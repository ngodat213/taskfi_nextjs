import { useState } from "react";
import { issueService } from "@/services/issue.service";
import { AiGenerateIssueResponse } from "@/types/ai.types";
import {
  AgentStep,
  IssueFormDraft,
} from "@/features/ai-assistant/types/ai-chat.types";

export type StreamPayload =
  | { type: "step"; data: AgentStep }
  | { type: "text"; data: { delta?: string } | string }
  | { type: "data"; data: IssueFormDraft }
  | { type: "done"; data?: unknown };

export function useAgentStream() {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [streamedText, setStreamedText] = useState<string>("");
  const [formDraft, setFormDraft] = useState<IssueFormDraft | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processEventPayload = (payload: StreamPayload) => {
    switch (payload.type) {
      case "step": {
        const newStep: AgentStep = payload.data;
        setSteps((prevSteps) => {
          const index = prevSteps.findIndex((s) => s.id === newStep.id);
          if (index !== -1) {
            const updated = [...prevSteps];
            updated[index] = { ...updated[index], ...newStep };
            return updated;
          }
          return [...prevSteps, newStep];
        });
        break;
      }

      case "text": {
        const textDelta =
          typeof payload.data === "string"
            ? payload.data
            : payload.data?.delta || "";
        setStreamedText((prev) => prev + textDelta);
        break;
      }

      case "data": {
        setFormDraft(payload.data);
        break;
      }

      case "done": {
        setIsLoading(false);
        break;
      }
    }
  };

  const resetStream = () => {
    setSteps([]);
    setStreamedText("");
    setFormDraft(null);
    setIsLoading(false);
  };

  const generateAiIssue = async (
    workspaceId: string,
    prompt: string,
    contextIssue?: {
      id?: string;
      summary?: string;
      description?: string;
      type?: string;
      status?: string;
      priority?: string;
      storyPoints?: number;
    },
  ): Promise<AiGenerateIssueResponse | null> => {
    resetStream();
    setIsLoading(true);

    processEventPayload({
      type: "step",
      data: {
        id: "ai-step-1",
        title: "Analyzing request with AI...",
        status: "running",
        message: "Processing workspace context and intent detection...",
      },
    });

    try {
      const response = await issueService.aiGenerateIssue(
        workspaceId,
        prompt,
        contextIssue,
      );

      if (response.steps && response.steps.length > 0) {
        response.steps.forEach((step) => {
          processEventPayload({
            type: "step",
            data: {
              id: step.id,
              title: step.title,
              status: step.status,
              message: step.message || "",
            },
          });
        });
      } else {
        processEventPayload({
          type: "step",
          data: {
            id: "ai-step-1",
            title: "AI Analysis Complete",
            status: "completed",
            message:
              response.intent === "CREATE_ISSUE" || response.isIssueRequest
                ? "Generated issue draft recommendations."
                : "Processed request.",
          },
        });
      }

      if (response.replyMessage) {
        processEventPayload({
          type: "text",
          data: response.replyMessage,
        });
      }

      const actionPayload =
        response.action?.payload && typeof response.action.payload === "object"
          ? (response.action.payload as Record<string, unknown>)
          : null;

      const hasIssueDraft =
        response.intent === "CREATE_ISSUE" ||
        response.intent === "UPDATE_ISSUE" ||
        response.action?.type === "ISSUE_DRAFT" ||
        response.action?.type === "ISSUE_UPDATE" ||
        Boolean(response.isIssueRequest) ||
        Boolean(actionPayload);

      const summary =
        (actionPayload?.summary as string | undefined) ||
        response.summary ||
        contextIssue?.summary;

      const description =
        (actionPayload?.description as string | undefined) ||
        (actionPayload?.desc as string | undefined) ||
        (actionPayload?.content as string | undefined) ||
        (actionPayload?.details as string | undefined) ||
        response.description;

      if (hasIssueDraft && (summary || description)) {
        const draft: IssueFormDraft = {
          summary: summary || contextIssue?.summary || "Updated Issue Draft",
          type: ((actionPayload?.type as string | undefined) ||
            response.type ||
            contextIssue?.type) as IssueFormDraft["type"],
          status: ((actionPayload?.status as string | undefined) ||
            response.status ||
            contextIssue?.status) as IssueFormDraft["status"],
          priority: ((actionPayload?.priority as string | undefined) ||
            response.priority ||
            contextIssue?.priority) as IssueFormDraft["priority"],
          description,
          storyPoints:
            (actionPayload?.storyPoints as number | undefined) ??
            response.storyPoints ??
            contextIssue?.storyPoints,
        };
        processEventPayload({ type: "data", data: draft });
      } else {
        setFormDraft(null);
      }

      processEventPayload({ type: "done" });
      return response;
    } catch (error) {
      processEventPayload({
        type: "step",
        data: {
          id: "ai-step-1",
          title: "Failed to generate AI response",
          status: "failed",
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while communicating with AI service.",
        },
      });
      processEventPayload({ type: "done" });
      return null;
    }
  };

  return {
    steps,
    streamedText,
    formDraft,
    isLoading,
    setIsLoading,
    processEventPayload,
    resetStream,
    generateAiIssue,
  };
}
