// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './api/authStore.js';

const ProtectedRoute = ({ children }) => {
  const { accessToken, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return null; // 또는 <LoadingSpinner />

  // 로그인 안 되어 있으면 로그인 페이지로 보내되, 이전 위치를 state에 저장
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
