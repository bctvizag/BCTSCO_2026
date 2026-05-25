import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, CreditCard, ArrowLeftRight, Zap, ArrowRight } from 'lucide-react'
import StatCard from '../components/StatCard'
import dashboardService from '../services/dashboardService'

const STATS = [
  { key: 'members',      label: 'Members',      icon: Users,          color: 'bg-primary-500',  fetch: dashboardService.getMemberCount },
  { key: 'accounts',     label: 'AC Accounts',  icon: CreditCard,     color: 'bg-violet-500',   fetch: dashboardService.getAcCount },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight, color: 'bg-emerald-500',  fetch: dashboardService.getTransactionCount },
  { key: 'actions',      label: 'Actions',      icon: Zap,            color: 'bg-amber-500',    fetch: dashboardService.getActionCount },
]

const QUICK_LINKS = [
  { to: '/members', label: 'Manage Members', desc: 'Create, search, edit, delete members', icon: Users, color: 'text-primary-600 bg-primary-50' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    const fetchAll = async () => {
      setLoading(true)
      const results = await Promise.allSettled(STATS.map((s) => s.fetch()))
      if (!alive) return
      const map = {}
      STATS.forEach((s, i) => {
        map[s.key] = results[i].status === 'fulfilled' ? results[i].value : '!'
      })
      setCounts(map)
      setLoading(false)
    }
    fetchAll()
    return () => { alive = false }
  }, [])

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div className="card p-5 bg-gradient-to-r from-primary-700 to-primary-500 border-0">
        <h2 className="text-white text-base font-semibold">Welcome to SQL Admin Panel</h2>
        <p className="text-primary-100 text-xs mt-1">
          Database: <strong>SOCRJY</strong> · Server: <strong>localhost\SQLEXPRESS</strong>
        </p>
      </div>

      {/* Stat cards */}
      <section aria-label="Summary statistics">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <StatCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={counts[s.key]}
              color={s.color}
              loading={loading}
            />
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section aria-label="Quick navigation">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{label}</p>
                <p className="text-2xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <ArrowRight
                size={13}
                className="text-slate-400 group-hover:text-primary-600 transition-colors shrink-0 mt-0.5"
              />
            </Link>
          ))}

          {/* Placeholder cards */}
          {['AC Accounts', 'Transactions', 'Actions', 'Cheque Details'].map((label) => (
            <div
              key={label}
              className="card p-4 flex items-start gap-3 opacity-50 cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <CreditCard size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{label}</p>
                <p className="text-2xs text-slate-400 mt-0.5">Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tables overview */}
      <section aria-label="Database tables">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Database Tables
        </h3>
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="table-header">Table</th>
                <th className="table-header">Primary Key</th>
                <th className="table-header">Columns</th>
                <th className="table-header">API Endpoint</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'mem_tb',      pk: 'MemID',    cols: 16, ep: '/api/members',      ready: true },
                { name: 'AC_tb',       pk: 'ACID',     cols: 15, ep: '/api/ac',           ready: false },
                { name: 'trans_tb',    pk: 'Trans_ID', cols: 30, ep: '/api/transactions', ready: false },
                { name: 'Action_TB',   pk: 'ActionID', cols: 4,  ep: '/api/actions',      ready: false },
                { name: 'Chqdetails',  pk: 'ChqID',    cols: 13, ep: '/api/chqdetails',   ready: false },
              ].map((t) => (
                <tr key={t.name} className="hover:bg-slate-50">
                  <td className="table-cell font-mono font-medium text-slate-700">{t.name}</td>
                  <td className="table-cell font-mono text-primary-600">{t.pk}</td>
                  <td className="table-cell">{t.cols}</td>
                  <td className="table-cell font-mono text-slate-500">{t.ep}</td>
                  <td className="table-cell">
                    {t.ready ? (
                      <span className="badge-green badge">Active</span>
                    ) : (
                      <span className="badge-gray badge">Planned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
