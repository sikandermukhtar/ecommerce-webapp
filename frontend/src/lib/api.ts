// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',// ✅ Your FastAPI server
  withCredentials: true,            // ✅ If you're using cookies
});

export default api;
