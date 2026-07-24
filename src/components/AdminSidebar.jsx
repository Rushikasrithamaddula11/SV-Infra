import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, FolderTree, Wrench, Image, FolderOpen,
  GalleryHorizontalEnd, Info, Mail, Star, Phone, Settings, Search, LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: Building2 },
  { to: '/admin/project-categories', label: 'Project Categories', icon: FolderTree },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/gallery-categories', label: 'Gallery Categories', icon: FolderOpen },
  { to: '/admin/hero-slider', label: 'Hero Slider', icon: GalleryHorizontalEnd },
  { to: '/admin/about', label: 'About Us', icon: Info },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/contact-info', label: 'Contact Information', icon: Phone },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  { to: '/admin/seo', label: 'SEO Settings', icon: Search },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-64 shrink-0 bg-navy text-white min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display font-bold text-lg">SV Infra</p>
        <p className="text-xs text-gold uppercase tracking-wide">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive ? 'bg-white/10 text-gold border-r-2 border-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={async () => { await logout(); navigate('/admin/login') }}
        className="flex items-center gap-3 px-6 py-4 text-sm text-white/70 hover:text-red-400 border-t border-white/10"
      >
        <LogOut size={17} /> Log Out
      </button>
    </aside>
  )
}
