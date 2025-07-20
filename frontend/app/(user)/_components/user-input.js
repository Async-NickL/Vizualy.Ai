import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Paperclip, Send, FileText, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { usePdfText } from "@/hooks/usePdfText";
import { useChatStore } from "@/store/chat";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_PDF_TEXT_SIZE = 400 * 1024;

const UserInput = ({ chat_id, setMessageSent }) => {
  const [input, setInput] = useState("");
  const { sendChat, loading: chatLoading } = useChat();
  const { extractPdfText, loading: pdfLoading, error: pdfError } = usePdfText();
  const fileInputRef = useRef();
  const [attachedFile, setAttachedFile] = useState(null);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const getChatById = useChatStore((state) => state.getChatById);
  const addChat = useChatStore((state) => state.addChat);
  const router = useRouter();

  // Default to a no-op if setMessageSent is not provided
  const setMessageSentSafe =
    typeof setMessageSent === "function" ? setMessageSent : () => {};

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessageSentSafe(true);
    const loadingToast = toast.loading("Sending message...");

    let userInput = input;
    if (attachedFile) {
      if (attachedFile.size > MAX_PDF_TEXT_SIZE) {
        toast.dismiss(loadingToast);
        toast.error(
          "PDF is too large to process. Please select a file under 200KB."
        );
        return;
      }
      const pdfText = await extractPdfText(attachedFile);
      if (!pdfText) {
        toast.dismiss(loadingToast);
        toast.error(
          "Failed to extract text from PDF. Please try another file."
        );
        return;
      }
      let truncatedText = pdfText;
      if (truncatedText.length > MAX_PDF_TEXT_SIZE) {
        truncatedText =
          truncatedText.slice(0, MAX_PDF_TEXT_SIZE) + "... [truncated]";
      }
      userInput = `${input}\n\nHere is user context from the PDF file \`${attachedFile.name}\` (extract the most relevant information for the user's query):\n\n\`\n${truncatedText}\n\``;
    }

    try {
      // If new chat, generate id, send, store, then redirect
      if (!chat_id || chat_id === "new") {
        const newChatId = nanoid();
        addChat(newChatId);
        // Send to backend (no history for first message)
        const data = await sendChat({
          user_input: userInput,
          history: [],
          chat_id: newChatId,
        });
        // Store user message
        appendMessage(newChatId, { role: "user", content: input });
        // Store AI message (entire response as JSON)
        appendMessage(newChatId, { role: "agent", content: data });
        setInput("");
        setAttachedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.replace(`/chat/${newChatId}`);
        toast.dismiss(loadingToast);
        toast.success("Message sent successfully!");
        return;
      }
      // Existing chat flow
      appendMessage(chat_id, { role: "user", content: input });
      const chat = getChatById(chat_id);
      const history = chat && chat.history ? chat.history.slice(-5) : [];
      const data = await sendChat({ user_input: userInput, history, chat_id });
      appendMessage(chat_id, { role: "agent", content: data });
      setInput("");
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.dismiss(loadingToast);
      setMessageSentSafe(false);
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.dismiss(loadingToast);
      setMessageSentSafe(false);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }
    setAttachedFile(file);
    toast.success(`PDF file "${file.name}" attached successfully!`);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("PDF file removed");
  };

  const isLoading = chatLoading || pdfLoading;

  return (
    <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-2 px-4 max-sm:px-2">
      {attachedFile && (
        <div className="flex items-center gap-2 mb-1 bg-card border border-foreground/10 rounded-md px-3 py-2 w-full ">
          <FileText className="text-primary" />
          <span className="truncate flex-1 text-sm">{attachedFile.name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRemoveFile}
            className="ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="w-full flex items-center gap-2">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          className="px-6 h-11"
          variant={"outline"}
          type="button"
          disabled={isLoading}
          onClick={handleAttachClick}
        >
          <Paperclip className="text-primary" />
        </Button>
        <Textarea
          className="flex-grow min-h-11"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          className="px-6 h-11 "
          variant={"outline"}
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Send className="text-primary" /> Send
        </Button>
      </div>
    </div>
  );
};

export default UserInput;
