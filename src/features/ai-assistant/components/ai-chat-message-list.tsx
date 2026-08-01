import React from "react";

import { ChatMessage } from "@/features/ai-assistant/types/ai-chat.types";
import { cn } from "@/utils/cn";

interface AiChatMessageListProps {
  messages: ChatMessage[];
  isModal?: boolean;
}

export function AiChatMessageList({
  messages,
  isModal = false,
}: AiChatMessageListProps) {
  if (messages.length === 0) return null;

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col items-end gap-1">
          <div
            className={cn(
              "bg-muted/80 text-foreground p-4 rounded-[20px] rounded-tr-sm leading-relaxed relative overflow-hidden",
              isModal ? "text-[14px] max-w-[85%]" : "text-[13.5px] max-w-[90%]",
            )}
          >
            <p>{msg.text}</p>
          </div>
          {msg.time && (
            <span className="text-[11px] text-muted-foreground font-medium mr-1">
              {msg.time}
            </span>
          )}
        </div>
      ))}
    </>
  );
}
