import axios from 'axios';

const API = axios.create({
    baseURL: "/api/v1/",
    withCredentials: true
});

// Request interceptor – attach Bearer token if present
API.interceptors.request.use(
    (config) => {
        const userData = localStorage.getItem("jobbuddy_user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (_) {
                // ignore parse errors
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – handle 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("jobbuddy_user");
        }
        return Promise.reject(error);
    }
);

export default API;
