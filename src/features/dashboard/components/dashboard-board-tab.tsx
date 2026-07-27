import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { BoardColumn } from "./board-column";
import { useUpdateIssue } from "@/features/projects/hooks/use-issues";
import { TaskCard } from "./task-card";
import { Issue } from "@/types/issue.types";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useIsMobile } from "@/hooks/use-media-query";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface DashboardBoardTabProps {
  projectId: string;
  workspaceId: string;
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
  onAddClick?: (status: string) => void;
}

export function DashboardBoardTab({
  projectId,
  workspaceId,
  q,
  issues,
  isLoading,
  onIssueClick,
  onAddClick,
}: DashboardBoardTabProps) {
  const isMobile = useIsMobile();
  const { data: configResponse } = useWorkspaceConfig(workspaceId);
  const statuses = configResponse?.data?.statuses || [];

  const baseColumns =
    statuses.length > 0
      ? statuses.map((s) => ({
          id: s.name.toLowerCase(),
          title: s.name,
          color: s.color || "#94a3b8",
          count: 0,
          issues: [] as Issue[],
        }))
      : [
          {
            id: "todo",
            title: "To Do",
            color: "#94a3b8",
            count: 0,
            issues: [] as Issue[],
          },
          {
            id: "in-progress",
            title: "In Progress",
            color: "#94a3b8",
            count: 0,
            issues: [] as Issue[],
          },
          {
            id: "done",
            title: "Done",
            color: "#94a3b8",
            count: 0,
            issues: [] as Issue[],
          },
        ];

  const { mutate: updateIssue, isPending: isUpdatingIssue } = useUpdateIssue();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [localIssues, setLocalIssues] = useState<Issue[]>(issues || []);
  const [prevIssues, setPrevIssues] = useState<Issue[] | undefined>(issues);

  if (issues !== prevIssues) {
    setPrevIssues(issues);
    if (!activeId && !isUpdatingIssue) {
      setLocalIssues(issues || []);
    }
  }

  const boardColumns = baseColumns.map((col) => {
    if (localIssues && localIssues.length > 0) {
      const normalize = (s: string) =>
        (s || "").toLowerCase().replace(/[\s-]/g, "");
      const colIssues = localIssues.filter(
        (i) => normalize(i.status) === normalize(col.id || col.title),
      );
      return {
        ...col,
        count: colIssues.length,
        issues: colIssues,
      };
    }
    return col;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeIssue = localIssues.find((i) => i.id === activeId);
    if (!activeIssue) return;

    let targetStatusId = overId;
    const overIssue = localIssues.find((i) => i.id === overId);

    if (overIssue) {
      targetStatusId =
        boardColumns.find((c) => c.issues.some((i) => i.id === overId))?.id ||
        overId;
    }

    const targetColumn = boardColumns.find((c) => c.id === targetStatusId);
    if (!targetColumn) return;

    const newStatus = targetColumn.title;

    if (activeIssue.status !== newStatus) {
      setLocalIssues((prev) =>
        prev.map((i) => (i.id === activeId ? { ...i, status: newStatus } : i)),
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let targetStatusId = overId;
    const overIssue = localIssues.find((i) => i.id === overId);
    if (overIssue) {
      targetStatusId =
        boardColumns.find((c) => c.issues.some((i) => i.id === overId))?.id ||
        overId;
    }

    const targetColumn = boardColumns.find((c) => c.id === targetStatusId);
    if (!targetColumn) return;

    const newStatus = targetColumn.title;

    const originalIssue = (issues || []).find((i) => i.id === activeId);
    if (originalIssue && originalIssue.status !== newStatus) {
      updateIssue({
        projectId: projectId,
        issueId: activeId,
        data: { status: newStatus },
      });
    }
  };

  const activeIssueData = activeId
    ? localIssues.find((i) => i.id === activeId)
    : null;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <CircleNotch className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div
        className={
          isMobile
            ? "flex-1 overflow-y-auto overflow-x-hidden px-4 py-4"
            : "flex-1 overflow-x-auto overflow-y-hidden px-6 py-4"
        }
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={
            isMobile
              ? "flex flex-col gap-6 w-full pb-4"
              : "flex gap-4 h-full min-w-full w-max"
          }
        >
          {boardColumns.map((col) => (
            <motion.div
              key={col.id}
              variants={columnVariants}
              className={
                isMobile
                  ? "w-full"
                  : "flex-1 min-w-75 max-w-85 flex flex-col h-full"
              }
            >
              <BoardColumn
                col={col}
                isMobile={isMobile}
                q={q}
                onIssueClick={onIssueClick}
                onAddClick={onAddClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeIssueData ? (
          <div
            className={
              isMobile
                ? "min-w-55 max-w-55 opacity-90 shadow-2xl rotate-2"
                : "min-w-75 max-w-85 w-[320px] opacity-95 shadow-2xl scale-105 cursor-grabbing"
            }
          >
            <TaskCard issue={activeIssueData} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
