'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, TrendingUp, Phone, MapPin, Star, ExternalLink, RefreshCw } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
  created_at: string
  tipificacion_nombre: string | null
  tipificacion_color: string | null
  ultima_nota: string | null
  ultimo_contacto: string | null
}

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

interface ScrapingStatus {
  is_running: boolean
  current_query: string | null
  leads_found: number
  opportunities_found: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [maxResults, setMaxResults] = useState(20)
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'reclamable'>('all')

  useEffect(() => {
    fetchLeads()
    fetchStats()
    const interval = setInterval(checkScrapingStatus, 2000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`, {
        params: { reclamable_only: filter === 'reclamable' }
      })
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const checkScrapingStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/scrape/status`)
      setScrapingStatus(response.data)
      
      if (response.data.is_running === false && loading) {
        setLoading(false)
        fetchLeads()
        fetchStats()
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  const startScraping = async () => {
    if (!query.trim()) {
      alert('Por favor ingresa una búsqueda')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/scrape`, {
        query,
        max_results: maxResults
      })
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al iniciar scraping')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎯 LeadHunter
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra negocios no reclamados en Google Maps
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <TrendingUp className="text-blue-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Oportunidades</p>
                  <p className="text-3xl font-bold text-green-600">{stats.reclamables}</p>
                </div>
                <Star className="text-green-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Con Teléfono</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.con_telefono}</p>
                </div>
                <Phone className="text-purple-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">% Oportunidades</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.porcentaje_oportunidades}%
                  </p>
                </div>
                <MapPin className="text-orange-500" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Nueva Búsqueda</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: restaurantes en Madrid"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={loading}
              />
            </div>
            
            <div className="w-32">
              <input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={loading}
              />
            </div>
            
            <button
              onClick={startScraping}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Buscar
                </>
              )}
            </button>
          </div>

          {scrapingStatus?.is_running && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-900 font-semibold">
                🔍 Buscando: {scrapingStatus.current_query}
              </p>
              <p className="text-blue-700">
                Leads encontrados: {scrapingStatus.leads_found} | 
                Oportunidades: {scrapingStatus.opportunities_found}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({stats?.total || 0})
          </button>
          <button
            onClick={() => setFilter('reclamable')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'reclamable'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Oportunidades ({stats?.reclamables || 0})
          </button>
        </div>

        {/* Leads List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${
                lead.es_reclamable ? 'border-2 border-green-400' : ''
              }`}
            >
              {lead.es_reclamable && (
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-3">
                  ✅ OPORTUNIDAD
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {lead.nombre}
              </h3>
              
              {lead.telefono && (
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Phone size={16} />
                  <span>{lead.telefono}</span>
                </div>
              )}
              
              {lead.direccion && (
                <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                  <MapPin size={16} />
                  <span className="truncate">{lead.direccion}</span>
                </div>
              )}
              
              {lead.rating && (
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Star size={16} className="text-yellow-500" />
                  <span>{lead.rating} ⭐ ({lead.reviews} reseñas)</span>
                </div>
              )}
              
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Ver en Google Maps
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay leads aún. Inicia una búsqueda para comenzar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
