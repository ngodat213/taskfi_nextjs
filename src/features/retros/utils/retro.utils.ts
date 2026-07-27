import {
  RetroItem,
  RetroItemResponseDto,
  RetroCategory,
  getRetroTags,
  mapBackendCategoryToFrontend,
} from "@/types/retro.types";

export const INITIAL_FALLBACK_RETRO_ITEMS: RetroItem[] = [
  {
    id: "retro-1",
    category: "went_well",
    title: "Tối ưu hóa tốc độ tải trang và hoàn thành Sprint 24 đúng hạn",
    description: "Team đã nâng cao hiệu suất rendering UI và áp dụng Caching cho API Backend NestJS.",
    votes: 5,
    authorName: "Ngô Tiến",
    tags: ["Frontend", "Performance", "Teamwork"],
    completed: false,
    createdAt: "Hôm nay",
  },
  {
    id: "retro-2",
    category: "to_improve",
    title: "Cần cải thiện việc viết tài liệu API Swagger trước khi Code",
    description: "Một số endpoint API chưa có mẫu DTO chuẩn khiến việc đấu nối mất nhiều thời gian.",
    votes: 3,
    authorName: "Minh Tuấn",
    tags: ["API Docs", "Backend"],
    completed: false,
    createdAt: "Hôm nay",
  },
  {
    id: "retro-3",
    category: "action_item",
    title: "Bổ sung Automated Test và CI/CD Pipeline cho dự án",
    description: "Thiết lập GitHub Actions để kiểm tra npx tsc và eslint trước khi merge PR.",
    votes: 8,
    authorName: "Hoàng Nam",
    tags: ["DevOps", "Quality Gate"],
    completed: true,
    createdAt: "Hôm nay",
  },
];

export function mapDtoToRetroItem(i: RetroItemResponseDto): RetroItem {
  return {
    id: i.id,
    category: mapBackendCategoryToFrontend(i.category),
    title: i.title,
    description: i.description || "",
    votes: i.votesCount,
    authorName: i.createdById
      ? `User ${i.createdById.slice(0, 4)}`
      : "Thành viên",
    authorAvatar: undefined,
    tags: i.tags,
    completed: i.completed,
    dueDate: i.dueDate,
    createdAt: new Date(i.createdAt).toLocaleDateString("vi-VN"),
  };
}

export function filterRetroItems(items: RetroItem[], searchQuery: string): RetroItem[] {
  if (!searchQuery.trim()) return items;
  const q = searchQuery.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.authorName.toLowerCase().includes(q) ||
      getRetroTags(item).some((t) => t.toLowerCase().includes(q)),
  );
}

export function groupRetroItemsByCategory(
  items: RetroItem[],
  categories: RetroCategory[],
): Map<RetroCategory, RetroItem[]> {
  const map = new Map<RetroCategory, RetroItem[]>();
  categories.forEach((cat) => map.set(cat, []));
  items.forEach((item) => {
    if (map.has(item.category)) {
      map.get(item.category)!.push(item);
    }
  });
  return map;
}
