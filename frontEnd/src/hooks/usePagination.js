import { useState, useMemo } from 'react'

/**
 * usePagination - handles page state and slicing of data
 * @param {Array} data - full dataset
 * @param {number} pageSize - rows per page
 */
export function usePagination(data, pageSize = 20) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))
  const next = () => goTo(page + 1)
  const prev = () => goTo(page - 1)
  const reset = () => setPage(1)

  return { paged, page, totalPages, goTo, next, prev, reset, total: data.length }
}
