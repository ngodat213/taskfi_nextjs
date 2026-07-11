export interface Group {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
}
