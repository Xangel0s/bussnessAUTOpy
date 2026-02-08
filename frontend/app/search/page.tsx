'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, RefreshCw, AlertCircle, History, TrendingUp, Target } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ScrapingStatus {
  is_running: boolean
  current_query: string | null
  leads_found: number
  opportunities_found: number
}

interface SearchHistory {
  query: string
  timestamp: string
  results: number
  opportunities: number
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [maxResults, setMaxResults] = useState(20)
  const [loading, setLoading] = useState(false)
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus | null>(null)
  const [error, setError] = useState('')
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(checkScrapingStatus, 2000)
    loadSearchHistory()
    return () => clearInterval(interval)
  }, [])

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }

  const saveToHistory = (query: string, results: number, opportunities: number) => {
    const newEntry: SearchHistory = {
      query,
      timestamp: new Date().toISOString(),
      results,
      opportunities
    }
    const updated = [newEntry, ...searchHistory].slice(0, 10) // Keep last 10
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const checkScrapingStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/scrape/status`)
      setScrapingStatus(response.data)
      
      if (response.data.is_running === false && loading) {
        setLoading(false)
        setSuccess(true)
        saveToHistory(
          response.data.current_query || query,
          response.data.leads_found,
          response.data.opportunities_found
        )
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  const startScraping = async () => {
    if (!query.trim()) {
      setError('Por favor ingresa una búsqueda')
      return
    }

    if (maxResults < 1 || maxResults > 100) {
      setError('El número de resultados debe estar entre 1 y 100')
      return
    }

    setError('')
    setSuccess(false)
    setLoading(true)
    
    try {
      await axios.post(`${API_URL}/scrape`, {
        query,
        max_results: maxResults
      })
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al iniciar scraping')
      setLoading(false)
    }
  }

  const useHistoryQuery = (historyQuery: string) => {
    setQuery(historyQuery)
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Búsqueda</h1>
          <p className="text-gray-600">Encuentra negocios no reclamados en Google Maps</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Query Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Búsqueda
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: restaurantes en Madrid, cafeterías en Lima"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Ingresa el tipo de negocio y la ubicación que deseas buscar
              </p>
            </div>

            {/* Max Results */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de resultados
              </label>
              <input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Máximo 100 resultados por búsqueda
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <Target size={20} />
                <span>¡Búsqueda completada exitosamente!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={startScraping}
              disabled={loading}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={24} />
                  Iniciar Búsqueda
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scraping Status */}
        {scrapingStatus?.is_running && (
          <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 text-lg">
              🔍 Búsqueda en progreso
            </h3>
            <div className="space-y-2">
              <p className="text-blue-800">
                <span className="font-semibold">Consulta:</span> {scrapingStatus.current_query}
              </p>
              <p className="text-blue-800">
                <span className="font-semibold">Leads encontrados:</span> {scrapingStatus.leads_found}
              </p>
              <p className="text-blue-800">
                <span className="font-semibold">Oportunidades:</span> {scrapingStatus.opportunities_found}
              </p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">💡 Consejos para mejores resultados</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Sé específico con la ubicación (ciudad, distrito, barrio)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Usa términos de búsqueda claros (restaurantes, cafeterías, tiendas)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Empieza con 20-30 resultados para probar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>El proceso puede tardar 2-5 minutos dependiendo de los resultados</span>
            </li>
          </ul>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <History size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Historial de Búsquedas</h3>
            </div>
            <div className="space-y-2">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => useHistoryQuery(item.query)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.query}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{item.results}</p>
                      <p className="text-gray-500">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-green-600">{item.opportunities}</p>
                      <p className="text-gray-500">Oport.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
