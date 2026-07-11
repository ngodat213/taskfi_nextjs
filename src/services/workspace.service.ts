import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceMember,
  InviteWorkspaceMemberRequest,
  WorkspaceRole,
  CreateRoleRequest,
  UpdateRoleRequest,
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  EmploymentType,
  CreateEmploymentTypeRequest,
  UpdateEmploymentTypeRequest,
} from "@/types/workspace.types";
import {
  BaseResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";

export const workspaceService = {
  getWorkspaces: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.LIST,
      { params },
    );
    return response.data;
  },

  getWorkspace: async (id: string) => {
    const response = await apiClient.get<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
    );
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceRequest) => {
    const response = await apiClient.post<BaseResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CREATE,
      data,
    );
    return response.data;
  },

  updateWorkspace: async (id: string, data: UpdateWorkspaceRequest) => {
    const response = await apiClient.put<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
      data,
    );
    return response.data;
  },

  deleteWorkspace: async (id: string) => {
    const response = await apiClient.delete<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
    );
    return response.data;
  },

  // MEMBERS
  getWorkspaceMembers: async (id: string, params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members`,
      { params },
    );
    return response.data;
  },

  inviteMember: async (id: string, data: InviteWorkspaceMemberRequest) => {
    const response = await apiClient.post<BaseResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members/invite`,
      data,
    );
    return response.data;
  },

  // ROLES
  getWorkspaceRoles: async (id: string) => {
    const response = await apiClient.get<PaginatedResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
    );
    return response.data;
  },

  createWorkspaceRole: async (id: string, data: CreateRoleRequest) => {
    const response = await apiClient.post<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
      data,
    );
    return response.data;
  },

  updateWorkspaceRole: async (
    id: string,
    roleId: string,
    data: UpdateRoleRequest,
  ) => {
    const response = await apiClient.put<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
      data,
    );
    return response.data;
  },

  deleteWorkspaceRole: async (id: string, roleId: string) => {
    const response = await apiClient.delete<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
    );
    return response.data;
  },

  // Department endpoints
  getDepartments: async (workspaceId: string, params?: PaginationParams) => {
    const response = await apiClient.get<BaseResponse<Department[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments`,
      { params },
    );
    return response.data;
  },

  getDepartment: async (workspaceId: string, departmentId: string) => {
    const response = await apiClient.get<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
    );
    return response.data;
  },

  createDepartment: async (
    workspaceId: string,
    data: CreateDepartmentRequest,
  ) => {
    const response = await apiClient.post<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments`,
      data,
    );
    return response.data;
  },

  updateDepartment: async (
    workspaceId: string,
    departmentId: string,
    data: UpdateDepartmentRequest,
  ) => {
    const response = await apiClient.put<BaseResponse<Department>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
      data,
    );
    return response.data;
  },

  deleteDepartment: async (workspaceId: string, departmentId: string) => {
    const response = await apiClient.delete<BaseResponse<null>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/departments/${departmentId}`,
    );
    return response.data;
  },

  // Employment Type endpoints
  getEmploymentTypes: async (
    workspaceId: string,
    params?: PaginationParams,
  ) => {
    const response = await apiClient.get<BaseResponse<EmploymentType[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types`,
      { params },
    );
    return response.data;
  },

  getEmploymentType: async (workspaceId: string, employmentTypeId: string) => {
    const response = await apiClient.get<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
    );
    return response.data;
  },

  createEmploymentType: async (
    workspaceId: string,
    data: CreateEmploymentTypeRequest,
  ) => {
    const response = await apiClient.post<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types`,
      data,
    );
    return response.data;
  },

  updateEmploymentType: async (
    workspaceId: string,
    employmentTypeId: string,
    data: UpdateEmploymentTypeRequest,
  ) => {
    const response = await apiClient.put<BaseResponse<EmploymentType>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
      data,
    );
    return response.data;
  },

  deleteEmploymentType: async (
    workspaceId: string,
    employmentTypeId: string,
  ) => {
    const response = await apiClient.delete<BaseResponse<null>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/employment-types/${employmentTypeId}`,
    );
    return response.data;
  },
};
