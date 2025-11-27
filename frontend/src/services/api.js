import axios from 'axios';

// Configuración base del API
// En desarrollo local: apunta directamente al backend (http://localhost:3001)
// En Docker/producción: usa rutas relativas para que nginx haga el proxy
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment
    ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001')
    : import.meta.env.VITE_BACKEND_URL; // <--- usa la URL completa en producción

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para loging (útil en desarrollo)
api.interceptors.request.use(
    (config) => {
        console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

/**
 * Verifica el estado del backend
 * @returns {Promise<Object>} Datos del health check
 */
export const checkHealth = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export default api;