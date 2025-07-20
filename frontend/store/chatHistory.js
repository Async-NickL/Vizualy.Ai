import { create } from "zustand";

export const useChatHistoryStore = create((set) => ({
  chats: null,
  setChats: (chats) => set({ chats }),
  clearChats: () => set({ chats: null }),
}));
