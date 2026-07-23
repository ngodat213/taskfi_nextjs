export type DocumentFileType =
  | "pdf"
  | "figma"
  | "markdown"
  | "spreadsheet"
  | "image"
  | "archive";

export type FolderGroupType = "team" | "project";

export interface FolderItem {
  id: string;
  name: string;
  groupType: FolderGroupType;
  teamName?: string;
  projectName?: string;
  fileCount: number;
  updatedAt: string;
  color: "blue" | "green" | "purple" | "amber" | "rose" | "indigo";
  owner: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  type: DocumentFileType;
  extension: string;
  size: string;
  updatedAt: string;
  author: {
    name: string;
    avatarBg?: string;
  };
  category: string;
  folderId?: string;
  downloadUrl?: string;
  starred?: boolean;
}
