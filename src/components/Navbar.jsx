import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const settings = useSettings()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy shadow-lg py-2' : 'bg-navy/95 py-4'}`}>
      <div className="container-x flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.companyName} className="h-10 max-h-12 w-auto object-contain" />
          ) : (
            <div className="h-10 w-10 border-2 border-gold flex items-center justify-center text-gold font-display font-bold">SV</div>
          )}
          <div className="leading-tight">
            <p className="text-white font-display font-bold tracking-wide text-sm sm:text-base">{settings.companyName}</p>
            <p className="text-gold text-[10px] sm:text-xs uppercase tracking-[0.15em]">{settings.tagline}</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm uppercase tracking-wide font-medium transition-colors ${isActive ? 'text-gold' : 'text-white/85 hover:text-gold'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a href={`tel:${settings.primaryPhone}`} className="flex items-center gap-2 text-gold text-sm font-semibold">
            <Phone size={16} /> {settings.primaryPhone}
          </a>
          <Link to="/contact" className="btn-primary !py-2.5 !px-5 text-sm">Get a Quote</Link>
        </nav>

        <button className="lg:hidden text-white" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy border-t border-white/10 mt-3">
          <div className="container-x py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) => `text-sm uppercase tracking-wide font-medium ${isActive ? 'text-gold' : 'text-white/85'}`}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary !py-2.5 text-sm w-full">Get a Quote</Link>
          </div>
        </div>
      )}
    </header>
  )
}
