import React, { useState, useEffect, useRef } from 'react';
import {
    Eye, EyeOff, Lock, Mail, Workflow, Shield, FileText, CheckCircle,
    MessageSquare, Settings, Upload, Search, LogOut, User, Menu, X,
    Book, Users, Phone, GraduationCap, Wrench, Info, Send,
    Home, FolderOpen, Clock, AlertCircle, ChevronRight, Plus, Trash2,
    FileCheck, Building, HelpCircle
} from 'lucide-react';

// Main App Component
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [currentPage, setCurrentPage] = useState('landing');

    useEffect(() => {
        // Check for existing auth token
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            // For demo, check username to determine role
            const savedRole = localStorage.getItem('userRole');
            setUserRole(savedRole || 'user');
        }
    }, []);

    const handleLogin = (token, role) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
        setCurrentPage('landing');
    };

    if (!isAuthenticated && currentPage === 'login') {
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
    }

    if (!isAuthenticated) {
        return <LandingPage onLoginClick={() => setCurrentPage('login')} />;
    }

    return <AuthenticatedApp userRole={userRole} onLogout={handleLogout} />;
};

// Landing Page Component
const LandingPage = ({ onLoginClick }) => {
    const categories = [
        { name: 'Procedures', icon: Book, description: 'Company procedures and workflows' },
        { name: 'Operations', icon: Wrench, description: 'Operational guidelines' },
        { name: 'User Manuals', icon: FileText, description: 'Product user guides' },
        { name: 'Products', icon: Info, description: 'Product specifications' },
        { name: 'Contacts', icon: Phone, description: 'Contact directories' },
        { name: 'Policies', icon: Shield, description: 'Company policies' },
        { name: 'Training', icon: GraduationCap, description: 'Training materials' },
        { name: 'Technical', icon: Settings, description: 'Technical documentation' }
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
                        <button
                            onClick={onLoginClick}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Login
                        </button>
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
                    <button
                        onClick={onLoginClick}
                        className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center"
                    >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Start Chatting
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                </div>

                {/* Knowledge Categories */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Knowledge Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-teal-600" />
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
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Ask Anything</h3>
                            <p className="text-gray-600">Type your question in natural language</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                            <p className="text-gray-600">AI searches through all company documents</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Info className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Answers</h3>
                            <p className="text-gray-600">Receive accurate, contextual answers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Login Page Component
const LoginPage = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch("http://localhost:5246/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password })
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();

            // Determine role based on username
            const role = (email === 'admin' || email === 'admin@jassist.com') ? 'admin' : 'user';
            onLogin(data.accessToken, role);

        } catch (err) {
            setError("Invalid credentials. Try: admin / Admin123!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                    <div className="absolute bottom-32 right-20 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white rounded-full"></div>
                </div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium mb-6">
                            JSMARTASSIST PLATFORM
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-4">Work Smarter</h1>
                        <h2 className="text-4xl font-light text-white mb-8">Perform Better</h2>
                        <p className="text-lg text-white opacity-90 max-w-md">
                            Experience next-generation smart assistance tools to optimize, process, and collaborate simply and securely
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-md">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <FileText className="w-8 h-8 text-white mb-3" />
                            <h3 className="text-white font-semibold text-lg">Smart Documents</h3>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <Workflow className="w-8 h-8 text-white mb-3" />
                            <h3 className="text-white font-semibold text-lg">AI Automation</h3>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <Shield className="w-8 h-8 text-white mb-3" />
                            <h3 className="text-white font-semibold text-lg">Secure Access</h3>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <CheckCircle className="w-8 h-8 text-white mb-3" />
                            <h3 className="text-white font-semibold text-lg">Smart Analytics</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white flex flex-col justify-center px-8 lg:px-12">
                <div className="max-w-md mx-auto w-full">
                    <button onClick={onBack} className="mb-6 text-teal-600 hover:text-teal-700 inline-flex items-center">
                        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                        Back to Home
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-xl text-white font-bold text-xl mb-4">
                            jSA
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Enter your credentials to access the platform</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">USERNAME OR EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="admin or admin@jassist.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'LOGIN'}
                        </button>
                    </div>

                    <div className="text-center mt-8 text-sm text-gray-400">
                        © JSMARTASSIST TECHNOLOGIES LTD
                    </div>
                </div>
            </div>
        </div>
    );
};

// Authenticated App Component
const AuthenticatedApp = ({ userRole, onLogout }) => {
    const [currentView, setCurrentView] = useState('chat');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center space-x-2 ${!sidebarOpen && 'justify-center'}`}>
                            <MessageSquare className="h-8 w-8 text-teal-600 flex-shrink-0" />
                            {sidebarOpen && <span className="text-xl font-bold">jSmartAssist.AI</span>}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`text-gray-500 hover:text-gray-700 ${!sidebarOpen && 'hidden'}`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <nav className="p-4">
                    <button
                        onClick={() => setCurrentView('chat')}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-2 ${currentView === 'chat' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
                            }`}
                    >
                        <MessageSquare className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && <span>AI Chat</span>}
                    </button>

                    {userRole === 'admin' && (
                        <>
                            <button
                                onClick={() => setCurrentView('documents')}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-2 ${currentView === 'documents' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <FolderOpen className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && <span>Documents</span>}
                            </button>

                            <button
                                onClick={() => setCurrentView('categories')}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-2 ${currentView === 'categories' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <Settings className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && <span>Categories</span>}
                            </button>

                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-2 ${currentView === 'dashboard' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <Building className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && <span>Dashboard</span>}
                            </button>
                        </>
                    )}

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 mt-8 text-red-600"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <h1 className="text-xl font-semibold">
                        {currentView === 'chat' && 'AI Assistant'}
                        {currentView === 'documents' && 'Document Management'}
                        {currentView === 'categories' && 'Category Management'}
                        {currentView === 'dashboard' && 'Admin Dashboard'}
                    </h1>

                    <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{userRole === 'admin' ? 'Admin User' : 'User'}</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-auto">
                    {currentView === 'chat' && <ChatView />}
                    {currentView === 'documents' && <DocumentsView />}
                    {currentView === 'categories' && <CategoriesView />}
                    {currentView === 'dashboard' && <DashboardView />}
                </div>
            </div>
        </div>
    );
};

