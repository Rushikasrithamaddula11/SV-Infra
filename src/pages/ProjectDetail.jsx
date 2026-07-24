import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react'
import { getBySlug, getOne, listAll } from '../utils/firestore'
import Lightbox from '../components/Lightbox'
import ProjectCard from '../components/ProjectCard'
import { useSettings } from '../context/SettingsContext'

export default function ProjectDetail() {
  const { slug } = useParams()
  const settings = useSettings()
  const [project, setProject] = useState(null)
  const [category, setCategory] = useState(null)
  const [related, setRelated] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const p = await getBySlug('projects', slug)
      setProject(p)
      if (p?.categoryId) {
        const cat = await getOne('projectCategories', p.categoryId)
        setCategory(cat)
        const all = await listAll('projects', { activeOnly: true })
        setRelated(all.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 3))
      }
      setLoading(false)
    })()
  }, [slug])

  if (loading) return <div className="section-pad text-center text-navy/50">Loading…</div>
  if (!project) return (
    <div className="section-pad text-center">
      <p className="text-navy/60 mb-4">Project not found.</p>
      <Link to="/projects" className="btn-navy">Back to Projects</Link>
    </div>
  )

  const images = project.images || []

  return (
    <div>
      <Helmet><title>{project.seoTitle || project.name} | {settings.companyName}</title></Helmet>

      <div className="relative h-[55vh] min-h-[420px] bg-navy">
        {project.coverImage && (
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        )}
        <div className="relative container-x h-full flex flex-col justify-end pb-10 text-white">
          <Link to="/projects" className="inline-flex items-center gap-2 text-gold text-sm mb-4 w-fit"><ArrowLeft size={16} /> Back to Projects</Link>
          {category && <p className="text-gold text-sm uppercase tracking-wide font-semibold mb-2">{category.name}</p>}
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-white/70 text-sm">
            {project.location && <span className="flex items-center gap-2"><MapPin size={16} /> {project.location}</span>}
            {project.completionDate && <span className="flex items-center gap-2"><Calendar size={16} /> {project.completionDate}</span>}
            {project.clientName && <span className="flex items-center gap-2"><User size={16} /> {project.clientName}</span>}
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <p className="text-navy/70 leading-relaxed whitespace-pre-line">{project.fullDescription || project.shortDescription}</p>
        </div>

        {images.length > 0 && (
          <div className="container-x mt-14">
            <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button key={img.storagePath || i} onClick={() => setLightboxIndex(i)} className="h-52 rounded-sm overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="container-x mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {related.map((p) => <ProjectCard key={p.id} project={p} categoryName={category?.name} />)}
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
