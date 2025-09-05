import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  isInitialized: false,

  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null, isInitialized: true }), // ✅ 초기화도 같이

  setInitialized: (value) => set({ isInitialized: value }),
}));

export default useAuthStore;