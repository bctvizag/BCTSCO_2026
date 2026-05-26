import { useState } from 'react'

const fmtMoney = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function TotalBalCell({ txn }) {
  const [hovered, setHovered] = useState(false)

  const detailItems = [
    { label: 'PRN_B', value: txn.PRN_B },
    { label: 'INT_B', value: txn.INT_B },
  ]

  return (
    <div
      className="relative inline-flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>
        {Number(txn.Total_Bal).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="text-[10px] text-slate-400">hover</span>

      {hovered && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
            Breakdown
          </p>
          <div className="space-y-1 text-[11px] text-slate-700">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span>{item.label}</span>
                <span className="font-medium">{fmtMoney(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
