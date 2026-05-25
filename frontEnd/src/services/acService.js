import api from './apiClient'

const ENDPOINT = '/ac'

const acService = {
  /** Fetch all AC records */
  getAll: () => api.get(ENDPOINT),

  /** Fetch AC record by ACID */
  getById: (id) => api.get(`${ENDPOINT}/${id}`),

  /** Create a new AC record */
  create: (data) => api.post(ENDPOINT, data),

  /** Update AC record by ACID */
  update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),

  /** Delete AC record by ACID */
  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
}

export default acService
