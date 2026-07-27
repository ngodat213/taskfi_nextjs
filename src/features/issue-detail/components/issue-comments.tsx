import { useState } from "react";
import {
  ArrowBendUpLeft,
  ShareNetwork,
  Check,
  DotsThree,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/ui/data-display/avatar";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TextEditor } from "@/components/ui/forms/text-editor";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import {
  useIssueComments,
  useAddComment,
} from "@/features/projects/hooks/use-issues";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useUserStore } from "@/store/user.store";
import { UserResponseDto } from "@/features/auth/types/auth.types";
import { Issue, IssueComment } from "@/types/issue.types";
import {
  getUserDisplayName,
  getUserInitials,
  getUserAvatarUrl,
  getUserSubHeader,
  renderFormattedCommentContent,
} from "@/features/issue-detail/utils/comment-user.utils";
import { cn } from "@/utils/cn";
import { LikeButton } from "@/components/ui/feedback/like-button";
import { formatRelativeTime } from "@/utils/date";
import "@/styles/code-theme.css";

interface IssueCommentsProps {
  issue: Issue;
  projectId?: string;
}

interface CommentItemProps {
  comment: IssueComment;
  issue: Issue;
  currentUser?: UserResponseDto | null;
  currentUserAvatarUrl?: string;
  onReply: (authorName: string) => void;
}

function CommentItem({
  comment,
  issue,
  currentUser,
  currentUserAvatarUrl,
  onReply,
}: CommentItemProps) {
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
  const displayName = isCurrentUser ? "You" : rawDisplayName;

  const commentAvatarUrl =
    getUserAvatarUrl(commentUser) ||
    (comment.userId === currentUser?.id ? currentUserAvatarUrl : undefined);
  const commentUserInitials = getUserInitials(commentUser);

  const isAssignee = comment.userId === issue.assigneeId;
  const isReporter =
    comment.userId === (issue as { reporterId?: string }).reporterId;
  const userRole = commentUser?.role;

  const roleBadgeText = isAssignee
    ? "Người thực thi"
    : isReporter
      ? "Tác giả"
      : userRole
        ? userRole
        : "Thành viên";

  const roleBadgeStyle = isAssignee
    ? "bg-primary/15 text-primary border-primary/30"
    : isReporter
      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
      : "bg-muted/80 text-muted-foreground/90 border-border/50";

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
                roleBadgeStyle,
              )}
            >
              {roleBadgeText}
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
              <ArrowBendUpLeft className="w-3.5 h-3.5" />
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
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <ShareNetwork className="w-3.5 h-3.5" />
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
              <DotsThree className="w-3.5 h-3.5" />
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

export function IssueComments({ issue }: IssueCommentsProps) {
  const [commentText, setCommentText] = useState("");
  const { data: comments = [], isLoading: isLoadingComments } =
    useIssueComments(issue.id);
  const addComment = useAddComment();

  const userStoreUser = useUserStore((state) => state.user);
  const { data: currentUserResponse } = useCurrentUser();

  const currentUser = currentUserResponse?.data || userStoreUser;
  const avatarUrl = getUserAvatarUrl(currentUser);

  const handleReply = (authorName: string) => {
    setCommentText(`<p>@${authorName} </p>`);
  };

  const isCommentEmpty =
    !commentText.trim() ||
    commentText === "<p></p>" ||
    commentText === "<p></p>\n";

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommentEmpty || addComment.isPending) return;

    addComment.mutate(
      { issueId: issue.id, body: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 mt-0 animate-in fade-in duration-200">
      {/* New Comment Form using TextEditor */}
      <form onSubmit={handleCommentSubmit}>
        <TextEditor
          value={commentText}
          onChange={setCommentText}
          placeholder="Viết bình luận, nhắc đến @users..."
          rightAction={
            <Button
              type="submit"
              disabled={addComment.isPending || isCommentEmpty}
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              className="h-7 px-3.5 text-[12px] font-semibold rounded-full disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {addComment.isPending ? "Đang gửi..." : "Bình luận"}
            </Button>
          }
        />
      </form>

      {/* Comments List Container Card */}
      <div className="p-3.5 sm:p-4 bg-card/80 rounded-xl border border-border/60 shadow-2xs flex flex-col gap-1">
        {isLoadingComments ? (
          <div className="p-3 text-center text-xs text-muted-foreground">
            Đang tải bình luận...
          </div>
        ) : comments.length > 0 ? (
          <div className="flex flex-col divide-y divide-border/40">
            {comments.map((comment: IssueComment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                issue={issue}
                currentUser={currentUser}
                currentUserAvatarUrl={avatarUrl}
                onReply={handleReply}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có bình luận nào"
            description="Hãy là người đầu tiên để lại bình luận cho công việc này."
            className="py-4 px-5 sm:p-4 bg-muted/30 border border-border/40 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
