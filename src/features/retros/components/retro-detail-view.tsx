"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";
import { motion, type Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/data-display/badge";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { AiChatSidebar } from "@/features/issue-detail/components/ai-chat-sidebar";
import {
  RetroItem,
  getRetroTags,
  RetroItemResponseDto,
} from "@/types/retro.types";
import {
  useRetroSessions,
  useRetroSessionDetail,
  useUpdateRetroItem,
} from "@/features/retros/hooks/use-retros";
import { RetroTagSelector } from "./retro-tag-selector";
import { RetroMainContent } from "./retro-main-content";
import { RetroSidebarStatus } from "./retro-sidebar-status";
import { mapDtoToRetroItem } from "@/features/retros/utils/retro.utils";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigation.store";

interface RetroDetailViewProps {
  retroId?: string;
  projectId?: string;
  onClose?: () => void;
}

const mainContentVariants: Variants = {
  hidden: { opacity: 0, x: 20, scale: 0.985 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 28,
    },
  },
};

export function RetroDetailView({
  retroId = "",
  projectId,
  onClose,
}: RetroDetailViewProps) {
  const updateItem = useUpdateRetroItem();

  const { data: retroSessionsRes, isLoading: isLoadingSessions } =
    useRetroSessions(projectId || "");
  const realSessions = retroSessionsRes?.data || [];
  const activeSession = realSessions.length > 0 ? realSessions[0] : null;

  const { data: sessionDetailRes, isLoading: isLoadingDetail } =
    useRetroSessionDetail(activeSession?.id || "");

  const apiItem = useMemo<RetroItem | null>(() => {
    if (sessionDetailRes?.data && retroId) {
      const detail = sessionDetailRes.data;
      const allDtos: RetroItemResponseDto[] = [
        ...detail.items.wentWell,
        ...detail.items.toImprove,
        ...detail.items.actionItem,
      ];
      const foundDto = allDtos.find((i) => i.id === retroId);
      if (foundDto) {
        return mapDtoToRetroItem(foundDto);
      }
    }
    return null;
  }, [sessionDetailRes, retroId]);

  const [title, setTitle] = useState(apiItem?.title || "");
  const [prevTitle, setPrevTitle] = useState(apiItem?.title);
  if (apiItem?.title !== prevTitle) {
    setPrevTitle(apiItem?.title);
    setTitle(apiItem?.title || "");
  }

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = "auto";
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  const pathname = usePathname();
  const pushNav = useNavigationStore((state) => state.push);
  const popNav = useNavigationStore((state) => state.pop);

  useEffect(() => {
    if (apiItem && activeSession) {
      pushNav({
        name: apiItem.title,
        description: `${activeSession.sprintName} • Retrospective`,
        backLink: pathname || "/dashboard",
      });
    }

    return () => {
      popNav();
    };
  }, [apiItem, activeSession, pathname, pushNav, popNav]);

  const debouncedTitle = useDebounce(title, 600);
  const lastSavedTitleRef = useRef(apiItem?.title || "");

  useEffect(() => {
    if (apiItem?.title && apiItem.title !== lastSavedTitleRef.current) {
      lastSavedTitleRef.current = apiItem.title;
    }
  }, [apiItem?.title]);

  useEffect(() => {
    const trimmedTitle = debouncedTitle.trim();
    if (trimmedTitle && trimmedTitle !== lastSavedTitleRef.current && apiItem && activeSession) {
      lastSavedTitleRef.current = trimmedTitle;
      updateItem.mutate({
        sessionId: activeSession.id,
        itemId: apiItem.id,
        data: { title: trimmedTitle },
      });
    }
  }, [debouncedTitle, apiItem, activeSession, updateItem]);

  const isLoading = isLoadingSessions || isLoadingDetail;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full min-h-100 text-muted-foreground bg-transparent">
          Loading retrospective details...
        </div>
      </PageContainer>
    );
  }

  if (!apiItem || !activeSession) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-full min-h-100 text-muted-foreground gap-4 bg-transparent">
          <div>Retro note not found.</div>
          {onClose && (
            <Button variant={ButtonVariant.Outline} onClick={onClose}>
              Back
            </Button>
          )}
        </div>
      </PageContainer>
    );
  }

  const itemState = apiItem;
  const targetSession = {
    sprintId: activeSession.id,
    sprintName: activeSession.sprintName,
    date: new Date(activeSession.date).toLocaleDateString("vi-VN"),
    sentimentScore: activeSession.sentimentScore,
    totalPointsCompleted: activeSession.totalPointsCompleted,
    totalPointsPlanned: activeSession.totalPointsPlanned,
    items: [],
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleTitleBlur = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== lastSavedTitleRef.current && apiItem && activeSession) {
      lastSavedTitleRef.current = trimmedTitle;
      updateItem.mutate({
        sessionId: activeSession.id,
        itemId: apiItem.id,
        data: { title: trimmedTitle },
      });
    } else if (!trimmedTitle) {
      setTitle(itemState.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      titleTextareaRef.current?.blur();
    }
  };

  const currentTags = getRetroTags(itemState);

  const handleAddTag = (newTag: string) => {
    if (currentTags.includes(newTag)) return;
    const updated = [...currentTags, newTag];
    updateItem.mutate({
      sessionId: targetSession.sprintId,
      itemId: itemState.id,
      data: { tags: updated },
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = currentTags.filter((t) => t !== tagToRemove);
    updateItem.mutate({
      sessionId: targetSession.sprintId,
      itemId: itemState.id,
      data: { tags: updated.length > 0 ? updated : ["General"] },
    });
  };

  const handleToggleComplete = () => {
    updateItem.mutate({
      sessionId: targetSession.sprintId,
      itemId: itemState.id,
      data: { completed: !itemState.completed },
    });
  };

  const isWentWell = itemState.category === "went_well";
  const isToImprove = itemState.category === "to_improve";
  const isActionItem = itemState.category === "action_item";

  const categoryLabel = isWentWell
    ? "Went Well 🎉"
    : isToImprove
      ? "To Improve 💡"
      : "Action Item ⚡";

  const categoryBadgeVariant: "emerald" | "amber" | "blue" = isWentWell
    ? "emerald"
    : isToImprove
      ? "amber"
      : "blue";

  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row h-full bg-transparent w-full animate-in fade-in duration-200 overflow-hidden">
        {/* Left AI Chat Sidebar */}
        <AiChatSidebar />

        {/* Right Main Content Area */}
        <motion.div
          variants={mainContentVariants}
          initial="hidden"
          animate="show"
          className="flex-1 h-full py-6 pl-6 pr-0 lg:py-8 lg:pl-6 lg:pr-0 bg-transparent overflow-hidden flex flex-col"
        >
          <div className="flex flex-col gap-6 w-full h-full">
            <div className="w-full h-full bg-card/60 backdrop-blur-md rounded-l-xl border border-border/50 flex flex-col overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto custom-scrollbar flex-1">
                {/* Title Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium flex-wrap">
                      <RetroTagSelector
                        tags={currentTags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                      />

                      <span>•</span>
                      <div className="inline-flex items-center gap-1.5 bg-muted/60 text-foreground px-2.5 py-0.5 rounded-md border border-border/60 text-xs font-semibold">
                        <CalendarBlank className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{targetSession.sprintName}</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          ({targetSession.date})
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={categoryBadgeVariant}
                      className="text-xs px-2.5 py-0.5"
                    >
                      {categoryLabel}
                    </Badge>
                  </div>

                  <textarea
                    ref={titleTextareaRef}
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    rows={1}
                    className="w-full text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug bg-transparent border-none outline-none resize-none overflow-hidden p-0 m-0 focus:ring-0 rounded focus:bg-muted/30 transition-colors"
                    spellCheck={false}
                    placeholder="Enter retrospective title..."
                  />

                  {/* Metadata below Title */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Avatar
                        src={itemState.authorAvatar}
                        alt={itemState.authorName}
                        size="sm"
                        className="w-4 h-4 shrink-0"
                      />
                      <span>{itemState.authorName}</span>
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <CalendarBlank className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{itemState.createdAt}</span>
                    </div>

                    {itemState.assigneeName && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <span className="text-muted-foreground font-normal">
                            Người thực thi:
                          </span>
                          <Avatar
                            src={itemState.assigneeAvatar}
                            alt={itemState.assigneeName}
                            size="sm"
                            className="w-4 h-4 shrink-0"
                          />
                          <span>{itemState.assigneeName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Main Grid */}
                <div
                  className={cn(
                    "grid grid-cols-1 gap-6 w-full",
                    isActionItem && "xl:grid-cols-[1fr_300px]",
                  )}
                >
                  <RetroMainContent
                    item={itemState}
                    sessionId={targetSession.sprintId}
                  />

                  {isActionItem && (
                    <RetroSidebarStatus
                      completed={Boolean(itemState.completed)}
                      onToggleComplete={handleToggleComplete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
