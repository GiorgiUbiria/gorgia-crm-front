import axios from "axios"

axios.defaults.withCredentials = true

const baseURL = process.env.REACT_APP_BASE_URL

const defaultInstance = axios.create({
  baseURL,
  timeout: 200000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

defaultInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default defaultInstance
