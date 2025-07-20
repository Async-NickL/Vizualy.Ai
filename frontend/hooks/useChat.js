import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export const useChat = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const sendChat = async ({ user_input, history, chat_id }) => {
    setLoading(true);
    try {
      const token = await getToken();
      const url = chat_id ? `/api/chat/${chat_id}` : "/api/chat";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_input, history }),
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error("Server error: " + text);
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendChat, loading };
};
