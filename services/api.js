// client/services/api.js
import axios from "axios";

// --- BASE URL (no trailing slash, no /api required in env) ---
let BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!BASE) {
  console.error("❌ NEXT_PUBLIC_API_BASE missing in .env.local");
  console.error("Example: NEXT_PUBLIC_API_BASE=https://bizzboss-server.onrender.com");
  BASE = "http://localhost:5000"; // safe fallback for dev
}

// Remove trailing slash if user adds it
BASE = BASE.replace(/\/$/, "");

// Final API base: always append /api
const API_BASE = `${BASE}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

// Helper: build URLs like buildUrl("/businesses")
export const buildUrl = (path = "") => {
  if (path.startsWith("/")) path = path.slice(1);
  return `${API_BASE}/${path}`;
};

// Attach auth token when logged in
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;
