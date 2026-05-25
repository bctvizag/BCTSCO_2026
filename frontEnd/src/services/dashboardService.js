import api from './apiClient'

const dashboardService = {
  /** Fetch member count */
  getMemberCount: async () => {
    const res = await api.get('/members')
    return res?.count ?? res?.data?.length ?? 0
  },
  /** Fetch AC count */
  getAcCount: async () => {
    const res = await api.get('/ac')
    return res?.count ?? res?.data?.length ?? 0
  },
  /** Fetch transaction count */
  getTransactionCount: async () => {
    const res = await api.get('/transactions')
    return res?.count ?? res?.data?.length ?? 0
  },
  /** Fetch action count */
  getActionCount: async () => {
    const res = await api.get('/actions')
    return res?.count ?? res?.data?.length ?? 0
  },
}

export default dashboardService
