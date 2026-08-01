"use client";

import { useMemo } from "react";

import {
  DEFAULT_SENTIMENT_SCORE,
  DEFAULT_SPRINT_ID,
  DEFAULT_SPRINT_NAME,
  HEX_OBJECT_ID_REGEX,
  SPRINT_PREFIX_REGEX,
} from "@/features/retros/constants/retro.constants";
import {
  useCreateRetroItem,
  useCreateRetroSession,
  useRetroSessionDetail,
  useRetroSessions,
  useToggleRetroVote,
  useUpdateRetroItem,
} from "@/features/retros/hooks/use-retros";
import {
  filterRetroItems,
  groupRetroItemsByCategory,
  mapDtoToRetroItem,
} from "@/features/retros/utils/retro.utils";
import {
  RetroCategory,
  RetroItem,
  mapFrontendCategoryToBackend,
} from "@/types/retro.types";

interface UseDashboardRetrosParams {
  projectId?: string;
  selectedSprint?: string;
  searchQuery?: string;
}

export function useDashboardRetros({
  projectId,
  selectedSprint = DEFAULT_SPRINT_ID,
  searchQuery = "",
}: UseDashboardRetrosParams = {}) {
  const { data: retroSessionsRes } = useRetroSessions(projectId || "");
  const realSessions = retroSessionsRes?.data || [];
  const activeSession = realSessions.length > 0 ? realSessions[0] : null;

  const { data: sessionDetailRes } = useRetroSessionDetail(
    activeSession?.id || "",
  );

  const createSessionMutation = useCreateRetroSession();
  const toggleVoteMutation = useToggleRetroVote();
  const createItemMutation = useCreateRetroItem();
  const updateItemMutation = useUpdateRetroItem();

  const currentSession = useMemo(() => {
    if (activeSession && sessionDetailRes?.data) {
      const detail = sessionDetailRes.data;
      const allItems: RetroItem[] = [
        ...detail.items.wentWell.map(mapDtoToRetroItem),
        ...detail.items.toImprove.map(mapDtoToRetroItem),
        ...detail.items.actionItem.map(mapDtoToRetroItem),
      ];

      return {
        sprintId: activeSession.sprintId,
        sprintName: activeSession.sprintName,
        date: new Date(activeSession.date).toLocaleDateString("vi-VN"),
        sentimentScore: activeSession.sentimentScore,
        totalPointsCompleted: activeSession.totalPointsCompleted,
        totalPointsPlanned: activeSession.totalPointsPlanned,
        items: allItems,
      };
    }

    return {
      sprintId: selectedSprint || DEFAULT_SPRINT_ID,
      sprintName: selectedSprint || DEFAULT_SPRINT_NAME,
      date: "Hiện tại",
      sentimentScore: DEFAULT_SENTIMENT_SCORE,
      totalPointsCompleted: 0,
      totalPointsPlanned: 0,
      items: [],
    };
  }, [activeSession, sessionDetailRes, selectedSprint]);

  const handleVote = (itemId: string) => {
    if (activeSession?.id) {
      toggleVoteMutation.mutate({ sessionId: activeSession.id, itemId });
    }
  };

  const handleToggleComplete = (itemId: string) => {
    if (activeSession?.id) {
      const targetItem = currentSession.items.find((i) => i.id === itemId);
      if (targetItem) {
        updateItemMutation.mutate({
          sessionId: activeSession.id,
          itemId,
          data: { completed: !targetItem.completed },
        });
      }
    }
  };

  const handleAddNote = async (
    note: Omit<
      RetroItem,
      "id" | "authorName" | "authorAvatar" | "votes" | "createdAt"
    >,
  ) => {
    let targetSessionId = activeSession?.id;

    if (!targetSessionId && projectId) {
      try {
        const isValidHexObjectId = HEX_OBJECT_ID_REGEX.test(selectedSprint);
        const formattedSprintName = selectedSprint.replace(
          SPRINT_PREFIX_REGEX,
          "Sprint ",
        );

        const createdSession = await createSessionMutation.mutateAsync({
          projectId,
          data: {
            sprintId: isValidHexObjectId ? selectedSprint : undefined,
            sprintName: formattedSprintName.startsWith("Sprint")
              ? formattedSprintName
              : `Sprint ${formattedSprintName}`,
          },
        });
        targetSessionId = createdSession?.data?.id;
      } catch (error) {
        console.error("Failed to auto-create retro session", error);
      }
    }

    if (targetSessionId) {
      createItemMutation.mutate({
        sessionId: targetSessionId,
        data: {
          category: mapFrontendCategoryToBackend(note.category),
          title: note.title,
          description: note.description,
          tags: note.tag ? [note.tag] : [],
        },
      });
    }
  };

  const filteredItems = useMemo(() => {
    return filterRetroItems(currentSession.items, searchQuery);
  }, [currentSession.items, searchQuery]);

  const itemsByCategory = useMemo(() => {
    const categories: RetroCategory[] = [
      "went_well",
      "to_improve",
      "action_item",
    ];
    return groupRetroItemsByCategory(filteredItems, categories);
  }, [filteredItems]);

  return {
    currentSession,
    itemsByCategory,
    handleVote,
    handleToggleComplete,
    handleAddNote,
  };
}
