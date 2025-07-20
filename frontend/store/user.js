import { create } from "zustand";

export const useUserStore = create((set) => ({
  user_id: null,
  email: null,
  setUser: (user_id, email) => set({ user_id, email }),
}));
