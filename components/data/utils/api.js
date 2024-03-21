// utils/api.js

import axios from 'axios';

// Create an axios instance
const api = axios.create();

// Add a request interceptor
api.interceptors.request.use((config) => {
  // Get the token from local storage
  const token = localStorage.getItem('token');

  // If the token is present, set it in the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;