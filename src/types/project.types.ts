import { BaseEntity, UploadedFile } from "./api.types";

export interface Project extends BaseEntity {
  name: string;
  key: string;
  projectType: string;
  description?: string;
  logo?: UploadedFile;
  logoUrl?: string;
  logoPublicId?: string;
  leadId?: string;
  groupId: string;
  workspaceId: string;
}

export interface CreateProjectRequest {
  key: string;
  name: string;
  projectType?: string;
  description?: string;
  logoPublicId?: string;
  leadId?: string;
}
