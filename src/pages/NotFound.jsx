import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-gold font-display font-bold text-6xl">404</p>
      <p className="text-navy/60 mt-3 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-navy">Back to Home</Link>
    </div>
  )
}
