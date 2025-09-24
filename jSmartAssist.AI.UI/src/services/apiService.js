import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post('/auth/login', data);
export const sendMessage = (data) => api.post('/chat/message', data);
export const getChatHistory = (sessionId) => api.get(`/chat/history/${sessionId}`);
export const uploadDocument = (formData) => api.post('/documents/upload', formData);
export const getDocuments = () => api.get('/documents');
export const getCategories = () => api.get('/documents/categories');

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default api;