import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { getBySlug } from '../utils/firestore'
import Lightbox from '../components/Lightbox'
import { useSettings } from '../context/SettingsContext'

export default function ServiceDetail() {
  const { slug } = useParams()
  const settings = useSettings()
  const [service, setService] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setService(await getBySlug('services', slug))
      setLoading(false)
    })()
  }, [slug])

  if (loading) return <div className="section-pad text-center text-navy/50">Loading…</div>
  if (!service) return (
    <div className="section-pad text-center">
      <p className="text-navy/60 mb-4">Service not found.</p>
      <Link to="/services" className="btn-navy">Back to Services</Link>
    </div>
  )

  const images = service.images || []
  const coverImage = service.coverImage || service.image

  return (
    <div>
      <Helmet><title>{service.seoTitle || service.name} | {settings.companyName}</title></Helmet>

      <div className="relative h-[50vh] min-h-[380px] bg-navy">
        {coverImage && (
          <img src={coverImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        )}
        <div className="relative container-x h-full flex flex-col justify-end pb-10 text-white">
          <Link to="/services" className="inline-flex items-center gap-2 text-gold text-sm mb-4 w-fit"><ArrowLeft size={16} /> Back to Services</Link>
          <h1 className="text-4xl font-bold">{service.name}</h1>
        </div>
      </div>

      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <p className="text-navy/70 leading-relaxed whitespace-pre-line">{service.detailedDescription || service.shortDescription}</p>
        </div>

        {images.length > 0 && (
          <div className="container-x mt-14">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button key={img.storagePath || i} onClick={() => setLightboxIndex(i)} className="h-48 rounded-sm overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + images.length) % images.length)}
        onNext={() => setLightboxIndex((i) => (i + 1) % images.length)}
      />
    </div>
  )
}
