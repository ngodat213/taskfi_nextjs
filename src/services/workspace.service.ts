import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceMember,
  InviteWorkspaceMemberRequest,
  UpdateWorkspaceMemberRequest,
  WorkspaceMemberQueryParams,
  WorkspaceRole,
  CreateRoleRequest,
  UpdateRoleRequest,
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  EmploymentType,
  CreateEmploymentTypeRequest,
  UpdateEmploymentTypeRequest,
  WorkspaceConfig,
} from "@/types/workspace.types";
import {
  BaseResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";

export const workspaceService = {
  getWorkspaces: async (params?: PaginationParams) => {
    return apiFetch<PaginatedResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.LIST,
      { params },
    );
  },

  getWorkspace: async (id: string) => {
    return apiFetch<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
    );
  },

  createWorkspace: async (data: CreateWorkspaceRequest) => {
    return apiFetch<BaseResponse<Workspace>>(API_ENDPOINTS.WORKSPACES.CREATE, {
      method: "POST",
      body: data,
    });
  },

  updateWorkspace: async (id: string, data: UpdateWorkspaceRequest) => {
    return apiFetch<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
      { method: "PUT", body: data },
    );
  },

  deleteWorkspace: async (id: string) => {
    return apiFetch<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
      { method: "DELETE" },
    );
  },

  getWorkspaceConfig: async (id: string) => {
    return apiFetch<BaseResponse<WorkspaceConfig>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/config`,
    );
  },

  // MEMBERS
  getWorkspaceMembers: async (
    id: string,
    params?: WorkspaceMemberQueryParams,
  ) => {
    return apiFetch<PaginatedResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members`,
      { params },
    );
  },

  inviteMember: async (id: string, data: InviteWorkspaceMemberRequest) => {
    return apiFetch<BaseResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members/invite`,
      { method: "POST", body: data },
    );
  },

  updateWorkspaceMember: async (
    workspaceId: string,
    memberId: string,
    data: UpdateWorkspaceMemberRequest,
  ) => {
    return apiFetch<BaseResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/members/${memberId}`,
      { method: "PUT", body: data },
    );
  },

  removeWorkspaceMember: async (workspaceId: string, memberId: string) => {
    return apiFetch<BaseResponse<{ status: string; message: string }>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/members/${memberId}`,
      { method: "DELETE" },
    );
  },

  // ROLES
  getWorkspaceRoles: async (id: string) => {
    return apiFetch<PaginatedResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
    );
  },

  createWorkspaceRole: async (id: string, data: CreateRoleRequest) => {
    return apiFetch<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
      { method: "POST", body: data },
    );
  },

  updateWorkspaceRole: async (
    id: string,
    roleId: string,
    data: UpdateRoleRequest,
  ) => {
    return apiFetch<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
      { method: "PUT", body: data },
    );
  },

  deleteWorkspaceRole: async (id: string, roleId: string) => {
    return apiFetch<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
      { method: "DELETE" },
    );
  },

  // Department endpoints
  getDepartments: async (workspaceId: string, params?: PaginationParams) => {
    return apiFetch<BaseResponse<Department[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments`,
      { params },
    );
  },

  getDepartment: async (workspaceId: string, departmentId: string) => {
    return apiFetch<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
    );
  },

  createDepartment: async (
    workspaceId: string,
    data: CreateDepartmentRequest,
  ) => {
    return apiFetch<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments`,
      { method: "POST", body: data },
    );
  },

  updateDepartment: async (
    workspaceId: string,
    departmentId: string,
    data: UpdateDepartmentRequest,
  ) => {
    return apiFetch<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
      { method: "PUT", body: data },
    );
  },

  deleteDepartment: async (workspaceId: string, departmentId: string) => {
    return apiFetch<BaseResponse<null>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
      { method: "DELETE" },
    );
  },

  // Employment Type endpoints
  getEmploymentTypes: async (
    workspaceId: string,
    params?: PaginationParams,
  ) => {
    return apiFetch<BaseResponse<EmploymentType[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types`,
      { params },
    );
  },

  getEmploymentType: async (workspaceId: string, employmentTypeId: string) => {
    return apiFetch<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
    );
  },

  createEmploymentType: async (
    workspaceId: string,
    data: CreateEmploymentTypeRequest,
  ) => {
    return apiFetch<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types`,
      { method: "POST", body: data },
    );
  },

  updateEmploymentType: async (
    workspaceId: string,
    employmentTypeId: string,
    data: UpdateEmploymentTypeRequest,
  ) => {
    return apiFetch<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
      { method: "PUT", body: data },
    );
  },

  deleteEmploymentType: async (
    workspaceId: string,
    employmentTypeId: string,
  ) => {
    return apiFetch<BaseResponse<null>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
      { method: "DELETE" },
    );
  },
};
