export function isToday(dateString?: string | null): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isOverdue(dateString?: string | null): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();

  // Reset time to start of day for accurate day-level comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() < today.getTime();
}

export function formatDueDate(dateString?: string | null): string {
  if (!dateString) return "No due date";

  const date = new Date(dateString);

  // Format like "Oct 24, 2026"
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (isToday(dateString)) {
    return `Today (${formattedDate})`;
  }

  return formattedDate;
}
