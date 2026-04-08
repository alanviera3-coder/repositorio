import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, Kanban, Wrench } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Kanban', icon: Kanban, end: true },
  { to: '/lista', label: 'Lista', icon: List },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wrench size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-sm leading-none block">DemandaPRO</span>
            <span className="text-xs text-gray-400 leading-none">Manutenção & Melhorias</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
