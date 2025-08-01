import axios from "axios";
import useUserStore from "./userStore.js"; // 사용자 상태 관리
import "react-toastify/dist/ReactToastify.css";

let isRefreshing = false; // 중복 refresh 방지
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: "https://moneyway.cloud/api",
  withCredentials: true, // refreshToken 쿠키를 포함하기 위해 필요
});

api.interceptors.request.use(
  (config) => {
    let token = null;
    try {
      // zustand persist에 저장된 유저에서 accessToken 추출
      token = useUserStore.getState().user?.accessToken;

      // 새로고침 직후 등에서 zustand에 없을 경우 localStorage fallback
      if (!token) {
        const userStr = localStorage.getItem("user");
        const userObj = userStr ? JSON.parse(userStr) : null;
        token = userObj?.accessToken;
      }
    } catch (e) {
      // JSON 파싱 오류 등 무시
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isTokenRefresh = originalRequest?.url?.includes("/auth/refresh");
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");

    if (status === 401 && isTokenRefresh) {
      // refresh 자체 실패 시 사용자 상태 초기화
      useUserStore.getState().clearUser();
      localStorage.removeItem("user");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !isLoginRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refreshToken은 쿠키에 있으므로 body 없이 요청
        const refreshResponse = await api.post("/auth/refresh");
        const { accessToken: newAccessToken } = refreshResponse.data;

        if (newAccessToken) {
          const userStore = useUserStore.getState();
          const prevUser = userStore.user || {};
          const newUser = { ...prevUser, accessToken: newAccessToken };

          userStore.setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));

          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useUserStore.getState().clearUser();
        localStorage.removeItem("user");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
