import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, ShieldCheck, Clock, Users, Gem, ArrowUpRight, Send, CheckCircle } from 'lucide-react'
import HeroSlider from '../components/HeroSlider'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import LeadPopupModal from '../components/LeadPopupModal'
import { listAll, createDoc } from '../utils/firestore'
import { useSettings } from '../context/SettingsContext'

import { defaultServices, defaultProjects, defaultHeroSlides, defaultTestimonials, defaultGallery } from '../utils/defaultData'

const whyIcons = [CheckCircle2, Clock, ShieldCheck, Users, Gem, CheckCircle2]

export default function Home() {
  const settings = useSettings()
  const [slides, setSlides] = useState(defaultHeroSlides)
  const [services, setServices] = useState(defaultServices)
  const [featuredProjects, setFeaturedProjects] = useState(defaultProjects)
  const [categories, setCategories] = useState([])
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [galleryImages, setGalleryImages] = useState(defaultGallery)

  const [leadForm, setLeadForm] = useState({ fullName: '', email: '', phone: '', serviceName: '', message: '' })
  const [submittingLead, setSubmittingLead] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState('')

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setLeadError('')
    if (!leadForm.fullName || !leadForm.phone) {
      setLeadError('Please fill in your name and phone number.')
      return
    }
    setSubmittingLead(true)
    try {
      await createDoc('enquiries', {
        fullName: leadForm.fullName,
        email: leadForm.email,
        phone: leadForm.phone,
        serviceName: leadForm.serviceName || 'General Inquiry',
        message: leadForm.message || 'Submitted from Home page quick form',
        projectType: 'General',
        status: 'New',
      })
      setLeadSubmitted(true)
      setLeadForm({ fullName: '', email: '', phone: '', serviceName: '', message: '' })
    } catch (err) {
      setLeadError('Failed to send enquiry. Please try again.')
    } finally {
      setSubmittingLead(false)
    }
  }

  useEffect(() => {
    // Non-blocking background fetch from Firestore to merge database data seamlessly
    (async () => {
      try {
        const [heroSlides, allServices, allProjects, allCategories, allTestimonials, allGallery] = await Promise.all([
          listAll('heroSlides', { activeOnly: true }).catch(() => []),
          listAll('services', { activeOnly: true }).catch(() => []),
          listAll('projects', { activeOnly: true }).catch(() => []),
          listAll('projectCategories', { activeOnly: true }).catch(() => []),
          listAll('testimonials', { activeOnly: true }).catch(() => []),
          listAll('gallery', { activeOnly: true }).catch(() => []),
        ])

        if (heroSlides.length > 0) setSlides(heroSlides)
        if (allServices.length > 0) setServices(allServices)
        if (allProjects.length > 0) {
          const featured = allProjects.filter((p) => p.featured)
          setFeaturedProjects(featured.length > 0 ? featured : allProjects)
        }
        if (allCategories.length > 0) setCategories(allCategories)
        if (allTestimonials.length > 0) setTestimonials(allTestimonials.filter((t) => t.status === 'approved'))
        if (allGallery.length > 0) setGalleryImages(allGallery)
      } catch (err) {
        console.warn('Background sync warning:', err)
      }
    })()
  }, [])

  const categoryName = (id) => categories.find((c) => c.id === id)?.name
  const sections = settings.homepageSections || {}
  const whyItems = [
    'Quality Work', 'Timely Delivery', 'Professional Execution',
    'Customer Satisfaction', 'Experienced Team', 'Premium Materials',
  ]

  return (
    <div>
      <Helmet><title>{settings.seo?.title || settings.companyName}</title></Helmet>

      {/* Automatic Welcome Inquiry Lead Popup */}
      <LeadPopupModal services={services} />

      {sections.hero?.enabled !== false && <HeroSlider slides={slides} />}

      {sections.about?.enabled !== false && (
        <section className="section-pad bg-white overflow-hidden">
          <div className="container-x grid md:grid-cols-2 gap-14 items-center">
            <div className="animate-fade-in-up">
              <p className="eyebrow">{sections.about?.subheading || 'Who We Are'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.about?.heading || 'About Us'}</h2>
              <p className="mt-6 text-navy/70 leading-relaxed">
                SV Infra projects 972 provides professional architectural, construction finishing and interior solutions
                for commercial and residential projects. We specialize in modern façade systems, glazing, aluminium
                works, interior solutions and customized construction finishing services.
              </p>
              <Link to="/about" className="btn-navy mt-8 inline-flex group">Discover Our Story <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-scale-up">
              <div className="h-64 bg-navy rounded-sm shadow-lg overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt="About" />
              </div>
              <div className="h-64 bg-gold/20 rounded-sm mt-8 shadow-lg overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="About Glazing" />
              </div>
            </div>
          </div>
        </section>
      )}

      {sections.services?.enabled !== false && services.length > 0 && (
        <section className="section-pad bg-cream">
          <div className="container-x">
            <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
              <p className="eyebrow justify-center">{sections.services?.subheading || 'What We Do'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.services?.heading || 'Our Expertise'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((s, idx) => (
                <div key={s.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/services" className="btn-navy">View All Services</Link>
            </div>
          </div>
        </section>
      )}

      {sections.featuredProjects?.enabled !== false && featuredProjects.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-x">
            <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
              <p className="eyebrow justify-center">{sections.featuredProjects?.subheading || 'Our Work'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.featuredProjects?.heading || 'Featured Projects'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredProjects.map((p, idx) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <ProjectCard project={p} categoryName={categoryName(p.categoryId)} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/projects" className="btn-navy">Explore Our Projects</Link>
            </div>
          </div>
        </section>
      )}

      {sections.whyChooseUs?.enabled !== false && (
        <section className="section-pad bg-navy text-white relative overflow-hidden">
          <div className="container-x relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
              <p className="eyebrow justify-center">{sections.whyChooseUs?.subheading || 'Our Promise'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.whyChooseUs?.heading || 'Why Choose Us'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyItems.map((item, i) => {
                const Icon = whyIcons[i]
                return (
                  <div key={item} className="flex items-start gap-4 bg-white/5 hover:bg-white/10 p-6 rounded-sm border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Icon className="text-gold shrink-0 animate-float" size={26} />
                    <p className="font-semibold">{item}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {sections.gallery?.enabled !== false && galleryImages.length > 0 && (
        <section className="section-pad bg-cream">
          <div className="container-x">
            <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
              <p className="eyebrow justify-center">{sections.gallery?.subheading || 'A Glimpse of Our Craft'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.gallery?.heading || 'Gallery'}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <Link to="/gallery" key={img.id} className="block h-44 overflow-hidden rounded-sm group relative shadow-md">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                    View Image
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.testimonials?.enabled !== false && testimonials.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-x">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="eyebrow justify-center">{sections.testimonials?.subheading || 'What They Say'}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{sections.testimonials?.heading || 'Client Testimonials'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="card p-6">
                  <div className="flex gap-1 text-gold mb-3">{'★'.repeat(t.rating || 5)}</div>
                  <p className="text-navy/70 text-sm leading-relaxed">{t.review}</p>
                  <div className="flex items-center gap-3 mt-5">
                    {t.customerImage && <img src={t.customerImage} className="w-10 h-10 rounded-full object-cover" alt={t.customerName} />}
                    <div>
                      <p className="font-semibold text-sm">{t.customerName}</p>
                      <p className="text-xs text-navy/50">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.contactCta?.enabled !== false && (
        <section className="bg-navy text-white py-16">
          <div className="container-x">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="eyebrow">Get In Touch</p>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3">Request a Free Quote</h2>
                <p className="mt-4 text-white/70 leading-relaxed">
                  Have a construction, glazing, or interior finishing project in mind? Submit your details and our expert team will connect with you promptly.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">✓</div>
                    <p className="text-sm font-medium">Free Consultation & Project Estimation</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">✓</div>
                    <p className="text-sm font-medium">Premium Architectural & Finishing Solutions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">✓</div>
                    <p className="text-sm font-medium">Experienced Professionals & Timely Execution</p>
                  </div>
                </div>
              </div>

              <div className="bg-white text-navy p-8 rounded-sm shadow-xl">
                <h3 className="text-xl font-bold mb-2">Send Us a Message</h3>
                <p className="text-navy/60 text-xs mb-6">Fill in your name, email, and phone number to get started.</p>

                {leadSubmitted ? (
                  <div className="text-center py-10">
                    <CheckCircle className="text-gold mx-auto" size={48} />
                    <p className="text-xl font-bold mt-4">Thank You!</p>
                    <p className="text-navy/60 text-sm mt-1">Your inquiry has been stored successfully. Our team will contact you shortly.</p>
                    <button onClick={() => setLeadSubmitted(false)} className="btn-navy mt-6">Submit Another Request</button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-navy/60 mb-1">Full Name *</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Enter your full name"
                        value={leadForm.fullName}
                        onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-navy/60 mb-1">Email Address *</label>
                        <input
                          className="input-field"
                          type="email"
                          placeholder="name@example.com"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-navy/60 mb-1">Phone Number *</label>
                        <input
                          className="input-field"
                          type="tel"
                          placeholder="Your phone number"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-navy/60 mb-1">Service Required (Optional)</label>
                      <select
                        className="input-field"
                        value={leadForm.serviceName}
                        onChange={(e) => setLeadForm({ ...leadForm, serviceName: e.target.value })}
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-navy/60 mb-1">Message (Optional)</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Tell us about your project requirements..."
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      />
                    </div>
                    {leadError && <p className="text-red-600 text-sm">{leadError}</p>}
                    <button type="submit" disabled={submittingLead} className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2">
                      <Send size={16} /> {submittingLead ? 'Sending Inquiry…' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
