import api from './apiClient'

const ENDPOINT = '/transDesc'

const transDescService = {
    /** Fetch all transaction descriptions */
    getAll: () => api.get(`${ENDPOINT}`),
    /** Fetch transaction description by ID */
    getById: (id) => api.get(`${ENDPOINT}/${id}`),
    /** Fetch distinct AC_Sub values for dropdown */
    getAcSubs: () => api.get(`${ENDPOINT}/ac-sub`),
}
export default transDescService