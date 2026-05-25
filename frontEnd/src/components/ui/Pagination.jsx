import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, total, pageSize, onPrev, onNext, onGoTo }) {
  const from = Math.min((page - 1) * pageSize + 1, total)
  const to   = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 bg-slate-50">
      <p className="text-2xs text-slate-500">
        Showing <span className="font-medium">{from}–{to}</span> of{' '}
        <span className="font-medium">{total}</span> records
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="btn-ghost px-1.5 py-1 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
            acc.push(p)
            return acc
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="text-xs text-slate-400 px-1">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onGoTo(p)}
                className={`w-6 h-6 rounded text-2xs font-medium transition-colors ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="btn-ghost px-1.5 py-1 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
