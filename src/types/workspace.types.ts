import { BaseEntity, PaginationParams } from "./api.types";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  roleId: string;
  username: string;
  email: string;
  roleName: string;
  name?: string;
  fullName?: string;
  full_name?: string;
  avatar_public_id?: string;
  avatarUrl?: string;
  avatar?: {
    uploaderId?: string;
    fileUrl?: string;
    originalName?: string;
    publicId?: string;
  };
  phone?: string;
  location?: string;
  jobTitle?: string;
  departmentId?: string;
  department?: string;
  employmentTypeId?: string;
  skills?: string;
  personalNote?: string;
  status?: string;
  tags?: string[];
  createdAt: string;
}

export interface WorkspaceMemberQueryParams extends PaginationParams {
  roleId?: string;
  departmentId?: string;
  employmentTypeId?: string;
  groupId?: string;
}

export interface InviteWorkspaceMemberRequest {
  email: string;
  roleId: string;
  username?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  departmentId?: string;
  employmentTypeId?: string;
  skills?: string;
  personalNote?: string;
}

export type UpdateWorkspaceMemberRequest =
  Partial<InviteWorkspaceMemberRequest>;

export interface WorkspaceRole {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  permissions: string[];
  scope: "workspace" | "project";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
  scope?: "workspace" | "project";
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface Department extends BaseEntity {
  workspaceId: string;
  name: string;
  description?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

export interface EmploymentType extends BaseEntity {
  workspaceId: string;
  name: string;
  description?: string;
}

export interface CreateEmploymentTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateEmploymentTypeRequest {
  name?: string;
  description?: string;
}

export interface WorkspaceStatus {
  id?: string;
  key?: string;
  no?: number;
  name: string;
  category: string;
  color?: string;
  isDefault?: boolean;
}

export interface WorkspaceIssueType {
  id?: string;
  key?: string;
  no?: number;
  name: string;
  icon?: string;
  description?: string;
  isSubtask?: boolean;
  isDefault?: boolean;
  allowedParentTypes?: string[];
}

export interface WorkspacePriority {
  id?: string;
  key?: string;
  no?: number;
  name: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface WorkspaceLinkType {
  type: string;
  inverseType: string;
  inwardLabel: string;
  outwardLabel: string;
}

export interface WorkspaceConfig {
  workspaceId: string;
  statuses: WorkspaceStatus[];
  issueTypes: WorkspaceIssueType[];
  priorities?: WorkspacePriority[];
  linkTypes?: WorkspaceLinkType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateWorkspaceConfigRequest {
  statuses?: WorkspaceStatus[];
  issueTypes?: WorkspaceIssueType[];
  priorities?: WorkspacePriority[];
  linkTypes?: WorkspaceLinkType[];
}
