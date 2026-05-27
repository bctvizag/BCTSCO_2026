import api from './apiClient'

const ENDPOINT = '/transactions'

const transactionService = {
  /** Fetch all transaction records */
  getAll: () => api.get(`${ENDPOINT}?orderBy=Trans_ID&order=DESC`),

  /** Fetch one transaction record by Trans_ID */
  getById: (id) => api.get(`${ENDPOINT}/Trans_ID/${id}`),

  /** Fetch transaction records by ACID */
  getByAcid: (acid) => api.get(`${ENDPOINT}/ACID/${acid}`),

  /** Filter transaction records by column and value */
  filterByColumn: (column, value) => api.post(`${ENDPOINT}/filter`, { column, value }),
}

export default transactionService
