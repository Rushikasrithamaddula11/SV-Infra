import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { getOne, updateDocById, createDoc } from '../utils/firestore'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const DEFAULTS = {
  intro: 'SV Infra projects 972 provides professional architectural, construction finishing and interior solutions for commercial and residential projects.',
  vision: 'To be a leading name in premium construction finishing and façade engineering.',
  mission: 'To deliver every project with uncompromising quality, on-time execution and premium materials.',
  whyChooseUs: ['Quality Work', 'Timely Delivery', 'Professional Execution', 'Customer Satisfaction', 'Experienced Team', 'Premium Materials'],
}

export default function AboutManager() {
  const [form, setForm] = useState(DEFAULTS)
  const [heroImage, setHeroImage] = useState(null)
  const [newItem, setNewItem] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      const content = await getOne('siteContent', 'about')
      if (content) {
        setForm({ ...DEFAULTS, ...content })
        if (content.heroImage) setHeroImage({ url: content.heroImage, storagePath: content.heroImageStoragePath })
      }
    })()
  }, [])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await setDoc(doc(db, 'siteContent', 'about'), {
      ...form, heroImage: heroImage?.url || '', heroImageStoragePath: heroImage?.storagePath || '',
    }, { merge: true })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addWhyItem = () => {
    if (!newItem.trim()) return
    setForm((f) => ({ ...f, whyChooseUs: [...f.whyChooseUs, newItem.trim()] }))
    setNewItem('')
  }
  const removeWhyItem = (i) => setForm((f) => ({ ...f, whyChooseUs: f.whyChooseUs.filter((_, idx) => idx !== i) }))

  return (
    <AdminLayout title="About Us">
      <form onSubmit={onSave} className="card p-6 max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Hero / Intro Image</p>
          <ImageUploader single value={[]} folder="about" coverUrl={heroImage?.url} onCoverChange={setHeroImage} />
          {heroImage?.url && <img src={heroImage.url} className="h-40 w-full object-cover mt-3 rounded-sm" alt="about" />}
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Company Introduction</label>
          <textarea className="input-field" rows={4} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Our Vision</label>
          <textarea className="input-field" rows={3} value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Our Mission</label>
          <textarea className="input-field" rows={3} value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Why Choose Us</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.whyChooseUs.map((item, i) => (
              <span key={i} className="flex items-center gap-2 bg-navy/5 px-3 py-1.5 rounded-sm text-sm">
                {item} <button type="button" onClick={() => removeWhyItem(i)}><X size={13} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field" placeholder="Add reason…" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <button type="button" onClick={addWhyItem} className="btn-navy !px-4"><Plus size={16} /></button>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
        {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
      </form>
    </AdminLayout>
  )
}
