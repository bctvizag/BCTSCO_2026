import { Pencil, Trash2 } from 'lucide-react'

const COLUMNS = [
  { key: 'MemID',   label: 'ID',      width: 'w-10' },
  { key: 'name',    label: 'Name',    width: 'w-36' },
  { key: 'Memtype', label: 'Type',    width: 'w-20' },
  { key: 'empno',   label: 'EmpNo',   width: 'w-20' },
  { key: 'gno',     label: 'GNo',     width: 'w-16' },
  { key: 'hrno',    label: 'HRNo',    width: 'w-16' },
  { key: 'desgn',   label: 'Designation', width: 'w-28' },
  { key: 'sex',     label: 'Sex',     width: 'w-10' },
  { key: 'DOB',     label: 'DOB',     width: 'w-24', isDate: true },
  { key: 'DOA',     label: 'DOA',     width: 'w-24', isDate: true },
  { key: 'DOR',     label: 'DOR',     width: 'w-24', isDate: true },
  { key: 'DOM',     label: 'DOM',     width: 'w-24', isDate: true },
  { key: 'DIV',     label: 'Division', width: 'w-24' },
  { key: 'subdiv',  label: 'SubDiv',  width: 'w-20' },
  { key: 'Status',  label: 'Status',  width: 'w-16' },
  { key: 'Phone1',  label: 'Phone',   width: 'w-24' },
]

const fmt = (val, isDate) => {
  if (!val) return <span className="text-slate-300">—</span>
  if (isDate) return val.toString().slice(0, 10)
  return val
}

const statusBadge = (status) => {
  const map = {
    Active:   'badge-green',
    Inactive: 'badge-red',
    Retired:  'badge-gray',
  }
  return <span className={`badge ${map[status] ?? 'badge-blue'}`}>{status}</span>
}

export default function MemberTable({ members, onEdit, onDelete }) {
  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 text-xs">
        No records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            {COLUMNS.map(({ key, label, width }) => (
              <th key={key} className={`table-header ${width}`}>
                {label}
              </th>
            ))}
            <th className="table-header w-16 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {members.map((m) => (
            <tr
              key={m.MemID}
              className="hover:bg-primary-50 transition-colors duration-100 group"
            >
              {COLUMNS.map(({ key, isDate }) => (
                <td key={key} className="table-cell">
                  {key === 'Status' ? statusBadge(m[key]) : fmt(m[key], isDate)}
                </td>
              ))}
              <td className="table-cell text-center">
                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(m)}
                    className="p-1 rounded text-primary-600 hover:bg-primary-100 transition-colors"
                    title="Edit"
                    aria-label={`Edit member ${m.name}`}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(m)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                    aria-label={`Delete member ${m.name}`}
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
