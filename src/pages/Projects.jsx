import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { listAll } from '../utils/firestore'
import ProjectCard from '../components/ProjectCard'
import { useSettings } from '../context/SettingsContext'
import { defaultProjects } from '../utils/defaultData'

const DEFAULT_CATEGORIES = [
  { id: 'cat-facade', name: 'Façade Systems & Glazing' },
  { id: 'cat-aluminium', name: 'Aluminium & Glass Works' },
  { id: 'cat-interior', name: 'Interior Solutions' },
  { id: 'cat-commercial', name: 'Commercial Projects' },
  { id: 'cat-residential', name: 'Residential Projects' },
]

export default function Projects() {
  const settings = useSettings()
  const [projects, setProjects] = useState(defaultProjects)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  useEffect(() => {
    (async () => {
      try {
        const [allProjects, allCategories] = await Promise.all([
          listAll('projects', { activeOnly: true }).catch(() => []),
          listAll('projectCategories', { activeOnly: true }).catch(() => []),
        ])
        if (allProjects && allProjects.length > 0) setProjects(allProjects)
        if (allCategories && allCategories.length > 0) setCategories(allCategories)
      } catch (e) {
        // keep defaults
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return projects
    return projects.filter((p) => p.categoryId === activeCategory)
  }, [projects, activeCategory])

  const categoryName = (id) => categories.find((c) => c.id === id)?.name

  return (
    <div>
      <Helmet><title>Our Projects | {settings.companyName}</title></Helmet>
      <section className="bg-navy text-white py-20">
        <div className="container-x">
          <p className="eyebrow">Our Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">Projects Portfolio</h1>
          <p className="text-white/60 mt-3 max-w-2xl">A showcase of our completed commercial and residential works across façades, glazing, aluminium and interiors.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="flex flex-wrap gap-3 mb-10">
            <button onClick={() => setSearchParams({})}
              className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide rounded-sm border ${activeCategory === 'all' ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/70 hover:border-navy'}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setSearchParams({ category: c.id })}
                className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide rounded-sm border ${activeCategory === c.id ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/70 hover:border-navy'}`}>
                {c.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-navy/50">No projects in this category yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((p) => <ProjectCard key={p.id} project={p} categoryName={categoryName(p.categoryId)} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
