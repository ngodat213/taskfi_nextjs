import { IssueActivityUser } from "@/types/issue.types";
import { WorkspaceMember } from "@/types/workspace.types";

export function formatFieldValue(value: string): string {
  if (!value) return "";
  if (value.startsWith("{") && value.endsWith("}")) {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      if (typeof parsed.summary === "string") {
        return parsed.summary;
      }
    } catch {
      // Return raw value if not valid JSON
    }
  }
  return value;
}

export function getActivityUserDisplayName(
  user?: IssueActivityUser,
  member?: WorkspaceMember,
  fallbackMemberText = "Member",
): string {
  return (
    user?.full_name ||
    user?.name ||
    user?.username ||
    member?.username ||
    member?.email ||
    fallbackMemberText
  );
}

export function getActivityUserAvatarUrl(
  user?: IssueActivityUser,
): string | undefined {
  return user?.avatarUrl || user?.avatar?.fileUrl;
}

export function getInitials(name: string, fallback = "U"): string {
  if (!name.trim()) return fallback;
  return name.trim().slice(0, 2).toUpperCase();
}
