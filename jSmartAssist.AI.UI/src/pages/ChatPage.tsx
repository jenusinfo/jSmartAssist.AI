// src/pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Settings, LogOut, MessageSquare } from 'lucide-react';
import apiService from '../services/apiService';
import { ChatMessage, DocumentReference } from '../types';
import { useAuth } from '../context/AuthContext';

const ChatPage: React.FC = () => {
    const { userRole, logout } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            type: 'assistant',
            text: "Hello! I'm your AI assistant. I can help you find information about company procedures, policies, products, and more. What would you like to know?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            type: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await apiService.sendChatMessage({
                sessionId: 'session-' + Date.now(),
                message: input,
                userId: localStorage.getItem('userId') || 'anonymous',
                userName: localStorage.getItem('userName') || 'User'
            });

            const assistantMessage: ChatMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                text: response.response || 'I found relevant information for your query.',
                references: response.referencedDocuments
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                text: 'I apologize, but I encountered an error while processing your request. Please ensure the AI service is running (Ollama on port 11434) and try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sampleQuestions = [
        "What are the company policies?",
        "How do I submit an expense report?",
        "Tell me about safety procedures",
        "What products do we offer?"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-8 w-8 text-teal-600" />
                            <span className="text-xl font-bold text-gray-900">jSmartAssist.AI</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {userRole === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                                >
                                    <Settings className="h-4 w-4 mr-1" />
                                    Admin Panel
                                </Link>
                            )}
                            <div className="text-gray-600 px-3 py-2 text-sm">
                                <User className="h-4 w-4 inline mr-1" />
                                {userRole === 'admin' ? 'Admin' : 'User'}
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
                </div>
            </header>

            {/* Chat Container - adjusted for header */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-white">
                        <h1 className="text-xl font-semibold text-gray-900">AI Assistant Chat</h1>
                        <p className="text-sm text-gray-600 mt-1">Ask me anything about your company's knowledge base</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-xs lg:max-w-md xl:max-w-2xl ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 ${msg.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                                            }`}>
                                            {msg.type === 'user' ?
                                                <User className="h-5 w-5 text-white" /> :
                                                <Bot className="h-5 w-5 text-white" />
                                            }
                                        </div>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`rounded-lg px-4 py-2 ${msg.type === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                                        {/* References */}
                                        {msg.references && msg.references.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 mb-1">Referenced documents:</p>
                                                {msg.references.map((ref, idx) => (
                                                    <div key={idx} className="text-xs bg-gray-50 rounded px-2 py-1 mt-1">
                                                        📄 {ref.title || ref.fileName}
                                                        {ref.category && (
                                                            <span className="ml-2 text-gray-400">({ref.category})</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Sample Questions */}
                    {messages.length === 1 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {sampleQuestions.map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(question)}
                                        className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me anything about company procedures, policies, products..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Press Enter to send • Your data is processed securely on-premise
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;