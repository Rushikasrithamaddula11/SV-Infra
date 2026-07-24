// Handles uploading images to Firebase Storage (default) with a Cloudinary
// fallback if VITE_CLOUDINARY_CLOUD_NAME is set. Either way the caller gets
// back a plain { url, storagePath } object that matches the Firestore image
// schema described in the project spec.
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export function uploadImage(file, folder, onProgress) {
  if (CLOUD_NAME && UPLOAD_PRESET) {
    return uploadToCloudinary(file, folder, onProgress)
  }
  return uploadToFirebase(file, folder, onProgress)
}

function uploadToFirebase(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100
        onProgress?.(pct)
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, storagePath: path, provider: 'firebase' })
      },
    )
  })
}

async function uploadToCloudinary(file, folder, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.((e.loaded / e.total) * 100)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, storagePath: data.public_id, provider: 'cloudinary' })
      } else reject(new Error('Cloudinary upload failed'))
    }
    xhr.onerror = () => reject(new Error('Cloudinary upload failed'))
    xhr.send(formData)
  })
}

export async function deleteUploadedImage(image) {
  if (!image) return
  if (image.provider === 'firebase' && image.storagePath) {
    try {
      await deleteObject(ref(storage, image.storagePath))
    } catch (e) {
      console.warn('Could not delete storage file', e)
    }
  }
  // Cloudinary deletion requires a signed server-side call (API secret),
  // so client-side we only remove the Firestore reference for Cloudinary images.
}
