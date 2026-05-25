import api from './apiClient'

const ENDPOINT = '/transactions'

const transactionService = {
  /** Fetch all transaction records */
  getAll: () => api.get(`${ENDPOINT}?orderBy=Trans_ID&order=DESC`),

  /** Fetch one transaction record by Trans_ID */
  getById: (id) => api.get(`${ENDPOINT}/${id}`),
}

export default transactionService
