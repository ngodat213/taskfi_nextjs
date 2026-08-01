import React, { useEffect, useRef } from "react";

import { SidebarSimpleIcon } from "@phosphor-icons/react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@/components/ui/layout/modal";
import {
  AgentStep,
  ChatMessage,
  IssueFormDraft,
} from "@/features/ai-assistant/types/ai-chat.types";

import { AgentStreamView } from "./agent-stream-view";
import { AiChatInputArea } from "./ai-chat-input-area";
import { AiChatMessageList } from "./ai-chat-message-list";

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isChatEmpty: boolean;
  messages: ChatMessage[];
  steps: AgentStep[];
  streamedText: string;
  formDraft: IssueFormDraft | null;
  inputText: string;
  onChangeInputText: (text: string) => void;
  onSendMessage: () => void;
  onSendMessageWithText: (text: string) => void;
  onApplyFormDraft?: (draft: IssueFormDraft) => void;
  isLoading: boolean;
}

export function AiChatModal({
  isOpen,
  onClose,
  isChatEmpty,
  messages,
  steps,
  streamedText,
  formDraft,
  inputText,
  onChangeInputText,
  onSendMessage,
  onSendMessageWithText,
  onApplyFormDraft,
  isLoading,
}: AiChatModalProps) {
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
    }
  }, [messages, streamedText, steps, formDraft]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-4xl" className="h-[85vh]">
        <ModalHeader
          title="AI Assistant"
          icon={<SidebarSimpleIcon className="w-4 h-4" />}
        />

        <ModalBody className="flex flex-col flex-1 overflow-hidden">
          {/* Modal Chat Content Area */}
          <div
            ref={modalScrollRef}
            className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 hide-scrollbar relative"
          >
            {/* Centered Empty State Input */}
            {isChatEmpty ? (
              <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 text-center my-auto w-full">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  What should we work on?
                </h2>
                <AiChatInputArea
                  inputText={inputText}
                  onChangeInputText={onChangeInputText}
                  onSendMessage={onSendMessage}
                  onSendMessageWithText={onSendMessageWithText}
                  isLoading={isLoading}
                  isCentered
                />
              </div>
            ) : (
              <>
                <AiChatMessageList messages={messages} isModal />

                <AgentStreamView
                  steps={steps}
                  streamedText={streamedText}
                  formDraft={formDraft}
                  onApplyForm={(draft) => {
                    onApplyFormDraft?.(draft);
                    onClose();
                  }}
                />
              </>
            )}
          </div>

          {/* Docked Input Area (Only when chat has messages) */}
          {!isChatEmpty && (
            <div className="p-3 pt-0 shrink-0 bg-transparent">
              <AiChatInputArea
                inputText={inputText}
                onChangeInputText={onChangeInputText}
                onSendMessage={onSendMessage}
                onSendMessageWithText={onSendMessageWithText}
                isLoading={isLoading}
              />
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
