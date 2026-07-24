import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { subscribeAll, createDoc, updateDocById, deleteDocById } from '../utils/firestore'
import { deleteUploadedImage } from '../utils/storageUpload'

const emptyForm = { customerName: '', review: '', rating: 5, location: '', status: 'pending' }

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => subscribeAll('testimonials', setItems, { orderField: 'createdAt', direction: 'desc' }), [])

  const resetForm = () => { setForm(emptyForm); setImage(null); setEditingId(null); setShowForm(false) }

  const onEdit = (item) => {
    setForm({ customerName: item.customerName, review: item.review, rating: item.rating || 5, location: item.location || '', status: item.status })
    setImage(item.customerImage ? { url: item.customerImage, storagePath: item.customerImageStoragePath } : null)
    setEditingId(item.id)
    setShowForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, rating: Number(form.rating), customerImage: image?.url || '', customerImageStoragePath: image?.storagePath || '' }
    if (editingId) await updateDocById('testimonials', editingId, payload)
    else await createDoc('testimonials', { ...payload, order: items.length + 1 })
    setSaving(false)
    resetForm()
  }

  const onDelete = async (item) => {
    if (!confirm('Delete this testimonial?')) return
    if (item.customerImage) await deleteUploadedImage({ url: item.customerImage, storagePath: item.customerImageStoragePath, provider: 'firebase' })
    await deleteDocById('testimonials', item.id)
  }

  return (
    <AdminLayout title="Testimonials" actions={<button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary !py-2.5 !px-5 text-sm"><Plus size={16} /> Add Testimonial</button>}>
      {showForm && (
        <div className="card p-6 mb-8 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button onClick={resetForm}><X size={18} /></button>
          </div>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Customer Name *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
            <textarea className="input-field sm:col-span-2" rows={3} placeholder="Review" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required />
            <div className="sm:col-span-2">
              <p className="text-sm font-medium mb-2">Customer Photo</p>
              <ImageUploader single value={[]} folder="testimonials" coverUrl={image?.url} onCoverChange={setImage} />
              {image?.url && <img src={image.url} className="h-20 w-20 rounded-full object-cover mt-3" alt="customer" />}
            </div>
            <button type="submit" disabled={saving} className="btn-navy sm:col-span-2 disabled:opacity-60">{saving ? 'Saving…' : 'Save Testimonial'}</button>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              {item.customerImage ? <img src={item.customerImage} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-navy/10" />}
              <div>
                <p className="font-semibold text-sm">{item.customerName}</p>
                <p className="text-xs text-navy/40">{item.location}</p>
              </div>
            </div>
            <p className="text-sm text-navy/60 line-clamp-3">{item.review}</p>
            <div className="flex justify-between items-center mt-4">
              <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
              <div className="flex gap-3">
                <button onClick={() => onEdit(item)} className="text-navy/60 hover:text-gold"><Pencil size={16} /></button>
                <button onClick={() => onDelete(item)} className="text-navy/60 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-navy/40 col-span-full text-center py-10">No testimonials yet.</p>}
      </div>
    </AdminLayout>
  )
}
