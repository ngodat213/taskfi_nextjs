# Implementation Notes

## Các thay đổi và quyết định thiết kế (TaskCard & Workspace Config UI)

### 1. Hiển thị thông tin Due Date & Subtask Progress trên Task Card
- **DueDatePill**: Hiển thị Due Date của Issue với icon lịch và định dạng ngày dễ đọc (`MMM d`). Trạng thái quá hạn (`overdue`) được làm nổi bật với màu đỏ nếu issue chưa `Done`.
- **SubtaskProgressRing**: Hiển thị tỷ lệ subtask đã hoàn thành dạng hình tròn SVG (Progress Ring), chỉ xuất hiện khi issue có ít nhất 1 subtask con.

### 2. Sắp xếp lại vị trí Badge & Avatar trên Card
- Chuyển **Avatar người thực hiện (Assignee)** lên góc trên bên phải header của card.
- Chuyển **TypeBadge (với TypeIcon)** xuống footer góc dưới bên trái, ngay phía trước **PriorityBadge**.

### 3. Chuẩn hóa chiều cao & góc bo tròn Badge/Pill
- Chuẩn hóa toàn bộ `Badge`, `TypeBadge`, `PriorityBadge`, `DueDatePill`, và `SubtaskProgressRing` về cùng chiều cao `22px`, font-size `10.5px`, line-height `leading-none`, và góc bo `rounded-md` (loại bỏ hoàn toàn `rounded-full` theo yêu cầu người dùng).

### 4. Cấu trúc Breadcrumb trên Task Card
- Hiển thị đầy đủ thông tin nhiệm vụ cha và con theo định dạng: `{PARENT_KEY} › {CHILD_KEY} · {PARENT_SUMMARY}`.
- Đồng bộ hóa toàn bộ chữ trên dòng Breadcrumb cùng 1 style font size (`12.5px`), font weight (`font-semibold`), và màu sắc (`text-muted-foreground`).

### 5. Ánh xạ màu động từ API Workspace Config
- Tích hợp `getTypeOrStatusColor` để lấy màu sắc tùy chỉnh từ API Workspace Config (`useWorkspaceConfig`).
- `TypeBadge` nhận màu hex động từ API để hiển thị đúng màu chữ, nền và viền.
- Khôi phục màu đường viền của card (`TaskCard`) về màu chuẩn mặc định (`border-border/80 hover:border-primary/40`).

### 6. Cấu hình Prettier & Sắp xếp Import tự động
- Thêm plugin `@trivago/prettier-plugin-sort-imports` và cấu hình tệp `.prettierrc` để tự động nhóm và sắp xếp thứ tự các câu lệnh `import` (React -> Next -> 3rd Party -> `@/` alias -> Relative path).
