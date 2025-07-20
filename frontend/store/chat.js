import { create } from "zustand";
import { nanoid } from "nanoid";

// Each chat: { chat_id: string, history: [{ role: "user"|"agent", content: string }] }
export const useChatStore = create((set, get) => ({
  chats: [], // [{ chat_id, history }]
  // Add a new chat
  addChat: (chat_id) =>
    set((state) => ({
      chats: [...state.chats, { chat_id, history: [] }],
    })),
  // Append a message to a chat's history
  appendMessage: (chat_id, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chat_id
          ? { ...chat, history: [...chat.history, message] }
          : chat
      ),
    })),
  // Set the history for a chat id (replace or add chat)
  setHistory: (chat_id, history) =>
    set((state) => {
      const chatExists = state.chats.some((chat) => chat.chat_id === chat_id);
      if (chatExists) {
        return {
          chats: state.chats.map((chat) =>
            chat.chat_id === chat_id ? { ...chat, history } : chat
          ),
        };
      } else {
        return {
          chats: [...state.chats, { chat_id, history }],
        };
      }
    }),
  // Reset all chats
  resetChats: () => set({ chats: [] }),
  // Get chat by id
  getChatById: (chat_id) =>
    get().chats.find((chat) => chat.chat_id === chat_id),
}));
