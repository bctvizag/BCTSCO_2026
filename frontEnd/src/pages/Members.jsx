import { useState, useMemo } from 'react'
import { UserPlus, Search, RefreshCw, X, FileSpreadsheet } from 'lucide-react'
import { exportToExcel } from '../utils/excelExport'
import { useMembers } from '../hooks/useMembers'
import { usePagination } from '../hooks/usePagination'
import MemberTable from '../components/members/MemberTable'
import MemberForm from '../components/members/MemberForm'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'

const PAGE_SIZE = 20

export default function Members() {
  const { members, loading, fetchAll, create, update, remove } = useMembers()

  // Excel Export
  const handleExport = () => {
    const exportData = filtered.map((m) => ({
      'Member ID': m.MemID,
      Name: m.name,
      Type: m.Memtype,
      'Emp No': m.empno,
      'G No': m.gno,
      'HR No': m.hrno,
      Designation: m.desgn,
      Sex: m.sex,
      DOB: m.DOB ? m.DOB.slice(0, 10) : '',
      DOA: m.DOA ? m.DOA.slice(0, 10) : '',
      DOR: m.DOR ? m.DOR.slice(0, 10) : '',
      DOM: m.DOM ? m.DOM.slice(0, 10) : '',
      Division: m.DIV,
      'Sub Div': m.subdiv,
      Status: m.Status,
      Phone: m.Phone1,
    }))
    exportToExcel(exportData, 'Members.xlsx', 'Members')
  }

  // Search
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return members
    return members.filter((m) =>
      [m.name, m.empno, m.gno, m.hrno, m.desgn, m.Phone1, m.DIV, m.Memtype, m.Status]
        .some((v) => v && v.toString().toLowerCase().includes(q))
    )
  }, [members, search])

  // Pagination
  const { paged, page, totalPages, next, prev, goTo, reset, total } = usePagination(
    filtered,
    PAGE_SIZE
  )

  // Reset to page 1 on search change
  const handleSearch = (val) => {
    setSearch(val)
    reset()
  }

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null)

  const openCreate = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditTarget(member)
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
      ok = await update(editTarget.MemID, data)
    } else {
      ok = await create(data)
    }
    setIsSubmitting(false)
    if (ok) closeModal()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await remove(deleteTarget.MemID)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="card px-3 py-2.5 flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-700 mr-2">
          Members
          <span className="ml-2 px-2 py-0.5 rounded-full text-2xs font-medium bg-primary-100 text-primary-700">
            {total}
          </span>
        </h2>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="member-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name, emp no, division…"
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
            aria-label="Refresh members"
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
            id="add-member-btn"
            onClick={openCreate}
            className="btn-primary"
          >
            <UserPlus size={12} />
            Add Member
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-xs">
            <Spinner size={16} />
            <span>Loading members…</span>
          </div>
        ) : (
          <>
            <MemberTable
              members={paged}
              onEdit={openEdit}
              onDelete={(m) => setDeleteTarget(m)}
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
        title={editTarget ? `Edit Member — ${editTarget.name ?? ''}` : 'Add New Member'}
        size="md"
      >
        <MemberForm
          initialData={editTarget}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Member"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
