import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Issue } from "@/types/issue.types";

import { TaskCard } from "./task-card";

export function SortableTaskCard({
  issue,
  isMobile,
  onIssueClick,
}: {
  issue: Issue;
  isMobile: boolean;
  onIssueClick?: (issueId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={
        isMobile ? "min-w-[220px] max-w-[220px] snap-center shrink-0" : "w-full"
      }
    >
      <TaskCard issue={issue} onIssueClick={onIssueClick} />
    </div>
  );
}
