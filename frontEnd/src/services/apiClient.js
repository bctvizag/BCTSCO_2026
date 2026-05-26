import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3030/api',  
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Response interceptor for uniform error shapes
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export default api
