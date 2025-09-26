// src/components/admin/DocumentManagement.tsx
// THIS IS THE CORRECT VERSION TO USE

import React, { useState } from 'react';
import { Upload, Trash2, Clock, Search, Filter, FileText } from 'lucide-react';
import apiService from '../../services/apiService';
import { Document, Category } from '../../types';
import DocumentUploadModal from './DocumentUploadModal';

interface DocumentManagementProps {
    documents: Document[];
    categories: Category[];
    onRefresh: () => void;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({
    documents,
    categories,
    onRefresh
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filter, setFilter] = useState({ category: '', status: '', search: '' });
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        setLoading(true);
        try {
            await apiService.deleteDocument(id);
            onRefresh();
            alert('Document deleted successfully!');
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
        setLoading(false);
    };

    const handleReprocess = async (id: number) => {
        setLoading(true);
        try {
            await apiService.reprocessDocument(id);
            onRefresh();
            alert('Document reprocessing started!');
        } catch (error) {
            console.error('Error reprocessing document:', error);
            alert('Failed to reprocess document');
        }
        setLoading(false);
    };

    const handleUpload = async (formData: FormData) => {
        try {
            await apiService.uploadDocument(formData);
            onRefresh();
            setShowUploadModal(false);
            alert('Document uploaded successfully!');
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        }
    };

    // Filter documents
    const filteredDocuments = documents.filter(doc => {
        if (filter.category && doc.categoryName !== filter.category) return false;
        if (filter.status && doc.processingStatus !== filter.status) return false;
        if (filter.search && !doc.title.toLowerCase().includes(filter.search.toLowerCase()) &&
            !doc.fileName.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={filter.category}
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="Processed">Processed</option>
                            <option value="Processing">Processing</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>

                        <div className="flex items-center text-sm text-gray-500">
                            <Filter className="h-4 w-4 mr-2" />
                            {filteredDocuments.length} of {documents.length} documents
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Size
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Uploaded
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                                <div className="text-sm text-gray-500">{doc.fileName}</div>
                                                {doc.description && (
                                                    <div className="text-sm text-gray-500 mt-1">{doc.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {doc.categoryName || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatFileSize(doc.fileSize)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.processingStatus === 'Processed'
                                                ? 'bg-green-100 text-green-800'
                                                : doc.processingStatus === 'Failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.processingStatus}
                                            {doc.chunkCount && doc.chunkCount > 0 && ` (${doc.chunkCount} chunks)`}
                                        </span>
                                        {doc.processingError && (
                                            <div className="text-xs text-red-600 mt-1">{doc.processingError}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                        {doc.uploadedBy && (
                                            <div className="text-xs text-gray-400">{doc.uploadedBy}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            {doc.processingStatus === 'Failed' && (
                                                <button
                                                    onClick={() => handleReprocess(doc.id)}
                                                    className="text-blue-600 hover:text-blue-500"
                                                    title="Reprocess document"
                                                    disabled={loading}
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="text-red-600 hover:text-red-500"
                                                title="Delete document"
                                                disabled={loading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredDocuments.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your filters'}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <DocumentUploadModal
                    categories={categories}
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUpload}
                />
            )}
        </>
    );
};

export default DocumentManagement;