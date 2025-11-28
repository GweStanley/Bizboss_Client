// client/services/api.js
import axios from 'axios';

function normalizeBase(url = '') {
  if (!url) return 'http://localhost:5000/api';
  // remove trailing slash if present
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const BASE = normalizeBase(process.env.NEXT_PUBLIC_API_BASE);

const api = axios.create({
  baseURL: BASE, // e.g. http://localhost:5000/api
  timeout: 15000,
});

// helper to build endpoint paths reliably (avoids accidental double slashes)
export const buildUrl = (path) => {
  if (!path) return BASE;
  if (path.startsWith('/')) path = path.slice(1);
  return `${BASE}/${path}`;
};

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

export default api;
