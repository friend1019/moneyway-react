import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.208.20:8081/api", // 서버 주소에 맞게 조정
  withCredentials: true, // 쿠키 자동 포함
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized -> 토큰 갱신 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 리프레시 토큰 갱신을 위한 요청 (백엔드가 쿠키 갱신 처리)
        await api.post("/auth/refresh", {}, { withCredentials: true });

        // 자동으로 새로운 JWT 쿠키가 갱신되므로, 원래 요청을 다시 보내기
        return api(originalRequest); // 다시 원래 요청을 보냄
      } catch (refreshError) {
        // 리프레시 토큰 갱신 실패 시, 로그아웃 처리
        console.error("리프레시 토큰 갱신 실패", refreshError);
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // 401 외의 오류는 그대로 처리
  }
);

export default api;
