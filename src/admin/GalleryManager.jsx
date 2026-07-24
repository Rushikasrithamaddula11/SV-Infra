import React, { useEffect, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { subscribeAll, createDoc, updateDocById, deleteDocById, slugify } from '../utils/firestore'
import { uploadImage, deleteUploadedImage } from '../utils/storageUpload'

const DEFAULT_GALLERY_CATEGORIES = [
  { id: 'gcat-facade', name: 'Façade' },
  { id: 'gcat-interiors', name: 'Interiors' },
  { id: 'gcat-glazing', name: 'Glazing' },
  { id: 'gcat-aluminium', name: 'Aluminium' },
  { id: 'gcat-completed', name: 'Completed Projects' },
]

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState(DEFAULT_GALLERY_CATEGORIES)
  const [uploadCategory, setUploadCategory] = useState('gcat-facade')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [newCatName, setNewCatName] = useState('')
  const [isCreatingCat, setIsCreatingCat] = useState(false)

  useEffect(() => {
    let unsubImages = () => {}
    let unsubCats = () => {}
    try {
      unsubImages = subscribeAll('gallery', (data) => setImages(data || []))
    } catch (e) {
      console.warn('Gallery subscription error:', e)
    }
    try {
      unsubCats = subscribeAll('galleryCategories', (cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats)
          if (!uploadCategory || uploadCategory.startsWith('gcat-')) setUploadCategory(cats[0]?.id || '')
        }
      })
    } catch (e) {
      console.warn('Gallery categories error:', e)
    }
    return () => {
      unsubImages()
      unsubCats()
    }
  }, [])

  const handleCreateCustomCategory = async () => {
    if (!newCatName.trim()) return
    const newCat = await createDoc('galleryCategories', {
      name: newCatName.trim(),
      slug: slugify(newCatName.trim()),
      active: true,
      order: categories.length + 1,
    })
    setUploadCategory(newCat.id)
    setNewCatName('')
    setIsCreatingCat(false)
  }

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    let catId = uploadCategory
    if (isCreatingCat && newCatName.trim()) {
      const newCat = await createDoc('galleryCategories', {
        name: newCatName.trim(),
        slug: slugify(newCatName.trim()),
        active: true,
        order: categories.length + 1,
      })
      catId = newCat.id
      setUploadCategory(catId)
      setIsCreatingCat(false)
      setNewCatName('')
    }
    if (!catId) { alert('Please select or create a gallery category first.'); return }
    setUploading(true)
    for (const file of files) {
      const result = await uploadImage(file, 'gallery')
      await createDoc('gallery', {
        url: result.url, storagePath: result.storagePath, provider: result.provider,
        title: file.name, altText: file.name, categoryId: catId, active: true, order: images.length + 1,
      })
    }
    setUploading(false)
    e.target.value = ''
  }

  const onDelete = async (img) => {
    if (!confirm('Delete this image?')) return
    await deleteUploadedImage(img)
    await deleteDocById('gallery', img.id)
  }

  const onSaveEdit = async () => {
    await updateDocById('gallery', editing.id, { title: editing.title, categoryId: editing.categoryId, active: editing.active })
    setEditing(null)
  }

  return (
    <AdminLayout title="Gallery">
      <div className="card p-6 mb-8">
        <p className="font-semibold mb-3">Upload New Images</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <select
            className="input-field sm:w-64"
            value={isCreatingCat ? 'NEW_CATEGORY' : uploadCategory}
            onChange={(e) => {
              if (e.target.value === 'NEW_CATEGORY') {
                setIsCreatingCat(true)
              } else {
                setIsCreatingCat(false)
                setUploadCategory(e.target.value)
              }
            }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value="NEW_CATEGORY">+ Add New Custom Category...</option>
          </select>

          {isCreatingCat && (
            <div className="flex gap-2">
              <input
                className="input-field text-sm sm:w-64"
                placeholder="Custom Category Name *"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleCreateCustomCategory}
                className="btn-navy !py-1.5 !px-3 text-xs whitespace-nowrap"
              >
                Save Category
              </button>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" multiple onChange={onUpload} disabled={!uploadCategory || uploading} />
        {uploading && <p className="text-sm text-navy/50 mt-2">Uploading…</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group card overflow-hidden">
            <img src={img.url} alt={img.title} className="h-32 w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => setEditing(img)} className="text-xs bg-white/90 px-2 py-1 rounded-sm">Edit</button>
              <button onClick={() => onDelete(img)} className="text-red-500 bg-white/90 p-1.5 rounded-full"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-navy/40 col-span-full text-center py-10">No gallery images yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-sm w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold">Edit Image</p>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <img src={editing.url} className="h-32 w-full object-cover rounded-sm mb-4" />
            <input className="input-field mb-3" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <select className="input-field mb-3" value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm mb-4">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active
            </label>
            <button onClick={onSaveEdit} className="btn-navy w-full">Save</button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
