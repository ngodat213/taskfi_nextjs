# 🚀 TaskFi - Modern Project Management & Task Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![i18n](https://img.shields.io/badge/next--intl-Multilingual-emerald?style=for-the-badge)](https://next-intl-docs.vercel.app/)

> **TaskFi** là một hệ thống ứng dụng web quản lý dự án và công việc cao cấp thế hệ mới, tích hợp công nghệ **Next.js 15 App Router**, giao diện **Glassmorphism & Pill UI**, hệ thống bộ lọc nâng cao, quản lý tài liệu và lịch trình thời gian thực.

---

## 📋 Mục Lục (Table of Contents)

1. [Tổng Quan Sản Phẩm (Overview)](#-tổng-quan-sản-phẩm-overview)
2. [Chi Tiết Các Tính Năng Độc Quyền (Detailed Features)](#-chi-tiết-các-tính-năng-độc-quyền-detailed-features)
   - [🎨 Design System & Theme Engine](#1-design-system--theme-engine-pill-ui--glassmorphism)
   - [📊 Dashboard & Kanban Board](#2-dashboard--kanban-board-management)
   - [📅 Calendar & Timetable Grid System](#3-calendar--timetable-grid-system)
   - [📚 Documents & Knowledge Hub](#4-documents--knowledge-hub)
   - [🧩 Subtasks & AI Assistant Sidebar](#5-subtasks--ai-assistant-sidebar)
   - [🏢 Workspace & Organization Management](#6-workspace--organization-management)
3. [Kiến Trúc Thư Mục & Mã Nguồn (Project Architecture)](#-kiến-trúc-thư-mục--mã-nguồn-project-architecture)
4. [Hệ Thống Linh Kiện UI (Component Design System Specs)](#-hệ-thống-linh-kiện-ui-component-design-system-specs)
5. [Quản Lý Trạng Thái (State Management Architecture)](#-quản-lý-trạng-thái-state-management-architecture)
6. [Tích Hợp API & Dịch Vụ (API & Service Integration)](#-tích-hợp-api--dịch-vụ-api--service-integration)
7. [Hướng Dẫn Cài Đặt & Phát Triển (Getting Started)](#-hướng-dẫn-cài-đặt--phát-triển-getting-started)
8. [Quy Chuẩn Viết Code (Clean Code & Guidelines)](#-quy-chuẩn-viết-code-clean-code--guidelines)

---

## 💡 Tổng Quan Sản Phẩm (Overview)

TaskFi được thiết kế hướng tới tối ưu hóa trải nghiệm người dùng (UX) và hiệu năng hiển thị 60fps mịn màng. Sản phẩm giải quyết các thách thức trong quản lý dự án bằng cách kết hợp:

- **Giao diện hiện đại & Bộ nhận diện thị giác đỉnh cao**: Ứng dụng nguyên lý bo tròn viên thuốc (Pill UI), hiệu ứng phát sáng mờ Glassmorphism ambient glow, cùng bảng màu Dark/Light Mode chuẩn chỉnh.
- **Tốc độ phản hồi cực nhanh**: Sử dụng Zustand cho quản lý trạng thái local/global và tối ưu hóa re-render thông qua các Sub-Components tách biệt.
- **Đa ngôn ngữ & Chuẩn SEO**: Tích hợp `next-intl` hoàn chỉnh với các đường dẫn động locale.

---

## 🔥 Chi Tiết Các Tính Năng Độc Quyền (Detailed Features)

### 🎨 1. Design System & Theme Engine (Pill UI + Glassmorphism)
- **Dark Mode Chuyên Sâu**:
  - **Phông nền ứng dụng (`--background`)**: `#171717` (Neutral Charcoal 900).
  - **Khung thẻ & Sidebar (`--card`, `--popover`)**: `#1C1C1C` tạo lớp phông nền tương phản nhẹ nhàng, cao cấp và chống mỏi mắt.
- **Light Mode Tinh Khiết**:
  - **Phông nền ứng dụng (`--background`)**: `#FDFDFD` trắng dịu.
  - **Khung thẻ & Sidebar (`--card`, `--popover`)**: `#F5F8F9` nổi bật độ sâu phân tầng.
- **Phong Cách Viên Thuốc (Pill Rounded Style)**:
  - Tất cả các linh kiện tương tác gồm **Button**, **Input**, **Select**, **SegmentedControl** đều mang đường cong `rounded-full` mượt mà.
- **Hiệu Ứng Nền Động (Animated Ambient Glow)**:
  - Khối phông nền `AnimatedBackground` chuyển động vô cực nhẹ nhàng với hiệu ứng blur `blur-[100px]` và hòa trộn màu `mix-blend-multiply dark:mix-blend-screen`.

---

### 📊 2. Dashboard & Kanban Board Management
- **Hai Chế Độ Hiển Thị Trực Quan**:
  - **Board View**: Bảng Kanban kéo thả công việc theo các cột trạng thái (`To Do`, `In Progress`, `In Review`, `Done`).
  - **List View**: Danh sách hiển thị dạng bảng linh hoạt, hỗ trợ phân cấp cây Subtasks con.
- **Bộ Lọc Nâng Cao (Advanced Filters)**:
  - Tìm kiếm tiêu đề/mã công việc thời gian thực.
  - Lọc theo **Assignee** (Người thực hiện), **Type** (Loại công việc), và **Priority** (Độ ưu tiên: Urgent, High, Medium, Low).
- **Thao Tác Nhanh (Quick Actions)**:
  - Nút bấm `+ New` Pill cho phép mở Modal khởi tạo công việc mới lập tức.

---

### 📅 3. Calendar & Timetable Grid System
- **Timetable Grid 24 Hours**:
  - Lưới thời gian theo giờ trong ngày, hiển thị các khối sự kiện và công việc trực quan theo thời lượng.
- **Chế Độ Agenda & Sprint View**:
  - Xem danh sách sự kiện sắp diễn ra theo timeline ngày/tuần.
  - Theo dõi tiến độ các cột mốc **Sprint Milestones**.
- **Bộ Chọn Ngày & Modal Sự Kiện**:
  - Linh kiện dialog `CalendarDatePickerDialog` chọn ngày tùy chỉnh và `CalendarEventModal` quản lý chi tiết sự kiện lịch.

---

### 📚 4. Documents & Knowledge Hub
- **Quản Lý Cấu Trúc Thư Mục & Tài Liệu**:
  - Hiển thị danh sách thư mục (`FolderCard`) và thẻ tài liệu (`DocumentCard`) theo lưới Grid.
- **Chỉ Báo Thị Giác Sắc Nét**:
  - Thẻ tài liệu kèm viền phát sáng phân loại accent color theo định dạng (`PDF`, `Doc`, `Sheet`, `Design`).
  - Hiển thị thông tin tác giả, avatar initials và thời gian cập nhật gần nhất.

---

### 🧩 5. Subtasks & AI Assistant Sidebar
- **Quản Lý Công Việc Con Phân Cấp (Subtask Hierarchy)**:
  - Cây danh sách công việc con hiển thị độ sâu (depth indent), cho phép bật/tắt mở rộng (expand/collapse) trực tiếp trên từng dòng.
- **AI Assistant Chat Sidebar**:
  - Trợ lý AI tích hợp ở góc phải hỗ trợ phân tích công việc, tóm tắt tiến độ và gợi ý giải pháp xử lý bug.

---

### 🏢 6. Workspace & Organization Management
- **Sidebar Điều Hướng Thông Minh**:
  - Nút chuyển đổi Workspace linh hoạt đính kèm logo và tên đại diện.
  - Hỗ trợ cơ chế thu gọn/mở rộng Sidebar (`isCollapsed`) mượt mà dạng Spring Animation.
  - Bảo toàn 100% 10 danh mục điều hướng chính (`Projects`, `My tasks`, `Calendar`, `Documents`, `Timeline`, `Backlog`, `Active sprints`, `Reports`, `Issues`, `Workspace settings`).
- **Thiết Lập Không Gian Làm Việc (Workspace Settings)**:
  - Quản lý danh sách thành viên (`MembersTable`), phòng ban (`DepartmentsTable`), vai trò (`RolesTable`), nhóm làm việc (`GroupsTable`) và loại hình nhân sự (`EmploymentTypesTable`).

---

## 📁 Kiến Trúc Thư Mục & Mã Nguồn (Project Architecture)

```text
taskfi_nextjs/
├── .agents/                        # Định nghĩa Agent Skills & Quy chuẩn thiết kế
├── .vscode/                        # Cấu hình IDE & Rule ẩn cảnh báo linter Tailwind
├── public/                         # Tài nguyên hình ảnh tĩnh
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [locale]/               # Các tuyến đường đa ngôn ngữ
│   │   │   ├── (dashboard)/        # Layout chính chứa Sidebar & TopNav
│   │   │   │   ├── calendar/       # Trang Calendar
│   │   │   │   ├── docs/           # Trang Documents
│   │   │   │   └── page.tsx        # Trang Dashboard chính
│   │   │   ├── login/              # Trang Đăng nhập
│   │   │   ├── register/           # Trang Đăng ký
│   │   │   ├── workspaces/         # Trang Chọn Workspace
│   │   │   └── layout.tsx          # Root Layout chuẩn Locale
│   │   └── globals.css             # Design Tokens & Cấu hình CSS Variables
│   ├── components/
│   │   ├── layout/                 # Bộ linh kiện Layout khung
│   │   │   ├── sidebar.tsx                 # Main Sidebar Container
│   │   │   ├── sidebar-workspace-header.tsx# Sub-component Header Workspace
│   │   │   ├── sidebar-action-bar.tsx      # Sub-component Nút + New & Search
│   │   │   ├── sidebar-nav-item.tsx        # Sub-component Đường dẫn Menu
│   │   │   ├── sidebar-user-footer.tsx     # Sub-component Chân trang User
│   │   │   ├── top-nav.tsx                 # Thanh Header điều hướng trên
│   │   │   ├── notifications-drawer.tsx    # Ngăn kéo Thông báo
│   │   │   └── page-container.tsx          # Khung bao bọc nội dung trang
│   │   └── ui/                     # Bộ linh kiện UI cơ bản
│   │       ├── actions/            # Button, ThemeToggle
│   │       ├── data-display/       # Avatar, Badge, EmptyState, TablePagination
│   │       ├── forms/              # Input, Select, SegmentedControl, TextEditor
│   │       └── layout/             # Modal, AnimatedBackground
│   ├── features/                   # Mô-đun tính năng nghiệp vụ độc lập
│   │   ├── auth/                   # Xử lý Xác thực & Form đăng nhập
│   │   ├── calendar/               # Linh kiện, Hooks & Mocks Lịch trình
│   │   ├── dashboard/              # Kanban Board, Issue Row, Filter Bars
│   │   ├── documents/              # Thẻ Folder, Document Card & Utilities
│   │   ├── issue-detail/           # Chi tiết Issue, Subtasks, AI Chat Sidebar
│   │   ├── projects/               # Danh sách Dự án & Card dự án
│   │   └── workspace-settings/     # Các bảng quản trị Workspace Settings
│   ├── i18n/                       # Cấu hình điều hướng đa ngôn ngữ (routing.ts)
│   ├── services/                   # Dịch vụ gọi API (issue.service.ts)
│   ├── store/                      # Zustand Stores (user, workspace, navigation)
│   ├── types/                      # Định nghĩa TypeScript Interfaces & Types
│   └── utils/                      # Hàm tiện ích (cn, date, error, string)
├── implementation-notes.md         # Nhật ký ghi chép chi tiết các quyết định mã nguồn
├── package.json
└── tsconfig.json
```

---

## 🧩 Hệ Thống Linh Kiện UI (Component Design System Specs)

### 1. `Button` (`src/components/ui/actions/button.tsx`)
```tsx
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/actions/button";

// Nút Pill mặc định
<Button variant={ButtonVariant.Pill} size={ButtonSize.Default}>
  + New Task
</Button>

// Nút hình tròn chứa Icon
<Button size={ButtonSize.Icon} variant={ButtonVariant.Outline}>
  <MagnifyingGlass className="w-4 h-4" />
</Button>
```

### 2. `SegmentedControl` (`src/components/ui/forms/segmented-control.tsx`)
```tsx
<SegmentedControl
  tabs={[
    { id: "board", label: "Board", icon: Kanban },
    { id: "list", label: "List", icon: List },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### 3. `Input` & `Select` (`src/components/ui/forms/`)
- Cung cấp dạng viên thuốc Pill `rounded-full px-3.5 h-9` đồng bộ trải nghiệm nhập liệu và chọn phần tử.

---

## 🗃️ Quản Lý Trạng Thái (State Management Architecture)

Ứng dụng sử dụng **Zustand** làm giải pháp quản lý trạng thái tập trung nhẹ nhàng và hiệu quả:

1. **`user.store.ts`**: Quản lý thông tin tài khoản người dùng đang đăng nhập và quyền hạn.
2. **`workspace.store.ts`**: Lưu trữ danh sách Workspace, Workspace active hiện tại và xử lý các hàm khởi tạo/cập nhật Workspace.
3. **`navigation.store.ts`**: Theo dõi lịch sử điều hướng (back-stack routing), phục vụ hiển thị Breadcrumb động và nút quay lại (Go Back/Forward) trên `TopNav`.

---

## 📡 Tích Hợp API & Dịch Vụ (API & Service Integration)

Các lệnh gọi API được đóng gói sạch sẽ trong thư mục `src/services/` và `src/features/*/hooks/`:

- **Client HTTP**: Đóng gói Axios client hỗ trợ tự động gắn Token xác thực, interceptor xử lý lỗi tập trung.
- **Service Layer**:
  - `issue.service.ts`: Xử lý CRUD danh sách công việc, cập nhật trạng thái kéo thả Kanban, gán người thực hiện và truy vấn công việc con (Subtasks).
- **Custom Hooks**: Sử dụng React Custom Hooks giúp bóc tách hoàn toàn logic nghiệp vụ ra khỏi linh kiện giao diện (UI Components).

---

## ⚙️ Hướng Dẫn Cài Đặt & Phát Triển (Getting Started)

### Yêu Cầu Hệ Thống (Prerequisites)
- **Node.js**: phiên bản `18.18.0` trở lên.
- **npm** (hoặc `pnpm` / `yarn`).

### Các Bước Cài Đặt Detail:

1. **Cloning Repository**:
   ```bash
   git clone https://github.com/ngodat213/taskfi_nextjs.git
   cd taskfi_nextjs
   ```

2. **Cài Đặt Packages Dependencies**:
   ```bash
   npm install
   ```

3. **Cấu Hình Môi Trường (`.env.local`)**:
   Tạo file `.env.local` tại thư mục gốc dự án:
   ```env
   NEXT_PUBLIC_API_URL=https://api.taskfi.example.com
   NEXT_PUBLIC_DEFAULT_LOCALE=en
   ```

4. **Khởi Chạy Server Phát Triển (Development Server)**:
   ```bash
   npm run dev
   ```
   Truy cập ứng dụng tại: `http://localhost:3000`.

5. **Kiểm Tra Type Checking (TypeScript)**:
   ```bash
   npx tsc --noEmit
   ```

6. **Đóng Gói Ứng Dụng (Production Build)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📐 Quy Chuẩn Viết Code (Clean Code & Guidelines)

Dự án tuân thủ nghiêm ngặt các quy tắc kiến trúc được định nghĩa tại `AGENTS.md`:

1. **Strict Types**: Không bao giờ sử dụng kiểu `any`. Định nghĩa `interface` hoặc `type` rõ ràng cho mọi Component Props và dữ liệu API.
2. **No Relative Imports**: Luôn luôn sử dụng Alias `@/` cho tất cả các import nội bộ (ví dụ: `import { Button } from "@/components/ui/actions/button"`). Không sử dụng đường dẫn tương đối dạng `../../`.
3. **Separation of Concerns**: Linh kiện UI phải "dumb" (chỉ làm nhiệm vụ hiển thị). Logic nghiệp vụ phức tạp phải được tách riêng vào Custom Hooks hoặc Services.
4. **Early Returns**: Sử dụng cơ chế trả về sớm (early return) để làm phẳng cấu trúc mã nguồn, tránh các khối `if-else` lồng nhau quá sâu.
5. **Self-closing Tags**: Luôn tự đóng thẻ đối với các Component không có children (`<SidebarNavItem />`).

---

© 2026 **TaskFi Team**. Phát triển với tinh thần đỉnh cao về trải nghiệm người dùng và mã nguồn sạch!
