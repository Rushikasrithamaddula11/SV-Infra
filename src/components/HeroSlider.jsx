import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider({ slides = [] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) {
    return (
      <div className="relative h-[85vh] min-h-[560px] bg-navy flex items-center overflow-hidden">
        <div className="container-x relative z-10 text-white animate-fade-in-up">
          <p className="eyebrow text-gold font-bold tracking-widest">SV Infra projects 972</p>
          <h1 className="text-4xl sm:text-6xl font-bold mt-4 leading-tight">
            Building Excellence<br /><span className="text-gold">with Quality &amp; Trust</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/80 text-lg leading-relaxed">
            Professional ACP Cladding, Structural Glazing, Toughened Glass, Aluminium and Interior Solutions for Commercial &amp; Residential Projects.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/projects" className="btn-primary">Explore Our Projects</Link>
            <Link to="/contact" className="btn-outline">Get a Quote</Link>
          </div>
        </div>
      </div>
    )
  }

  const slide = slides[index]
  const slideImage = slide.image || slide.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1600&q=80'
  const slideTitle = slide.title || slide.heading || 'Architectural Glazing & Façade Excellence'
  const slideSubheading = slide.subheading || slide.description || 'Engineered for Durability, Aesthetic Perfection, and Energy Efficiency'
  const slideBtnText = slide.buttonText || slide.primaryButtonText || 'Explore Our Projects'
  const slideBtnLink = slide.buttonLink || slide.primaryButtonLink || '/projects'

  return (
    <div className="relative h-[85vh] min-h-[560px] overflow-hidden bg-navy">
      {slides.map((s, i) => {
        const bgImg = s.image || s.imageUrl || slideImage
        return (
          <div
            key={s.id || i}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              i === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(11,31,58,0.94) 25%, rgba(11,31,58,0.60) 100%), url(${bgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )
      })}

      <div className="relative z-20 h-full flex items-center">
        <div key={index} className="container-x text-white animate-fade-in-up">
          <p className="eyebrow text-gold font-bold tracking-widest">SV Infra projects 972</p>
          <h1 className="text-4xl sm:text-6xl font-bold mt-4 leading-tight max-w-3xl drop-shadow-md">
            {slideTitle}
          </h1>
          <p className="mt-6 max-w-xl text-white/85 text-lg leading-relaxed drop-shadow">
            {slideSubheading}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to={slideBtnLink} className="btn-primary">
              {slideBtnText}
            </Link>
            <Link to="/contact" className="btn-outline">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-gold hover:text-navy text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setIndex((index + 1) % slides.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-gold hover:text-navy text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-30">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-10 bg-gold' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
