import React, { useState, useEffect, useRef } from 'react';
import {
    Eye, EyeOff, Lock, Mail, Shield, FileText,
    MessageSquare, Settings, Upload, Search, LogOut, User, Menu, X,
    Book, Users, Phone, GraduationCap, Wrench, Info, Send,
    Home, FolderOpen, Clock, AlertCircle, ChevronRight, Plus, Trash2,
    FileCheck, Building, HelpCircle, ChevronLeft, Filter, Download
} from 'lucide-react';

// Main App Component
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [currentView, setCurrentView] = useState('landing');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Check for existing auth token
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            const savedRole = localStorage.getItem('userRole');
            setUserRole(savedRole || 'user');
        }
    }, []);

    const handleLogin = (credentials) => {
        // Simulate authentication
        const { email, password } = credentials;

        // Simple role detection based on email
        const role = (email === 'admin' || email.includes('admin')) ? 'admin' : 'user';

        // Store auth info
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('userRole', role);

        setIsAuthenticated(true);
        setUserRole(role);
        setShowLoginModal(false);
        setCurrentView('chat');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
        setCurrentView('landing');
    };

    const handleCategoryClick = (category) => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        } else {
            setCurrentView('chat');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                currentView={currentView}
                onNavigate={setCurrentView}
                onLoginClick={() => setShowLoginModal(true)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main>
                {currentView === 'landing' && (
                    <LandingPage
                        onLoginClick={() => setShowLoginModal(true)}
                        onCategoryClick={handleCategoryClick}
                    />
                )}

                {currentView === 'chat' && isAuthenticated && <ChatPage />}

                {currentView === 'admin' && isAuthenticated && userRole === 'admin' && (
                    <AdminPage onNavigateToDocuments={() => setCurrentView('documents')} />
                )}

                {currentView === 'documents' && isAuthenticated && userRole === 'admin' && (
                    <DocumentManagementPage onBack={() => setCurrentView('admin')} />
                )}
            </main>

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={handleLogin}
                />
            )}
        </div>
    );
};

// Header Component
const Header = ({ isAuthenticated, userRole, currentView, onNavigate, onLoginClick, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => onNavigate('landing')}
                    >
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">AI Assistant</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => onNavigate('landing')}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'landing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </button>

                        {isAuthenticated && (
                            <button
                                onClick={() => onNavigate('chat')}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'chat'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat</span>
                            </button>
                        )}

                        {isAuthenticated && userRole === 'admin' && (
                            <button
                                onClick={() => onNavigate('admin')}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'admin' || currentView === 'documents'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Settings className="h-4 w-4" />
                                <span>Admin</span>
                            </button>
                        )}

                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">{userRole === 'admin' ? 'Admin' : 'User'}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Login
                            </button>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t py-2">
                        <div className="space-y-1">
                            <button
                                onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                                className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'landing' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
                                    }`}
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </button>

                            {isAuthenticated && (
                                <>
                                    <button
                                        onClick={() => { onNavigate('chat'); setMobileMenuOpen(false); }}
                                        className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'chat' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
                                            }`}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Chat</span>
                                    </button>

                                    {userRole === 'admin' && (
                                        <button
                                            onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                                            className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
                                                }`}
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Admin</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}

                            {!isAuthenticated && (
                                <button
                                    onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

// Landing Page Component
const LandingPage = ({ onLoginClick, onCategoryClick }) => {
    const categories = [
        { name: 'Procedures', icon: Settings, color: 'blue', description: 'Company procedures and workflows' },
        { name: 'Operations', icon: Wrench, color: 'green', description: 'Operational guidelines and manuals' },
        { name: 'User Manuals', icon: Book, color: 'purple', description: 'Product user manuals and guides' },
        { name: 'Product Information', icon: Info, color: 'orange', description: 'Product specifications and details' },
        { name: 'Contact Information', icon: Phone, color: 'red', description: 'Contact details and directories' },
        { name: 'Policies', icon: Shield, color: 'indigo', description: 'Company policies and regulations' },
        { name: 'Training Materials', icon: GraduationCap, color: 'yellow', description: 'Training guides and resources' },
        { name: 'Technical Documentation', icon: FileText, color: 'gray', description: 'Technical specifications and docs' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                    AI-Powered Company Assistant
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Get instant answers about company procedures, policies, products, and more.
                    Our AI assistant has access to all your company's knowledge base.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <button
                        onClick={onLoginClick}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Start Chatting
                        <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                </div>
            </div>

            {/* Knowledge Categories */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Knowledge Categories</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Browse by category or ask our AI assistant anything about your company
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const bgColor = `bg-${category.color}-100`;
                        const textColor = `text-${category.color}-600`;

                        return (
                            <div
                                key={index}
                                onClick={() => onCategoryClick(category.name)}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                    <Icon className={`h-6 w-6 ${textColor}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Our AI assistant makes finding company information effortless
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ask Anything</h3>
                        <p className="text-gray-600">
                            Type your question in natural language. Ask about procedures, policies, products, or contacts.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
                        <p className="text-gray-600">
                            Our AI searches through all company documents and finds the most relevant information.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Answers</h3>
                        <p className="text-gray-600">
                            Receive accurate, contextual answers with references to source documents.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 opacity-90">
                    Start chatting with our AI assistant and get instant access to your company's knowledge base.
                </p>
                <button
                    onClick={onLoginClick}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Start Chatting Now
                </button>
            </div>
        </div>
    );
};

