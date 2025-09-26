import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, MessageSquare, LogOut, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';
import { Document, Category, DocumentStats } from '../../types';
import DashboardOverview from '../../components/admin/DashboardOverview';
import DocumentManagement from '../../components/admin/DocumentManagement';
import CategoryManagement from '../../components/admin/CategoryManagement';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState<'overview' | 'documents' | 'categories'>('overview');
    const [stats, setStats] = useState<DocumentStats | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, docsData, catsData] = await Promise.all([
                apiService.getDocumentStats(),
                apiService.getDocuments(),
                apiService.getCategories()
            ]);

            setStats(statsData);
            setDocuments(docsData);
            setCategories(catsData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/chat"
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back to Chat
                            </Link>
                            <div className="text-gray-300">|</div>
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-8 w-8 text-teal-600" />
                                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="text-red-600 hover:text-red-700 flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                        >
                            <LogOut className="h-4 w-4 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setCurrentSection('overview')}
                            className={`px-4 py-2 rounded-md ${currentSection === 'overview'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setCurrentSection('documents')}
                            className={`px-4 py-2 rounded-md ${currentSection === 'documents'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Documents
                        </button>
                        <button
                            onClick={() => setCurrentSection('categories')}
                            className={`px-4 py-2 rounded-md ${currentSection === 'categories'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Categories
                        </button>
                    </nav>
                </div>

                {currentSection === 'overview' && stats && (
                    <DashboardOverview stats={stats} documents={documents} onRefresh={loadData} />
                )}
                {currentSection === 'documents' && (
                    <DocumentManagement documents={documents} categories={categories} onRefresh={loadData} />
                )}
                {currentSection === 'categories' && (
                    <CategoryManagement categories={categories} onRefresh={loadData} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;