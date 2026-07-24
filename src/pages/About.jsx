import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Target, Eye, CheckCircle2 } from 'lucide-react'
import { getOne } from '../utils/firestore'
import { useSettings } from '../context/SettingsContext'

const DEFAULT_ABOUT = {
  intro: 'SV Infra Projects provides professional architectural, construction finishing and interior solutions for commercial and residential projects. We specialize in modern façade systems, glazing, aluminium works, interior solutions and customized construction finishing services.',
  vision: 'To be a leading name in premium construction finishing and façade engineering, recognized for craftsmanship, innovation and reliability across Andhra Pradesh, Telangana and beyond.',
  mission: 'To deliver every project — commercial or residential — with uncompromising quality, on-time execution and materials that stand the test of time, while building lasting relationships with our clients.',
  whyChooseUs: ['Quality Work', 'Timely Delivery', 'Professional Execution', 'Customer Satisfaction', 'Experienced Team', 'Premium Materials'],
  heroImage: '',
}

export default function About() {
  const settings = useSettings()
  const [content, setContent] = useState(DEFAULT_ABOUT)

  useEffect(() => {
    (async () => {
      const doc = await getOne('siteContent', 'about')
      if (doc) setContent({ ...DEFAULT_ABOUT, ...doc })
    })()
  }, [])

  return (
    <div>
      <Helmet><title>About Us | {settings.companyName}</title></Helmet>

      <section className="bg-navy text-white py-24 mt-0">
        <div className="container-x">
          <p className="eyebrow">About SV Infra Projects</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">{settings.companyName}</h1>
          <p className="text-gold mt-2 text-lg">{settings.tagline}</p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x grid md:grid-cols-2 gap-14 items-center">
          <div className="h-96 rounded-sm overflow-hidden bg-navy-light">
            {content.heroImage && <img src={content.heroImage} alt="SV Infra Projects" className="w-full h-full object-cover" />}
          </div>
          <div>
            <p className="eyebrow">Company Introduction</p>
            <h2 className="text-3xl font-bold mt-3 mb-5">Crafting Structures That Last</h2>
            <p className="text-navy/70 leading-relaxed">{content.intro}</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-x grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <Eye className="text-gold" size={30} />
            <h3 className="text-xl font-bold mt-4 mb-3">Our Vision</h3>
            <p className="text-navy/70 leading-relaxed">{content.vision}</p>
          </div>
          <div className="card p-8">
            <Target className="text-gold" size={30} />
            <h3 className="text-xl font-bold mt-4 mb-3">Our Mission</h3>
            <p className="text-navy/70 leading-relaxed">{content.mission}</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy text-white">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="eyebrow justify-center">Our Promise</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Why Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.whyChooseUs.map((item) => (
              <div key={item} className="flex items-center gap-4 bg-white/5 p-6 rounded-sm border border-white/10">
                <CheckCircle2 className="text-gold shrink-0" size={24} />
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
