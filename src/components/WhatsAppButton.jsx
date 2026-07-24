import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function WhatsAppButton() {
  const s = useSettings()
  if (!s.whatsappNumber) return null
  return (
    <a
      href={`https://wa.me/${s.whatsappNumber}?text=${encodeURIComponent('Hi, I would like to get a quote from SV Infra Projects.')}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline text-sm font-semibold pr-1">Chat With Us</span>
    </a>
  )
}
