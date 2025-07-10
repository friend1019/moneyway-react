// src/api/axios.js
import axios from "axios";
import useAuthStore from "./authStore.js"; // Zustand 스토어 가져오기

const api = axios.create({
  baseURL: "https://moneyway-3zca.onrender.com/api",
  withCredentials: true, // 쿠키 포함
});

// ✅ 요청 인터셉터: 메모리에서 Access Token 가져와 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401 발생 시 자동 리프레시 → 메모리에 새 토큰 저장 → 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post("/auth/token");
        const { accessToken: newAccessToken } = refreshResponse.data;

        if (newAccessToken) {
          // 메모리에 새 토큰 저장
          useAuthStore.getState().setAccessToken(newAccessToken);
          // 원래 요청의 헤더 갱신 후 재시도
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        useAuthStore.getState().clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
