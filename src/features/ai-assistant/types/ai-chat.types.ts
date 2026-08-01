import { Issue } from "@/types/issue.types";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  time?: string;
}

export interface AgentStep {
  id: string;
  title: string;
  status: "running" | "completed" | "failed";
  message?: string;
}

export interface IssueFormDraft {
  summary?: string;
  description?: string;
  type?: Issue["type"];
  status?: Issue["status"];
  priority?: Issue["priority"];
  storyPoints?: number;
}
