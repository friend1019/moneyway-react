// src/api/axios.js
import axios from "axios";
import useAuthStore from "./authStore.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: "https://moneyway-3zca.onrender.com/api",
  withCredentials: true, // 쿠키 포함
});

//메모리에서 Access Token 가져와 Authorization 헤더에 추가하는 거임
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

//401 발생 시 자동 리프레시 → 메모리에 새 토큰 저장 → 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    //토큰 리프레시 시도
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post("/auth/refresh");
        const { accessToken: newAccessToken } = refreshResponse.data;

        if (newAccessToken) {
          useAuthStore.getState().setAccessToken(newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAccessToken();
        toast.warn("로그인이 필요합니다.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    //기타 에러들 처리하는 거 여기 있음
    const isTokenRefresh = originalRequest?.url?.includes("/auth/token");

    if ((status === 401 || status === 403) && !isTokenRefresh) {
      toast.warn("로그인이 필요합니다.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
