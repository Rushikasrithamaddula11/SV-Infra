import React, { useRef, useState } from 'react'
import { UploadCloud, X, Star } from 'lucide-react'
import { uploadImage, deleteUploadedImage } from '../utils/storageUpload'

// Reusable drag & drop image manager.
// value: array of { url, storagePath, title, altText, order }
// single: if true, behaves as a single cover-image picker (returns via onChange with a single object)
export default function ImageUploader({ value = [], onChange, folder = 'uploads', single = false, coverUrl, onCoverChange }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const handleFiles = async (files) => {
    setUploading(true)
    const list = Array.from(files)
    const newImages = []
    for (const file of list) {
      try {
        const result = await uploadImage(file, folder, setProgress)
        newImages.push({ ...result, title: file.name, altText: file.name, order: (value?.length || 0) + newImages.length + 1 })
      } catch (e) {
        console.error(e)
      }
    }
    setUploading(false)
    setProgress(0)
    if (single) {
      onCoverChange?.(newImages[0])
    } else {
      onChange?.([...(value || []), ...newImages])
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (img, i) => {
    await deleteUploadedImage(img)
    const next = [...value]
    next.splice(i, 1)
    onChange?.(next)
  }

  const setAsCoverOf = (img) => onCoverChange?.(img)

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-navy/20 hover:border-gold rounded-sm py-8 flex flex-col items-center justify-center text-navy/50 cursor-pointer transition-colors"
      >
        <UploadCloud size={28} />
        <p className="text-sm mt-2">{uploading ? `Uploading… ${Math.round(progress)}%` : 'Drag & drop images, or click to browse'}</p>
        <input ref={inputRef} type="file" accept="image/*" multiple={!single} hidden onChange={(e) => e.target.files?.length && handleFiles(e.target.files)} />
      </div>

      {!single && value?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {value.map((img, i) => (
            <div key={img.storagePath || img.url} className="relative group rounded-sm overflow-hidden border border-navy/10">
              <img src={img.url} alt={img.altText || ''} className="h-28 w-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {onCoverChange && (
                  <button type="button" onClick={() => setAsCoverOf(img)}
                    className={`p-1.5 rounded-full ${coverUrl === img.url ? 'bg-gold text-navy' : 'bg-white/80 text-navy'}`} title="Set as cover">
                    <Star size={14} />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(img, i)} className="p-1.5 rounded-full bg-white/80 text-red-600" title="Delete">
                  <X size={14} />
                </button>
              </div>
              {coverUrl === img.url && (
                <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded-sm">COVER</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
