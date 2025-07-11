// src/App.js
import React, { useEffect } from "react";
import AppRouter from "./Router";
import api from "./api/axios";
import useAuthStore from "./api/authStore.js";
import LoadingSpinner from "./component/common/LoadingSpinner.jsx";

window.authStore = useAuthStore;

function App() {
  const { isInitialized, setInitialized, setAccessToken } = useAuthStore();

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const res = await api.post("/auth/token");
        const { accessToken } = res.data;
        console.log("자동 로그인 액세스토큰:", accessToken);
        if (accessToken) {
          setAccessToken(accessToken);
        }
      } catch (error) {
        console.log("자동 로그인 실패");
      } finally {
        setInitialized(true);
      }
    };

    tryAutoLogin();
  }, [setAccessToken, setInitialized]);

  if (!isInitialized) {
    // 아직 자동 로그인 시도 중이면 로딩 표시
    <LoadingSpinner />;
  }

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
