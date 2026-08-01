import React, { useEffect, useRef, useState } from "react";

import { CornersOutIcon, SidebarSimpleIcon } from "@phosphor-icons/react";

import { useAgentStream } from "@/features/ai-assistant/hooks/use-agent-stream";
import {
  ChatMessage,
  IssueFormDraft,
} from "@/features/ai-assistant/types/ai-chat.types";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Issue } from "@/types/issue.types";

import { AgentStreamView } from "./agent-stream-view";
import { AiChatInputArea } from "./ai-chat-input-area";
import { AiChatMessageList } from "./ai-chat-message-list";
import { AiChatModal } from "./ai-chat-modal";

interface AiChatSidebarProps {
  onApplyFormDraft?: (draft: IssueFormDraft) => void;
  contextIssue?: Issue;
}

export function AiChatSidebar({
  onApplyFormDraft,
  contextIssue,
}: AiChatSidebarProps) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  const {
    steps,
    streamedText,
    formDraft,
    isLoading,
    processEventPayload,
    generateAiIssue,
  } = useAgentStream();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedText, steps, formDraft]);

  const handleSendMessageWithText = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isLoading || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setInputText("");

    const newMsg: ChatMessage = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${
              typeof crypto !== "undefined" && crypto.getRandomValues
                ? crypto.getRandomValues(new Uint32Array(1))[0]
                : Date.now()
            }`,
      sender: "user",
      text: trimmedText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);

    if (activeWorkspaceId) {
      const issueContextPayload = contextIssue
        ? {
            id: contextIssue.id,
            summary: contextIssue.summary,
            description: contextIssue.description || undefined,
            type: contextIssue.type,
            status: contextIssue.status,
            priority: contextIssue.priority,
            storyPoints: contextIssue.storyPoints,
          }
        : undefined;

      await generateAiIssue(
        activeWorkspaceId,
        trimmedText,
        issueContextPayload,
      );
    } else {
      processEventPayload({
        type: "text",
        data: "Please select an active workspace to use the AI Assistant.",
      });
      processEventPayload({ type: "done" });
    }

    isSubmittingRef.current = false;
  };

  const handleSendMessage = () => {
    handleSendMessageWithText(inputText);
  };

  const isChatEmpty =
    messages.length === 0 && !streamedText && steps.length === 0;

  return (
    <>
      {/* 🔹 SIDEBAR VIEW */}
      <div className="hidden lg:flex flex-col w-90 xl:w-105 shrink-0 bg-transparent p-6 lg:p-8 lg:pr-2 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <SidebarSimpleIcon className="w-4 h-4" />
            <span className="text-[13px] font-semibold">AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Open Fullscreen Chat Modal"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-md hover:bg-muted"
          >
            <CornersOutIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History / Centered Empty State */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-6 flex flex-col gap-5 hide-scrollbar relative"
        >
          {isChatEmpty ? (
            <div className="flex-1 flex flex-col justify-center items-center px-2 py-6 text-center my-auto w-full">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                What should we work on?
              </h2>
              <AiChatInputArea
                inputText={inputText}
                onChangeInputText={setInputText}
                onSendMessage={handleSendMessage}
                onSendMessageWithText={handleSendMessageWithText}
                isLoading={isLoading}
                isCentered
              />
            </div>
          ) : (
            <>
              <AiChatMessageList messages={messages} />

              <AgentStreamView
                steps={steps}
                streamedText={streamedText}
                formDraft={formDraft}
                onApplyForm={onApplyFormDraft}
              />
            </>
          )}
        </div>

        {/* Docked Input Area (Only when chat has messages) */}
        {!isChatEmpty && (
          <AiChatInputArea
            inputText={inputText}
            onChangeInputText={setInputText}
            onSendMessage={handleSendMessage}
            onSendMessageWithText={handleSendMessageWithText}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 🔹 FULLSCREEN AI CHAT MODAL OVERLAY */}
      <AiChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isChatEmpty={isChatEmpty}
        messages={messages}
        steps={steps}
        streamedText={streamedText}
        formDraft={formDraft}
        inputText={inputText}
        onChangeInputText={setInputText}
        onSendMessage={handleSendMessage}
        onSendMessageWithText={handleSendMessageWithText}
        onApplyFormDraft={onApplyFormDraft}
        isLoading={isLoading}
      />
    </>
  );
}
