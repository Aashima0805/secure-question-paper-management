import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../auth";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;