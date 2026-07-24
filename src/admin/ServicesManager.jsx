import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { subscribeAll, createDoc, updateDocById, deleteDocById, slugify } from '../utils/firestore'
import { deleteUploadedImage } from '../utils/storageUpload'

const emptyForm = {
  name: '', shortDescription: '', detailedDescription: '', icon: 'Layers',
  active: true, order: 1, seoTitle: '', seoDescription: '',
}

const ICONS = ['Layers', 'Building2', 'Hammer', 'Wrench', 'DoorOpen', 'Home', 'PanelsTopLeft', 'Grid2x2', 'Sparkles', 'ShieldCheck']

export default function ServicesManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [cover, setCover] = useState(null)
  const [gallery, setGallery] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => subscribeAll('services', setItems), [])

  const resetForm = () => {
    setForm(emptyForm); setCover(null); setGallery([]); setEditingId(null); setShowForm(false)
  }

  const onEdit = (item) => {
    setForm({
      name: item.name, shortDescription: item.shortDescription || '', detailedDescription: item.detailedDescription || '',
      icon: item.icon || 'Layers', active: item.active, order: item.order || 1,
      seoTitle: item.seoTitle || '', seoDescription: item.seoDescription || '',
    })
    setCover(item.coverImage ? { url: item.coverImage, storagePath: item.coverStoragePath } : null)
    setGallery(item.images || [])
    setEditingId(item.id)
    setShowForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      order: Number(form.order) || 1,
      slug: slugify(form.name),
      coverImage: cover?.url || '',
      coverStoragePath: cover?.storagePath || '',
      images: gallery,
    }
    if (editingId) await updateDocById('services', editingId, payload)
    else await createDoc('services', payload)
    setSaving(false)
    resetForm()
  }

  const onDelete = async (item) => {
    if (!confirm(`Delete service "${item.name}"?`)) return
    if (item.coverImage) await deleteUploadedImage({ url: item.coverImage, storagePath: item.coverStoragePath, provider: 'firebase' })
    for (const img of item.images || []) await deleteUploadedImage(img)
    await deleteDocById('services', item.id)
  }

  return (
    <AdminLayout
      title="Services"
      actions={<button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary !py-2.5 !px-5 text-sm"><Plus size={16} /> Add Service</button>}
    >
      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Service' : 'New Service'}</h3>
            <button onClick={resetForm}><X size={18} /></button>
          </div>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Service Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className="input-field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <input className="input-field sm:col-span-2" placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <textarea className="input-field sm:col-span-2" rows={4} placeholder="Detailed Description" value={form.detailedDescription} onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })} />
            <input className="input-field" type="number" placeholder="Display Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
            </label>
            <input className="input-field" placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <input className="input-field" placeholder="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />

            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Cover Image</p>
              <ImageUploader single value={[]} folder="services" coverUrl={cover?.url} onCoverChange={setCover} />
              {cover?.url && <img src={cover.url} className="h-24 mt-3 rounded-sm" alt="cover" />}
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Gallery Images</p>
              <ImageUploader value={gallery} onChange={setGallery} folder="services" />
            </div>
            <button type="submit" disabled={saving} className="btn-navy sm:col-span-2 disabled:opacity-60">{saving ? 'Saving…' : 'Save Service'}</button>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-left text-navy/50 uppercase text-xs">
              <th className="p-4">Cover</th><th className="p-4">Name</th><th className="p-4">Order</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-navy/5">
                <td className="p-4">{item.coverImage ? <img src={item.coverImage} className="h-12 w-12 object-cover rounded-sm" /> : <div className="h-12 w-12 bg-navy/5 rounded-sm" />}</td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.order}</td>
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
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-navy/40">No services yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
