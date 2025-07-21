import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "./api/authStore.js";
import LoadingSpinner from "./component/common/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { accessToken, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return <LoadingSpinner />;

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
