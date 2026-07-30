"use client";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";
import { Issue } from "@/types/issue.types";
import { TableRow, TableCell } from "@/components/ui/data-display/table";
import { PriorityBadge } from "@/components/ui/data-display/priority-badge";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { isToday, isOverdue, formatDueDate } from "@/utils/date";
import { ISSUE_TYPE_CONFIG } from "@/features/issues/constants/issue-ui.constants";

interface MyTaskRowProps {
  task: Issue;
  onTaskClick?: (task: Issue) => void;
}

export function MyTaskRow({ task, onTaskClick }: MyTaskRowProps) {
  const statusLower = (task.status || "").toLowerCase();
  const isCompleted = statusLower === "done" || statusLower === "completed";
  const issueKeyDisplay = task.issueKey || task.id;
  const projectName = task.project?.name || "";
  const projectLogo = task.project?.avatarUrl || task.project?.logoUrl;
  const projectFallback = task.project?.key || projectName;

  // Issue type icon resolution
  const typeKey = (task.type || "").toLowerCase().trim();
  const typeConf =
    ISSUE_TYPE_CONFIG[task.type] ||
    ISSUE_TYPE_CONFIG[typeKey] ||
    ISSUE_TYPE_CONFIG.task;
  const TypeIconComp = typeConf?.icon;

  return (
    <TableRow
      className="group cursor-pointer hover:bg-muted/60 transition-colors"
      onClick={() => onTaskClick?.(task)}
    >
      {/* Task Key */}
      <TableCell className="w-28 min-w-28 max-w-28 align-middle px-4">
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          {issueKeyDisplay}
        </span>
      </TableCell>

      {/* Type */}
      <TableCell className="w-28 min-w-28 max-w-28 hidden sm:table-cell align-middle">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {TypeIconComp && (
            <TypeIconComp className={cn("w-3.5 h-3.5", typeConf?.colorClass)} />
          )}
          <span className="text-[12px] font-medium capitalize">
            {task.type}
          </span>
        </div>
      </TableCell>

      {/* Task Name */}
      <TableCell className="align-middle transition-colors">
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "text-[13.5px] font-medium text-foreground tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-1",
              isCompleted &&
                "line-through text-muted-foreground group-hover:text-slate-500",
            )}
          >
            {task.summary}
          </span>
          {/* Mobile inline info */}
          <div className="md:hidden flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5">
              <Avatar
                src={projectLogo}
                fallback={projectFallback}
                size="sm"
                className="w-4 h-4 rounded-sm text-[8px] font-bold border border-border bg-card text-blue-500 shrink-0"
              />
              <span className="text-[11.5px] text-muted-foreground">
                {projectName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
              <CalendarBlankIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span
                className={cn(
                  isToday(task.dueDate) && "text-amber-600 font-medium",
                  isOverdue(task.dueDate) && "text-red-600 font-bold",
                )}
              >
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Project */}
      <TableCell className="w-20 min-w-20 max-w-20 hidden md:table-cell align-middle text-center">
        <div className="flex justify-center">
          <Tooltip content={projectName} position="top">
            <Avatar
              src={projectLogo}
              fallback={projectFallback}
              size="sm"
              className="w-6.5 h-6.5 rounded-md text-[10px] font-bold border border-border bg-card text-blue-500 shadow-2xs shrink-0 cursor-pointer hover:border-blue-400 transition-colors"
            />
          </Tooltip>
        </div>
      </TableCell>

      {/* Due Date */}
      <TableCell className="w-36 min-w-36 max-w-36 hidden sm:table-cell align-middle">
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <CalendarBlankIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span
            className={cn(
              isToday(task.dueDate) && "text-amber-600 font-medium",
              isOverdue(task.dueDate) && "text-red-600 font-bold",
            )}
          >
            {formatDueDate(task.dueDate)}
          </span>
        </div>
      </TableCell>

      {/* Priority */}
      <TableCell className="w-32 min-w-32 max-w-32 hidden lg:table-cell align-middle">
        <PriorityBadge priority={task.priority} />
      </TableCell>
    </TableRow>
  );
}
