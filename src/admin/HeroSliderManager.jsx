import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { subscribeAll, createDoc, updateDocById, deleteDocById } from '../utils/firestore'
import { deleteUploadedImage } from '../utils/storageUpload'

const emptyForm = {
  heading: 'Building Excellence with Quality & Trust',
  description: 'Professional ACP Cladding, Structural Glazing, Toughened Glass, Aluminium and Interior Solutions for Commercial & Residential Projects.',
  primaryButtonText: 'Explore Our Projects', primaryButtonLink: '/projects',
  secondaryButtonText: 'Get a Quote', secondaryButtonLink: '/contact',
  active: true, order: 1,
}

export default function HeroSliderManager() {
  const [slides, setSlides] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => subscribeAll('heroSlides', setSlides), [])

  const resetForm = () => { setForm(emptyForm); setImage(null); setEditingId(null); setShowForm(false) }

  const onEdit = (s) => {
    setForm({
      heading: s.heading, description: s.description, primaryButtonText: s.primaryButtonText,
      primaryButtonLink: s.primaryButtonLink, secondaryButtonText: s.secondaryButtonText,
      secondaryButtonLink: s.secondaryButtonLink, active: s.active, order: s.order || 1,
    })
    setImage(s.imageUrl ? { url: s.imageUrl, storagePath: s.imageStoragePath } : null)
    setEditingId(s.id)
    setShowForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!image?.url) { alert('Please upload a hero image.'); return }
    setSaving(true)
    const payload = { ...form, order: Number(form.order) || 1, imageUrl: image.url, imageStoragePath: image.storagePath || '' }
    if (editingId) await updateDocById('heroSlides', editingId, payload)
    else await createDoc('heroSlides', payload)
    setSaving(false)
    resetForm()
  }

  const onDelete = async (s) => {
    if (!confirm('Delete this slide?')) return
    if (s.imageUrl) await deleteUploadedImage({ url: s.imageUrl, storagePath: s.imageStoragePath, provider: 'firebase' })
    await deleteDocById('heroSlides', s.id)
  }

  return (
    <AdminLayout title="Hero Slider" actions={<button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary !py-2.5 !px-5 text-sm"><Plus size={16} /> Add Slide</button>}>
      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Slide' : 'New Slide'}</h3>
            <button onClick={resetForm}><X size={18} /></button>
          </div>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <input className="input-field sm:col-span-2" placeholder="Heading" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
            <textarea className="input-field sm:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="input-field" placeholder="Primary Button Text" value={form.primaryButtonText} onChange={(e) => setForm({ ...form, primaryButtonText: e.target.value })} />
            <input className="input-field" placeholder="Primary Button Link" value={form.primaryButtonLink} onChange={(e) => setForm({ ...form, primaryButtonLink: e.target.value })} />
            <input className="input-field" placeholder="Secondary Button Text" value={form.secondaryButtonText} onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })} />
            <input className="input-field" placeholder="Secondary Button Link" value={form.secondaryButtonLink} onChange={(e) => setForm({ ...form, secondaryButtonLink: e.target.value })} />
            <input className="input-field" type="number" placeholder="Display Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Enabled
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Hero Image *</p>
              <ImageUploader single value={[]} folder="hero" coverUrl={image?.url} onCoverChange={setImage} />
              {image?.url && <img src={image.url} className="h-32 w-full object-cover mt-3 rounded-sm" alt="hero" />}
            </div>
            <button type="submit" disabled={saving} className="btn-navy sm:col-span-2 disabled:opacity-60">{saving ? 'Saving…' : 'Save Slide'}</button>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((s) => (
          <div key={s.id} className="card overflow-hidden">
            <img src={s.imageUrl} className="h-40 w-full object-cover" alt={s.heading} />
            <div className="p-4">
              <p className="font-semibold text-sm line-clamp-1">{s.heading}</p>
              <div className="flex justify-between items-center mt-3">
                <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.active ? 'Enabled' : 'Disabled'}</span>
                <div className="flex gap-3">
                  <button onClick={() => onEdit(s)} className="text-navy/60 hover:text-gold"><Pencil size={16} /></button>
                  <button onClick={() => onDelete(s)} className="text-navy/60 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-navy/40 col-span-full text-center py-10">No hero slides yet.</p>}
      </div>
    </AdminLayout>
  )
}
