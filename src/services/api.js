import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para lidar com erros de token expirado ou inválido
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
});

export default api;