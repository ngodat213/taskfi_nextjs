# Implementation Notes

## Re-design Chuẩn High-End Cho File Card & Folder Card (`src/features/documents`)

- **Bối cảnh**: Giao diện các card File và Folder trước đó hơi đơn giản, thiếu hiệu ứng thị giác hiện đại và chưa có chiều sâu.
- **Những cải tiến đã thực hiện**:
  1. **FolderCard ([folder-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/folder-card.tsx))**:
     - **Ambient Background Radial Glow**: Thêm hiệu ứng phát sáng mờ (radial glow) theo tông màu chủ đạo của thư mục khi hover (`from-[color]/15 via-[color]/5 to-transparent`).
     - **Viền Accent Line Phía Dưới**: Thêm thanh highlight hiệu ứng màu tương ứng chạy ở đáy card khi hover.
     - **Typography & Meta Badges**: Tăng kích thước icon `FolderSimple` dạng duotone, làm nổi bật badge phân loại "Team" / "Project" kèm dot indicator nhấp nháy nhẹ, nút thao tác 3 chấm `DotsThreeVertical` xuất hiện tinh tế khi hover.
  2. **DocumentCard ([document-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-card.tsx))**:
     - **Top Colored Accent Border**: Thêm đường viền accent màu sắc phía trên tương ứng từng loại file (PDF: Rose, Figma: Purple, Markdown: Emerald, Sheet: Amber, Archive: Indigo).
     - **Icon Container & Category Badge**: Icon định dạng file chuẩn duotone trong khung vuông bo góc `rounded-xl` nổi bật, nhãn định dạng phân loại góc mượt mà.
     - **Action Star & Toolbar**: Nút Star đánh dấu yêu thích với nền mờ amber sáng mịn khi active, cụm nút chia sẻ/tải về phản hồi hiệu ứng rê chuột ấn tượng.
  3. **Helper Utils ([documents.utils.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/utils/documents.utils.ts))**: Bổ sung bộ kiểu dáng mở rộng (glow, accentBorder, badgeStyle, iconBg) hỗ trợ đồng bộ màu sắc động cho cả 2 dạng hiển thị Grid & List.
  4. **Đồng Bộ Hoàn Toàn Thiết Kế Theo `my-tasks` ([documents-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/documents-view.tsx))**:
     - **Tái cấu trúc List View sang Table chuẩn UI**: Sử dụng trực tiếp bộ linh kiện `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableCell` đồng bộ với trang `my-tasks`.
     - **Căn chỉnh & Hiển thị Cột Chuẩn**: Cấu trúc các cột tiêu đề (Document Title / Folder Name, Category / Type, Target, Size / Count, Author / Owner, Actions) chuyên nghiệp và sắc nét.
     - **Đồng bộ Section Title**: Áp dụng chuẩn Typography tiêu đề mục của `my-tasks` (`text-[14px] font-bold text-foreground capitalize flex items-center gap-2`), tích hợp Icon định dạng màu sắc rực rỡ và đếm số lượng bản ghi trong ngoặc đơn (`(count)`).
  5. **Màn Hình Chi Tiết Thư Mục (Dedicated Folder View Screen)**:
     - **Chuyển Màn Khi Nhấp Vào Folder**: Thay vì hiển thị danh sách đính kèm mờ nhạt bên dưới ở màn chính, khi click vào bất kỳ Folder nào, ứng dụng sẽ chuyển hẳn sang **Màn hình chi tiết thư mục riêng** với hiệu ứng chuyển trang `AnimatePresence` mượt mà.
     - **Breadcrumb & Header Thư Mục**: Tích hợp nút `Back to Folders`, thanh Breadcrumb dẫn đường (`Documents / Folder Name`), Banner thông tin chi tiết thư mục (tên folder, phạm vi Team/Project, tổng số file, chủ sở hữu, nút upload trực tiếp vào folder).
     - **Bộ Lọc & Tìm Kiếm Riêng Trong Folder**: Cho phép lọc theo danh mục (Specs, Design, Architecture...), tìm kiếm file theo tên, và chuyển đổi linh hoạt chế độ xem Grid / Table List chỉ trong phạm vi folder được chọn.
  6. **Tích Hợp `useNavigationStore` & Loại Bỏ Nút Back Nội Tuyến**:
     - **Đã Loại Bỏ**: Đã tháo bỏ hoàn toàn cụm nút Back và Breadcrumb nội tuyến (`< Back to Folders Documents / Folder Name`) trong giao diện nội dung.
     - **Tích Hợp Zustand Navigation Store**: Khi chọn mở folder, hàm `handleOpenFolder` tự động gọi `pushNav({ name: folder.name, description: folder.teamName || folder.projectName, backLink: "/docs" })` từ [navigation.store.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/store/navigation.store.ts) để quản lý điều hướng chuẩn cấp hệ thống (Sidebar / Layout Header).
  7. **Hiển Thị Tiêu Đề Folder Động Khi Mở Folder**:
     - **PageHeader Tiêu Đề Folder**: Tiêu đề trang chính (`PageHeader`) tự động chuyển sang Tên của Folder được chọn kèm Icon Duotone sinh động và nút `Upload to Folder`.
     - **Section Title Tiêu Đề Folder**: Tiêu đề mục nội dung đổi thành `{selectedFolderObj.name} Files` kèm đếm số lượng tài liệu có trong folder đó.
  8. **Loại Bỏ Banner Khung Folder Chi Tiết (Folder Detail Meta Banner Removal)**:
     - **Đã Loại Bỏ**: Đã xóa hoàn toàn khung Banner thông tin thừa (`<div className="relative rounded-2xl p-4.5 border ...">...</div>`), giúp bố cục giao diện gọn gàng, tinh tế và tập trung hoàn toàn vào nội dung tìm kiếm cũng như danh sách file.
  10. **Tích Hợp Tên Folder Vào Thanh Điều Hướng Đỉnh Trang (TopNav Breadcrumb Sync)**:
      - **Đồng Bộ TopNav ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**: Tự động nhận diện item phụ được push vào `useNavigationStore` và hiển thị trực tiếp Tên của Folder vừa chọn vào dãy Breadcrumb đỉnh trang (`< > Docs / <Tên Folder>`).
      - **Điều Hướng Đồng Bộ Hai Chiều**: Nhấn vào `Docs` hoặc nút mũi tên quay lại (`CaretLeft`) trên TopNav sẽ tự động `popNav()` và chuyển mịn về giao diện tổng quan Documents.
  11. **Giữ Cố Định Header Workspace Trên Sidebar ([sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar.tsx))**:
      - **Khắc Phục Tác Dụng Phụ**: Điều chỉnh `currentNav` ở [sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar.tsx) ưu tiên lấy item root Workspace (`backLink: "/workspaces"` hoặc `stack[0]`), đảm bảo Header góc trên bên trái Sidebar luôn cố định thông tin Workspace chính chứ không bị đổi nhầm thành tên Folder con.

