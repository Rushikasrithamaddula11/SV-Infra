import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { subscribeAll, listAll, createDoc, updateDocById, deleteDocById, slugify } from '../utils/firestore'
import { deleteUploadedImage } from '../utils/storageUpload'

const emptyForm = {
  name: '', categoryId: '', location: '', district: '', state: '', address: '', clientName: '', completionDate: '',
  shortDescription: '', fullDescription: '', featured: false, active: true, order: 1,
  seoTitle: '', seoDescription: '',
}

export default function ProjectsManager() {
  const [items, setItems] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [cover, setCover] = useState(null)
  const [gallery, setGallery] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const DEFAULT_CATEGORIES = [
    { id: 'cat-facade', name: 'Façade Systems & Glazing' },
    { id: 'cat-aluminium', name: 'Aluminium & Glass Works' },
    { id: 'cat-interior', name: 'Interior Solutions' },
    { id: 'cat-commercial', name: 'Commercial Projects' },
    { id: 'cat-residential', name: 'Residential Projects' },
  ]

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [newCatName, setNewCatName] = useState('')
  const [isCreatingCat, setIsCreatingCat] = useState(false)

  useEffect(() => {
    let unsubProjects = () => {}
    let unsubCats = () => {}
    try {
      unsubProjects = subscribeAll('projects', (data) => setItems(data || []))
    } catch (e) {
      console.warn('Projects subscription error:', e)
    }
    try {
      unsubCats = subscribeAll('projectCategories', (data) => {
        if (data && data.length > 0) {
          setCategories(data)
        }
      })
    } catch (e) {
      console.warn('Categories subscription error:', e)
    }
    return () => {
      unsubProjects()
      unsubCats()
    }
  }, [])

  const resetForm = () => {
    setForm(emptyForm); setCover(null); setGallery([]); setEditingId(null); setShowForm(false)
    setIsCreatingCat(false); setNewCatName('')
  }

  const handleCategorySelectChange = async (e) => {
    const val = e.target.value
    if (val === 'NEW_CATEGORY') {
      setIsCreatingCat(true)
      setForm({ ...form, categoryId: '' })
    } else {
      setIsCreatingCat(false)
      setForm({ ...form, categoryId: val })
    }
  }

  const handleCreateCustomCategory = async () => {
    if (!newCatName.trim()) return
    const newCat = await createDoc('projectCategories', {
      name: newCatName.trim(),
      slug: slugify(newCatName.trim()),
      active: true,
      order: categories.length + 1,
    })
    setForm({ ...form, categoryId: newCat.id })
    setNewCatName('')
    setIsCreatingCat(false)
  }

  const onEdit = (item) => {
    setForm({
      name: item.name, categoryId: item.categoryId || '', location: item.location || '',
      district: item.district || '', state: item.state || '', address: item.address || '',
      clientName: item.clientName || '', completionDate: item.completionDate || '',
      shortDescription: item.shortDescription || '', fullDescription: item.fullDescription || '',
      featured: !!item.featured, active: item.active, order: item.order || 1,
      seoTitle: item.seoTitle || '', seoDescription: item.seoDescription || '',
    })
    setCover(item.coverImage ? { url: item.coverImage, storagePath: item.coverStoragePath } : null)
    setGallery(item.images || [])
    setEditingId(item.id)
    setIsCreatingCat(false)
    setShowForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    let finalCatId = form.categoryId
    if (isCreatingCat && newCatName.trim()) {
      const newCat = await createDoc('projectCategories', {
        name: newCatName.trim(),
        slug: slugify(newCatName.trim()),
        active: true,
        order: categories.length + 1,
      })
      finalCatId = newCat.id
    }
    if (!finalCatId) { alert('Please select or create a category.'); return }
    setSaving(true)
    const payload = {
      ...form,
      categoryId: finalCatId,
      order: Number(form.order) || 1,
      slug: slugify(form.name),
      coverImage: cover?.url || '',
      coverStoragePath: cover?.storagePath || '',
      images: gallery,
    }
    if (editingId) await updateDocById('projects', editingId, payload)
    else await createDoc('projects', payload)
    setSaving(false)
    resetForm()
  }

  const onDelete = async (item) => {
    if (!confirm(`Delete project "${item.name}"?`)) return
    if (item.coverImage) await deleteUploadedImage({ url: item.coverImage, storagePath: item.coverStoragePath, provider: 'firebase' })
    for (const img of item.images || []) await deleteUploadedImage(img)
    await deleteDocById('projects', item.id)
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || 'Custom Category'
  const visibleItems = filterCategory === 'all' ? items : items.filter((i) => i.categoryId === filterCategory)

  return (
    <AdminLayout
      title="Projects"
      actions={<button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary !py-2.5 !px-5 text-sm"><Plus size={16} /> Add Project</button>}
    >
      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={resetForm}><X size={18} /></button>
          </div>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Project Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

            <input className="input-field" placeholder="Location / Area" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input-field" placeholder="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            <input className="input-field" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <input className="input-field sm:col-span-2" placeholder="Full Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

            <div className="space-y-2">
              <select
                className="input-field"
                value={isCreatingCat ? 'NEW_CATEGORY' : form.categoryId}
                onChange={handleCategorySelectChange}
                required={!isCreatingCat && !form.categoryId}
              >
                <option value="">Select Category *</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="NEW_CATEGORY">+ Add New Custom Category...</option>
              </select>

              {isCreatingCat && (
                <div className="flex gap-2">
                  <input
                    className="input-field text-sm"
                    placeholder="Enter Custom Category Name *"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
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
            <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input-field" placeholder="Client Name (optional)" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            <input className="input-field" placeholder="Completion Date (e.g. March 2025)" value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} />
            <input className="input-field" type="number" placeholder="Display Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <input className="input-field sm:col-span-2" placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <textarea className="input-field sm:col-span-2" rows={4} placeholder="Full Description" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} />
            <input className="input-field" placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <input className="input-field" placeholder="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />

            <div className="flex gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured Project
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
              </label>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Cover Image</p>
              <ImageUploader single value={[]} folder="projects" coverUrl={cover?.url} onCoverChange={setCover} />
              {cover?.url && <img src={cover.url} className="h-24 mt-3 rounded-sm" alt="cover" />}
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Project Gallery Images</p>
              <ImageUploader value={gallery} onChange={setGallery} folder="projects" coverUrl={cover?.url} onCoverChange={setCover} />
            </div>
            <button type="submit" disabled={saving} className="btn-navy sm:col-span-2 disabled:opacity-60">{saving ? 'Saving…' : 'Publish Project'}</button>
          </form>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <select className="input-field w-auto" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-left text-navy/50 uppercase text-xs">
              <th className="p-4">Cover</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Featured</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr key={item.id} className="border-b border-navy/5">
                <td className="p-4">{item.coverImage ? <img src={item.coverImage} className="h-12 w-12 object-cover rounded-sm" /> : <div className="h-12 w-12 bg-navy/5 rounded-sm" />}</td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{categoryName(item.categoryId)}</td>
                <td className="p-4">{item.featured && <Star size={16} className="text-gold fill-gold" />}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => onEdit(item)} className="text-navy/60 hover:text-gold"><Pencil size={16} /></button>
                  <button onClick={() => onDelete(item)} className="text-navy/60 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-navy/40">No projects yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
