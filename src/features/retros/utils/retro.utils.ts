import {
  RetroCategory,
  RetroItem,
  RetroItemResponseDto,
  getRetroTags,
  mapBackendCategoryToFrontend,
} from "@/types/retro.types";

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

export function filterRetroItems(
  items: RetroItem[],
  searchQuery: string,
): RetroItem[] {
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
