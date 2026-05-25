import { useState, useEffect } from 'react'
import memberService from '../../services/memberService'
import ComboSearchBox from '../ui/ComboSearchBox'
import toast from 'react-hot-toast'

const EMPTY = {
  MemID: '',
  AC_type: '',
  AC_Sub: '',
  ACNO: '',
  DOC: '',
  Amt: '',
  Period: '',
  CloseDT: '',
  prn: '',
  int: '',
  rate: '',
  Closed: false,
  Remarks: '',
  IntCalType: '',
}

const FIELDS = [
  { key: 'MemID',      label: 'Member ID',          type: 'number', required: true },
  { key: 'ACNO',       label: 'Account Number',      required: true },
  { key: 'AC_type',    label: 'Account Type' },
  { key: 'AC_Sub',     label: 'Account Sub-Type' },
  { key: 'DOC',        label: 'Date of Commencement',type: 'date' },
  { key: 'Amt',        label: 'Amount',             type: 'number', step: '0.01' },
  { key: 'Period',     label: 'Period (Months)',    type: 'number' },
  { key: 'CloseDT',    label: 'Closing Date',        type: 'date' },
  { key: 'prn',        label: 'Principal Amount',    type: 'number', step: '0.01' },
  { key: 'int',        label: 'Interest Amount',     type: 'number', step: '0.01' },
  { key: 'rate',       label: 'Interest Rate (%)',   type: 'number', step: '0.0001' },
  { key: 'IntCalType', label: 'Interest Calc Type' },
  { key: 'Remarks',    label: 'Remarks',             col: 2 },
]

export default function ACForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(EMPTY)
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  // Load members for real-time validation name display
  useEffect(() => {
    async function loadMembers() {
      setLoadingMembers(true)
      try {
        const res = await memberService.getAll()
        setMembers(res.data ?? [])
      } catch (err) {
        console.error('Failed to load members list for form helper:', err)
      } finally {
        setLoadingMembers(false)
      }
    }
    loadMembers()
  }, [])

  useEffect(() => {
    if (initialData) {
      const cleaned = {}
      Object.keys(EMPTY).forEach((k) => {
        const v = initialData[k]
        if (v && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
          cleaned[k] = v.slice(0, 10)
        } else {
          cleaned[k] = v ?? (k === 'Closed' ? false : '')
        }
      })
      setForm(cleaned)
    } else {
      setForm(EMPTY)
    }
  }, [initialData])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that a valid member is selected
    if (form.MemID && !activeMember) {
      toast.error('Please select a valid member from the search results')
      return
    }

    const payload = { ...form }

    // Parse numeric fields
    payload.MemID = payload.MemID ? parseInt(payload.MemID, 10) : null
    payload.Period = payload.Period ? parseInt(payload.Period, 10) : null
    payload.Amt = payload.Amt ? parseFloat(payload.Amt) : null
    payload.prn = payload.prn ? parseFloat(payload.prn) : null
    payload.int = payload.int ? parseFloat(payload.int) : null
    payload.rate = payload.rate ? parseFloat(payload.rate) : null

    // Date sanitization
    ;['DOC', 'CloseDT'].forEach((k) => {
      if (!payload[k]) payload[k] = null
    })

    onSubmit(payload)
  }

  // Find member info if MemID is filled
  const activeMember = form.MemID
    ? members.find((m) => m.MemID === Number(form.MemID))
    : null

  return (
    <form onSubmit={handleSubmit} id="ac-form" className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {FIELDS.map(({ key, label, type, required, step, col }) => (
          <div key={key} className={col === 2 ? 'col-span-2' : ''}>
            <label htmlFor={`field-${key}`} className="label">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {key === 'MemID' ? (
              <ComboSearchBox
                items={members}
                value={form.MemID}
                onSearch={(q) => set('MemID', q)}
                onSelect={(item) => set('MemID', item.MemID)}
                placeholder="Search ID, name, rank..."
                searchFields={['MemID', 'name', 'desgn']}
                displayFields={['MemID', 'name', 'desgn']}
                fieldLabels={{ MemID: 'ID', name: 'Name', desgn: 'Rank' }}
                valueField="MemID"
                disabled={isSubmitting}
              />
            ) : (
              <input
                id={`field-${key}`}
                type={type || 'text'}
                step={step}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                required={required}
                className="input"
                placeholder={label}
              />
            )}
            {key === 'MemID' && form.MemID && (
              <div className="mt-1 min-h-[14px]">
                {activeMember ? (
                  <p className="text-2xs text-emerald-600 font-medium">
                    ✓ Member: {activeMember.name} ({activeMember.desgn || 'No Rank'})
                  </p>
                ) : loadingMembers ? (
                  <p className="text-2xs text-slate-400">Verifying member ID…</p>
                ) : (
                  <p className="text-2xs text-red-500 font-medium">
                    ✗ Member ID not found
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Closed field separate check box */}
        <div className="col-span-2 flex items-center gap-2 py-1">
          <input
            id="field-Closed"
            type="checkbox"
            checked={form.Closed}
            onChange={(e) => set('Closed', e.target.checked)}
            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="field-Closed" className="text-xs font-medium text-slate-600">
            Mark Account as Closed
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : initialData ? 'Update Account' : 'Create Account'}
        </button>
      </div>
    </form>
  )
}
