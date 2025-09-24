import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5246/api", 
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach token automatically
api.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