// Chat View Component
const ChatView = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'assistant', text: 'Hello! I\'m your AI assistant. I can help you find information about company procedures, policies, products, and more. What would you like to know?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5246/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    sessionId: 'session-' + Date.now(),
                    message: input,
                    userId: 'user',
                    userName: 'User'
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'assistant',
                text: data.response || 'Based on the knowledge base, I found relevant information for your query.',
                references: data.referencedDocuments
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'assistant',
                text: 'I can help you with company information. Please ensure the AI service is running (Ollama on port 11434).'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const sampleQuestions = [
        "What is our company's vacation policy?",
        "How do I submit an expense report?",
        "What are the safety procedures?",
        "Which product should I recommend for outdoor use?"
    ];

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${msg.type === 'user'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                {msg.references && msg.references.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-300">
                                        <p className="text-xs opacity-75">Referenced:</p>
                                        {msg.references.map((ref, i) => (
                                            <div key={i} className="text-xs mt-1">📄 {ref.title || ref.fileName}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sample Questions */}
                <div className="px-6 py-3 border-t bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                        {sampleQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask me anything..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Documents View Component
const DocumentsView = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Employee Handbook.pdf', category: 'Policies', size: '2.4 MB', status: 'Processed', uploadedAt: '2024-01-15' },
        { id: 2, name: 'Product Manual.docx', category: 'Products', size: '1.8 MB', status: 'Processing', uploadedAt: '2024-01-14' },
        { id: 3, name: 'Safety Procedures.pdf', category: 'Procedures', size: '956 KB', status: 'Processed', uploadedAt: '2024-01-13' },
    ]);

    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div>
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Document Library</h2>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 inline-flex items-center"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3">Document</th>
                                    <th className="text-left py-3">Category</th>
                                    <th className="text-left py-3">Size</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Uploaded</th>
                                    <th className="text-right py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                                {doc.name}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                                                {doc.category}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600">{doc.size}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${doc.status === 'Processed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600">{doc.uploadedAt}</td>
                                        <td className="py-3 text-right">
                                            <button className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Upload Document</h3>
                            <button onClick={() => setShowUploadModal(false)}>
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Drop your file here, or browse</p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Categories View Component
const CategoriesView = () => {
    const [categories] = useState([
        { id: 1, name: 'Procedures', icon: Book, count: 12, color: 'blue' },
        { id: 2, name: 'Operations', icon: Wrench, count: 8, color: 'green' },
        { id: 3, name: 'Policies', icon: Shield, count: 15, color: 'indigo' },
        { id: 4, name: 'Products', icon: Info, count: 23, color: 'orange' },
        { id: 5, name: 'Training', icon: GraduationCap, count: 7, color: 'yellow' },
        { id: 6, name: 'Contacts', icon: Phone, count: 45, color: 'red' },
    ]);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 inline-flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <div key={cat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 bg-${cat.color}-100 rounded-lg`}>
                                            <Icon className={`h-6 w-6 text-${cat.color}-600`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{cat.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{cat.count} documents</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Settings className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Dashboard View Component
const DashboardView = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Documents</p>
                            <p className="text-2xl font-bold">47</p>
                        </div>
                        <FileText className="h-8 w-8 text-teal-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Processed</p>
                            <p className="text-2xl font-bold">43</p>
                        </div>
                        <FileCheck className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Chats</p>
                            <p className="text-2xl font-bold">1,284</p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Users</p>
                            <p className="text-2xl font-bold">156</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ollama AI Service</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Database</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Document Processing</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">4 in queue</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;