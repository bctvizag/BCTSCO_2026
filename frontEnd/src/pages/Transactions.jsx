import { useMemo, useState, useEffect } from 'react'
import { Search, RefreshCw, X, FileSpreadsheet } from 'lucide-react'
import { exportToExcel } from '../utils/excelExport'
import { useTransactions } from '../hooks/useTransactions'
import { usePagination } from '../hooks/usePagination'
import TransactionTable from '../components/transactions/TransactionTable'
import  acservice from '../services/acservice'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'
import ComboSearchBox from '../components/ui/ComboSearchBox'


const PAGE_SIZE = 20

export default function Transactions() {
  const { transactions, loading, fetchAll } = useTransactions()
  const [selectedAC, setSelectedAC] = useState(null)
  const [acSearchVal, setAcSearchVal] = useState('')
  const [acSubs, setAcSubs] = useState([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = transactions

    if (selectedAC) {
      result = result.filter(
        (txn) => Number(txn.ACID) === Number(selectedAC.ACID)
      )
    }

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
  }, [search, transactions, selectedAC])

  useEffect(() => {
    const loadAcSubs = async () => {
      try {
        const res = await acservice.getAll()
        const mapped = (res.data ?? []).map((item) => {
          const mName = item.member?.name || ''
          return {
            ...item,
            memberName: mName,
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


  const { paged, page, totalPages, next, prev, goTo, reset, total } = usePagination(
    filtered,
    PAGE_SIZE
  )

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
            placeholder="Search transaction, invoice, status..."
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

      <div className="relative flex-1 min-w-[280px] max-w-md">
        <ComboSearchBox  
          items={acSubs}
          value={selectedAC ? selectedAC.displayLabel : acSearchVal}
          
          onSearch={handleAccountSearch}
          
          onSelect={(item) => {
            setSelectedAC(item)
            reset()
          }}
          placeholder="Search accounts"
          searchFields={['ACID', 'ACNO', 'AC_Sub', 'memberName']}
          displayFields={['ACID', 'ACNO', 'AC_Sub', 'memberName']}
          fieldLabels={{ ACID: 'AC ID', ACNO: 'Account No', AC_Sub: 'AC_Sub', memberName: 'Member Name' }}
          valueField="ACID"
          highlightField="ACNO"
          className="w-full"
          
        />
      </div>
           


        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchAll}
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


       <div>
        selected 
        <pre>
           {/* {JSON.stringify(acSubs, null, 2)} */}
          selectedAC :
           {JSON.stringify(selectedAC, null, 2)}

          acSearchVal : 
           {JSON.stringify(acSearchVal, null, 2)}
           {/* {JSON.stringify(selectedAC.member.name, null, 2)} */}
        </pre>
       </div>
    </div>
  )
}
