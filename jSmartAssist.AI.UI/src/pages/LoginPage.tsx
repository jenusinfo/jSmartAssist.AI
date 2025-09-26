// src/pages / LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, MessageSquare, ChevronLeft } from 'lucide-react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await apiService.login({ username: email, password });
            const role = email.includes('admin') ? 'admin' : 'user';

            login(data.accessToken, role);

            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

          // All users go to chat after login
          navigate('/chat');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Try admin/Admin123!');
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
                        <h1 className="text-5xl font-bold text-white mb-4">jSmartAssist.AI</h1>
                        <h2 className="text-3xl font-light text-white mb-8">Knowledge at Your Fingertips</h2>
                        <p className="text-lg text-white opacity-90 max-w-md">
                            Access your organization's entire knowledge base with AI-powered assistance.
                            Upload documents, ask questions, and get instant, accurate answers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white flex flex-col justify-center px-8 lg:px-12">
                <div className="max-w-md mx-auto w-full">
                    <Link
                        to="/"
                        className="mb-6 text-teal-600 hover:text-teal-700 inline-flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <MessageSquare className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to access your AI assistant</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                USERNAME OR EMAIL
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="admin or user@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
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
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'LOGIN'}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-600">
                            Demo credentials: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin / Admin123!</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;