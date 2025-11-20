import axios from 'axios';

// 1. DEFINICIÓN DE LA API
export const api = axios.create({
  // Usamos la ruta relativa para Vercel y el proxy de Vite
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  // 🔑 CRÍTICO: 'include' para enviar y recibir cookies.
  // En Vercel (mismo dominio virtual) 'same-origin' podría bastar, pero 'include' es más seguro en desarrollo cross-domain.
  withCredentials: true, 
  // Nota: 'credentials' es la opción de 'fetch'. En Axios usamos 'withCredentials'.
});

// 2. INTERCEPTOR CONDICIONAL
// Se aplica solo en desarrollo, donde el token se guarda en localStorage 
// para simular la sesión cuando la cookie no puede establecerse fácilmente
// (ej. si el frontend y backend corren en dominios/puertos diferentes sin HTTPS).
if (import.meta.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((config) => {
    const t = localStorage.getItem('token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });
}


export default api;