"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatControl() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatControl must be used within a ChatProvider");
  }
  return context;
}
