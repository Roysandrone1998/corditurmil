import axios from 'axios';

// 1. DEFINICIÓN DE LA API
export const api = axios.create({
  // Usamos la ruta relativa para Vercel y el proxy de Vite
  baseURL: import.meta.env.VITE_API_URL || '/api', 
 
  withCredentials: true, 

});


if (import.meta.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((config) => {
     const t = localStorage.getItem('token');
     if (t) config.headers.Authorization = `Bearer ${t}`;
     return config;
  });
}


export default api;