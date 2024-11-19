import axios from "axios";

axios.defaults.withCredentials = true
// axios.defaults.withXSRFToken = true

const defaultInstance = axios.create({
  baseURL: 'https://back.gorgia.ge',
  // baseURL: 'http://127.0.0.1:8000',
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

// defaultInstance.interceptors.request.use((config) => {
//     const token = decodeURIComponent(document.cookie.replace('XSRF-TOKEN=', ''));
//     defaultInstance.defaults.headers['X-XSRF-TOKEN'] = token;

//     return config;
// });

export default defaultInstance
