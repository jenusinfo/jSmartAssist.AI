// src/types/index.ts

export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    displayOrder?: number;
    isActive: boolean;
    documentCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Document {
    id: number;
    fileName: string;
    title: string;
    description?: string;
    categoryId?: number;
    categoryName?: string;
    contentType: string;
    filePath?: string;
    fileSize?: number;
    uploadedAt: string;
    uploadedBy?: string;
    processedAt?: string;
    processingStatus: 'Pending' | 'Processing' | 'Processed' | 'Failed';
    processingError?: string;
    chunkCount?: number;
}

export interface DocumentStats {
    totalDocuments: number;
    processedDocuments: number;
    pendingDocuments: number;
    processingDocuments: number;
    failedDocuments: number;
    totalChunks: number;
    averageChunksPerDocument: number;
}

// Fixed ChatMessage type to match component usage
export interface ChatMessage {
    id: number | string;
    type: 'user' | 'assistant';
    text: string;
    references?: DocumentReference[];
}

// Alternative ChatMessage for API (if needed)
export interface ChatHistoryMessage {
    id: number;
    sessionId?: string;
    userId?: string;
    userName?: string;
    message: string;
    isUserMessage: boolean;
    createdAt: string;
    references?: DocumentReference[];
}

export interface DocumentReference {
    id: number;
    title: string;
    fileName: string;
    category?: string;
}

export interface ChatResponse {
    response: string;
    references?: string[];
    referencedDocuments?: DocumentReference[];
    tokensUsed?: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId?: string;
    userName?: string;
    role?: string;
}

export interface User {
    id: string;
    username: string;
    email?: string;
    role: 'admin' | 'user';
    isActive: boolean;
}