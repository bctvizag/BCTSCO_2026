import { useState, useEffect, useCallback } from 'react'
import acService from '../services/acService'
import toast from 'react-hot-toast'

export function useACAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await acService.getAll()
      setAccounts(res.data ?? [])
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load AC accounts: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const create = async (data) => {
    try {
      await acService.create(data)
      toast.success('AC account created successfully')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Create failed: ${err.message}`)
      return false
    }
  }

  const update = async (id, data) => {
    try {
      await acService.update(id, data)
      toast.success('AC account updated successfully')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Update failed: ${err.message}`)
      return false
    }
  }

  const remove = async (id) => {
    try {
      await acService.remove(id)
      toast.success('AC account deleted')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
      return false
    }
  }

  return { accounts, loading, error, fetchAll, create, update, remove }
}
