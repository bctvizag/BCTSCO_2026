import { useState, useEffect, useCallback } from 'react'
import memberService from '../services/memberService'
import toast from 'react-hot-toast'

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await memberService.getAll()
      setMembers(res.data ?? [])
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load members: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const create = async (data) => {
    try {
      await memberService.create(data)
      toast.success('Member created successfully')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Create failed: ${err.message}`)
      return false
    }
  }

  const update = async (id, data) => {
    try {
      await memberService.update(id, data)
      toast.success('Member updated successfully')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Update failed: ${err.message}`)
      return false
    }
  }

  const remove = async (id) => {
    try {
      await memberService.remove(id)
      toast.success('Member deleted')
      await fetchAll()
      return true
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
      return false
    }
  }

  return { members, loading, error, fetchAll, create, update, remove }
}
