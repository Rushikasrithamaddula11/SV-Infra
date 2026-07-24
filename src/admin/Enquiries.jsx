import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { subscribeAll, updateDocById, deleteDocById } from '../utils/firestore'

const STATUSES = ['New', 'Contacted', 'Follow Up', 'Converted', 'Closed']
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700', Contacted: 'bg-amber-100 text-amber-700',
  'Follow Up': 'bg-purple-100 text-purple-700', Converted: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500',
}

export default function Enquiries() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => subscribeAll('enquiries', setItems, { orderField: 'createdAt', direction: 'desc' }), [])

  const onStatusChange = (id, status) => updateDocById('enquiries', id, { status })
  const onDelete = async (id) => { if (confirm('Delete this enquiry?')) await deleteDocById('enquiries', id) }

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)

  return (
    <AdminLayout title="Enquiries">
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-sm text-sm font-semibold border ${filter === 'all' ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/60'}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-sm text-sm font-semibold border ${filter === s ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/60'}`}>{s}</button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-left text-navy/50 uppercase text-xs">
              <th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Service</th><th className="p-4">Type</th><th className="p-4">Message</th><th className="p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-navy/5 align-top">
                <td className="p-4">
                  <p className="font-medium">{item.fullName}</p>
                  <p className="text-navy/40 text-xs">{item.email}</p>
                  <p className="text-navy/40 text-xs">{item.location}</p>
                </td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.serviceName || '—'}</td>
                <td className="p-4">{item.projectType}</td>
                <td className="p-4 max-w-xs"><p className="line-clamp-3 text-navy/60">{item.message}</p></td>
                <td className="p-4">
                  <select value={item.status} onChange={(e) => onStatusChange(item.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-sm border-0 ${STATUS_COLORS[item.status] || 'bg-gray-100'}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4"><button onClick={() => onDelete(item.id)} className="text-navy/40 hover:text-red-600"><Trash2 size={16} /></button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-navy/40">No enquiries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
