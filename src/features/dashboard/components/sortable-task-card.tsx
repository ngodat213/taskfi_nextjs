import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./task-card";
import { Issue } from "@/types/issue.types";

export function SortableTaskCard({
  issue,
  isMobile,
}: {
  issue: Issue;
  isMobile: boolean;
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
      <TaskCard issue={issue} />
    </div>
  );
}
