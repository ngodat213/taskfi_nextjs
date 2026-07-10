import {
  LayoutGrid,
  ListTodo,
  FileText,
  BarChart2,
  Users,
  Archive,
  History,
  Network,
  CheckCircle2,
} from "lucide-react";

export type Issue = {
  id: string;
  summary: string;
  type: string;
  priority: string;
  assignee: string;
  children?: Issue[];
  status?: string;
};

// Mock Kanban data
export const columns: {
  id: string;
  title: string;
  count: number;
  issues: Issue[];
}[] = [
  {
    id: "todo",
    title: "To Do",
    count: 53,
    issues: [
      {
        id: "MBECO-100",
        summary: "[EPIC] Nâng cấp hệ thống Camera AI",
        type: "epic",
        priority: "High",
        assignee: "TN",
        children: [
          {
            id: "MBECO-282",
            summary:
              "[QC] Kiểm thử hồi quy chức năng theo dõi trực tiếp camera",
            type: "story",
            priority: "Medium",
            assignee: "SL",
            children: [
              {
                id: "MBECO-286",
                summary: "[BE] Add related cameras for details response",
                type: "task",
                priority: "Medium",
                assignee: "TN",
                children: [
                  {
                    id: "MBECO-286-1",
                    summary: "Update database schema for camera relations",
                    type: "subtask",
                    priority: "High",
                    assignee: "TN",
                  },
                  {
                    id: "MBECO-286-2",
                    summary: "Write unit tests for details API",
                    type: "subtask",
                    priority: "Medium",
                    assignee: "TN",
                  },
                ],
              },
              {
                id: "MBECO-280",
                summary:
                  "[09/07/2026] [Portal] Không thể xem Playback sau khi thu",
                type: "bug",
                priority: "Critical",
                assignee: "TV",
                children: [
                  {
                    id: "MBECO-280-1",
                    summary: "Điều tra log API Playback",
                    type: "subtask",
                    priority: "High",
                    assignee: "TV",
                  },
                  {
                    id: "MBECO-280-2",
                    summary: "Fix lỗi timeout kết nối",
                    type: "subtask",
                    priority: "Critical",
                    assignee: "TV",
                  },
                ],
              },
            ],
          },
          {
            id: "MBECO-290",
            summary: "Thiết kế UI/UX cho module AI",
            type: "story",
            priority: "Medium",
            assignee: "TH",
            children: [
              {
                id: "MBECO-290-1",
                summary: "Lên wireframe",
                type: "task",
                priority: "Medium",
                assignee: "TH",
              },
            ],
          },
        ],
      },
      {
        id: "MBECO-283",
        summary: "Lịch sử cảnh báo bờ ao",
        type: "task",
        priority: "Medium",
        assignee: "TN",
      },
      {
        id: "MBECO-281",
        summary: "Thêm thông tin ngày nuôi - thức ăn",
        type: "task",
        priority: "Medium",
        assignee: "TV",
      },
      {
        id: "MBECO-279",
        summary:
          "[09/07/2026] [Portal/ Portal mobile DEV ] Lỗi không search tên vụ nuôi thành công...",
        type: "bug",
        priority: "Medium",
        assignee: "SL",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    count: 24,
    issues: [
      {
        id: "MBECO-200",
        summary: "[EPIC] Quản lý Kho",
        type: "epic",
        priority: "Medium",
        assignee: "SL",
        children: [
          {
            id: "MBECO-260",
            summary:
              "[BE] Adjust export receipt warehouse according to the new template.",
            type: "task",
            priority: "Medium",
            assignee: "SL",
            children: [
              {
                id: "MBECO-260-1",
                summary: "Tạo template mới PDF",
                type: "subtask",
                priority: "Medium",
                assignee: "SL",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    count: 16,
    issues: [
      {
        id: "MBECO-273",
        summary: "[APP] - Áp dụng liquid glass cho chế độ giám sát",
        type: "task",
        priority: "Medium",
        assignee: "TN",
      },
      {
        id: "MBECO-241",
        summary: "[BE] Add pause/resume device schedule APIs and logic",
        type: "task",
        priority: "High",
        assignee: "SL",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    count: 191,
    issues: [
      {
        id: "MBECO-276",
        summary: "Viết testcase cho Portal Web",
        type: "subtask",
        priority: "Medium",
        assignee: "TH",
      },
      {
        id: "MBECO-265",
        summary:
          "[BE] Refactor Validation Error Messages and Add Max/Min Limit Check for Sensor...",
        type: "task",
        priority: "Medium",
        assignee: "SL",
      },
      {
        id: "MBECO-261",
        summary: "Cập nhật Testcase, Retest biểu đồ TSMT",
        type: "subtask",
        priority: "Medium",
        assignee: "TH",
      },
    ],
  },
];

export const tabs = [
  { label: "Board", icon: LayoutGrid, active: true },
  { label: "Backlog", icon: ListTodo, active: false },
  { label: "Issues", icon: FileText, active: false },
  { label: "Done", icon: CheckCircle2, active: false },
  { label: "Reports", icon: BarChart2, active: false },
  { label: "Workload", icon: Users, active: false },
  { label: "Retros", icon: History, active: false },
  { label: "Deps", icon: Network, active: false },
  { label: "Archived", icon: Archive, active: false },
];
