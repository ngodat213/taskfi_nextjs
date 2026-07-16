import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueService, GetIssuesParams } from "@/services/issue.service";
import { CreateIssueRequest, Issue } from "@/types/issue.types";
import { PaginatedResponse } from "@/types/api.types";

export const useIssues = (projectId: string, params?: GetIssuesParams) => {
  return useQuery({
    queryKey: ["issues", projectId, params],
    queryFn: () => issueService.getIssuesByProject(projectId, params),
    enabled: !!projectId,
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
        (old: PaginatedResponse<Issue> | undefined) => {
          if (!old || !old.data || !old.data.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((issue: Issue) =>
                issue.id === issueId ? { ...issue, ...data } : issue,
              ),
            },
          };
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
    },
  });
};
