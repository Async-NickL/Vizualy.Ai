"use client";
import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chat";
import UserInput from "../../_components/user-input";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import UserLogo from "../../_components/user-logo";
import AiMessage from "../../_components/ai-message";
import { toast } from "sonner";

const Page = () => {
  const { id: chat_id } = useParams();
  const { setHistory } = useChatStore();
  const chat = useChatStore((state) => state.getChatById(chat_id));
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const loadingToastRef = useRef(null);
  const scrollRef = useRef(null);
  const [isMessageSent, setMessageSent] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadChatHistory = async () => {
      if (!chat_id) return;

      setLoading(true);
      loadingToastRef.current = toast.loading("Loading chat history...");

      try {
        const token = await getToken();
        const res = await fetch(`/api/get-history/${chat_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (ignore) return;

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (ignore) return;

        setHistory(chat_id, data.history || []);
        setLoading(false);

        if (loadingToastRef.current) {
          toast.dismiss(loadingToastRef.current);
          loadingToastRef.current = null;
        }
        toast.success("Chat history loaded successfully!");
      } catch (error) {
        if (ignore) return;

        setLoading(false);

        if (loadingToastRef.current) {
          toast.dismiss(loadingToastRef.current);
          loadingToastRef.current = null;
        }
        toast.error("Failed to load chat history");
      }
    };

    loadChatHistory();

    return () => {
      ignore = true;
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
        loadingToastRef.current = null;
      }
    };
  }, [chat_id, setHistory, getToken]);

  useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loading, chat && chat.history ? chat.history.length : 0]);

  return (
    <section className="relative w-full max-w-6xl h-screen flex flex-col">
      <div
        className="flex-1 overflow-y-auto px-5 py-16 scrollbar-hide scroll-smooth"
        ref={scrollRef}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="flex justify-end">
              <Skeleton className="h-32 w-2/3" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-72 w-2/3" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-28 w-3/4" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-52 w-3/4" />
            </div>
          </div>
        ) : chat && chat.history.length > 0 ? (
          chat.history.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 w-full flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.role === "user" ? <UserLogo /> : null}
                <span className="inline-block px-3 py-2 rounded bg-muted text-foreground max-w-[80%] whitespace-pre-line">
                  {msg.role === "agent" ? (
                    <AiMessage content={msg.content} />
                  ) : typeof msg.content === "object" ? (
                    JSON.stringify(msg.content)
                  ) : (
                    msg.content
                  )}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-center">
            No messages yet.
          </div>
        )}
        {isMessageSent && (
          <div className="w-full h-full mt-5">
            <Skeleton className="w-1/3 max-w-[80%] mb-3 h-32" />
            <Skeleton className="w-3/4 max-w-[80%] h-64" />
          </div>
        )}
      </div>
      <UserInput chat_id={chat_id} setMessageSent={setMessageSent} />
    </section>
  );
};

export default Page;
