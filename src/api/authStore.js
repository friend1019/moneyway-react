import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // Access Token을 메모리에 저장 (초기값은 null)
  accessToken: null,

  // 앱이 처음 로드될 때 자동 로그인 시도 여부
  isInitialized: false,

  // 액션: 토큰 저장
  setAccessToken: (token) => set({ accessToken: token }),

  // 액션: 토큰 제거
  clearAccessToken: () => set({ accessToken: null }),

  // 액션: 초기화 상태 변경
  setInitialized: (value) => set({ isInitialized: value }),
}));

export default useAuthStore;
