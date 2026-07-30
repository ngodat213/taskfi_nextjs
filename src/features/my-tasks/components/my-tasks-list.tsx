"use client";
import { motion, type Variants } from "framer-motion";
import {
  CheckSquareIcon,
  ChecksIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Issue } from "@/types/issue.types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/data-display/table";
import { isToday, isOverdue } from "@/utils/date";
import { MyTaskRow } from "./my-task-row";
import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";

const containerVariants: Variants = STAGGER_CONTAINER_VARIANTS;
const itemVariants: Variants = SPRING_CARD_VARIANTS;

interface MyTasksListProps {
  activeTab: string;
  tasks: Issue[];
  isLoading?: boolean;
  onTaskClick?: (task: Issue) => void;
  searchQuery?: string;
}

export function MyTasksList({
  activeTab,
  tasks = [],
  isLoading = false,
  onTaskClick,
  searchQuery = "",
}: MyTasksListProps) {
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab
    if (activeTab === "due_today" && !isToday(task.dueDate)) return false;
    if (activeTab === "overdue" && !isOverdue(task.dueDate)) return false;
    if (activeTab === "no_due_date" && task.dueDate) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = (task.summary || "").toLowerCase().includes(query);
      const matchKey = (task.issueKey || task.id || "")
        .toLowerCase()
        .includes(query);
      const matchProject = (task.project?.name || "")
        .toLowerCase()
        .includes(query);
      return matchTitle || matchKey || matchProject;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-card border border-border/60 rounded-lg shadow-sm">
        <CircleNotchIcon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeTasks = filteredTasks.filter((t) => {
    const s = (t.status || "").toLowerCase();
    return s !== "done" && s !== "completed";
  });
  const doneTasks = filteredTasks.filter((t) => {
    const s = (t.status || "").toLowerCase();
    return s === "done" || s === "completed";
  });

  const renderTable = (taskList: Issue[], title: string) => {
    if (taskList.length === 0) return null;
    return (
      <motion.div variants={itemVariants} className="mb-8 last:mb-0">
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
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28 min-w-28 max-w-28 px-4">
                    Key
                  </TableHead>
                  <TableHead className="w-28 min-w-28 max-w-28 hidden sm:table-cell">
                    Type
                  </TableHead>
                  <TableHead>Task name</TableHead>
                  <TableHead className="w-20 min-w-20 max-w-20 text-center hidden md:table-cell">
                    Project
                  </TableHead>
                  <TableHead className="w-36 min-w-36 max-w-36 hidden sm:table-cell">
                    Due date
                  </TableHead>
                  <TableHead className="w-32 min-w-32 max-w-32 hidden lg:table-cell pr-4">
                    Priority
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskList.map((task) => (
                  <MyTaskRow
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col"
    >
      {renderTable(activeTasks, "Active Tasks")}
      {renderTable(doneTasks, "Done")}

      {filteredTasks.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="px-5 py-12 text-center text-muted-foreground font-medium text-[13px] bg-card border border-border/60 rounded-lg shadow-sm"
        >
          No tasks found in this view.
        </motion.div>
      )}
    </motion.div>
  );
}
