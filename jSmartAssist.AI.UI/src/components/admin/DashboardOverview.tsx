import React from 'react';
import { FileText, FileCheck, Clock, Building } from 'lucide-react';
import { DocumentStats, Document } from '../../types';

interface DashboardOverviewProps {
    stats: DocumentStats;
    documents: Document[];
    onRefresh: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, documents, onRefresh }) => {
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-green-100">
                            <FileCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Processed</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.processedDocuments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-yellow-100">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Processing</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.pendingDocuments + stats.processingDocuments}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-purple-100">
                            <Building className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Chunks</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalChunks}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {documents.slice(0, 5).map((doc) => (
                        <div key={doc.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                                        <p className="text-sm text-gray-500">{doc.categoryName || 'Uncategorized'}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.processingStatus === 'Processed'
                                        ? 'bg-green-100 text-green-800'
                                        : doc.processingStatus === 'Failed'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {doc.processingStatus}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DashboardOverview;

