import React from 'react';
import { MessageSquare, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
    const { userRole, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => onNavigate('chat')}
                    >
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">AI Assistant</span>
                    </div>

                    <nav className="flex items-center space-x-4">
                        <button
                            onClick={() => onNavigate('chat')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'chat'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            Chat
                        </button>

                        {userRole === 'admin' && (
                            <button
                                onClick={() => onNavigate('admin')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'admin'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Settings className="h-4 w-4 inline mr-1" />
                                Admin
                            </button>
                        )}

                        <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <User className="h-4 w-4" />
                                <span className="text-sm">{userRole === 'admin' ? 'Admin' : 'User'}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                                <LogOut className="h-4 w-4 inline" />
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;

