import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ 추가
import AppRouter from "./Router";
import api from "./api/axios";
import useAuthStore from "./api/authStore.js";
import LoadingSpinner from "./component/common/LoadingSpinner.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

window.authStore = useAuthStore;

function App() {
  const { isInitialized, setInitialized, setAccessToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const tryAutoLogin = async () => {
      if (location.pathname === "/login") {
        setInitialized(true);
        return;
      }

      try {
        const res = await api.post("/auth/refresh");
        const accessToken = res?.data?.accessToken;

        if (accessToken) {
          setAccessToken(accessToken);
        } else {
          useAuthStore.getState().clearAccessToken(); // ✅ 안정성 보완
        }
      } catch (error) {
        console.error("refresh 실패:", error);
        useAuthStore.getState().clearAccessToken(); // ✅ 실패 시 명시적으로 비움
      } finally {
        setInitialized(true);
      }
    };

    tryAutoLogin();
  }, [location.pathname]);

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
