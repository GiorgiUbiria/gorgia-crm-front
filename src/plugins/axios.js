import axios from "axios";

axios.defaults.withCredentials = true

// const baseURL = "http://127.0.0.1:8000"

// const baseURL = process.env.NODE_ENV === 'production'
//   ? process.env.REACT_APP_PROD_BASE_URL
//   : process.env.REACT_APP_DEV_BASE_URL;

const baseURL = process.env.REACT_APP_BASE_URL;

// const baseURL = "back.gorgia.ge";

const defaultInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

defaultInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default defaultInstance