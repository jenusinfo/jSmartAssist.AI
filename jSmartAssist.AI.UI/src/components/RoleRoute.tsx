import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
