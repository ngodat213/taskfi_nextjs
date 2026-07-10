import { PaginatedResponse } from "@/types/api.types";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceResponse = PaginatedResponse<Workspace>;

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
  createdAt: string;
}

export interface InviteWorkspaceMemberRequest {
  email: string;
  roleId: string;
}

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
