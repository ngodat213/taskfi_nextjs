import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  issueService,
  GetIssuesParams,
  GetMyTasksParams,
} from "@/services/issue.service";
import {
  CreateIssueRequest,
  Issue,
  IssueComment,
  IssueActivity,
} from "@/types/issue.types";

export const useMyTasks = (
  workspaceId?: string | null,
  params?: GetMyTasksParams,
) => {
  return useQuery({
    queryKey: ["my-tasks", workspaceId, params],
    queryFn: () => issueService.getMyTasks(workspaceId!, params),
    enabled: !!workspaceId,
  });
};

export const useIssues = (projectId: string, params?: GetIssuesParams) => {
  return useQuery({
    queryKey: ["issues", projectId, params],
    queryFn: () => issueService.getIssuesByProject(projectId, params),
    enabled: !!projectId,
  });
};

export const useIssue = (projectId: string, issueId: string) => {
  return useQuery({
    queryKey: ["issues", projectId, issueId],
    queryFn: () => issueService.getIssueById(projectId, issueId),
    enabled: !!projectId && !!issueId,
  });
};

export const useParentOptions = (
  projectId: string,
  params?: { type?: string; search?: string },
) => {
  return useQuery({
    queryKey: ["parent-options", projectId, params],
    queryFn: () =>
      issueService.getParentOptions(projectId, {
        type: params?.type || "",
        search: params?.search,
      }),
    enabled: !!projectId && !!params?.type,
  });
};

export const useChildOptions = (
  projectId: string,
  params?: { parentType?: string; search?: string },
) => {
  return useQuery({
    queryKey: ["child-options", projectId, params],
    queryFn: () => issueService.getChildOptions(projectId, params),
    enabled: !!projectId,
  });
};

export const useIssueChildren = (projectId: string, issueId: string) => {
  return useQuery({
    queryKey: ["issues", projectId, issueId, "children"],
    queryFn: () => issueService.getIssueChildren(projectId, issueId),
    enabled: !!projectId && !!issueId,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateIssueRequest;
    }) => issueService.createIssue(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.projectId],
      });
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      issueId,
      data,
    }: {
      projectId: string;
      issueId: string;
      data: import("@/types/issue.types").UpdateIssueRequest;
    }) => issueService.updateIssue(projectId, issueId, data),
    onMutate: async ({ projectId, issueId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["issues", projectId] });
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["issues", projectId],
      });

      queryClient.setQueriesData(
        { queryKey: ["issues", projectId] },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          const oldObj = old as Record<string, unknown>;

          // Case 1: Paginated response { data: { data: Issue[] } }
          if (
            oldObj.data &&
            typeof oldObj.data === "object" &&
            Array.isArray((oldObj.data as Record<string, unknown>).data)
          ) {
            const innerData = oldObj.data as Record<string, unknown>;
            return {
              ...oldObj,
              data: {
                ...innerData,
                data: (innerData.data as Issue[]).map((i) =>
                  i.id === issueId ? { ...i, ...data } : i,
                ),
              },
            };
          }

          // Case 2: Single issue response { data: Issue }
          if (
            oldObj.data &&
            typeof oldObj.data === "object" &&
            (oldObj.data as Record<string, unknown>).id === issueId
          ) {
            return {
              ...oldObj,
              data: {
                ...(oldObj.data as Record<string, unknown>),
                ...data,
              },
            };
          }

          return old;
        },
      );

      return { previousQueries };
    },
    onError: (err, newIssue, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["issue-activities", variables.issueId],
      });
    },
  });
};

export const useIssueActivities = (issueId: string) => {
  return useQuery<IssueActivity[]>({
    queryKey: ["issue-activities", issueId],
    queryFn: async () => {
      const res = await issueService.getIssueActivities(issueId);
      return res.data || [];
    },
    enabled: !!issueId,
  });
};

export const useIssueComments = (issueId: string) => {
  return useQuery<IssueComment[]>({
    queryKey: ["issue-comments", issueId],
    queryFn: async () => {
      const res = await issueService.getIssueComments(issueId);
      return res.data || [];
    },
    enabled: !!issueId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      issueId,
      body,
    }: {
      issueId: string;
      body: string;
    }) => {
      return issueService.addComment(issueId, body);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issue-comments", variables.issueId],
      });
      queryClient.invalidateQueries({
        queryKey: ["issue-activities", variables.issueId],
      });
    },
  });
};

export const useLinkIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      issueId,
      targetIssueId,
      type,
    }: {
      projectId?: string;
      issueId: string;
      targetIssueId: string;
      type: string;
    }) => issueService.createLink(issueId, targetIssueId, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["issues", variables.projectId],
        });
      }
    },
  });
};

export const useUnlinkIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      issueId,
      targetIssueId,
    }: {
      projectId?: string;
      issueId: string;
      targetIssueId: string;
    }) => issueService.removeLink(issueId, targetIssueId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["issues", variables.projectId],
        });
      }
    },
  });
};
