import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { listAll } from '../utils/firestore'
import Lightbox from '../components/Lightbox'
import { useSettings } from '../context/SettingsContext'
import { defaultGallery } from '../utils/defaultData'

const DEFAULT_GALLERY_CATEGORIES = [
  { id: 'gcat-facade', name: 'Façade' },
  { id: 'gcat-interiors', name: 'Interiors' },
  { id: 'gcat-glazing', name: 'Glazing' },
  { id: 'gcat-aluminium', name: 'Aluminium' },
  { id: 'gcat-completed', name: 'Completed Projects' },
]

export default function Gallery() {
  const settings = useSettings()
  const [images, setImages] = useState(defaultGallery)
  const [categories, setCategories] = useState(DEFAULT_GALLERY_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const [allImages, allCategories] = await Promise.all([
          listAll('gallery', { activeOnly: true }).catch(() => []),
          listAll('galleryCategories', { activeOnly: true }).catch(() => []),
        ])
        if (allImages && allImages.length > 0) setImages(allImages)
        if (allCategories && allCategories.length > 0) setCategories(allCategories)
      } catch (e) {
        // keep defaults
      }
    })()
  }, [])

  const filtered = useMemo(() => (
    activeCategory === 'all' ? images : images.filter((i) => i.categoryId === activeCategory)
  ), [images, activeCategory])

  return (
    <div>
      <Helmet><title>Gallery | {settings.companyName}</title></Helmet>
      <section className="bg-navy text-white py-20">
        <div className="container-x">
          <p className="eyebrow">A Glimpse of Our Craft</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">Gallery</h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="flex flex-wrap gap-3 mb-10">
            <button onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide rounded-sm border ${activeCategory === 'all' ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/70 hover:border-navy'}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)}
                className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide rounded-sm border ${activeCategory === c.id ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/70 hover:border-navy'}`}>
                {c.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-navy/50">No images in this category yet.</p>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
              {filtered.map((img, i) => (
                <button key={img.id} onClick={() => setLightboxIndex(i)} className="block w-full break-inside-avoid rounded-sm overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-auto hover:scale-105 transition-transform duration-300" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)}
        onNext={() => setLightboxIndex((i) => (i + 1) % filtered.length)}
      />
    </div>
  )
}
