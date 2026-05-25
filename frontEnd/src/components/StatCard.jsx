import Spinner from './ui/Spinner'

export default function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <Spinner size={14} className="mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-800 leading-tight">{value ?? '—'}</p>
        )}
      </div>
    </div>
  )
}
