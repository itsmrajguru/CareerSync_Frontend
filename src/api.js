import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/*
  This file only creates and configures the shared axios instance.
  All API functions live in their dedicated service files:

    services/authService.js          → login, signup, OTP, password reset
    services/studentProfileService.js → student profile + resume upload
    services/companyProfileService.js → company profile CRUD
    services/jobsService.js           → internal platform jobs (create, mine, update, delete)
    services/externalJobsService.js   → Adzuna external job search
    services/applicationService.js   → apply, get applications, update status
*/

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

// Request Interceptor: auto-inject access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor: handle 401 and auto-refresh access token if expired
api.interceptors.response.use(
  // Success: unwrap the response data so callers receive the payload directly
  (response) => {
    return response.data
  },

  // Error: attempt a silent token refresh on 401, then retry original request
  async (error) => {
    /*
      originalRequest is the failed call (e.g. GET /jobs).
      We store it so that after getting a new token we can replay it
      seamlessly — the user never sees the failure.
    */
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        console.log('Token expired — attempting silent refresh...');
        const res = await api.post('/auth/token/refresh', {})
        const { newAccessToken } = res;
        localStorage.setItem('token', newAccessToken)
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (e) {
        console.log('Refresh token failed — redirecting to login');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    // Log all other API errors for debugging
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    }
    return Promise.reject(error);
  }
)

export default api;
