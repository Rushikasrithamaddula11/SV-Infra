import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const s = useSettings()
  return (
    <footer className="bg-navy-dark text-white/80">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="text-white font-display font-bold text-lg mb-3">{s.companyName}</p>
          <p className="text-sm leading-relaxed text-white/60">{s.footerDescription}</p>
          <div className="flex gap-3 mt-5">
            {s.social?.facebook && <a href={s.social.facebook} target="_blank" rel="noreferrer" className="hover:text-gold"><Facebook size={18} /></a>}
            {s.social?.instagram && <a href={s.social.instagram} target="_blank" rel="noreferrer" className="hover:text-gold"><Instagram size={18} /></a>}
            {s.social?.youtube && <a href={s.social.youtube} target="_blank" rel="noreferrer" className="hover:text-gold"><Youtube size={18} /></a>}
            {s.social?.linkedin && <a href={s.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-gold"><Linkedin size={18} /></a>}
            {s.social?.twitter && <a href={s.social.twitter} target="_blank" rel="noreferrer" className="hover:text-gold"><Twitter size={18} /></a>}
          </div>
        </div>

        <div>
          <p className="text-gold uppercase tracking-wide text-xs font-semibold mb-4">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/projects" className="hover:text-gold">Projects</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-gold uppercase tracking-wide text-xs font-semibold mb-4">Andhra Pradesh Office</p>
          <p className="text-sm flex gap-2 text-white/60"><MapPin size={16} className="shrink-0 mt-0.5" /> {s.apAddress}</p>
          <p className="text-gold uppercase tracking-wide text-xs font-semibold mt-5 mb-4">Telangana Office</p>
          <p className="text-sm flex gap-2 text-white/60"><MapPin size={16} className="shrink-0 mt-0.5" /> {s.tsAddress}</p>
        </div>

        <div>
          <p className="text-gold uppercase tracking-wide text-xs font-semibold mb-4">Contact</p>
          <p className="text-sm flex items-center gap-2 mb-2"><Phone size={16} /> {s.primaryPhone}</p>
          <p className="text-sm flex items-center gap-2 mb-2"><Phone size={16} /> {s.secondaryPhone}</p>
          <p className="text-sm flex items-center gap-2"><Mail size={16} /> {s.email}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">{s.copyrightText}</div>
    </footer>
  )
}
