'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '@/components/Sidebar'
import { 
  TrendingUp, 
  Phone, 
  MapPin, 
  Star, 
  Users,
  Target,
  Mail,
  MessageSquare,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

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

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Actualizar cada 30s
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general de tu pipeline de ventas</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Leads"
                value={stats.total}
                icon={<Users className="text-blue-500" size={24} />}
                trend="+12%"
                trendUp={true}
                color="blue"
              />
              
              <StatCard
                title="Oportunidades"
                value={stats.reclamables}
                icon={<Target className="text-green-500" size={24} />}
                trend="+8%"
                trendUp={true}
                color="green"
              />
              
              <StatCard
                title="Con Teléfono"
                value={stats.con_telefono}
                icon={<Phone className="text-purple-500" size={24} />}
                trend="+15%"
                trendUp={true}
                color="purple"
              />
              
              <StatCard
                title="% Conversión"
                value={`${stats.porcentaje_oportunidades}%`}
                icon={<TrendingUp className="text-orange-500" size={24} />}
                trend="-2%"
                trendUp={false}
                color="orange"
              />
            </div>

            {/* Pipeline por Tipificación */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pipeline Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pipeline de Ventas</h2>
                <div className="space-y-4">
                  {stats.por_tipificacion.map((tip) => (
                    <div key={tip.nombre} className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tip.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{tip.nombre}</span>
                          <span className="text-sm font-bold text-gray-900">{tip.cantidad}</span>
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

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
                <div className="space-y-3">
                  <QuickActionButton
                    icon={<Search className="text-white" size={20} />}
                    label="Nueva Búsqueda"
                    description="Buscar leads en Google Maps"
                    color="bg-blue-600 hover:bg-blue-700"
                    href="/busqueda"
                  />
                  
                  <QuickActionButton
                    icon={<MessageSquare className="text-white" size={20} />}
                    label="Enviar WhatsApp"
                    description="Campaña de mensajes masivos"
                    color="bg-green-600 hover:bg-green-700"
                    href="/whatsapp"
                  />
                  
                  <QuickActionButton
                    icon={<Mail className="text-white" size={20} />}
                    label="Enviar Email"
                    description="Campaña de cold email"
                    color="bg-purple-600 hover:bg-purple-700"
                    href="/email"
                  />
                  
                  <QuickActionButton
                    icon={<Database className="text-white" size={20} />}
                    label="Enriquecer Leads"
                    description="Extraer emails y validar SSL"
                    color="bg-orange-600 hover:bg-orange-700"
                    href="/enriquecimiento"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
              <div className="space-y-4">
                <ActivityItem
                  icon={<Users className="text-blue-500" size={20} />}
                  title="Nuevos leads encontrados"
                  description="20 negocios agregados desde 'Cafeterías Lima'"
                  time="Hace 5 minutos"
                />
                <ActivityItem
                  icon={<Target className="text-green-500" size={20} />}
                  title="Oportunidad detectada"
                  description="Café de Lima - Negocio no reclamado con 4.5★"
                  time="Hace 10 minutos"
                />
                <ActivityItem
                  icon={<MessageSquare className="text-purple-500" size={20} />}
                  title="Mensaje enviado"
                  description="WhatsApp enviado a 15 leads"
                  time="Hace 1 hora"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Componentes auxiliares
function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp, 
  color 
}: { 
  title: string
  value: number | string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trendUp ? 'text-green-600' : 'text-red-600'
        }`}>
          {trendUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {trend}
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ 
  icon, 
  label, 
  description, 
  color, 
  href 
}: { 
  icon: React.ReactNode
  label: string
  description: string
  color: string
  href: string
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-4 p-4 rounded-lg ${color} transition-colors`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-white">
        <div className="font-semibold">{label}</div>
        <div className="text-sm opacity-90">{description}</div>
      </div>
    </a>
  )
}

function ActivityItem({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="text-xs text-gray-400 mt-1">{time}</div>
      </div>
    </div>
  )
}

// Import faltante
import { Database, Search } from 'lucide-react'
