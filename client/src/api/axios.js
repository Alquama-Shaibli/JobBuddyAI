import axios from 'axios';

const API = axios.create({
    baseURL: "/api/v1/",
    withCredentials: true
});
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default API;
