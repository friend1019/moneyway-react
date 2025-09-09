import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./Router";
import api from "./api/axios";
import useUserStore from "./api/userStore.js"; // ✅ 통합 상태 관리
import LoadingSpinner from "./component/common/LoadingSpinner.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const { isInitialized, setInitialized, clearUser } = useUserStore(); // ✅ authStore 제거

  useEffect(() => {
    const tryAutoLogin = async () => {
      if (location.pathname === "/login") {
        setInitialized(true);
        return;
      }

      try {
        await api.post("/auth/refresh");
        // ✅ refreshToken은 쿠키에 있으므로 별도 처리 불필요
      } catch (error) {
        console.error("refresh 실패:", error);
        clearUser(); // ✅ 상태 초기화
      } finally {
        setInitialized(true);
      }
    };

    tryAutoLogin();
  }, [location.pathname, setInitialized, clearUser]);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        newestOnTop={false}
        theme="colored"
      />
      <AppRouter />
    </div>
    
  );
}

export default App;