// Chat Page Component
const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'assistant',
            text: "Hello! I'm your AI assistant. I can help you find information about company procedures, policies, products, and more. What can I help you with today?",
            time: new Date().toLocaleTimeString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = () => {
        if (!input.trim() || isTyping) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                {
                    text: "Based on our company's safety procedures, all employees must wear appropriate PPE when in designated areas. This includes hard hats, safety glasses, and steel-toed boots. Regular safety training is conducted quarterly to ensure everyone stays up to date with the latest protocols.",
                    docs: ["Employee Safety Procedures", "PPE Guidelines 2024"]
                },
                {
                    text: "Our Product X user manual covers installation, configuration, and troubleshooting. The latest version (v2.1) includes updated security features and improved performance optimization. You can find detailed step-by-step instructions for all common tasks.",
                    docs: ["Product X User Manual v2.1", "Quick Start Guide"]
                },
                {
                    text: "According to our IT equipment policy, all company devices must have approved antivirus software and be updated regularly. Personal use is permitted during breaks, but all data must be backed up according to our data retention guidelines.",
                    docs: ["IT Equipment Policy 2024", "Data Retention Guidelines"]
                },
                {
                    text: "For technical support, you can reach our IT department at ext. 1234 or email support@company.com. For urgent issues outside business hours, use the emergency contact number provided in your employee handbook.",
                    docs: ["Employee Handbook", "Contact Directory"]
                },
                {
                    text: "I found relevant information about your query in our knowledge base. The procedures document outlines the standard workflow for this process, including required approvals and timelines. Would you like me to explain any specific step in more detail?",
                    docs: ["Standard Operating Procedures", "Workflow Guidelines"]
                }
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const assistantMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                text: randomResponse.text,
                docs: randomResponse.docs,
                time: new Date().toLocaleTimeString()
            };

            setIsTyping(false);
            setMessages(prev => [...prev, assistantMessage]);
        }, 1500 + Math.random() * 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ height: 'calc(100vh - 64px)' }}>
            <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4">
                    <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                        <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                        AI Assistant
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Ask me anything about your company's knowledge base
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-2 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className="flex items-start space-x-2">
                                    {message.type === 'assistant' && (
                                        <MessageSquare className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                                    )}
                                    {message.type === 'user' && (
                                        <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        {message.docs && message.docs.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-300">
                                                <p className="text-xs opacity-75 mb-1">Referenced documents:</p>
                                                {message.docs.map((doc, i) => (
                                                    <div key={i} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 mb-1">
                                                        📄 {doc}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs opacity-75 mt-1">{message.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="1"
                            disabled={isTyping}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isTyping || !input.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Admin Page Component
const AdminPage = ({ onNavigateToDocuments }) => {
    const [stats] = useState({
        totalDocs: 47,
        processed: 43,
        totalChats: 1284,
        activeUsers: 156
    });

    const [recentDocs] = useState([
        { name: 'Employee Safety Procedures', category: 'Procedures', status: 'Processed', time: '2 hours ago' },
        { name: 'Product X User Manual v2.1', category: 'User Manuals', status: 'Processing', time: '1 day ago' },
        { name: 'IT Equipment Policy 2024', category: 'Policies', status: 'Processed', time: '2 days ago' }
    ]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your AI assistant's knowledge base and monitor usage
                        </p>
                    </div>
                    <button
                        onClick={onNavigateToDocuments}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={onNavigateToDocuments}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Manage Documents
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Building className="h-4 w-4 mr-2" />
                        View Analytics
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDocs}</p>
                            <p className="text-sm text-gray-500">Documents in knowledge base</p>
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
                            <p className="text-2xl font-bold text-gray-900">{stats.processed}</p>
                            <p className="text-sm text-gray-500">Documents ready for AI</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-purple-100">
                            <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Total Chats</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
                            <p className="text-sm text-gray-500">Conversations this month</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-md bg-orange-100">
                            <Users className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                            <p className="text-sm text-gray-500">Users this week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
                        <button
                            onClick={onNavigateToDocuments}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            View all
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentDocs.map((doc, index) => (
                        <div key={index} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-sm text-gray-500">{doc.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'Processed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {doc.status}
                                    </span>
                                    <span className="text-sm text-gray-500">{doc.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Document Management Page Component
const DocumentManagementPage = ({ onBack }) => {
    const [documents] = useState([
        {
            id: 1,
            name: 'Employee Safety Procedures',
            filename: 'safety-procedures-2024.pdf',
            description: 'Comprehensive safety guidelines for all employees',
            category: 'Procedures',
            size: '2.4 MB',
            status: 'Processed',
            date: 'Jan 15, 2024'
        },
        {
            id: 2,
            name: 'Product X User Manual v2.1',
            filename: 'product-x-manual-v2.1.pdf',
            description: 'Complete user guide for Product X',
            category: 'User Manuals',
            size: '5.7 MB',
            status: 'Processing',
            date: 'Jan 14, 2024'
        },
        {
            id: 3,
            name: 'IT Equipment Policy 2024',
            filename: 'it-equipment-policy-2024.docx',
            description: 'Updated IT equipment usage and security policy',
            category: 'Policies',
            size: '847 KB',
            status: 'Processed',
            date: 'Jan 13, 2024'
        }
    ]);

    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <button
                                onClick={onBack}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
                        </div>
                        <p className="text-gray-600">
                            Upload and manage documents for your AI assistant's knowledge base
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>All Categories</option>
                            <option>Procedures</option>
                            <option>Operations</option>
                            <option>User Manuals</option>
                            <option>Policies</option>
                        </select>
                        <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>All Status</option>
                            <option>Processed</option>
                            <option>Processing</option>
                        </select>
                        <div className="flex items-center text-sm text-gray-500">
                            <Filter className="h-4 w-4 mr-2" />
                            {documents.length} of {documents.length} documents
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
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                                <div className="text-sm text-gray-500">{doc.filename}</div>
                                                <div className="text-sm text-gray-500 mt-1">{doc.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'Processed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="text-blue-600 hover:text-blue-500" title="View document">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-500" title="Delete document">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <UploadModal onClose={() => setShowUploadModal(false)} />
            )}
        </div>
    );
};

// Login Modal Component
const LoginModal = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        setLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            onLogin({ email, password });
            setLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-8">
                        <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Sign in to access the AI Assistant</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@company.com"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Try: admin or user@company.com</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10 pr-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Any password will work for demo</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Upload Modal Component
const UploadModal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = () => {
        if (!title || !category) {
            alert('Please fill in all required fields');
            return;
        }

        // Handle upload logic here
        alert('Document uploaded successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            File *
                        </label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                Drop your file here, or{' '}
                                <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                                    browse
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                                    />
                                </label>
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, TXT, XLS, XLSX up to 10MB
                            </p>
                            {fileName && (
                                <div className="mt-4 text-sm text-gray-700">
                                    Selected: {fileName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter document title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter document description"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a category</option>
                            <option>Procedures</option>
                            <option>Operations</option>
                            <option>User Manuals</option>
                            <option>Product Information</option>
                            <option>Contact Information</option>
                            <option>Policies</option>
                            <option>Training Materials</option>
                            <option>Technical Documentation</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;