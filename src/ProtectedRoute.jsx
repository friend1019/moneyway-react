import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "./api/userStore.js";

const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  // 로그인 안 된 상태라면 로그인 페이지로 이동
  if (!user || !user.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
