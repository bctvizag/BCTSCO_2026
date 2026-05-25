import { Pencil, Trash2 } from 'lucide-react'

const COLUMNS = [
  { key: 'ACID',       label: 'AC ID',        width: 'w-14' },
  { key: 'MemID',      label: 'Mem ID',       width: 'w-16' },
  { key: 'memberName', label: 'Member Name',  width: 'w-36' },
  { key: 'rank',       label: 'Rank',         width: 'w-24' },
  { key: 'ACNO',       label: 'AC No.',       width: 'w-24' },
  { key: 'AC_type',    label: 'AC Type',      width: 'w-20' },
  { key: 'AC_Sub',     label: 'AC Sub',       width: 'w-20' },
  { key: 'DOC',        label: 'DOC',          width: 'w-22', isDate: true },
  { key: 'Amt',        label: 'Amount',       width: 'w-24', isDecimal: true },
  { key: 'Period',     label: 'Period',       width: 'w-16' },
  { key: 'CloseDT',    label: 'Close DT',     width: 'w-22', isDate: true },
  { key: 'prn',        label: 'Prn',          width: 'w-24', isDecimal: true },
  { key: 'int',        label: 'Int',          width: 'w-24', isDecimal: true },
  { key: 'rate',       label: 'Rate',         width: 'w-16', isRate: true },
  { key: 'Closed',     label: 'Status',       width: 'w-18' },
  { key: 'IntCalType', label: 'Int Cal',      width: 'w-20' },
  { key: 'Remarks',    label: 'Remarks',      width: 'w-48' },
]

const getValue = (m, col) => {
  if (col.key === 'memberName') return m.member?.name
  if (col.key === 'rank') return m.member?.desgn
  return m[col.key]
}

const fmt = (val, col) => {
  if (val === null || val === undefined || val === '') {
    return <span className="text-slate-300">—</span>
  }
  if (col.isDate) return val.toString().slice(0, 10)
  if (col.isDecimal) {
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  if (col.isRate) return Number(val).toString() + '%'
  return val
}

const closedBadge = (closed) => {
  if (closed) {
    return <span className="badge badge-red">Closed</span>
  }
  return <span className="badge badge-green">Active</span>
}

export default function ACTable({ accounts, onEdit, onDelete }) {
  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 text-xs">
        No records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            {COLUMNS.map((col) => (
              <th key={col.key} className={`table-header ${col.width}`}>
                {col.label}
              </th>
            ))}
            <th className="table-header w-16 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accounts.map((acc) => (
            <tr
              key={acc.ACID}
              className="hover:bg-primary-50 transition-colors duration-100 group"
            >
              {COLUMNS.map((col) => {
                const val = getValue(acc, col)
                return (
                  <td key={col.key} className="table-cell">
                    {col.key === 'Closed' ? closedBadge(val) : fmt(val, col)}
                  </td>
                )
              })}
              <td className="table-cell text-center">
                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(acc)}
                    className="p-1 rounded text-primary-600 hover:bg-primary-100 transition-colors"
                    title="Edit"
                    aria-label={`Edit account ${acc.ACNO}`}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(acc)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                    aria-label={`Delete account ${acc.ACNO}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
