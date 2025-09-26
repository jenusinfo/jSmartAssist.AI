import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
    children: JSX.Element;
    allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole } = useAuth(); // Changed from 'role' to 'userRole'

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole || "")) { // Changed from 'role' to 'userRole'
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;