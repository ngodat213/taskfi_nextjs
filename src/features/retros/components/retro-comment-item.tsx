"use client";

import { useState } from "react";
import { ArrowBendUpLeftIcon, ShareNetworkIcon, CheckIcon, DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/ui/data-display/avatar";
import { MarkdownPreview } from "@/components/ui/data-display/markdown-preview";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { LikeButton } from "@/components/ui/feedback/like-button";
import { RetroComment } from "@/types/retro.types";
import {
  getUserAvatarUrl,
  getUserInitials,
} from "@/features/issue-detail/utils/comment-user.utils";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useUserStore } from "@/store/user.store";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/cn";
import "@/styles/code-theme.css";

interface RetroCommentItemProps {
  comment: RetroComment;
  onReply: (authorName: string) => void;
}

export function RetroCommentItem({ comment, onReply }: RetroCommentItemProps) {
  const [likesCount, setLikesCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const userStoreUser = useUserStore((state) => state.user);
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.data || userStoreUser;

  const isCurrentUser = Boolean(
    currentUser?.id &&
    (comment as { createdById?: string }).createdById === currentUser.id,
  );

  const rawDisplayName = comment.authorName || "Thành viên";
  const displayName = isCurrentUser ? "You" : rawDisplayName;
  const avatarUrl =
    comment.authorAvatar ||
    (isCurrentUser ? getUserAvatarUrl(currentUser) : undefined);
  const initials = isCurrentUser
    ? getUserInitials(currentUser)
    : rawDisplayName.slice(0, 2).toUpperCase();

  const formattedTime = formatRelativeTime(comment.createdAt);

  const handleShare = async () => {
    try {
      const shareText = `${rawDisplayName}: "${comment.content}"`;
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
        src={avatarUrl}
        alt={displayName}
        fallback={initials}
        size="sm"
        className="mt-0.5 shrink-0"
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
                isCurrentUser
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted/80 text-muted-foreground/90 border-border/50",
              )}
            >
              {isCurrentUser ? "Tác giả" : "Thành viên"}
            </span>
          </div>
        </div>

        {/* Comment Body Content */}
        <MarkdownPreview content={comment.content} className="mt-1.5" />

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
              <span>Trả lời</span>
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
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <ShareNetworkIcon className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
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
