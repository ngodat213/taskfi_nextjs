import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { retroService } from "@/services/retro.service";
import {
  CreateRetroSessionRequest,
  UpdateRetroSessionRequest,
  CreateRetroItemRequest,
  UpdateRetroItemRequest,
} from "@/types/retro.types";

export const useRetroSessions = (projectId: string, sprintId?: string) => {
  return useQuery({
    queryKey: ["retros", projectId, sprintId],
    queryFn: () => retroService.getRetroSessions(projectId, sprintId),
    enabled: Boolean(projectId),
  });
};

export const useCreateRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateRetroSessionRequest;
    }) => retroService.createRetroSession(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retros", variables.projectId],
      });
    },
  });
};

export const useRetroSessionDetail = (sessionId: string) => {
  return useQuery({
    queryKey: ["retroDetail", sessionId],
    queryFn: () => retroService.getRetroSessionDetail(sessionId),
    enabled: Boolean(sessionId),
  });
};

export const useUpdateRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: UpdateRetroSessionRequest;
    }) => retroService.updateRetroSession(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroDetail", variables.sessionId],
      });
    },
  });
};

export const useCreateRetroItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: CreateRetroItemRequest;
    }) => retroService.createRetroItem(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroDetail", variables.sessionId],
      });
    },
  });
};

export const useUpdateRetroItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      sessionId: string;
      itemId: string;
      data: UpdateRetroItemRequest;
    }) => retroService.updateRetroItem(itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroDetail", variables.sessionId],
      });
    },
  });
};

export const useDeleteRetroItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
    }: {
      sessionId: string;
      itemId: string;
    }) => retroService.deleteRetroItem(itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroDetail", variables.sessionId],
      });
    },
  });
};

export const useToggleRetroVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
    }: {
      sessionId: string;
      itemId: string;
    }) => retroService.toggleVote(itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroDetail", variables.sessionId],
      });
    },
  });
};

export const useRetroComments = (itemId: string) => {
  return useQuery({
    queryKey: ["retroComments", itemId],
    queryFn: () => retroService.getRetroComments(itemId),
    enabled: Boolean(itemId),
  });
};

export const useAddRetroComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, content }: { itemId: string; content: string }) =>
      retroService.addRetroComment(itemId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retroComments", variables.itemId],
      });
    },
  });
};
