import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

// websiteSettings/main holds all the global, site-wide fields an admin can
// edit (company name, logo, phones, addresses, socials, homepage sections).
const DEFAULT_SETTINGS = {
  companyName: 'SV INFRA PROJECTS 972',
  tagline: 'Building Excellence with Quality & Trust',
  logoUrl: '/images/branding/sv-logo.png',
  faviconUrl: '',
  primaryPhone: '+91 95159 88011',
  secondaryPhone: '+91 88011 85559',
  whatsappNumber: '919515988011',
  email: 'info@svinfraprojects.com',
  apAddress: "Opp. Rajahamsa Guest House, RTC Bus Stand to Gooty Road, Anantapur, Andhra Pradesh",
  tsAddress: "9-1-1 to 3, Brundavan Studio, ISKCON Compound, St. John's Road, Secunderabad, Telangana",
  mapUrl: '',
  footerDescription: 'Professional ACP Cladding, Structural Glazing, Toughened Glass, Aluminium and Interior Solutions for Commercial & Residential Projects.',
  copyrightText: `© ${new Date().getFullYear()} SV Infra projects 972. All rights reserved.`,
  social: { facebook: '', instagram: '', youtube: '', linkedin: '' },
  homepageSections: {
    hero: { enabled: true, order: 1 },
    about: { enabled: true, order: 2, heading: 'About Us', subheading: 'Who We Are' },
    services: { enabled: true, order: 3, heading: 'Our Expertise', subheading: 'What We Do' },
    featuredProjects: { enabled: true, order: 4, heading: 'Featured Projects', subheading: 'Our Work' },
    whyChooseUs: { enabled: true, order: 5, heading: 'Why Choose Us', subheading: 'Our Promise' },
    gallery: { enabled: true, order: 6, heading: 'Gallery', subheading: 'A Glimpse of Our Craft' },
    testimonials: { enabled: true, order: 7, heading: 'Client Testimonials', subheading: 'What They Say' },
    contactCta: { enabled: true, order: 8 },
  },
  seo: { title: 'SV Infra projects 972 | Building Excellence with Quality & Trust', description: '', keywords: '', ogImage: '' },
}

const SettingsContext = createContext(DEFAULT_SETTINGS)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'websiteSettings', 'main'), (snap) => {
      if (snap.exists()) {
        setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...snap.data() }))
      }
    }, () => {})
    return unsub
  }, [])

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
export { DEFAULT_SETTINGS }
