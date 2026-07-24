import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { createDoc, listAll } from '../utils/firestore'
import { useSettings } from '../context/SettingsContext'

const emptyForm = { fullName: '', phone: '', email: '', location: '', serviceId: '', projectType: 'Residential', message: '' }

export default function Contact() {
  const settings = useSettings()
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => setServices(await listAll('services', { activeOnly: true })))()
  }, [])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.phone) {
      setError('Please fill in your name and phone number.')
      return
    }
    setSubmitting(true)
    try {
      const service = services.find((s) => s.id === form.serviceId)
      await createDoc('enquiries', { ...form, serviceName: service?.name || '', status: 'New' })
      setSubmitted(true)
      setForm(emptyForm)
    } catch (err) {
      setError('Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Helmet><title>Contact Us | {settings.companyName}</title></Helmet>
      <section className="bg-navy text-white py-20">
        <div className="container-x">
          <p className="eyebrow">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">Contact Us</h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <p className="text-gold text-xs uppercase font-semibold tracking-wide mb-3">Andhra Pradesh Office</p>
              <p className="flex gap-3 text-navy/70 text-sm"><MapPin size={18} className="shrink-0 text-gold" /> {settings.apAddress}</p>
            </div>
            <div className="card p-6">
              <p className="text-gold text-xs uppercase font-semibold tracking-wide mb-3">Telangana Office</p>
              <p className="flex gap-3 text-navy/70 text-sm"><MapPin size={18} className="shrink-0 text-gold" /> {settings.tsAddress}</p>
            </div>
            <div className="card p-6 space-y-3">
              <p className="flex items-center gap-3 text-sm"><Phone size={18} className="text-gold" /> {settings.primaryPhone}</p>
              <p className="flex items-center gap-3 text-sm"><Phone size={18} className="text-gold" /> {settings.secondaryPhone}</p>
              <p className="flex items-center gap-3 text-sm"><Mail size={18} className="text-gold" /> {settings.email}</p>
            </div>
            {settings.mapUrl && (
              <div className="h-64 rounded-sm overflow-hidden">
                <iframe title="map" src={settings.mapUrl} className="w-full h-full border-0" loading="lazy" />
              </div>
            )}
          </div>

          <div className="lg:col-span-3 card p-8">
            <h2 className="text-2xl font-bold mb-1">Get a Free Quote</h2>
            <p className="text-navy/60 text-sm mb-6">Fill in the form and our team will get back to you shortly.</p>

            {submitted ? (
              <div className="flex flex-col items-center text-center py-14">
                <CheckCircle className="text-gold" size={48} />
                <p className="text-xl font-bold mt-4">Thank you!</p>
                <p className="text-navy/60 mt-1">Your enquiry has been received. We'll contact you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn-navy mt-6">Send Another Enquiry</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5">
                <input className="input-field" name="fullName" placeholder="Full Name *" value={form.fullName} onChange={onChange} required />
                <input className="input-field" name="phone" placeholder="Phone Number *" value={form.phone} onChange={onChange} required />
                <input className="input-field" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
                <input className="input-field" name="location" placeholder="Location" value={form.location} onChange={onChange} />
                <select className="input-field" name="serviceId" value={form.serviceId} onChange={onChange}>
                  <option value="">Service Required</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select className="input-field" name="projectType" value={form.projectType} onChange={onChange}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Other</option>
                </select>
                <textarea className="input-field sm:col-span-2" name="message" rows={4} placeholder="Message" value={form.message} onChange={onChange} />
                {error && <p className="text-red-600 text-sm sm:col-span-2">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary sm:col-span-2 disabled:opacity-60">
                  <Send size={16} /> {submitting ? 'Sending…' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
