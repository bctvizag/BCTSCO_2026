import { useMemo } from 'react'
import TotalCell from './TotalCell'
import TotalBalCell from './TotalBalCell'

const COLUMNS = [   
  { key: 'ACID', label: 'AC ID', width: 'w-16' },  
  { key: 'Trans_desc', label: 'Description', width: 'w-40' },
  { key: 'Trans_dt', label: 'Date', width: 'w-24', isDate: true },
  { key: 'CB_dt', label: 'CB Dt', width: 'w-24', isDate: true },
  
//   { key: 'I_NO', label: 'Invoice', width: 'w-28' },
  { key: 'Total_amt', label: 'Total', width: 'w-24', isDecimal: true },
  { key: 'PRN', label: 'PRN', width: 'w-20', isDecimal: true },
  { key: 'INT', label: 'INT', width: 'w-20', isDecimal: true },
  { key: 'Total_Bal', label: 'Total Bal', width: 'w-24', isDecimal: true },
  
  { key: 'rate', label: 'Rate', width: 'w-18', isRate: true },
  { key: 'Days', label: 'Days', width: 'w-16' },
//   { key: 'Status', label: 'Status', width: 'w-20' },
  { key: 'CB_side', label: 'CB Side', width: 'w-18' },
  { key: 'MEMID', label: 'Member ID', width: 'w-20' },
 
  { key: 'AC_Sub', label: 'AC Sub', width: 'w-24' },
  { key: 'Remarks', label: 'Remarks', width: 'w-40' },
  { key: 'ActionID', label: 'Batch No', width: 'w-40' },
  { key: 'Trans_ID', label: 'Trans ID', width: 'w-20' },
]

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

const statusBadge = (status) => {
  const map = {
    Active: 'badge-green',
    Pending: 'badge-blue',
    Cleared: 'badge-green',
    Cancelled: 'badge-red',
    Closed: 'badge-gray',
  }

  return <span className={`badge ${map[status] ?? 'badge-blue'}`}>{status}</span>
}

export default function TransactionTable({ transactions }) {
  const normalized = useMemo(
    () =>
      transactions.map((txn) => {
        const prnB = Number(txn.PRN_B ?? 0)
        const intB = Number(txn.INT_B ?? 0)

        return {
          ...txn,
          Status: txn.Status ?? 'Pending',
          Total_Bal: prnB + intB,
        }
      }),
    [transactions]
  )

  if (normalized.length === 0) {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {normalized.map((txn) => (
            <tr
              key={txn.Trans_ID}
              className="hover:bg-primary-50 transition-colors duration-100"
            >
              {COLUMNS.map((col) => (
                <td key={`${txn.Trans_ID}-${col.key}`} className="table-cell">
                  {col.key === 'Status'
                    ? statusBadge(txn[col.key])
                    : col.key === 'Total_amt'
                      ? <TotalCell txn={txn} />
                      : col.key === 'Total_Bal'
                        ? <TotalBalCell txn={txn} />
                        : fmt(txn[col.key], col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
