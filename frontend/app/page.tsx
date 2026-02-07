'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, Phone, MapPin, Star, Target, Users, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Stats {
  total: number
  reclamables: number
  con_telefono: number
  porcentaje_oportunidades: number
  por_tipificacion: Array<{
    nombre: string
    color: string
    cantidad: number
  }>
}

interface Lead {
  id: number
  nombre: string
  telefono: string | null
  es_reclamable: boolean
  rating: number | null
  reviews: number | null
  created_at: string
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/leads`, { params: { limit: 5 } })
      ])
      setStats(statsRes.data)
      setRecentLeads(leadsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu pipeline de leads</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Leads totales</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Oportunidades</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.reclamables}</p>
            <p className="text-sm text-gray-600 mt-1">No reclamados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="text-purple-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Contactables</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.con_telefono}</p>
            <p className="text-sm text-gray-600 mt-1">Con teléfono</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Tasa</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.porcentaje_oportunidades}%</p>
            <p className="text-sm text-gray-600 mt-1">Oportunidades</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline por Tipificación */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pipeline por Etapa</h2>
            <Link
              href="/crm"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              Ver CRM
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.por_tipificacion.map((tip) => (
              <div key={tip.nombre} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tip.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{tip.nombre}</span>
                    <span className="text-sm text-gray-600">{tip.cantidad} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: tip.color,
                        width: `${stats.total > 0 ? (tip.cantidad / stats.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Leads Recientes</h2>
            <Link
              href="/leads"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                    {lead.nombre}
                  </h3>
                  {lead.es_reclamable && (
                    <span className="ml-2 text-green-600 text-xs">🎯</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {lead.telefono && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} />
                      {lead.telefono.slice(0, 12)}...
                    </span>
                  )}
                  {lead.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      {lead.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No hay leads aún
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Link
          href="/search"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Nueva Búsqueda</h3>
              <p className="text-sm text-blue-100">Encuentra más leads</p>
            </div>
          </div>
        </Link>

        <Link
          href="/crm"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Pipeline CRM</h3>
              <p className="text-sm text-green-100">Gestiona tus leads</p>
            </div>
          </div>
        </Link>

        <Link
          href="/to-contact"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Seguimientos</h3>
              <p className="text-sm text-purple-100">Próximos contactos</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
