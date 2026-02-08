'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, MapPin, Target, BarChart3, PieChart, Activity, Award, Zap, Phone } from 'lucide-react'

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
  score: number
  potencial: string
}

interface CategoryData {
  category: string
  count: number
  opportunities: number
  percentage: number
  avgRating: number
  score: number
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

  const calculateScore = (opportunities: number, total: number, avgRating: number, withPhone: number) => {
    // Score ponderado: 40% oportunidades, 30% tasa de éxito, 20% rating, 10% teléfonos
    const opportunityScore = (opportunities / Math.max(...leads.map(() => 1))) * 40
    const successRate = (opportunities / total) * 30
    const ratingScore = (avgRating / 5) * 20
    const phoneScore = (withPhone / total) * 10
    
    return Math.round(opportunityScore + successRate + ratingScore + phoneScore)
  }

  const getPotencial = (score: number) => {
    if (score >= 80) return 'Muy Alto'
    if (score >= 60) return 'Alto'
    if (score >= 40) return 'Medio'
    if (score >= 20) return 'Bajo'
    return 'Muy Bajo'
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
      .map(loc => {
        const avgRating = loc.ratingCount > 0 ? parseFloat((loc.totalRating / loc.ratingCount).toFixed(1)) : 0
        const percentage = parseFloat(((loc.opportunities / loc.total) * 100).toFixed(1))
        const score = calculateScore(loc.opportunities, loc.total, avgRating, loc.withPhone)
        
        return {
          location: loc.location,
          total: loc.total,
          opportunities: loc.opportunities,
          avgRating,
          withPhone: loc.withPhone,
          percentage,
          score,
          potencial: getPotencial(score)
        }
      })
      .sort((a, b) => b.score - a.score)
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
          opportunities: 0,
          totalRating: 0,
          ratingCount: 0
        })
      }
      
      const data = categoryMap.get(category)
      data.count++
      if (lead.es_reclamable) data.opportunities++
      if (lead.rating) {
        data.totalRating += lead.rating
        data.ratingCount++
      }
    })

    const categories = Array.from(categoryMap.values())
      .map(cat => {
        const avgRating = cat.ratingCount > 0 ? parseFloat((cat.totalRating / cat.ratingCount).toFixed(1)) : 0
        const percentage = parseFloat(((cat.opportunities / cat.count) * 100).toFixed(1))
        const score = calculateScore(cat.opportunities, cat.count, avgRating, cat.count)
        
        return {
          category: cat.category,
          count: cat.count,
          opportunities: cat.opportunities,
          percentage,
          avgRating,
          score
        }
      })
      .sort((a, b) => b.score - a.score)

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    if (score >= 20) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (score >= 20) return 'bg-orange-100 text-orange-800 border-orange-300'
    return 'bg-red-100 text-red-800 border-red-300'
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
            <h2 className="text-xl font-bold text-gray-900">Top Ubicaciones por Potencial</h2>
          </div>

          <div className="space-y-4">
            {locationData.map((loc, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <Award className={`${getScoreColor(loc.score)}`} size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{loc.location}</p>
                      <p className="text-sm text-gray-500">
                        {loc.opportunities} de {loc.total} leads • {loc.percentage}% éxito
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">⭐ {loc.avgRating}</span>
                        <span className="text-xs text-gray-500">📞 {loc.withPhone}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getScoreBadge(loc.score)}`}>
                          {loc.potencial}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(loc.score)}`}>
                      {loc.score}
                    </div>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${getColorIntensity(loc.percentage)}`}
                    style={{ width: getBarWidth(loc.score, 100) }}
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{cat.category}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getScoreBadge(cat.score)}`}>
                        Score: {cat.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {cat.opportunities} oportunidades de {cat.count} leads • ⭐ {cat.avgRating}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getColorIntensity(cat.percentage)}`}>
                    {cat.percentage}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getColorIntensity(cat.percentage)}`}
                    style={{ width: getBarWidth(cat.score, 100) }}
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
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-yellow-600" size={24} />
          <h3 className="font-bold text-gray-900 text-lg">💡 Recomendaciones Inteligentes</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {locationData.length > 0 && (
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-green-600" size={20} />
                <p className="text-sm font-semibold text-gray-600">🎯 Mejor Ubicación</p>
              </div>
              <p className="font-bold text-xl text-green-600">{locationData[0]?.location}</p>
              <p className="text-sm text-gray-700 mt-1">
                {locationData[0]?.opportunities} oportunidades • Score: {locationData[0]?.score}/100
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Potencial: <span className="font-semibold">{locationData[0]?.potencial}</span> • 
                Rating: ⭐ {locationData[0]?.avgRating} • 
                Teléfonos: 📞 {locationData[0]?.withPhone}
              </p>
            </div>
          )}
          
          {categoryData.length > 0 && (
            <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-purple-600" size={20} />
                <p className="text-sm font-semibold text-gray-600">🏆 Mejor Categoría</p>
              </div>
              <p className="font-bold text-xl text-purple-600">{categoryData[0]?.category}</p>
              <p className="text-sm text-gray-700 mt-1">
                {categoryData[0]?.opportunities} oportunidades • Score: {categoryData[0]?.score}/100
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Tasa de éxito: <span className="font-semibold">{categoryData[0]?.percentage}%</span> • 
                Rating promedio: ⭐ {categoryData[0]?.avgRating}
              </p>
            </div>
          )}
        </div>

        {/* Estrategia Recomendada */}
        {locationData.length > 0 && categoryData.length > 0 && (
          <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-blue-600" size={20} />
              <p className="font-bold text-gray-900">📊 Estrategia Recomendada</p>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">1. Prioriza:</span> Buscar <span className="font-semibold text-purple-600">{categoryData[0]?.category}</span> en <span className="font-semibold text-green-600">{locationData[0]?.location}</span>
              </p>
              <p>
                <span className="font-semibold">2. Potencial:</span> Esta combinación tiene un score de <span className="font-semibold text-blue-600">{Math.round((locationData[0]?.score + categoryData[0]?.score) / 2)}/100</span> con {locationData[0]?.percentage}% de tasa de éxito
              </p>
              <p>
                <span className="font-semibold">3. Contactabilidad:</span> {locationData[0]?.withPhone} leads tienen teléfono ({Math.round((locationData[0]?.withPhone / locationData[0]?.total) * 100)}%)
              </p>
              {locationData[1] && (
                <p>
                  <span className="font-semibold">4. Alternativa:</span> También considera <span className="font-semibold text-green-600">{locationData[1]?.location}</span> (Score: {locationData[1]?.score})
                </p>
              )}
            </div>
          </div>
        )}

        {/* Métricas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Promedio Rating</p>
            <p className="font-bold text-lg text-yellow-600">
              {locationData.length > 0
                ? (locationData.reduce((sum, l) => sum + parseFloat(l.avgRating.toString()), 0) / locationData.length).toFixed(1)
                : '0'} ⭐
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Leads Contactables</p>
            <p className="font-bold text-lg text-green-600">
              {leads.filter(l => l.telefono).length} ({((leads.filter(l => l.telefono).length / leads.length) * 100).toFixed(0)}%)
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Score Promedio</p>
            <p className="font-bold text-lg text-blue-600">
              {locationData.length > 0
                ? Math.round(locationData.reduce((sum, l) => sum + l.score, 0) / locationData.length)
                : 0}/100
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Mejor Potencial</p>
            <p className="font-bold text-lg text-purple-600">
              {locationData[0]?.potencial || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
