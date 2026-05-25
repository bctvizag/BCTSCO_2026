import api from './apiClient'

const ENDPOINT = '/members'

const memberService = {
  /** Fetch all members */
  getAll: () => api.get(ENDPOINT),

  /** Fetch member by MemID */
  getById: (id) => api.get(`${ENDPOINT}/${id}`),

  /** Create a new member */
  create: (data) => api.post(ENDPOINT, data),

  /** Update member by MemID */
  update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),

  /** Delete member by MemID */
  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
}

export default memberService
