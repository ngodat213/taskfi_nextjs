import { UserResponseDto } from "@/types/auth.types";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import hljs from "highlight.js";

/**
 * Returns the best display name for a user (full_name -> name -> email -> fallback)
 */
export function getUserDisplayName(
  user?: UserResponseDto | null,
  fallback = "User",
): string {
  if (!user) return fallback;
  return user.full_name?.trim() || user.email?.trim() || fallback;
}

/**
 * Returns 2-character uppercase initials for avatar fallback
 */
export function getUserInitials(
  user?: UserResponseDto | null,
  fallback = "U",
): string {
  const name = getUserDisplayName(user, "");
  if (!name) return fallback;
  return name.slice(0, 2).toUpperCase();
}

/**
 * Returns resolved Cloudinary avatar URL for a user
 */
export function getUserAvatarUrl(
  user?: UserResponseDto | null,
): string | undefined {
  if (!user) return undefined;
  return (
    user.avatar?.fileUrl ??
    (user.avatar?.publicId
      ? getCloudinaryUrl(user.avatar.publicId)
      : undefined) ??
    undefined
  );
}

/**
 * Returns subheader string combining job title and department (e.g. "Frontend Engineer • Engineering")
 */
export function getUserSubHeader(
  user?: UserResponseDto | null,
): string | undefined {
  if (!user) return undefined;
  const jobTitle = user.job_title?.trim();
  const department = user.department?.trim();
  const role = (user.global_role || user.role)?.trim();

  if (jobTitle) {
    return department ? `${jobTitle} • ${department}` : jobTitle;
  }
  if (department) return department;
  if (role) return `${role} • Dự án`;
  return undefined;
}

/**
 * Highlights code blocks inside HTML comments with syntax colors using highlight.js
 */
export function renderFormattedCommentContent(html?: string | null): string {
  if (!html) return "";
  if (!html.includes("<pre>")) return html;

  const parts = html.split("<pre>");
  const result: string[] = [parts[0]];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endPreIdx = part.indexOf("</pre>");

    if (endPreIdx === -1) {
      result.push(`<pre>${part}`);
      continue;
    }

    const rawCodeBlock = part.slice(0, endPreIdx);
    const restOfPart = part.slice(endPreIdx + 6);

    const cleanCode = rawCodeBlock
      .replace(/^(?:>)?(?:<code[^>]*>)?/i, "")
      .replace(/(?:<\/code>)?$/i, "");

    const decodedCode = cleanCode
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    try {
      const highlighted = hljs.highlightAuto(decodedCode).value;
      result.push(
        `<pre class="hljs"><code class="hljs">${highlighted}</code></pre>${restOfPart}`,
      );
    } catch {
      result.push(`<pre>${rawCodeBlock}</pre>${restOfPart}`);
    }
  }

  return result.join("");
}

/**
 * Returns role badge text and Tailwind style for a comment author
 */
export function getCommentRoleBadgeInfo(
  commentUserId: string,
  issue: { assigneeId?: string; reporterId?: string },
  userRole?: string,
  roleTranslations?: { assignee: string; author: string; member: string },
) {
  const isAssignee = commentUserId === issue.assigneeId;
  const isReporter = commentUserId === issue.reporterId;

  if (isAssignee) {
    return {
      label: roleTranslations?.assignee || "Người thực thi",
      style: "bg-primary/15 text-primary border-primary/30",
    };
  }

  if (isReporter) {
    return {
      label: roleTranslations?.author || "Tác giả",
      style: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    };
  }

  return {
    label: userRole || roleTranslations?.member || "Thành viên",
    style: "bg-muted/80 text-muted-foreground/90 border-border/50",
  };
}
