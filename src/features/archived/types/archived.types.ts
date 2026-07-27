export type ArchivedItemType = "issue" | "sprint" | "document";

export interface ArchivedItem {
  id: string;
  key: string;
  title: string;
  type: ArchivedItemType;
  issueType?: "story" | "bug" | "task" | "epic";
  originalStatus: string;
  archivedAt: string;
  archivedBy: string;
  archivedByAvatar?: string;
  reason?: string;
}
