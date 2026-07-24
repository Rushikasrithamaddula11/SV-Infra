import React, { useEffect, useState } from 'react'
import { X, Send, CheckCircle, Sparkles } from 'lucide-react'
import { createDoc } from '../utils/firestore'

export default function LeadPopupModal({ services = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', serviceName: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Show popup after 1.5 seconds if user hasn't already dismissed it in this session
    const dismissed = sessionStorage.getItem('sv_lead_popup_dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('sv_lead_popup_dismissed', 'true')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.phone) {
      setError('Please fill in your name and phone number.')
      return
    }
    setSubmitting(true)
    try {
      await createDoc('enquiries', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        serviceName: form.serviceName || 'General Inquiry',
        message: form.message || 'Submitted via Welcome Popup Form',
        projectType: 'General',
        status: 'New',
      })
      setSubmitted(true)
      sessionStorage.setItem('sv_lead_popup_dismissed', 'true')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden relative border border-gold/30 animate-scale-up cursor-default"
      >
        {/* Close / Cross Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-white bg-black/40 hover:bg-gold hover:text-navy p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
          aria-label="Close modal"
          title="Close"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="bg-navy text-white p-6 relative overflow-hidden pr-14">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none">
            <Sparkles size={140} className="text-gold" />
          </div>
          <div className="relative z-10">
            <p className="eyebrow text-gold font-bold">Welcome to SV Infra Projects</p>
            <h3 className="text-2xl font-bold mt-1">Get a Free Project Consultation</h3>
            <p className="text-xs text-white/70 mt-1">Submit your details & our expert team will contact you shortly.</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="text-gold mx-auto" size={54} />
              <h4 className="text-2xl font-bold mt-4 text-navy">Thank You!</h4>
              <p className="text-navy/70 text-sm mt-2">
                Your inquiry has been received. Our team will get back to you with a free consultation quote soon.
              </p>
              <button type="button" onClick={handleClose} className="btn-navy mt-6">
                Explore Website
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Service Interest (Optional)
                </label>
                <select
                  className="input-field"
                  value={form.serviceName}
                  onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                >
                  <option value="">Select Service Required</option>
                  <option value="Façade Systems & Glazing">Façade Systems & Glazing</option>
                  <option value="Aluminium & Glass Works">Aluminium & Glass Works</option>
                  <option value="Interior & Exterior Finishing">Interior & Exterior Finishing</option>
                  <option value="Commercial Structural Glazing">Commercial Structural Glazing</option>
                  <option value="ACP Cladding">ACP Cladding</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Message / Details (Optional)
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Tell us briefly about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                <Send size={16} />
                {submitting ? 'Submitting…' : 'Submit & Get Free Quote'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
