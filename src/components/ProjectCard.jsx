import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Building2 } from 'lucide-react'

export default function ProjectCard({ project, categoryName }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group relative block overflow-hidden card">
      <div className="relative h-72 overflow-hidden">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-navy-light flex items-center justify-center text-white/40">
            <Building2 size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-90" />
        {project.featured && (
          <span className="absolute top-4 left-4 bg-gold text-navy text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-sm">
            Featured
          </span>
        )}
        <div className="absolute bottom-0 p-5 text-white">
          {categoryName && <p className="text-gold text-xs uppercase tracking-wide font-semibold mb-1">{categoryName}</p>}
          <h3 className="font-display font-bold text-lg">{project.name}</h3>
          {project.location && (
            <p className="text-white/70 text-xs flex items-center gap-1 mt-1"><MapPin size={12} /> {project.location}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
