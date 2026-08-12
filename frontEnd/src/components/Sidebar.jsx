import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  Zap,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members',   icon: Users,           label: 'Members' },
  { to: '/ac',        icon: CreditCard,      label: 'AC Accounts' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/actions',   icon: Zap,             label: 'Actions',      disabled: true },
  { to: '/chqdetails',icon: Database,        label: 'Cheque Details', disabled: true },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  return (
    <aside className={`shrink-0 bg-sidebar flex flex-col relative transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-48'
    }`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-[18px] -right-3 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110 z-30"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-slate-700 h-14 shrink-0 overflow-hidden ${
        isCollapsed ? 'justify-center px-2' : ''
      }`}>
        <div className="w-6 h-6 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
          <Database size={13} className="text-white" />
        </div>
        <span className={`text-white text-xs font-semibold leading-tight transition-all duration-300 whitespace-nowrap ${
          isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-xs'
        }`}>
          SQL Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <p className={`px-2 pb-1 text-2xs font-semibold uppercase tracking-widest text-slate-500 transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isCollapsed ? 'opacity-0 max-w-0 pb-0' : 'opacity-100'
        }`}>
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label, disabled }) =>
          disabled ? (
            <div
              key={to}
              title={isCollapsed ? `${label} (Soon)` : undefined}
              className={`flex items-center py-2 rounded-lg text-slate-500 cursor-not-allowed opacity-50 transition-all duration-300 ${
                isCollapsed ? 'justify-center px-2' : 'px-3'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-xs ml-2.5'
              }`}>
                {label}
              </span>
              {!isCollapsed && (
                <span className="ml-auto text-2xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded shrink-0">
                  Soon
                </span>
              )}
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center py-2 rounded-lg text-xs transition-all duration-150 ${
                  isCollapsed ? 'justify-center px-2' : 'px-3'
                } ${
                  isActive
                    ? 'bg-primary-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-xs ml-2.5'
              }`}>
                {label}
              </span>
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className={`px-4 py-3 border-t border-slate-700 shrink-0 overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'px-2' : ''
      }`}>
        <p className={`text-2xs text-slate-500 transition-all duration-300 whitespace-nowrap ${
          isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
        }`}>
          DB: SOCRJY · SQLEXPRESS
        </p>
        <div className={`flex items-center gap-1.5 mt-1 transition-all duration-300 ${
          isCollapsed ? 'justify-center mt-0' : ''
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className={`text-2xs text-emerald-400 transition-all duration-300 whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-xs ml-0'
          }`}>
            Connected
          </span>
        </div>
      </div>
    </aside>
  )
}

