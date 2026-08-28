import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, FolderTree, Wrench, Image, Mail, MailOpen } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { listAll } from '../utils/firestore'

const StatCard = ({ icon: Icon, label, value, to }) => (
  <Link to={to} className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
    <div className="h-12 w-12 rounded-sm bg-navy/5 flex items-center justify-center text-navy"><Icon size={22} /></div>
    <div>
      <p className="text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-navy/50">{label}</p>
    </div>
  </Link>
)

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, categories: 0, services: 0, gallery: 0, enquiries: 0, newEnquiries: 0 })

  useEffect(() => {
    (async () => {
      const [projects, categories, services, gallery, enquiries] = await Promise.all([
        listAll('projects'), listAll('projectCategories'), listAll('services'), listAll('gallery'), listAll('enquiries'),
      ])
      setStats({
        projects: projects.length,
        categories: categories.length,
        services: services.length,
        gallery: gallery.length,
        enquiries: enquiries.length,
        newEnquiries: enquiries.filter((e) => e.status === 'New').length,
      })
    })()
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Building2} label="Total Projects" value={stats.projects} to="/admin/projects" />
        <StatCard icon={FolderTree} label="Total Categories" value={stats.categories} to="/admin/project-categories" />
        <StatCard icon={Wrench} label="Total Services" value={stats.services} to="/admin/services" />
        <StatCard icon={Image} label="Total Gallery Images" value={stats.gallery} to="/admin/gallery" />
        <StatCard icon={Mail} label="Total Enquiries" value={stats.enquiries} to="/admin/enquiries" />
        <StatCard icon={MailOpen} label="New Enquiries" value={stats.newEnquiries} to="/admin/enquiries" />
      </div>
      <div className="mt-8 card p-6 text-sm text-navy/60">
        Welcome to the SV Infra projects 972 admin panel. Use the sidebar to manage projects, services, gallery, hero slider,
        testimonials, enquiries and every other part of the public website — no code changes required.
      </div>
    </AdminLayout>
  )
}
