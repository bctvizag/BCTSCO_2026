import { useMemo, useState, useEffect } from 'react'
import { Search, RefreshCw, X, FileSpreadsheet } from 'lucide-react'
import { exportToExcel } from '../utils/excelExport'
import { useTransactions } from '../hooks/useTransactions'
import { usePagination } from '../hooks/usePagination'
import TransactionTable from '../components/transactions/TransactionTable'
import  acservice from '../services/acservice'
import memberService from '../services/memberService'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'
import ComboSearchBox from '../components/ui/ComboSearchBox'


const PAGE_SIZE = 20

export default function Transactions() {
  const { transactions, loading, fetchAll, fetchByAcid, filterByColumn } = useTransactions()
  const [selectedAC, setSelectedAC] = useState(null)
  const [acSearchVal, setAcSearchVal] = useState('')
  const [acSubs, setAcSubs] = useState([])
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberSearchVal, setMemberSearchVal] = useState('')
  const [batchNoSearchVal, setBatchNoSearchVal] = useState('')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ACID')

  const filtered = useMemo(() => {
    let result = transactions

    const q = search.toLowerCase().trim()
    if (!q) return result

    return result.filter((txn) =>
      [
        txn.Trans_ID,
        txn.Trans_dt,
        txn.ACID,
        txn.I_NO,
        txn.Cash_amt,
        txn.Chq_amt,
        txn.Adj_amt,
        txn.Total_amt,
        txn.PRN,
        txn.INT,
        txn.rate,
        txn.Days,
        txn.Status,
        txn.CB_side,
        txn.MEMID,
        txn.Trans_desc,
        txn.AC_Sub,
        txn.Remarks,
      ].some((value) => value && value.toString().toLowerCase().includes(q))
    )
  }, [search, transactions])

  useEffect(() => {
    const loadAcSubs = async () => {
      try {
        const res = await acservice.getAll()
        const mapped = (res.data ?? []).map((item) => {
          const mName = item.member?.name || ''
          return {
            ...item,
            memberName: mName,
            gno: item.member?.gno || '',
            displayLabel: `${item.ACID} - ${item.ACNO || ''} - ${item.AC_Sub || ''} (${mName})`.replace(/\s+-\s+$/, '')
          }
        })
        setAcSubs(mapped)
      } catch (err) {
        console.error('Failed to load AC_Sub values for form helper:', err)
      }
    }
    loadAcSubs()
  }, [])

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await memberService.getAll()
        const mappedMembers = (res.data ?? []).map((item) => ({
          ...item,
          displayLabel: `${item.MemID} - ${item.name || ''} (${item.desgn || ''})`.replace(/\s+-\s+$/, ''),
        }))
        setMembers(mappedMembers)
      } catch (err) {
        console.error('Failed to load members list for filter helper:', err)
      }
    }

    loadMembers()
  }, [])

  useEffect(() => {
    if (filterType === 'ACID') {
      if (selectedAC) {
        fetchByAcid(selectedAC.ACID)
      } else {
        fetchAll()
      }
      return
    }

    if (filterType === 'MEMID') {
      if (selectedMember) {
        filterByColumn('MEMID', selectedMember.MemID)
      } else {
        fetchAll()
      }
      return
    }

    if (filterType === 'Batch NO') {
      const batchValue = batchNoSearchVal.trim()
      if (batchValue) {
        filterByColumn('ActionID', batchValue)
      } else {
        fetchAll()
      }
      return
    }

    fetchAll()
  }, [filterType, selectedAC, selectedMember, batchNoSearchVal, fetchAll, fetchByAcid, filterByColumn])

  const handleFilterTypeChange = (value) => {
    setFilterType(value)
    setSelectedAC(null)
    setAcSearchVal('')
    setSelectedMember(null)
    setMemberSearchVal('')
    setBatchNoSearchVal('')
    setSearch('')
  }

  const handleMemberSearch = (val, results = []) => {
    setMemberSearchVal(val)

    const selectedItem = results[0]
    const isExplicitSelection = Boolean(selectedItem)

    if (!isExplicitSelection && selectedMember) {
      const currentQuery = val.trim().toLowerCase()
      const matchesCurrentLabel = selectedMember.displayLabel?.toLowerCase() === currentQuery
      const matchesCurrentId = String(selectedMember.MemID).toLowerCase() === currentQuery

      if (!matchesCurrentLabel && !matchesCurrentId) {
        setSelectedMember(null)
      }
    }

    if (!val) {
      reset()
    }
  }

  const handleBatchNoChange = (val) => {
    setBatchNoSearchVal(val)
    if (!val) {
      reset()
    }
  }

  const { paged, page, totalPages, next, prev, goTo, reset, total } = usePagination(
    filtered,
    PAGE_SIZE
  )

  const refreshTransactions = () => {
    if (filterType === 'ACID') {
      if (selectedAC) {
        fetchByAcid(selectedAC.ACID)
      } else {
        fetchAll()
      }
      return
    }

    if (filterType === 'MEMID') {
      if (selectedMember) {
        filterByColumn('MEMID', selectedMember.MemID)
      } else {
        fetchAll()
      }
      return
    }

    if (filterType === 'Batch NO') {
      const batchValue = batchNoSearchVal.trim()
      if (batchValue) {
        filterByColumn('ActionID', batchValue)
      } else {
        fetchAll()
      }
      return
    }

    fetchAll()
  }

  const handleSearch = (val) => {
    setSearch(val)
    reset()
  }

  const handleExport = () => {
    const exportData = filtered.map((txn) => ({
      'Trans ID': txn.Trans_ID,
      Date: txn.Trans_dt ? txn.Trans_dt.slice(0, 10) : '',
      'AC ID': txn.ACID,
      Invoice: txn.I_NO,
      Cash: txn.Cash_amt,
      Cheque: txn.Chq_amt,
      Adj: txn.Adj_amt,
      Total: txn.Total_amt,
      PRN: txn.PRN,
      INT: txn.INT,
      'Total Bal': Number(txn.PRN_B ?? 0) + Number(txn.INT_B ?? 0),
      Rate: txn.rate,
      Days: txn.Days,
      Status: txn.Status,
      'CB Side': txn.CB_side,
      'Member ID': txn.MEMID,
      Description: txn.Trans_desc,
      'AC Sub': txn.AC_Sub,
      Remarks: txn.Remarks,
    }))

    exportToExcel(exportData, 'Transactions.xlsx', 'Transactions')
  }

  const handleAccountSearch = (val, results = []) => {
    setAcSearchVal(val)

    const selectedItem = results[0]
    const isExplicitSelection = Boolean(selectedItem)

    if (!isExplicitSelection && selectedAC) {
      const currentQuery = val.trim().toLowerCase()
      const matchesCurrentLabel = selectedAC.displayLabel?.toLowerCase() === currentQuery
      const matchesCurrentId = String(selectedAC.ACID).toLowerCase() === currentQuery

      if (!matchesCurrentLabel && !matchesCurrentId) {
        setSelectedAC(null)
      }
    }

    if (!val) {
      reset()
    }
  }

  return (
    <div className="space-y-3">
      <div className="card px-3 py-2.5 flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-700 mr-2">
          Transactions
          <span className="ml-2 px-2 py-0.5 rounded-full text-2xs font-medium bg-primary-100 text-primary-700">
            {total}
          </span>
        </h2>



        <div className="w-px h-5 bg-slate-300" />

        <div className="relative">
          <select
            aria-label="Filter by"
            className="input text-xs"
            value={filterType}
            onChange={(e) => handleFilterTypeChange(e.target.value)}
          >
            <option value="">Filter by</option>
            <option value="ACID">ACID</option>
            <option value="MEMID">MEMID</option>
            <option value="Batch NO">Batch NO</option>
          </select>
        </div>

      <div className="relative flex-1 min-w-[280px] max-w-md">
        {filterType === 'ACID' ? (
          <ComboSearchBox
            items={acSubs}
            value={selectedAC ? selectedAC.displayLabel : acSearchVal}
            onSearch={handleAccountSearch}
            onSelect={(item) => {
              setSelectedAC(item)
              reset()
            }}
            placeholder="Search accounts"
            searchFields={['ACID', 'ACNO', 'AC_Sub', 'memberName', 'gno']}
            displayFields={['ACID', 'ACNO', 'AC_Sub', 'memberName', 'gno']}
            fieldLabels={{ ACID: 'AC ID', ACNO: 'Account No', AC_Sub: 'AC_Sub', memberName: 'Member Name', gno: 'GNO' }}
            valueField="ACID"
            highlightField="ACNO"
            className="w-full"
          />
        ) : filterType === 'MEMID' ? (
          <ComboSearchBox
            items={members}
            value={selectedMember ? selectedMember.displayLabel : memberSearchVal}
            onSearch={handleMemberSearch}
            onSelect={(item) => {
              setSelectedMember(item)
              reset()
            }}
            placeholder="Search ID, name, rank..."
            searchFields={['MemID', 'name', 'desgn']}
            displayFields={['MemID', 'name', 'desgn']}
            fieldLabels={{ MemID: 'ID', name: 'Name', desgn: 'Rank' }}
            valueField="MemID"
            highlightField="name"
            className="w-full"
          />
        ) : filterType === 'Batch NO' ? (
          <input
            id="batch-no-search"
            type="text"
            inputMode="numeric"
            value={batchNoSearchVal}
            onChange={(e) => handleBatchNoChange(e.target.value)}
            placeholder="Enter Batch No / ActionID"
            className="input w-full"
          />
        ) : (
          <input
            type="text"
            disabled
            value=""
            placeholder="Select a filter type"
            className="input w-full bg-slate-100 cursor-not-allowed"
          />
        )}
      </div>

        <div className="w-px h-5 bg-slate-300" >
          <select>
            
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="transaction-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search transaction, status..."
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
            onClick={refreshTransactions}
            disabled={loading}
            className="btn-secondary gap-1.5"
            aria-label="Refresh transactions"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="btn-success gap-1.5"
            aria-label="Export transactions to Excel"
          >
            <FileSpreadsheet size={12} />
            Export
          </button>
        </div>

      </div>       
    
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-xs">
            <Spinner size={16} />
            <span>Loading transactions…</span>
          </div>
        ) : (
          <>
            <TransactionTable transactions={paged} />
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

{/* PRE DIV */}
       <div>         
        <pre>
           {/* {JSON.stringify(acSubs, null, 2)} */}          
        </pre>
       </div>
    </div>
  )
}
