"use client";
import {
  CalendarBlankIcon,
  DotsThreeIcon,
  CheckSquareIcon,
  ArrowElbowDownRightIcon,
  BugIcon,
  StackIcon,
  ChecksIcon,
} from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { myTasks } from "./mock-data";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { Badge } from "@/components/ui/data-display/badge";
import { isToday, isOverdue, formatDueDate } from "@/utils/date";

export function MyTasksList({ activeTab }: { activeTab: string }) {
  const [tasks] = useState(myTasks);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "due_today") return isToday(task.dueDate);
    if (activeTab === "overdue") return isOverdue(task.dueDate);
    if (activeTab === "no_due_date") return !task.dueDate;
    return true;
  });

  const renderTaskRow = (task: (typeof tasks)[0]) => (
    <TableRow key={task.id} className="group cursor-pointer">
      {/* Task Key */}
      <TableCell className="align-middle px-4">
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          {task.id}
        </span>
      </TableCell>

      {/* Type */}
      <TableCell className="hidden sm:table-cell align-middle">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {task.type === "Task" && (
            <CheckSquareIcon className="w-3.5 h-3.5 text-blue-500" />
          )}
          {task.type === "Subtask" && (
            <ArrowElbowDownRightIcon className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          {task.type === "Bug" && (
            <BugIcon className="w-3.5 h-3.5 text-red-500" />
          )}
          {task.type === "Epic" && (
            <StackIcon className="w-3.5 h-3.5 text-purple-500" />
          )}
          <span className="text-[12px] font-medium">{task.type}</span>
        </div>
      </TableCell>

      {/* Task Name */}
      <TableCell className="align-middle transition-colors">
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "text-[13.5px] font-medium text-foreground tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-1",
              task.isCompleted &&
                "line-through text-muted-foreground group-hover:text-slate-500",
            )}
          >
            {task.title}
          </span>
          {/* Mobile inline info */}
          <div className="md:hidden flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className={cn("w-1.5 h-1.5 rounded-full", task.projectColor)}
              />
              <span className="text-[11.5px] text-muted-foreground">
                {task.project}
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
      <TableCell className="hidden md:table-cell align-middle">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-sm shadow-sm",
              task.projectColor,
            )}
          />
          <span className="text-[12.5px] text-muted-foreground font-medium">
            {task.project}
          </span>
        </div>
      </TableCell>

      {/* Due Date */}
      <TableCell className="hidden sm:table-cell align-middle">
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
      <TableCell className="hidden lg:table-cell align-middle">
        <Badge
          variant={
            task.priority === "Urgent"
              ? "red"
              : task.priority === "High"
                ? "orange"
                : task.priority === "Medium"
                  ? "blue"
                  : "slate"
          }
        >
          {task.priority}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right align-middle pr-4">
        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/60 transition-all opacity-0 group-hover:opacity-100">
          <DotsThreeIcon className="w-4 h-4" />
        </button>
      </TableCell>
    </TableRow>
  );

  const activeTasks = filteredTasks.filter((t) => !t.isCompleted);
  const doneTasks = filteredTasks.filter((t) => t.isCompleted);

  const renderTable = (taskList: typeof tasks, title: string) => {
    if (taskList.length === 0) return null;
    return (
      <div className="mb-8 last:mb-0">
        <h3 className="text-[14px] font-bold text-foreground capitalize mb-3 flex items-center gap-2">
          {title === "Done" ? (
            <CheckSquareIcon className="w-4 h-4 text-emerald-500" />
          ) : (
            <ChecksIcon className="w-4 h-4 text-blue-500" />
          )}
          {title}{" "}
          <span className="text-muted-foreground font-medium text-[12px] ml-1">
            ({taskList.length})
          </span>
        </h3>
        <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col w-full">
          <div className="flex-1 p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25 px-4">Key</TableHead>
                  <TableHead className="w-30 hidden sm:table-cell">
                    Type
                  </TableHead>
                  <TableHead>Task name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Project
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Due date
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="w-12 text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskList.map((task) => renderTaskRow(task))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {renderTable(activeTasks, "Active Tasks")}
      {renderTable(doneTasks, "Done")}

      {filteredTasks.length === 0 && (
        <div className="px-5 py-12 text-center text-muted-foreground font-medium text-[13px] border-t bg-card border border-border/60 rounded-lg shadow-sm">
          No tasks found in this view.
        </div>
      )}
    </div>
  );
}
