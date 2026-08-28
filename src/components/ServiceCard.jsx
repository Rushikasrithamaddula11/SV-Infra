import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers } from 'lucide-react'

export default function ServiceCard({ service }) {
  const coverImage = service.coverImage || service.image

  return (
    <Link to={`/services/${service.slug}`} className="group card overflow-hidden block">
      <div className="relative h-56 overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-navy-light flex items-center justify-center text-white/40">
            <Layers size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-navy group-hover:text-gold-dark transition-colors">{service.name}</h3>
        <p className="text-sm text-navy/60 mt-2 line-clamp-2">{service.shortDescription}</p>
        <span className="inline-flex items-center gap-1 text-gold-dark text-sm font-semibold mt-4">
          Learn More <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  )
}
