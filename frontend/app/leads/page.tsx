'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Phone, MapPin, Star, ExternalLink, Filter, Search, Download } from 'lucide-react'

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
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterReclamable, setFilterReclamable] = useState<string>('all')
  const [filterPhone, setFilterPhone] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, searchTerm, filterReclamable, filterPhone])

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

  const applyFilters = () => {
    let filtered = [...leads]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Reclamable filter
    if (filterReclamable === 'yes') {
      filtered = filtered.filter(lead => lead.es_reclamable)
    } else if (filterReclamable === 'no') {
      filtered = filtered.filter(lead => !lead.es_reclamable)
    }

    // Phone filter
    if (filterPhone === 'yes') {
      filtered = filtered.filter(lead => lead.telefono)
    } else if (filterPhone === 'no') {
      filtered = filtered.filter(lead => !lead.telefono)
    }

    setFilteredLeads(filtered)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Nombre', 'Teléfono', 'Dirección', 'Rating', 'Reseñas', 'Oportunidad', 'Estado', 'Etapa']
    const rows = filteredLeads.map(lead => [
      lead.id,
      lead.nombre,
      lead.telefono || 'N/A',
      lead.direccion || 'N/A',
      lead.rating || 'N/A',
      lead.reviews || 'N/A',
      lead.es_reclamable ? 'Sí' : 'No',
      lead.estado,
      lead.tipificacion_nombre || 'N/A'
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const viewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setShowModal(true)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos los Leads</h1>
        <p className="text-gray-600">Gestiona y filtra todos tus leads capturados</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o dirección..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Reclamable Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oportunidad
            </label>
            <select
              value={filterReclamable}
              onChange={(e) => setFilterReclamable(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Todos</option>
              <option value="yes">Sí (No reclamado)</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Phone Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <select
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Todos</option>
              <option value="yes">Con teléfono</option>
              <option value="no">Sin teléfono</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredLeads.length}</span> de <span className="font-semibold">{leads.length}</span> leads
          </p>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Negocio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {lead.nombre}
                        {lead.es_reclamable && (
                          <span className="text-green-600 text-xs">🎯</span>
                        )}
                      </div>
                      {lead.direccion && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {lead.direccion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.telefono ? (
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone size={14} className="text-green-600" />
                        {lead.telefono}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin teléfono</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {lead.rating ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={14} className="text-yellow-500" />
                        <span className="font-medium">{lead.rating}</span>
                        <span className="text-gray-500">({lead.reviews})</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin rating</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.es_reclamable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.es_reclamable ? 'Oportunidad' : 'Reclamado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {lead.tipificacion_nombre ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: lead.tipificacion_color || '#gray' }}
                        />
                        <span className="text-sm text-gray-900">{lead.tipificacion_nombre}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin etapa</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewLeadDetails(lead)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100"
                      >
                        Ver Detalles
                      </button>
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded text-sm font-medium hover:bg-gray-100"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No se encontraron leads con los filtros aplicados
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLead.nombre}</h2>
                  {selectedLead.es_reclamable && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      🎯 Oportunidad
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedLead.telefono && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <Phone className="text-purple-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-semibold text-gray-900">{selectedLead.telefono}</p>
                    </div>
                  </div>
                )}

                {selectedLead.direccion && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <MapPin className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-semibold text-gray-900">{selectedLead.direccion}</p>
                    </div>
                  </div>
                )}

                {selectedLead.rating && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                    <Star className="text-yellow-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold text-gray-900">
                        {selectedLead.rating} ⭐ ({selectedLead.reviews} reseñas)
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-semibold text-gray-900">{selectedLead.estado}</p>
                  </div>
                  {selectedLead.tipificacion_nombre && (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedLead.tipificacion_color || '#gray' }}
                      />
                      <span className="font-semibold">{selectedLead.tipificacion_nombre}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedLead.telefono && (
                    <a
                      href={`tel:${selectedLead.telefono}`}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold"
                    >
                      <Phone size={18} />
                      Llamar Ahora
                    </a>
                  )}
                  <a
                    href={selectedLead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold"
                  >
                    <ExternalLink size={18} />
                    Ver en Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
