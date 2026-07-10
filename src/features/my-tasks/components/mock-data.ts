export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "Todo" | "In Progress" | "In Review" | "Done";
export type TaskType = "Task" | "Subtask" | "Bug" | "Epic";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  project: string;
  projectColor: string;
  dueDate: string | null;
  status: Status;
  priority: Priority;
  isCompleted: boolean;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 5);

export const myTasks: Task[] = [
  {
    id: "TSK-01",
    type: "Task",
    title: "Design new landing page for Q3 campaign",
    project: "Mebieco",
    projectColor: "bg-blue-500",
    dueDate: today.toISOString(),
    status: "Todo",
    priority: "High",
    isCompleted: false,
  },
  {
    id: "TSK-02",
    type: "Subtask",
    title: "Fix navigation bug on mobile devices",
    project: "Mebieco",
    projectColor: "bg-blue-500",
    dueDate: today.toISOString(),
    status: "In Progress",
    priority: "Urgent",
    isCompleted: false,
  },
  {
    id: "TSK-03",
    type: "Bug",
    title: "Write documentation for new API endpoints",
    project: "Internal Tools",
    projectColor: "bg-emerald-500",
    dueDate: tomorrow.toISOString(),
    status: "Todo",
    priority: "Medium",
    isCompleted: true,
  },
  {
    id: "TSK-04",
    type: "Task",
    title: "Review Q2 performance metrics with team",
    project: "Taskfi Auth",
    projectColor: "bg-purple-500",
    dueDate: nextWeek.toISOString(),
    status: "Done",
    priority: "Low",
    isCompleted: true,
  },
  {
    id: "TSK-05",
    type: "Task",
    title: "Update team presentation slides",
    project: "Marketing",
    projectColor: "bg-orange-500",
    dueDate: yesterday.toISOString(),
    status: "Todo",
    priority: "Low",
    isCompleted: false,
  },
  {
    id: "TSK-06",
    type: "Epic",
    title: "Setup CI/CD pipeline",
    project: "Infrastructure",
    projectColor: "bg-slate-500",
    dueDate: null,
    status: "Todo",
    priority: "Medium",
    isCompleted: false,
  },
];
