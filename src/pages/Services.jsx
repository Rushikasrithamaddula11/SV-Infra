import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { listAll } from '../utils/firestore'
import ServiceCard from '../components/ServiceCard'
import { useSettings } from '../context/SettingsContext'
import { defaultServices } from '../utils/defaultData'

export default function Services() {
  const settings = useSettings()
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    (async () => {
      try {
        const fetched = await listAll('services', { activeOnly: true })
        if (fetched && fetched.length > 0) setServices(fetched)
      } catch (e) {
        // keep defaults
      }
    })()
  }, [])

  return (
    <div>
      <Helmet><title>Our Services | {settings.companyName}</title></Helmet>
      <section className="bg-navy text-white py-20">
        <div className="container-x">
          <p className="eyebrow">What We Do</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">Our Services</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            From façade systems to interior finishing, we deliver end-to-end construction solutions built on quality and precision.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
