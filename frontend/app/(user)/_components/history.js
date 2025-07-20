import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useChatHistoryStore } from "@/store/chatHistory";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const skeletonWidths = [
  "w-1/2",
  "w-2/3",
  "w-3/4",
  "w-5/6",
  "w-full",
  "w-4/5",
  "w-1/3",
  "w-11/12",
];

const skeletonHeights = ["h-10", "h-13", "h-15", "h-12", "h-9", "h-17"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const ChatHistory = () => {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();
  const { chats, setChats } = useChatHistoryStore();

  useEffect(() => {
    if (chats !== null) return;
    let ignore = false;
    const fetchChats = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch("/api/chat-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch chat list");
        const data = await res.json();
        if (!ignore) setChats(data.chats || []);
      } catch (err) {
        if (!ignore) setChats([]);
      }
      if (!ignore) setLoading(false);
    };
    fetchChats();
    return () => {
      ignore = true;
    };
  }, [chats, getToken, setChats]);

  if (loading || chats === null)
    return (
      <div className="scrollbar-hide h-full pr-2 overflow-y-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`${getRandom(skeletonWidths)} ${getRandom(
              skeletonHeights
            )} mb-4`}
          />
        ))}
      </div>
    );
  if (!chats.length) return <div>No chats found.</div>;

  return (
    <motion.div
      className="scrollbar-hide h-full overflow-y-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chats.map((chat) => (
        <motion.div
          key={chat.chat_id}
          variants={itemVariants}
          className="cursor-pointer mb-1 py-2 px-3 hover:bg-foreground/10 rounded-md"
          onClick={() => router.push(`/chat/${chat.chat_id}`)}
        >
          {chat.first_message || "(No message)"}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChatHistory;
