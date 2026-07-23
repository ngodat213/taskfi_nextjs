# TaskFi - Next-Gen Project & Task Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-60fps-purple?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![i18n](https://img.shields.io/badge/i18n-next--intl-emerald?style=flat-square)](https://next-intl-docs.vercel.app/)

**TaskFi** là ứng dụng quản lý công việc và dự án hiện đại, mượt mà và trực quan được xây dựng trên nền tảng **Next.js 15 (App Router)**. Ứng dụng cung cấp trải nghiệm người dùng đẳng cấp với hệ thống giao diện **Glassmorphism**, hiệu ứng **Pill UI**, chế độ **Dark Mode chuyên sâu** cùng các mô hình quản lý Kanban, Timetable Calendar, Documents Hub và Workspace linh hoạt.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 🎨 1. Hệ Thống Thiết Kế Pill UI & Dark Mode Đẳng Cấp
- **Chế độ Tối (Dark Mode)**: Tùy chỉnh bảng màu tối sang trọng với phông nền `#171717` (Neutral Charcoal) và thẻ Card `#1C1C1C` phân tầng trực quan, êm mắt.
- **Chế độ Sáng (Light Mode)**: Phông nền `#FDFDFD` tinh khiết đính kèm thẻ Sidebar/Card `#F5F8F9` cao cấp.
- **Form UI Viên Thuốc (Pill Rounded)**: Tất cả nút bấm (`Button`), ô tìm kiếm (`Input`), bộ chọn tab (`SegmentedControl`) và menu rủ (`Select`) đều mang kiểu dáng bo tròn viên thuốc mềm mại (`rounded-full`).

### 📊 2. Quản Lý Dự Án & Công Việc Trực Quan (Kanban & Issues)
- Bảng Kanban tương tác kéo thả mượt mà với hiệu ứng động Framer Motion 60fps.
- Phân loại Issues theo các chuẩn (Task, Subtask, Bug, Story, Epic) cùng quản lý trạng thái, độ ưu tiên, người phụ trách và subtasks liên kết.

### 📅 3. Lịch Trình & Timetable Grid (Calendar Module)
- Bộ lịch thông minh tích hợp góc nhìn **Agenda**, **Timetable Grid** theo khung giờ sinh động và theo dõi mốc **Sprint Milestones**.
- Bộ chọn ngày (`CalendarDatePickerDialog`) và xem chi tiết sự kiện mượt mà.

### 📚 4. Trung Tâm Tài Liệu (Documents & Knowledge Hub)
- Quản lý tài liệu và thư mục dự án theo cấu trúc phân cấp trực quan.
- Thẻ Folder & Document thiết kế theo phong cách Glassmorphism với viền phát sáng ambient glow tinh tế.

### 🏢 5. Điều Hướng Workspace & Phân Quyền Vận Hành
- Sidebar điều hướng thông minh tách biệt dạng linh kiện mô-đun (`SidebarWorkspaceHeader`, `SidebarActionBar`, `SidebarNavItem`, `SidebarUserFooter`).
- Quản lý danh mục thành viên, nhóm phòng ban, vai trò và loại hình nhân sự trong Workspace Settings.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Core Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & Icons**: TailwindCSS v4, Phosphor Icons (`@phosphor-icons/react`)
- **Animation & Motion**: Framer Motion (Glassmorphism & Smooth Micro-interactions)
- **State Management**: Zustand
- **Internationalization**: `next-intl` (Hỗ trợ đa ngôn ngữ quốc tế)
- **Code Quality**: ESLint, TypeScript Strict Mode, VS Code Custom Rules

---

## 📁 Cấu Trúc Dự Án (Directory Structure)

```text
taskfi_nextjs/
├── .agents/                    # Bộ quy chuẩn thiết kế & Agent Skills
├── public/                     # Tài nguyên tĩnh (Images, SVGs)
├── src/
│   ├── app/                    # Next.js App Router (Layouts, Pages, Globals CSS)
│   ├── components/
│   │   ├── layout/             # Sidebar, TopNav, PageContainer, NotificationsDrawer
│   │   └── ui/                 # Core UI Primitives (Button, Input, Select, Badge, Avatar)
│   ├── features/               # Các mô-đun tính năng chính
│   │   ├── auth/               # Đăng nhập, đăng ký, xác thực OTP
│   │   ├── calendar/           # Lịch trình, Timetable Grid, Agenda
│   │   ├── dashboard/          # Bảng điều khiển, Kanban Board, Issues Table
│   │   ├── documents/          # Trung tâm tài liệu, Folder cards, Document list
│   │   ├── issue-detail/       # Chi tiết công việc, Subtasks, AI Chat Sidebar
│   │   ├── projects/           # Quản lý danh sách dự án
│   │   ├── workspace-settings/ # Thiết lập không gian làm việc & thành viên
│   │   └── workspaces/         # Danh sách Workspace selector
│   ├── services/               # Gọi API & Xử lý dữ liệu
│   ├── store/                  # Zustand Global Stores (user, workspace, navigation)
│   ├── types/                  # Định nghĩa TypeScript Interfaces & Enums
│   └── utils/                  # Utility Helpers (cn, date, error, string)
├── implementation-notes.md     # Nhật ký quyết định kiến trúc & thay đổi
└── package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### Yêu cầu tiên quyết:
- **Node.js**: `>= 18.18.0`
- **npm** hoặc **pnpm** / **yarn**

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Development Mode)
```bash
npm run dev
```
Trình duyệt sẽ tự động chạy ứng dụng tại địa chỉ [http://localhost:3000](http://localhost:3000).

### 3. Kiểm tra mã nguồn & Kiểm tra Kiểu TypeScript (Type Check)
```bash
npx tsc --noEmit
```

### 4. Đóng gói Sản phẩm (Production Build)
```bash
npm run build
npm run start
```

---

## 📄 Ghi Chú Phát Triển (Implementation Notes)

Mọi chi tiết thay đổi, quyết định kiến trúc, tối ưu linter và bảng màu thiết kế đều được lưu trữ minh bạch tại [implementation-notes.md](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/implementation-notes.md).

---

© 2026 **TaskFi Team**. All Rights Reserved.
