import { useState } from "react";

import { useTranslations } from "next-intl";

import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { CommentItem } from "@/features/issue-detail/components/comment-item";
import { getUserAvatarUrl } from "@/features/issue-detail/utils/comment-user.utils";
import {
  useAddComment,
  useIssueComments,
} from "@/features/projects/hooks/use-issues";
import { useUserStore } from "@/store/user.store";
import { Issue, IssueComment } from "@/types/issue.types";

interface IssueCommentsProps {
  issue: Issue;
  projectId?: string;
}

export function IssueComments({ issue }: IssueCommentsProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueComments;

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

  const isCommentEmpty = !commentText.replace(/<[^<>]*>/g, "").trim();

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
          placeholder={t(TK.placeholder)}
          rightAction={
            <Button
              type="submit"
              disabled={addComment.isPending || isCommentEmpty}
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              className="h-7 px-3.5 text-[12px] font-semibold rounded-full disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {addComment.isPending ? t(TK.submitting) : t(TK.submit)}
            </Button>
          }
        />
      </form>

      {/* Comments List Container Card */}
      <div className="p-3.5 sm:p-4 bg-card/80 rounded-xl border border-border/60 shadow-2xs flex flex-col gap-1">
        {isLoadingComments ? (
          <div className="p-3 text-center text-xs text-muted-foreground">
            {t(TK.loading)}
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
            title={t(TK.emptyTitle)}
            description={t(TK.emptyDesc)}
            className="py-4 px-5 sm:p-4 bg-muted/30 border border-border/40 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
