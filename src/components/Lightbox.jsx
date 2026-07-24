import React, { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (index === null || index === undefined) return null
  const img = images[index]

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-5 right-5 text-white/80 hover:text-gold" onClick={onClose}><X size={30} /></button>
      {images.length > 1 && (
        <button className="absolute left-4 sm:left-8 text-white/80 hover:text-gold" onClick={(e) => { e.stopPropagation(); onPrev() }}>
          <ChevronLeft size={36} />
        </button>
      )}
      <img src={img.url || img} alt={img.title || ''} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
      {images.length > 1 && (
        <button className="absolute right-4 sm:right-8 text-white/80 hover:text-gold" onClick={(e) => { e.stopPropagation(); onNext() }}>
          <ChevronRight size={36} />
        </button>
      )}
    </div>
  )
}
