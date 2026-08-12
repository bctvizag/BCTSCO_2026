import { useMemo } from 'react'
import ReportTable from './ReportTable'
import TotalCell from './TotalCell'
import TotalBalCell from './TotalBalCell'

// Shared "empty" placeholder, matching the previous fmt() behavior.
const dash = <span className="text-slate-300">—</span>

const isEmpty = (val) => val === null || val === undefined || val === ''

const textFormat = (val) => (isEmpty(val) ? dash : val)

const dateFormat = (val) => (isEmpty(val) ? dash : val.toString().slice(0, 10))

const decimalFormat = (val) =>
  isEmpty(val)
    ? dash
    : Number(val).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

const rateFormat = (val) => (isEmpty(val) ? dash : Number(val).toString() + '%')

// Column widths are now pixel numbers (ReportTable no longer uses Tailwind
// width classes), roughly matching the previous w-* utility values.
const COLUMNS = [
  { key: 'ACID', header: 'AC ID', width: 64, format: textFormat },
  { key: 'Trans_desc', header: 'Description', width: 160, format: textFormat },
  { key: 'Trans_dt', header: 'Date', width: 96, isDate: true, format: dateFormat },
  { key: 'CB_dt', header: 'CB Dt', width: 96, isDate: true, format: dateFormat },

  // { key: 'I_NO', header: 'Invoice', width: 112 },
  { key: 'Total_amt', header: 'Total', width: 96, hideFilter: true, summary: 'sum', format: (val, row) => <TotalCell txn={row} /> },
  { key: 'PRN', header: 'PRN', width: 80, format: decimalFormat },
  { key: 'INT', header: 'INT', width: 80, format: decimalFormat },
  { key: 'Total_Bal', header: 'Total Bal', width: 96, hideFilter: true, format: (val, row) => <TotalBalCell txn={row} /> },

  { key: 'rate', header: 'Rate', width: 48, format: rateFormat, summary: 'avg' },
  // { key: 'Days', header: 'Days', width: 64 },
  // { key: 'Status', header: 'Status', width: 80 },
  // { key: 'CB_side', header: 'CB Side', width: 72 },
  { key: 'MEMID', header: 'Member ID', width: 80, format: textFormat },
  { key: 'memberName', header: 'Member Name', width: 144, format: textFormat },
  { key: 'gno', header: 'GNO', width: 144, format: textFormat },

  // { key: 'AC_Sub', header: 'AC Sub', width: 96 },
  // { key: 'Remarks', header: 'Remarks', width: 160 },
  { key: 'ActionID', header: 'Batch No', width: 160, format: textFormat },
  { key: 'Trans_ID', header: 'Trans ID', width: 80, format: textFormat },
]

// Conditional row formatting, evaluated top-to-bottom (first match wins).
// Example: highlight "P" (Pay-in) side CB rows in light green with red text.
const ROW_STYLES = [
  {
    when: (row) => row.CB_side === 'P',
    style: { backgroundColor: 'lightgreen', color: 'red' },
  },
]

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
          // Flatten nested member fields so ReportTable's flat row[key]
          // lookups (sorting, filtering, CSV export) work on them directly.
          memberName: txn.member?.name,
          gno: txn.member?.gno,
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
    <ReportTable
      data={normalized}
      customColumns={COLUMNS}
      enableFilters
      enableExport
      displayFooter
      defaultAlign="left"
      exportFilename="transactions.csv"
      conditionalRowStyles={ROW_STYLES}
    />
  )
}