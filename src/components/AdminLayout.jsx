import React from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ title, actions, children }) {
  return (
    <div className="admin-shell flex">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-white border-b border-navy/10 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display font-bold text-xl text-navy">{title}</h1>
          <div className="flex gap-3">{actions}</div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
