'use client'

import { Home, Search, Users, BarChart3, Settings, Target, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Search, label: 'Nueva Búsqueda', href: '/search' },
  { icon: Target, label: 'Pipeline CRM', href: '/crm' },
  { icon: Users, label: 'Todos los Leads', href: '/leads' },
  { icon: Phone, label: 'Por Contactar', href: '/to-contact' },
  { icon: Calendar, label: 'Seguimientos', href: '/follow-ups' },
  { icon: BarChart3, label: 'Estadísticas', href: '/stats' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎯 <span>LeadHunter</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">CRM Profesional</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <p className="font-semibold text-white mb-1">Auto-Py LeadHunter</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
