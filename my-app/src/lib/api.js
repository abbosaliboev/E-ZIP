// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // CRA dev server bu yo‘lni setupProxy orqali backendga forward qiladi
  timeout: 20000,
});

export default api;