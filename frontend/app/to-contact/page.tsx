'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Phone, MapPin, Star, ExternalLink, Copy, CheckCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Lead {
  id: number
  nombre: string
  telefono: string
  url: string
  direccion: string | null
  rating: number | null
  reviews: number | null
  es_reclamable: boolean
  tipificacion_nombre: string | null
  tipificacion_color: string | null
}

export default function ToContactPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`)
      // Filter only leads with phone numbers
      const withPhone = response.data.filter((lead: Lead) => lead.telefono)
      setLeads(withPhone)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyPhone = (phone: string, id: number) => {
    navigator.clipboard.writeText(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando leads...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Por Contactar</h1>
        <p className="text-gray-600">Leads con información de contacto disponible</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Contactables</p>
              <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Phone className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Oportunidades</p>
              <p className="text-3xl font-bold text-green-600">
                {leads.filter(l => l.es_reclamable).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Con Rating Alto</p>
              <p className="text-3xl font-bold text-yellow-600">
                {leads.filter(l => l.rating && l.rating >= 4.0).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">
                {lead.nombre}
              </h3>
              {lead.es_reclamable && (
                <span className="ml-2 text-green-600 text-xl">🎯</span>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Phone size={16} className="text-purple-600" />
                  <span className="font-semibold text-purple-900">{lead.telefono}</span>
                </div>
                <button
                  onClick={() => copyPhone(lead.telefono, lead.id)}
                  className="p-2 hover:bg-purple-100 rounded transition-colors"
                  title="Copiar teléfono"
                >
                  {copiedId === lead.id ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-purple-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              {lead.rating && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star size={14} className="text-yellow-500" />
                  <span className="font-medium">{lead.rating}</span>
                  <span>({lead.reviews} reseñas)</span>
                </div>
              )}

              {lead.direccion && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{lead.direccion}</span>
                </div>
              )}

              {lead.tipificacion_nombre && (
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lead.tipificacion_color || '#gray' }}
                  />
                  <span className="text-gray-700">{lead.tipificacion_nombre}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <a
                href={`tel:${lead.telefono}`}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
              >
                <Phone size={16} />
                Llamar
              </a>
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                title="Ver en Google Maps"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
          <Phone size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay leads con teléfono
          </h3>
          <p className="text-gray-600">
            Los leads con información de contacto aparecerán aquí
          </p>
        </div>
      )}
    </div>
  )
}
