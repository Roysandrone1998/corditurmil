import axios from 'axios';

export const api = axios.create({
  // Usamos la ruta relativa para Vercel y el proxy de Vite
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  credentials: true // 👈 NECESARIO para que Vercel use la Cookie en producción
});

// 🔑 RESTAURAMOS EL INTERCEPTOR:
// Esto es CRÍTICO para el entorno LOCAL, ya que es la única forma de enviar el token.
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;