## Refactor Clean Code Module Calendar (`src/features/calendar`)

- **Bối cảnh**: Tối ưu hóa toàn bộ codebase module Calendar theo các quy tắc Clean Code & Architecture Rules (Tách biệt mối quan tâm, loại bỏ magic values, tường minh tên biến).
- **Những cải tiến đã thực hiện**:
  1. **Custom Hook ([use-calendar-events.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/hooks/use-calendar-events.ts))**:
     - Tách 100% logic quản lý state (search, filters, view mode, date picker, selected event) và logic tính toán `filteredEvents` ra khỏi UI component.
  2. **Trích Xuất Hằng Số Config ([calendar.constants.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/constants/calendar.constants.ts))**:
     - Thêm hằng số `CALENDAR_CONFIG` quản lý `START_HOUR = 8`, `ROW_HEIGHT_PX = 64`, `DEFAULT_SELECTED_DAY = 22` loại bỏ hoàn toàn magic numbers.
  3. **Đặt Tên Tường Minh ([calendar-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/components/calendar-view.tsx))**:
     - Chuyển đổi tên biến viết tắt `q` thành `searchQuery` đúng tinh thần Clean Code.
  4. **Áp Dụng Trong Timetable Grid ([calendar-timetable-grid.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/components/calendar-timetable-grid.tsx))**:
     - Sử dụng trực tiếp `CALENDAR_CONFIG.ROW_HEIGHT_PX` và `CALENDAR_CONFIG.START_HOUR` giúp tính toán vị trí tọa độ thẻ sự kiện minh bạch và dễ bảo trì.
  5. **Tách Biệt Dữ Liệu Giả Ra Thư Mục `mocks/`**:
     - **Calendar Mocks**: Tách toàn bộ dải dữ liệu giả `MOCK_CALENDAR_EVENTS` sang file riêng [calendar.mocks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/mocks/calendar.mocks.ts).
     - **Documents Mocks**: Tách `MOCK_FOLDERS` và `MOCK_DOCUMENTS` sang file riêng [documents.mocks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/mocks/documents.mocks.ts), giúp giữ cho các file `constants.ts` thuần túy chứa cấu hình giao diện.
  6. **Loại Bỏ `Docs & Resources` Trong Calendar**:
     - Đã tháo bỏ nút bấm `Docs & Resources` trên [calendar-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/components/calendar-view.tsx), xóa bỏ component Sidebar tài liệu phụ và dọn dẹp biến state `isDocsOpen` ở [use-calendar-events.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/hooks/use-calendar-events.ts).
  7. **Khắc Phục Toàn Bộ Lỗi Linter & Cảnh Báo UI (`current_problems`)**:
     - **Tối Ưu React 19 Render Effect**: Loại bỏ hoàn toàn `useEffect` gọi `setState` đồng bộ trong [documents-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/documents-view.tsx), chuyển sang dạng giá trị tính toán trực tiếp `effectiveFolderId` khi render.
     - **Giảm Độ Phức Tạp Cognitive Complexity**: Tách `DedicatedFolderView` ra khỏi [documents-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/documents-view.tsx), hạ độ phức tạp từ 21 xuống <15.
     - **Chuẩn Hóa Class Tailwind**: Sửa các class warning `w-[120px]` $\rightarrow$ `w-30`, `max-w-[500px]` $\rightarrow$ `max-w-125`, `-left-[19px]` $\rightarrow$ `-left-4.75` và xóa thuộc tính CSS xung đột `inline-block` trùng với `flex` ở [calendar-agenda-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/components/calendar-agenda-tab.tsx).
  8. **Tạo Zustand User Store ([user.store.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/store/user.store.ts))**:
     - Khởi tạo `useUserStore` quản lý trạng thái thông tin người dùng (`UserProfile`) và cài đặt tùy chỉnh cá nhân (`UserPreferences` như theme, ngôn ngữ, múi giờ, thông báo) với middleware `persist` lưu trữ tự động vào LocalStorage (`user-storage`).
  9. **Đồng Bộ View Mode (Grid/List) & Starred Filter Vào User Store**:
     - Thêm `documentsViewMode` ("grid" | "list") và `documentsStarredOnly` (boolean) vào `UserPreferences` trong [user.store.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/store/user.store.ts).
     - Đồng bộ hai trạng thái này trực tiếp trong [documents-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/documents-view.tsx), giúp ứng dụng tự động ghi nhớ chế độ hiển thị mong muốn của người dùng ngay cả khi tải lại trang.
   11. **Xây Dựng Bảng Notifications Drawer Áp Dụng Bố Cục Thẻ Gợi Ý Gọn Gàng ([notifications-drawer.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/notifications-drawer.tsx))**:
      - **Bố Cục Cấu Trúc Bảng Thông Báo TaskFi**:
        - **Avatar Ký Tự Tròn Phân Màu (Circle Avatar)**: Avatar dạng hình tròn (`w-8 h-8 rounded-full`) đặt ở bên trái.
        - **Dòng Thông Tin Tác Vụ Inline**: `[Tên người dùng] [Mô tả thay đổi trạng thái tác vụ TaskFi] [Thời gian]` (Ví dụ: `Dat Ngo changed a task status from In Progress to In Design 10 mins ago`).
        - **Chấm Xanh Chỉ Báo Chưa Đọc (Unread Blue Dot)**: Chấm tròn màu xanh lam (`bg-blue-600 w-2.5 h-2.5 rounded-full`) ở góc trên bên phải đối với các mục chưa đọc.
        - **Dòng Tiêu Đề Công Việc & Icon Phân Loại**: Tích hợp icon định dạng TaskFi (`CheckSquare` Task, `GitBranch` Subtask, `Bug` Bug, `BookmarkSimple` Story, `GitPullRequest` PR) kèm tên công việc (`TaskFi v1.4 Release Deployment & Clean Code`).
        - **Mã Công Việc & Trạng Thái**: Hiển thị định dạng mã tác vụ TaskFi (`TASK-104 • In Design` / `PR-42 • Approved`).
        - **Sub-row Chỉ Số Cập Nhật Nhanh**: Avatar nhỏ kèm đường dẫn màu xanh hiển thị chỉ số cập nhật (`+3 updates from Dat Ngo` / `+2 mentions from Alex Rivers`).
   12. **Redesign Thẻ Workspace Header & User Profile Trong Sidebar Chuẩn Glassmorphic High-End ([sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar.tsx))**:
      - **Thẻ Workspace Header & User Profile**:
        - Áp dụng phong cách **Glassmorphism cao cấp** (`bg-card/40 hover:bg-card/80 backdrop-blur-md border border-border/70 hover:border-primary/40`).
        - Trang bị dải phản quang ánh sáng ở mép mép viền trên (`before:bg-linear-to-r before:from-transparent before:via-white/40 dark:before:via-white/15 before:to-transparent`), mang lại vẻ ngoài óng ánh hiện đại của các khối thủy tinh liquid mờ.
        - Logo & Avatar trang bị Gradient rực rỡ kèm viền phản quang `ring-1 ring-white/20`.
        - Icon bánh răng cài đặt `Gear` tích hợp micro-interaction xoay nhẹ khi hover (`group-hover/user:rotate-45 transition-all`).
   13. **Khắc Phục & Tối Ưu Hiệu Ứng Backdrop Blur Phông Nền Cho Sidebar ([layout.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/app/[locale]/(dashboard)/layout.tsx) & [animated-background.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/layout/animated-background.tsx))**:
      - **Nguyên nhân**: Trước đó linh kiện `<AnimatedBackground />` bị đặt bên trong thẻ div nội dung bên phải, khiến khu vực phía sau Sidebar không có phông nền gradient/blobs rực rỡ để hiệu ứng `backdrop-blur` hiển thị.
      - **Giải pháp**:
        - Đưa `<AnimatedBackground />` ra gốc toàn bộ màn hình Dashboard Layout (`fixed inset-0 z-0`), giúp các khối màu gradient chuyển động phủ đều toàn bộ phía sau Sidebar và toàn màn hình.
        - Thêm khối glow màu xanh ngọc nhạt (`bg-emerald-500/20 filter blur-[100px]`) ở góc trên bên trái (-top-10 -left-10) dành riêng phía sau Sidebar.
        - Nâng cấp Sidebar với `bg-card/60 backdrop-blur-xl border-border/70` tạo hiệu ứng thủy tinh mờ (`frosted glass`) rực rỡ và chân thực.
   14. **Bỏ Màu Nền Đặc (Solid Background) Ở Trang All Projects ([projects-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/projects-view.tsx) & [project-group-section.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/project-group-section.tsx))**:
      - Loại bỏ thuộc tính màu nền đặc `bg-background` của khung nhìn All Projects, chuyển sang `bg-transparent`.
      - Lược bỏ các khối gradient tĩnh cũ (`blur-[100px]`), nhường chỗ cho hiệu ứng phông nền chuyển động toàn màn hình.
      - Chuyển đổi các thẻ dự án trong danh sách sang định dạng **Glassmorphism mờ kính** (`bg-card/40 hover:bg-card/80 backdrop-blur-md border border-border/70 hover:border-primary/40 rounded-xl`).
   16. **Cập Nhật Bảng Màu Dark Mode Tông Xanh Đêm Deep Midnight Navy ([globals.css](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/app/globals.css))**:
      - **Light Mode**: `--background` màu xám nhạt dịu mắt `#f8fafc` (`slate-50`), `--card` màu trắng tinh `#ffffff` nổi bật.
      - **Dark Mode (Deep Midnight Navy)**:
        - Chuyển `--background` sang gam xanh đêm thâm thẫm **`#0b0f19`** (Slate 950 Deep Navy).
        - Chuyển `--card` và `--popover` sang khối xanh navy mờ nổi **`#111827`** (Gray 900).
        - Viền hairline Slate Navy **`#1e293b`** (Slate 800) và điểm nhấn Sky Blue **`#38bdf8`**, mang lại cảm giác thanh lịch, hiện đại và vô cùng êm mắt.
   17. **Chuẩn Hóa Các Class Tailwind Tùy Biến Linter Warning ([sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar.tsx) & [calendar-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/calendar/components/calendar-view.tsx))**:
      - Thay thế các class ngoặc vuông tùy biến `w-[17px] h-[17px]` sang class Tailwind v4 chuẩn `w-4.25 h-4.25`.
      - Thay thế `text-[17px]` sang `text-base` font chữ chuẩn hệ thống, loại bỏ hoàn toàn các cảnh báo linter.
   18. **Cập Nhật Chính Xác Bảng Màu Light Mode Theo Yêu Cầu ([globals.css](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/app/globals.css))**:
      - **Phông nền chính Light Mode (`--background`)**: Đổi thành mã màu **`#FDFDFD`** tinh khiết.
      - **Màu nền Sidebar, Card & Popover (`--card` & `--popover`)**: Đổi thành mã màu **`#F5F8F9`** tạo sự phân tầng tương phản nhẹ nhàng, cao cấp và vô cùng êm mắt.
   19. **Thiết Lập Rule Cấu Hình Cấu Hình Ẩn Cảnh Báo Tailwind Canonical Class ([settings.json](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/.vscode/settings.json))**:
      - Cấu hình `"tailwindCSS.suggestCanonical": false`, `"tailwindCSS.lint.suggestCanonical": "ignore"`, và `"tailwindCSS.lint.invalidArbitraryValue": "ignore"`.
      - Giúp VS Code và trình biên dịch ẩn hoàn toàn mọi gợi ý/cảnh báo phiền phức dạng *"The class w-[17px] can be written as w-4.25"* trên toàn bộ Workspace.
   20. **Cập Nhật Chính Xác Bảng Màu Dark Mode Theo Yêu Cầu ([globals.css](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/app/globals.css))**:
      - **Phông nền chính Dark Mode (`--background`)**: Đổi thành mã màu **`#171717`** (Neutral 900 Charcoal).
      - **Màu nền Sidebar, Card & Popover (`--card` & `--popover`)**: Đổi thành mã màu **`#1C1C1C`** nổi bật với sắc xám đen tinh tế, hòa hợp hoàn hảo cùng giao diện tối.
   21. **Giữ Nguyên Toàn Bộ Menu TaskFi Gốc & Áp Dụng Layout Đỉnh Cao Mới ([sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar.tsx))**:
      - **Bảo toàn 100% Các Router & Menu TaskFi Gốc**: Giữ đầy đủ danh mục điều hướng TaskFi gốc bao gồm `Projects` (`/`), `My tasks` (`/my-tasks`), `Calendar` (`/calendar`), `Documents` (`/docs`), `Timeline` (`/timeline`), `Backlog` (`/backlog`), `Active sprints` (`/active-sprints`), `Reports` (`/reports`), `Issues` (`/issues`), và `Workspace settings` (`/workspace-settings`).
      - **Header Workspace Tinh Tế**: Avatar vuông chữ cái màu xanh lá (`w-7 h-7 rounded-md bg-emerald-500`) đính kèm tiêu đề Workspace, caret down và nút toggle thu gọn ở góc phải.
      - **Thanh Thao Tác Nhanh "+ New" & Tìm Kiếm**: Nút bo tròn Pill `+ New` mềm mại (`rounded-full bg-secondary/80`) đi kèm nút tròn tìm kiếm (`w-8 h-8 rounded-full`).
      - **Group Accordion "Recent" & "Teams"**: Tích hợp các thẻ mục sổ xuống **Recent** đính kèm các dự án nổi bật (`Q1 Recap`, `Design Team Projects`, `UX Copy Writing`) và mục **Teams**.
   22. **Nâng Cấp Component Button Chuẩn Mẫu Dạng Viên Thuốc (Pill Buttons) ([button.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/actions/button.tsx))**:
      - Chuyển đổi toàn bộ thiết kế nút bấm sang khối dạng viên thuốc bo tròn mềm mại (`rounded-full bg-secondary/90 hover:bg-secondary border border-border/50 shadow-2xs`).
      - Bổ sung biến thể `ButtonVariant.Pill` và kích thước `ButtonSize.Icon` (`w-8.5 h-8.5 p-0 rounded-full flex items-center justify-center`) phục vụ các nút bấm hình tròn icon tùy chọn.
      - Tăng cường hiệu ứng chạm tương tác mịn màng (`active:scale-[0.97] font-semibold text-[13px]`).
   23. **Sửa Đổi Hoàn Toàn 100% Cảnh Báo Linter Trong Danh Sách `current_problems`**:
      - Gỡ bỏ import thừa `AnimatedBackground` tại [workspaces/page.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/app/[locale]/workspaces/page.tsx).
      - Chuẩn hóa `max-w-[380px]` sang `max-w-95` tại [notifications-drawer.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/notifications-drawer.tsx).
      - Chuẩn hóa `h-[56px]`, `w-[20px]`, `w-[18px]` sang `h-14`, `w-5`, `w-4.5` tại [top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx).
      - Chuẩn hóa `w-[380px] h-[380px]` sang `w-95 h-95` tại [animated-background.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/layout/animated-background.tsx).
      - Chuẩn hóa `rounded-[4px]`, `w-[26px]` sang `rounded-sm`, `w-6.5` tại [issue-table-row.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/issue-table-row.tsx).
      - Sửa `bg-gradient-to-br`, `max-w-[90px]`, `max-w-[80px]`, `h-[2px]` sang `bg-linear-to-br`, `max-w-22.5`, `max-w-20`, `h-0.5` tại [document-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-card.tsx) & [folder-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/folder-card.tsx).
   24. **Audit Toàn Diện & Chuẩn Hóa Nguyên Tắc DRY Cho Thư Mục Layout ([src/components/layout](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout))**:
      - Tạo mới module tiện ích dùng chung [string.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/utils/string.ts) chứa hàm `getInitials`, loại bỏ mã lặp giữa `sidebar.tsx` và `notifications-drawer.tsx`.
      - Đảm bảo 100% các thành phần trong `src/components/layout` (`sidebar.tsx`, `top-nav.tsx`, `notifications-drawer.tsx`, `page-container.tsx`) đều tuân thủ màu theme linh hoạt `bg-card` / `bg-transparent`, hoàn toàn sạch sẽ, không dính màu solid cứng hay vi phạm nguyên tắc DRY.
   25. **Tách Biệt Các Sub-Components Tối Ưu Tốc Độ & Kiến Trúc Sản Phẩm ([src/components/layout](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout))**:
      - **[sidebar-workspace-header.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-workspace-header.tsx)**: Linh kiện Header chọn Workspace và công tắc thu gọn Sidebar.
      - **[sidebar-action-bar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-action-bar.tsx)**: Thanh nút thao tác nhanh `+ New` và tìm kiếm.
      - **[sidebar-nav-item.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-nav-item.tsx)**: Linh kiện hiển thị các đường dẫn điều hướng chính với hiệu ứng active pill độc lập.
      - **[sidebar-user-footer.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-user-footer.tsx)**: Linh kiện chân trang tài khoản người dùng.
   26. **Đồng Bộ Thiết Kế Khối Viên Thuốc (Pill Rounded) Cho Form Components ([segmented-control.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/segmented-control.tsx), [input.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/input.tsx), [select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/select.tsx))**:
      - Chuyển đổi toàn bộ bộ chọn Tab SegmentedControl (`List`, `Cards`, `CalendarBlank`) sang khối bo tròn Pill `rounded-full bg-secondary/80`.
      - Chuyển đổi ô tìm kiếm Input (`Search title...`) và bộ chọn Dropdown Select (`Assignee`, `Type`, `Priority`) sang khối bo tròn Pill `rounded-full px-3.5 h-9` đồng bộ 100% theo đúng ảnh yêu cầu.
   27. **Tái Thiết Kế Toàn Diện Linh Kiện ProfileSetting ([profile-setting.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/user-settings/components/profile-setting.tsx))**:
      - Nâng cấp giao diện trang Cài đặt Hồ sơ cá nhân theo phong cách Pill UI & Glassmorphism với viền phát sáng ambient radial glow (`from-emerald-500/10 via-teal-500/5 to-transparent`).
      - Tích hợp avatar tròn lớn chứa Avatar Initials linh hoạt từ `useUserStore`, đính kèm camera hover overlay icon và huy hiệu trạng thái online `bg-emerald-500`.
      - Chuyển đổi toàn bộ các ô nhập dữ liệu `Full Name`, `Email Address`, và `Unique User ID` sang linh kiện Pill `Input` bo tròn `rounded-full`.
      - Bổ sung huy hiệu `Verified` cho Email và nút Sao chép User ID kèm hiệu ứng Framer Motion animated feedback "Copied!".
   28. **Khắc Phục 100% Lỗi Chuyển Tab Case-Sensitive & Phục Hồi Các Tệp Tiện Ích Export ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx#L286))**:
      - Chuẩn hóa việc so sánh `activeTab.toLowerCase()` trong [`dashboard-view.tsx`](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx#L286), giải quyết dứt điểm lỗi hiển thị câu *"Content for Retros is coming soon."* khi chuyển tab.
      - Phục hồi và bổ sung đầy đủ các xuất hàm tiện ích `formatRelativeTime` ([`date.ts`](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/utils/date.ts#L43)), `formatBytes`, `getFileNameFromUrl`, `isImageUrl` ([`cloudinary.ts`](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/utils/cloudinary.ts#L15)), `STAGGER_CONTAINER_VARIANTS`, `SPRING_CARD_VARIANTS` ([`animations.ts`](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/constants/animations.ts#L35)) và các types `IssueAttachment`, `IssueComment`, `IssueLinkType` ([`issue.types.ts`](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/types/issue.types.ts#L49)).
      - Toàn bộ codebase đã đạt **0 lỗi TypeScript & 0 cảnh báo ESLint**.