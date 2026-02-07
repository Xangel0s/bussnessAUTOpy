'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  MessageSquare, 
  Mail, 
  TrendingUp,
  Settings,
  Target,
  Database,
  Zap
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Search, label: 'Búsqueda', href: '/busqueda' },
  { icon: Users, label: 'Leads', href: '/leads' },
  { icon: Target, label: 'Pipeline', href: '/pipeline' },
  { icon: MessageSquare, label: 'WhatsApp', href: '/whatsapp' },
  { icon: Mail, label: 'Email', href: '/email' },
  { icon: Database, label: 'Enriquecimiento', href: '/enriquecimiento' },
  { icon: Zap, label: 'Campañas', href: '/campanas' },
  { icon: TrendingUp, label: 'Reportes', href: '/reportes' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎯 <span>LeadHunter</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">CRM Inteligente</p>
      </div>

      {/* Menu */}
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
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>Auto-Py v1.0.0</p>
          <p className="mt-1">Powered by Python + FastAPI</p>
        </div>
      </div>
    </div>
  )
}
