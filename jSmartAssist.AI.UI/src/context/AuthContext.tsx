import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [role, setRole] = useState<string | null>(null);

  const login = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
      setToken(newToken);

      try {
          const payload = JSON.parse(atob(newToken.split(".")[1]));
          setRole(payload.role || null);
      } catch {
          setRole(null);
      }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  
  const refresh = async () => {
    const stored = localStorage.getItem("refreshToken");
    if (!stored) return logout();

    try {
      const response = await fetch("https://localhost:5001/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stored),
      });
      if (!response.ok) throw new Error("Refresh failed");
      const data = await response.json();
      login(data.token);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
