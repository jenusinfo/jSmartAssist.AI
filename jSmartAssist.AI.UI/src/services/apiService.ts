// src/services/apiService.ts
import axios, { AxiosInstance } from 'axios';

// Change this line:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7239/api';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor to handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userRole');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(credentials: { username: string; password: string }) {
        const response = await this.client.post('/auth/login', credentials);
        return response.data;
    }

    async refreshToken(refreshToken: string) {
        const response = await this.client.post('/auth/refresh', { refreshToken });
        return response.data;
    }

    // Category endpoints
    async getCategories() {
        const response = await this.client.get('/category');
        return response.data;
    }

    async getCategory(id: number) {
        const response = await this.client.get(`/category/${id}`);
        return response.data;
    }

    async createCategory(category: any) {
        const response = await this.client.post('/category', category);
        return response.data;
    }

    async updateCategory(id: number, category: any) {
        const response = await this.client.put(`/category/${id}`, category);
        return response.data;
    }

    async deleteCategory(id: number) {
        const response = await this.client.delete(`/category/${id}`);
        return response.data;
    }

    async seedCategories() {
        const response = await this.client.post('/category/seed-defaults');
        return response.data;
    }

    // Document endpoints
    async getDocuments() {
        const response = await this.client.get('/document');
        return response.data;
    }

    async getDocument(id: number) {
        const response = await this.client.get(`/document/${id}`);
        return response.data;
    }

    async uploadDocument(formData: FormData) {
        const response = await this.client.post('/document/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async deleteDocument(id: number) {
        const response = await this.client.delete(`/document/${id}`);
        return response.data;
    }

    async reprocessDocument(id: number) {
        const response = await this.client.post(`/document/${id}/reprocess`);
        return response.data;
    }

    async getDocumentStats() {
        const response = await this.client.get('/document/stats');
        return response.data;
    }

    // Chat endpoints
    async sendChatMessage(message: {
        sessionId: string;
        message: string;
        category?: string;
        userId?: string;
        userName?: string;
    }) {
        const response = await this.client.post('/chat/message', message);
        return response.data;
    }

    async getChatHistory(sessionId: string) {
        const response = await this.client.get(`/chat/session/${sessionId}/history`);
        return response.data;
    }
}

const apiService = new ApiService();
export default apiService;