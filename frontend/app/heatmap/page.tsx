'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, MapPin, Target, BarChart3, PieChart, Activity } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Lead {
  id: number
  nombre: string
  telefono: string | null
  direccion: string | null
  rating: number | null
  reviews: number | null
  es_reclamable: boolean
  estado: string
  tipificacion_nombre: string | null
  created_at: string
}

interface LocationData {
  location: string
  total: number
  opportunities: number
  avgRating: number
  withPhone: number
  percentage: number
}

interface CategoryData {
  category: string
  count: number
  opportunities: number
  percentage: number
}

export default function HeatmapPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [timeData, setTimeData] = useState<any[]>([])

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    if (leads.length > 0) {
      analyzeData()
    }
  }, [leads])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`)
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = () => {
    // Análisis por ubicación
    const locationMap = new Map<string, any>()
    
    leads.forEach(lead => {
      if (lead.direccion) {
        // Extraer ciudad/zona de la dirección
        const parts = lead.direccion.split(',')
        const location = parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim() || 'Desconocido'
        
        if (!locationMap.has(location)) {
          locationMap.set(location, {
            location,
            total: 0,
            opportunities: 0,
            totalRating: 0,
            ratingCount: 0,
            withPhone: 0
          })
        }
        
        const data = locationMap.get(location)
        data.total++
        if (lead.es_reclamable) data.opportunities++
        if (lead.rating) {
          data.totalRating += lead.rating
          data.ratingCount++
        }
        if (lead.telefono) data.withPhone++
      }
    })

    const locations = Array.from(locationMap.values())
      .map(loc => ({
        location: loc.location,
        total: loc.total,
        opportunities: loc.opportunities,
        avgRating: loc.ratingCount > 0 ? (loc.totalRating / loc.ratingCount).toFixed(1) : 0,
        withPhone: loc.withPhone,
        percentage: ((loc.opportunities / loc.total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.opportunities - a.opportunities)
      .slice(0, 10)

    setLocationData(locations)

    // Análisis por categoría (extraer del nombre del negocio)
    const categoryMap = new Map<string, any>()
    const keywords = ['restaurante', 'cafetería', 'tienda', 'hotel', 'bar', 'panadería', 'farmacia', 'peluquería', 'gimnasio', 'consultorio']
    
    leads.forEach(lead => {
      const nombre = lead.nombre.toLowerCase()
      let category = 'Otros'
      
      for (const keyword of keywords) {
        if (nombre.includes(keyword)) {
          category = keyword.charAt(0).toUpperCase() + keyword.slice(1)
          break
        }
      }
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          count: 0,
          opportunities: 0
        })
      }
      
      const data = categoryMap.get(category)
      data.count++
      if (lead.es_reclamable) data.opportunities++
    })

    const categories = Array.from(categoryMap.values())
      .map(cat => ({
        category: cat.category,
        count: cat.count,
        opportunities: cat.opportunities,
        percentage: ((cat.opportunities / cat.count) * 100).toFixed(1)
      }))
      .sort((a, b) => b.opportunities - a.opportunities)

    setCategoryData(categories)

    // Análisis temporal
    const timeMap = new Map<string, any>()
    
    leads.forEach(lead => {
      const date = new Date(lead.created_at)
      const monthYear = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
      
      if (!timeMap.has(monthYear)) {
        timeMap.set(monthYear, {
          period: monthYear,
          total: 0,
          opportunities: 0
        })
      }
      
      const data = timeMap.get(monthYear)
      data.total++
      if (lead.es_reclamable) data.opportunities++
    })

    const timeAnalysis = Array.from(timeMap.values())
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())

    setTimeData(timeAnalysis)
  }

  const getColorIntensity = (percentage: number) => {
    const num = parseFloat(percentage.toString())
    if (num >= 70) return 'bg-green-600'
    if (num >= 50) return 'bg-green-500'
    if (num >= 30) return 'bg-yellow-500'
    if (num >= 10) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getBarWidth = (value: number, max: number) => {
    return `${(value / max) * 100}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Analizando datos...</div>
      </div>
    )
  }

  const maxOpportunities = Math.max(...locationData.map(l => l.opportunities), 1)
  const maxCount = Math.max(...categoryData.map(c => c.count), 1)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Calor de Oportunidades</h1>
        <p className="text-gray-600">Análisis geográfico y de categorías para identificar las mejores oportunidades</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
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
              <Target className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa de Éxito</p>
              <p className="text-3xl font-bold text-purple-600">
                {leads.length > 0 ? ((leads.filter(l => l.es_reclamable).length / leads.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ubicaciones</p>
              <p className="text-3xl font-bold text-orange-600">{locationData.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MapPin className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Locations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Top Ubicaciones por Oportunidades</h2>
          </div>

          <div className="space-y-4">
            {locationData.map((loc, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{loc.location}</p>
                      <p className="text-sm text-gray-500">
                        {loc.opportunities} de {loc.total} leads ({loc.percentage}%)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold ${getColorIntensity(loc.percentage)}`}>
                      {loc.percentage}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ⭐ {loc.avgRating} | 📞 {loc.withPhone}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getColorIntensity(loc.percentage)}`}
                    style={{ width: getBarWidth(loc.opportunities, maxOpportunities) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {locationData.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay datos de ubicación disponibles
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-purple-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Análisis por Categoría</h2>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <p className="text-sm text-gray-500">
                      {cat.opportunities} oportunidades de {cat.count} leads
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getColorIntensity(cat.percentage)}`}>
                    {cat.percentage}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getColorIntensity(cat.percentage)}`}
                    style={{ width: getBarWidth(cat.count, maxCount) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {categoryData.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay datos de categorías disponibles
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-green-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Tendencia Temporal</h2>
        </div>

        {timeData.length > 0 ? (
          <div className="space-y-3">
            {timeData.map((period, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">
                  {period.period}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                      style={{ width: getBarWidth(period.total, Math.max(...timeData.map(t => t.total))) }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-green-600 transition-all"
                      style={{ width: getBarWidth(period.opportunities, Math.max(...timeData.map(t => t.total))) }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-700 w-32">
                    <span className="text-blue-600">{period.total}</span> total |{' '}
                    <span className="text-green-600">{period.opportunities}</span> oport.
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No hay datos temporales disponibles
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">💡 Insights Clave</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locationData.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Mejor Ubicación</p>
              <p className="font-bold text-lg text-blue-600">{locationData[0]?.location}</p>
              <p className="text-sm text-gray-700">
                {locationData[0]?.opportunities} oportunidades ({locationData[0]?.percentage}% de éxito)
              </p>
            </div>
          )}
          {categoryData.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Mejor Categoría</p>
              <p className="font-bold text-lg text-purple-600">{categoryData[0]?.category}</p>
              <p className="text-sm text-gray-700">
                {categoryData[0]?.opportunities} oportunidades ({categoryData[0]?.percentage}% de éxito)
              </p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Promedio de Rating</p>
            <p className="font-bold text-lg text-yellow-600">
              {locationData.length > 0
                ? (locationData.reduce((sum, l) => sum + parseFloat(l.avgRating.toString()), 0) / locationData.length).toFixed(1)
                : '0'} ⭐
            </p>
            <p className="text-sm text-gray-700">En ubicaciones analizadas</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Leads con Teléfono</p>
            <p className="font-bold text-lg text-green-600">
              {leads.filter(l => l.telefono).length} ({((leads.filter(l => l.telefono).length / leads.length) * 100).toFixed(1)}%)
            </p>
            <p className="text-sm text-gray-700">Contactables directamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
