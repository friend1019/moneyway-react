import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // Access Token 메모리 저장
  accessToken: null,

  // 앱이 처음 로드될 때 자동 로그인 시도 여부
  isInitialized: false,

  //토큰 저장
  setAccessToken: (token) => set({ accessToken: token }),

  //토큰 제거
  clearAccessToken: () => set({ accessToken: null }),

  //초기화 상태 변경
  setInitialized: (value) => set({ isInitialized: value }),
}));

export default useAuthStore;
