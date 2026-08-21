// ============================================================
// context/api.js - Centralized API helper using axios
// ============================================================

import axios from 'axios';

// Base URL — React dev server proxies /api to localhost:5000
const API = axios.create({ baseURL: '/api' });

// Automatically attach the JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
