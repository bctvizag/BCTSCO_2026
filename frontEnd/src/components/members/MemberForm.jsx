import { useState, useEffect } from 'react'

const EMPTY = {
  Memtype: '', empno: '', gno: '', hrno: '', name: '',
  desgn: '', sex: '', DOB: '', DOA: '', DOR: '',
  DOM: '', DIV: '', subdiv: '', Status: '', Phone1: '',
}

const FIELDS = [
  { key: 'name',    label: 'Full Name',   required: true, col: 2 },
  { key: 'Memtype', label: 'Member Type', required: true },
  { key: 'empno',   label: 'Emp No.' },
  { key: 'gno',     label: 'G. No.' },
  { key: 'hrno',    label: 'HR No.' },
  { key: 'desgn',   label: 'Designation' },
  { key: 'sex',     label: 'Gender',  type: 'select', options: ['', 'M', 'F', 'O'] },
  { key: 'Phone1',  label: 'Phone' },
  { key: 'DIV',     label: 'Division' },
  { key: 'subdiv',  label: 'Sub-Division' },
  { key: 'Status',  label: 'Status', type: 'select', options: ['', 'Active', 'Inactive', 'Retired'] },
  { key: 'DOB',     label: 'Date of Birth',   type: 'date' },
  { key: 'DOA',     label: 'Date of Appt.',   type: 'date' },
  { key: 'DOR',     label: 'Date of Retire.', type: 'date' },
  { key: 'DOM',     label: 'Date of Memb.',   type: 'date' },
]

export default function MemberForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initialData) {
      const cleaned = {}
      Object.keys(EMPTY).forEach((k) => {
        const v = initialData[k]
        if (v && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
          cleaned[k] = v.slice(0, 10)
        } else {
          cleaned[k] = v ?? ''
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
    const payload = { ...form }
    // Convert empty date strings to null
    ;['DOB', 'DOA', 'DOR', 'DOM'].forEach((k) => {
      if (!payload[k]) payload[k] = null
    })
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} id="member-form">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {FIELDS.map(({ key, label, type, options, required, col }) => (
          <div key={key} className={col === 2 ? 'col-span-2' : ''}>
            <label htmlFor={`field-${key}`} className="label">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'select' ? (
              <select
                id={`field-${key}`}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="input"
              >
                {options.map((o) => (
                  <option key={o} value={o}>{o || '— Select —'}</option>
                ))}
              </select>
            ) : (
              <input
                id={`field-${key}`}
                type={type || 'text'}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                required={required}
                className="input"
                placeholder={label}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : initialData ? 'Update Member' : 'Create Member'}
        </button>
      </div>
    </form>
  )
}
