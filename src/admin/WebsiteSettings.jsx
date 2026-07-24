import React, { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import { useSettings } from '../context/SettingsContext'

const SECTION_LABELS = {
  hero: 'Hero Slider', about: 'About', services: 'Services', featuredProjects: 'Featured Projects',
  whyChooseUs: 'Why Choose Us', gallery: 'Gallery', testimonials: 'Testimonials', contactCta: 'Contact CTA',
}

export default function WebsiteSettings() {
  const settings = useSettings()
  const [form, setForm] = useState(settings)
  const [logo, setLogo] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(settings)
    if (settings.logoUrl) setLogo({ url: settings.logoUrl })
    if (settings.faviconUrl) setFavicon({ url: settings.faviconUrl })
  }, [settings.companyName])

  const updateSection = (key, field, value) => {
    setForm((f) => ({ ...f, homepageSections: { ...f.homepageSections, [key]: { ...f.homepageSections[key], [field]: value } } }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await setDoc(doc(db, 'websiteSettings', 'main'), {
      companyName: form.companyName, tagline: form.tagline, footerDescription: form.footerDescription,
      copyrightText: form.copyrightText, homepageSections: form.homepageSections,
      logoUrl: logo?.url || '', faviconUrl: favicon?.url || '',
    }, { merge: true })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout title="Website Settings">
      <form onSubmit={onSave} className="space-y-8 max-w-3xl">
        <div className="card p-6 space-y-4">
          <h3 className="font-bold">General</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <input className="input-field" placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <textarea className="input-field" rows={2} placeholder="Footer Description" value={form.footerDescription} onChange={(e) => setForm({ ...form, footerDescription: e.target.value })} />
          <input className="input-field" placeholder="Copyright Text" value={form.copyrightText} onChange={(e) => setForm({ ...form, copyrightText: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Logo</p>
              <ImageUploader single value={[]} folder="branding" coverUrl={logo?.url} onCoverChange={setLogo} />
              {logo?.url && <img src={logo.url} className="h-14 mt-3" alt="logo" />}
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Favicon</p>
              <ImageUploader single value={[]} folder="branding" coverUrl={favicon?.url} onCoverChange={setFavicon} />
              {favicon?.url && <img src={favicon.url} className="h-10 mt-3" alt="favicon" />}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold mb-4">Homepage Sections</h3>
          <div className="space-y-3">
            {Object.entries(form.homepageSections || {}).map(([key, val]) => (
              <div key={key} className="flex flex-wrap items-center gap-3 border-b border-navy/5 pb-3">
                <label className="flex items-center gap-2 w-48 shrink-0">
                  <input type="checkbox" checked={val.enabled} onChange={(e) => updateSection(key, 'enabled', e.target.checked)} />
                  <span className="text-sm font-medium">{SECTION_LABELS[key] || key}</span>
                </label>
                {'heading' in val && (
                  <>
                    <input className="input-field flex-1 min-w-[160px]" placeholder="Heading" value={val.heading || ''} onChange={(e) => updateSection(key, 'heading', e.target.value)} />
                    <input className="input-field flex-1 min-w-[160px]" placeholder="Subheading" value={val.subheading || ''} onChange={(e) => updateSection(key, 'subheading', e.target.value)} />
                  </>
                )}
                <input className="input-field w-20" type="number" placeholder="Order" value={val.order || 1} onChange={(e) => updateSection(key, 'order', Number(e.target.value))} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
        {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
      </form>
    </AdminLayout>
  )
}
