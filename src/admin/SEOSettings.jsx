import React, { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { useSettings } from '../context/SettingsContext'

export default function SEOSettings() {
  const settings = useSettings()
  const [form, setForm] = useState(settings.seo || {})
  const [ogImage, setOgImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(settings.seo || {})
    if (settings.seo?.ogImage) setOgImage({ url: settings.seo.ogImage })
  }, [settings.seo?.title])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await setDoc(doc(db, 'websiteSettings', 'main'), { seo: { ...form, ogImage: ogImage?.url || '' } }, { merge: true })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout title="SEO Settings">
      <form onSubmit={onSave} className="card p-6 max-w-2xl space-y-4">
        <input className="input-field" placeholder="Website Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input-field" rows={3} placeholder="Meta Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input-field" placeholder="Keywords (comma separated)" value={form.keywords || ''} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
        <div>
          <p className="text-sm font-medium mb-2">OG Image</p>
          <ImageUploader single value={[]} folder="seo" coverUrl={ogImage?.url} onCoverChange={setOgImage} />
          {ogImage?.url && <img src={ogImage.url} className="h-32 mt-3 rounded-sm" alt="og" />}
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
        {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
      </form>
    </AdminLayout>
  )
}
