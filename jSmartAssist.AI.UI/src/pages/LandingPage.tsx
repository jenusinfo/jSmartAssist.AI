// src/pages / LandingPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    MessageSquare, Book, Wrench, FileText, Info, Phone,
    Shield, GraduationCap, Settings, ChevronRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Procedures', icon: Book, description: 'Company procedures and workflows', color: 'blue' },
        { name: 'Operations', icon: Wrench, description: 'Operational guidelines', color: 'green' },
        { name: 'User Manuals', icon: FileText, description: 'Product user guides', color: 'purple' },
        { name: 'Products', icon: Info, description: 'Product specifications', color: 'orange' },
        { name: 'Contacts', icon: Phone, description: 'Contact directories', color: 'red' },
        { name: 'Policies', icon: Shield, description: 'Company policies', color: 'indigo' },
        { name: 'Training', icon: GraduationCap, description: 'Training materials', color: 'yellow' },
        { name: 'Technical', icon: Settings, description: 'Technical documentation', color: 'gray' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-8 w-8 text-teal-600" />
                            <span className="text-xl font-bold text-gray-900">jSmartAssist.AI</span>
                        </div>
                        <Link
                            to="/login"
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        AI-Powered Company Assistant
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Get instant answers about company procedures, policies, products, and more.
                        Our AI assistant has access to all your company's knowledge base.
                    </p>
                    <Link
                        to="/login"
                        className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center"
                    >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Start Chatting
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>

                {/* Knowledge Categories */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Knowledge Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate('/login')}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer hover:-translate-y-1"
                                >
                                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                        <Icon className={`h-6 w-6 text-${category.color}-600`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                                    <p className="text-sm text-gray-600">{category.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Ask Anything</h3>
                            <p className="text-gray-600">
                                Type your question in natural language
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                            <p className="text-gray-600">
                                AI searches through all company documents
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Info className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Answers</h3>
                            <p className="text-gray-600">
                                Receive accurate, contextual answers
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Start chatting with our AI assistant and get instant access to your company's knowledge base.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Start Chatting Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;