import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  Zap,
  Database,
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
  return (
    <aside className="w-48 shrink-0 bg-sidebar flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-700">
        <div className="w-6 h-6 rounded-lg bg-primary-500 flex items-center justify-center">
          <Database size={13} className="text-white" />
        </div>
        <span className="text-white text-xs font-semibold leading-tight">SQL Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <p className="px-2 pb-1 text-2xs font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label, disabled }) =>
          disabled ? (
            <div
              key={to}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed opacity-50"
            >
              <Icon size={13} />
              <span className="text-xs">{label}</span>
              <span className="ml-auto text-2xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                Soon
              </span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700">
        <p className="text-2xs text-slate-500">DB: SOCRJY · SQLEXPRESS</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-2xs text-emerald-400">Connected</span>
        </div>
      </div>
    </aside>
  )
}
