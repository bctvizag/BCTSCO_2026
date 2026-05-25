import { useState, useEffect, useCallback } from 'react'
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

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { transactions, loading, error, fetchAll }
}
