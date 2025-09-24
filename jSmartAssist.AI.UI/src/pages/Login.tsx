import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Workflow, Shield, FileText, CheckCircle } from 'lucide-react';

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    // Handle login logic here
    try {
      const response = await fetch("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend accepts both username or email
        body: JSON.stringify({ username: email, password })
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      const accessToken = data.accessToken ?? data.token?.accessToken ?? data.token;
      const refreshToken = data.refreshToken ?? data.token?.refreshToken;

        if (!accessToken || typeof accessToken !== "string") {
            throw new Error("Missing access token in login response");
        }

        login(accessToken);

        if (refreshToken && typeof refreshToken === "string") {
            localStorage.setItem("refreshToken", refreshToken);
        }

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex flex-col justify-center px-12 relative overflow-hidden">
        {/* Background Pattern */}
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
            
            <h1 className="text-5xl font-bold text-white mb-4">
              Work Smarter
            </h1>
            <h2 className="text-4xl font-light text-white mb-8">
              Perform Better
            </h2>
            <p className="text-lg text-white opacity-90 mb-12 max-w-md">
              Experience next-generation smart assistance tools to optimize,
              process, and collaborate simply and securely
            </p>
          </div>

          {/* Features Grid */}
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

        {/* Footer Links */}
        <div className="absolute bottom-8 left-12 flex space-x-6 text-white text-sm opacity-75">
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Cookie Policy</a>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex flex-col justify-center px-12 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-xl text-white font-bold text-xl mb-4">
              jSA
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to the
            </h2>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Assistant Platform
            </h3>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                EMAIL*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jsmartassist.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                PASSWORD*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-teal-500 hover:text-teal-600 transition-colors">
                Forgot Your Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>LOGIN</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-400">
          © JSMARTASSIST TECHNOLOGIES LTD
        </div>
      </div>
    </div>
  );
};

export default LoginPage;