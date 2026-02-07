'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Phone, MapPin, Star, ExternalLink, Calendar, User, MessageSquare } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Lead {
  id: number
  nombre: string
  telefono: string | null
  url: string
  direccion: string | null
  rating: number | null
  reviews: number | null
  es_reclamable: boolean
  estado: string
  tipificacion_nombre: string | null
  tipificacion_color: string | null
}

interface Tipificacion {
  id: number
  nombre: string
  color: string
  descripcion: string
  orden: number
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [tipificaciones, setTipificaciones] = useState<Tipificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leadsRes, tipsRes] = await Promise.all([
        axios.get(`${API_URL}/leads`),
        axios.get(`${API_URL}/tipificaciones`)
      ])
      setLeads(leadsRes.data)
      setTipificaciones(tipsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLeadsByTipificacion = (tipNombre: string) => {
    return leads.filter(lead => lead.tipificacion_nombre === tipNombre || (!lead.tipificacion_nombre && tipNombre === 'Nuevo'))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando pipeline...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline CRM</h1>
        <p className="text-gray-600">Gestiona tus leads por etapa del proceso de venta</p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {tipificaciones.map((tip) => {
          const columnLeads = getLeadsByTipificacion(tip.nombre)
          
          return (
            <div
              key={tip.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
            >
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tip.color }}
                    />
                    {tip.nombre}
                  </h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {columnLeads.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tip.descripcion}</p>
              </div>

              {/* Cards */}
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  >
                    {/* Lead Name */}
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {lead.nombre}
                    </h4>

                    {/* Lead Info */}
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {lead.telefono && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span className="truncate">{lead.telefono}</span>
                        </div>
                      )}
                      
                      {lead.rating && (
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-yellow-500" />
                          <span>{lead.rating} ⭐ ({lead.reviews})</span>
                        </div>
                      )}
                      
                      {lead.direccion && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span className="truncate text-xs">{lead.direccion}</span>
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    {lead.es_reclamable && (
                      <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold mb-2">
                        🎯 Oportunidad
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                        <MessageSquare size={14} />
                        Nota
                      </button>
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-1"
                      >
                        <ExternalLink size={14} />
                        Ver
                      </a>
                    </div>
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No hay leads en esta etapa
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
