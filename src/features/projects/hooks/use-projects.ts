import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { CreateProjectRequest } from "@/types/project.types";
import { PaginationParams } from "@/types/api.types";

export function useProjects(groupId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: ["projects", groupId, params],
    queryFn: () => projectService.getProjects(groupId, params),
    enabled: !!groupId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateProjectRequest;
    }) => projectService.createProject(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
}
