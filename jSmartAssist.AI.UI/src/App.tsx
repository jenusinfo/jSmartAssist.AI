import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import { useAuth } from "./context/AuthContext";

// Dummy Dashboard for testing
const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-teal-600 mb-4">Welcome to Dashboard (Protected)</h1>
      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

const Unauthorized: React.FC = () => (
  <div className="p-10 text-red-600 font-bold text-2xl">Access Denied</div>
);

function App() {
  return (
    <AuthProvider>
      
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["Admin"]}>
                <div className="p-10 text-2xl font-bold text-purple-600">Admin Panel</div>
              </RoleRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;
