import { useState, useCallback } from 'react'
import transactionService from '../services/transactionService'
import toast from 'react-hot-toast'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await transactionService.getAll()
      setTransactions(res.data ?? [])
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load transactions: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchByAcid = useCallback(async (acid) => {
    setLoading(true)
    setError(null)
    try {
      const res = await transactionService.getByAcid(acid)
      setTransactions(res.data ?? [])
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load transactions for ACID ${acid}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return { transactions, loading, error, fetchAll, fetchByAcid }
}
