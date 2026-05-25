import { useState, useMemo } from 'react'
import { PlusCircle, Search, RefreshCw, X, FileSpreadsheet } from 'lucide-react'
import { exportToExcel } from '../utils/excelExport'
import { useACAccounts } from '../hooks/useACAccounts'
import { usePagination } from '../hooks/usePagination'
import ACTable from '../components/ac/ACTable'
import ACForm from '../components/ac/ACForm'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'

const PAGE_SIZE = 20

export default function ACAccounts() {
  const { accounts, loading, fetchAll, create, update, remove } = useACAccounts()

  // Excel Export
  const handleExport = () => {
    const exportData = filtered.map((acc) => ({
      'Account ID': acc.ACID,
      'Member ID': acc.MemID,
      'Member Name': acc.member?.name || '',
      'Rank (Designation)': acc.member?.desgn || '',
      'Account No': acc.ACNO,
      'Account Type': acc.AC_type,
      'Sub Type': acc.AC_Sub,
      'Commencement Date': acc.DOC ? acc.DOC.slice(0, 10) : '',
      Amount: acc.Amt,
      'Period (Months)': acc.Period,
      'Closing Date': acc.CloseDT ? acc.CloseDT.slice(0, 10) : '',
      Principal: acc.prn,
      Interest: acc.int,
      'Rate (%)': acc.rate,
      Status: acc.Closed ? 'Closed' : 'Active',
      'Interest Calc Type': acc.IntCalType,
      Remarks: acc.Remarks,
    }))
    exportToExcel(exportData, 'AC_Accounts.xlsx', 'Accounts')
  }

  // Search state
  const [search, setSearch] = useState('')

  // Filter accounts by code, types, remarks, member ID, name, or rank
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return accounts
    return accounts.filter((acc) =>
      [
        acc.ACID,
        acc.MemID,
        acc.ACNO,
        acc.AC_type,
        acc.AC_Sub,
        acc.Remarks,
        acc.IntCalType,
        acc.member?.name,
        acc.member?.desgn,
      ].some((v) => v && v.toString().toLowerCase().includes(q))
    )
  }, [accounts, search])

  // Pagination hook
  const { paged, page, totalPages, next, prev, goTo, reset, total } = usePagination(
    filtered,
    PAGE_SIZE
  )

  const handleSearch = (val) => {
    setSearch(val)
    reset()
  }

  // Modal forms state
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null)

  const openCreate = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const openEdit = (acc) => {
    setEditTarget(acc)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    let ok
    if (editTarget) {
      ok = await update(editTarget.ACID, data)
    } else {
      ok = await create(data)
    }
    setIsSubmitting(false)
    if (ok) closeModal()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await remove(deleteTarget.ACID)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="card px-3 py-2.5 flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-700 mr-2">
          AC Accounts
          <span className="ml-2 px-2 py-0.5 rounded-full text-2xs font-medium bg-primary-100 text-primary-700">
            {total}
          </span>
        </h2>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="ac-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search AC no, types, member name, rank..."
            className="input pl-7 pr-7"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="btn-secondary gap-1.5"
            aria-label="Refresh accounts"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="btn-success gap-1.5"
            aria-label="Export to Excel"
          >
            <FileSpreadsheet size={12} />
            Export
          </button>
          <button
            id="add-ac-btn"
            onClick={openCreate}
            className="btn-primary"
          >
            <PlusCircle size={12} />
            Add Account
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-xs">
            <Spinner size={16} />
            <span>Loading AC accounts...</span>
          </div>
        ) : (
          <>
            <ACTable
              accounts={paged}
              onEdit={openEdit}
              onDelete={(acc) => setDeleteTarget(acc)}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              onPrev={prev}
              onNext={next}
              onGoTo={goTo}
            />
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? `Edit AC Account — ACID: ${editTarget.ACID}` : 'Add New AC Account'}
        size="md"
      >
        <ACForm
          initialData={editTarget}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete AC Account"
        message={`Are you sure you want to delete account "${deleteTarget?.ACNO}" (ACID: ${deleteTarget?.ACID})? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
