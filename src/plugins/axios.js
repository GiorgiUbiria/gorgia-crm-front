import axios from "axios"

axios.defaults.withCredentials = true

const baseURL = process.env.REACT_APP_API_URL

const defaultInstance = axios.create({
  baseURL,
  timeout: 200000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  credentials: "include"
})

defaultInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    // Ensure CORS credentials are properly set
    config.withCredentials = true
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

defaultInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        ...error,
        message: 'მოთხოვნის დრო ამოიწურა. გთხოვთ სცადოთ თავიდან.'
      })
    }
    // Handle CORS and cookie errors
    if (error.response?.status === 419) {
      // CSRF token mismatch
      window.location.reload()
      return Promise.reject({
        ...error,
        message: 'სესია ვადაგასულია. გვერდი განახლდება.'
      })
    }
    return Promise.reject(error)
  }
)

export default defaultInstance
