import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowBendUpLeftIcon,
  ShareNetworkIcon,
  CheckIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/ui/data-display/avatar";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { LikeButton } from "@/components/ui/feedback/like-button";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { UserResponseDto } from "@/types/auth.types";
import { Issue, IssueComment } from "@/types/issue.types";
import {
  getUserDisplayName,
  getUserInitials,
  getUserAvatarUrl,
  getUserSubHeader,
  renderFormattedCommentContent,
  getCommentRoleBadgeInfo,
} from "@/features/issue-detail/utils/comment-user.utils";
import { cn } from "@/utils/cn";
import { formatRelativeTime } from "@/utils/date";
import "@/styles/code-theme.css";

export interface CommentItemProps {
  comment: IssueComment;
  issue: Issue;
  currentUser?: UserResponseDto | null;
  currentUserAvatarUrl?: string;
  onReply: (authorName: string) => void;
}

export function CommentItem({
  comment,
  issue,
  currentUser,
  currentUserAvatarUrl,
  onReply,
}: CommentItemProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueComments;

  const [likesCount, setLikesCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const formattedTime = formatRelativeTime(comment.createdAt);

  const commentUser =
    comment.user ||
    (comment.userId === currentUser?.id ? currentUser : undefined);

  const isCurrentUser = Boolean(
    currentUser?.id && comment.userId === currentUser.id,
  );
  const rawDisplayName = getUserDisplayName(commentUser);
  const displayName = isCurrentUser ? t(TK.you) : rawDisplayName;

  const commentAvatarUrl =
    getUserAvatarUrl(commentUser) ||
    (comment.userId === currentUser?.id ? currentUserAvatarUrl : undefined);
  const commentUserInitials = getUserInitials(commentUser);

  const roleBadge = getCommentRoleBadgeInfo(
    comment.userId,
    issue,
    commentUser?.role,
    {
      assignee: t(TK.roles.assignee),
      author: t(TK.roles.author),
      member: t(TK.roles.member),
    },
  );

  const subHeaderText = getUserSubHeader(commentUser);

  const handleShare = async () => {
    try {
      const shareText = `${rawDisplayName}: "${comment.body}"`;
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  return (
    <div className="flex gap-3 py-3 first:pt-1 last:pb-1 group">
      <Avatar
        src={commentAvatarUrl}
        alt={displayName}
        fallback={commentUserInitials}
        size="sm"
        className="mt-0.5"
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </span>
            <span
              className={cn(
                "text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border select-none",
                roleBadge.style,
              )}
            >
              {roleBadge.label}
            </span>
          </div>
        </div>

        {/* Sub-header text line */}
        {subHeaderText && (
          <div className="text-[11.5px] text-muted-foreground/80 mt-0 font-medium">
            {subHeaderText}
          </div>
        )}

        {/* Comment Body Content */}
        <div
          className="text-[13px] text-foreground/90 wrap-break-word leading-relaxed mt-1.5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-(--hljs-bg) [&_pre]:text-(--hljs-fg) [&_pre]:border [&_pre]:border-border/60 [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-xs"
          dangerouslySetInnerHTML={{
            __html: renderFormattedCommentContent(comment.body),
          }}
        />

        {/* Comment Actions Footer Bar */}
        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
            <LikeButton
              votes={likesCount}
              onVote={() => setLikesCount((prev) => prev + 1)}
              categoryVariant="blue"
            />
            <Button
              type="button"
              variant={ButtonVariant.Ghost}
              onClick={() => onReply(rawDisplayName)}
              className="h-6 px-2 text-[11.5px] font-medium gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowBendUpLeftIcon className="w-3.5 h-3.5" />
              <span>{t(TK.reply)}</span>
            </Button>
            <Button
              type="button"
              variant={ButtonVariant.Ghost}
              onClick={handleShare}
              className={cn(
                "h-6 px-2 text-[11.5px] font-medium gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer",
                isCopied && "text-emerald-500 font-semibold",
              )}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t(TK.copied)}</span>
                </>
              ) : (
                <>
                  <ShareNetworkIcon className="w-3.5 h-3.5" />
                  <span>{t(TK.share)}</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant={ButtonVariant.Ghost}
              size={ButtonSize.Icon}
              className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <DotsThreeIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
          <span className="text-[11px] text-muted-foreground/70 font-normal shrink-0">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
