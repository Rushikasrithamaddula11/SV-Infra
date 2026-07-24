import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import AdminLayout from '../components/AdminLayout'
import { useSettings } from '../context/SettingsContext'

export default function ContactInfoManager() {
  const settings = useSettings()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  React.useEffect(() => setForm(settings), [settings.primaryPhone, settings.apAddress])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await setDoc(doc(db, 'websiteSettings', 'main'), {
      primaryPhone: form.primaryPhone, secondaryPhone: form.secondaryPhone, whatsappNumber: form.whatsappNumber,
      email: form.email, apAddress: form.apAddress, tsAddress: form.tsAddress, mapUrl: form.mapUrl,
      social: form.social,
    }, { merge: true })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout title="Contact Information">
      <form onSubmit={onSave} className="card p-6 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Primary Phone" value={form.primaryPhone} onChange={(e) => setForm({ ...form, primaryPhone: e.target.value })} />
          <input className="input-field" placeholder="Secondary Phone" value={form.secondaryPhone} onChange={(e) => setForm({ ...form, secondaryPhone: e.target.value })} />
          <input className="input-field" placeholder="WhatsApp Number (with country code, no +)" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
          <input className="input-field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <textarea className="input-field" rows={2} placeholder="Andhra Pradesh Office Address" value={form.apAddress} onChange={(e) => setForm({ ...form, apAddress: e.target.value })} />
        <textarea className="input-field" rows={2} placeholder="Telangana Office Address" value={form.tsAddress} onChange={(e) => setForm({ ...form, tsAddress: e.target.value })} />
        <input className="input-field" placeholder="Google Maps Embed URL" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} />

        <p className="font-semibold pt-2">Social Media Links</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Facebook URL" value={form.social?.facebook || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} />
          <input className="input-field" placeholder="Instagram URL" value={form.social?.instagram || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} />
          <input className="input-field" placeholder="YouTube URL" value={form.social?.youtube || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, youtube: e.target.value } })} />
          <input className="input-field" placeholder="LinkedIn URL" value={form.social?.linkedin || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })} />
          <input className="input-field" placeholder="Twitter / X URL" value={form.social?.twitter || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, twitter: e.target.value } })} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
        {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
      </form>
    </AdminLayout>
  )
}
