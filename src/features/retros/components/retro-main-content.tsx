"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ChatCircleIcon, PulseIcon } from "@phosphor-icons/react/dist/ssr";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { AttachmentUploader } from "@/components/ui/forms/attachment-uploader";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { RetroItem, RetroComment } from "@/types/retro.types";
import { IssueAttachment } from "@/types/issue.types";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useUserStore } from "@/store/user.store";
import { useDebounce } from "@/hooks/use-debounce";
import { RetroCommentItem } from "./retro-comment-item";
import {
  useRetroComments,
  useAddRetroComment,
  useUpdateRetroItem,
} from "@/features/retros/hooks/use-retros";

interface RetroMainContentProps {
  item: RetroItem;
  sessionId: string;
  categoryBadgeVariant?: "emerald" | "amber" | "blue";
}

export function RetroMainContent({ item, sessionId }: RetroMainContentProps) {
  const userStoreUser = useUserStore((state) => state.user);
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.data || userStoreUser;
  const currentUserId = currentUser?.id || "user";

  const [desc, setDesc] = useState(item.description || "");
  const [prevDesc, setPrevDesc] = useState(item.description);
  if (item.description !== prevDesc) {
    setPrevDesc(item.description);
    setDesc(item.description || "");
  }

  const debouncedDesc = useDebounce(desc, 600);
  const updateItem = useUpdateRetroItem();
  const lastSavedDescRef = useRef(item.description || "");

  useEffect(() => {
    const trimmed = debouncedDesc.trim();
    if (trimmed !== lastSavedDescRef.current) {
      lastSavedDescRef.current = trimmed;
      updateItem.mutate({
        sessionId,
        itemId: item.id,
        data: { description: trimmed },
      });
    }
  }, [debouncedDesc, item.id, sessionId, updateItem]);

  const [attachments, setAttachments] = useState<(IssueAttachment | string)[]>(
    item.attachments || [],
  );
  const [prevAttachments, setPrevAttachments] = useState(item.attachments);
  if (item.attachments !== prevAttachments) {
    setPrevAttachments(item.attachments);
    setAttachments(item.attachments || []);
  }

  const [activeTab, setActiveTab] = useState("comments");
  const [commentText, setCommentText] = useState("");

  const addComment = useAddRetroComment();
  const { data: apiCommentsRes, isLoading: isLoadingComments } =
    useRetroComments(item.id);

  const comments = useMemo<RetroComment[]>(() => {
    if (apiCommentsRes?.data) {
      return apiCommentsRes.data.map((c) => ({
        id: c.id,
        createdById: (c as { createdById?: string }).createdById,
        authorName: (c as { authorName?: string }).authorName || "Thành viên",
        authorAvatar: undefined,
        content: c.content,
        createdAt:
          (c as { createdAt?: string }).createdAt || new Date().toISOString(),
      }));
    }
    return item.comments || [];
  }, [apiCommentsRes, item.comments]);

  const handleDescBlur = () => {
    const trimmed = desc.trim();
    if (trimmed !== lastSavedDescRef.current) {
      lastSavedDescRef.current = trimmed;
      updateItem.mutate({
        sessionId,
        itemId: item.id,
        data: { description: trimmed },
      });
    }
  };

  const handleAttachmentsChange = (updated: IssueAttachment[]) => {
    setAttachments(updated);
  };

  const isCommentEmpty =
    !commentText.trim() ||
    commentText === "<p></p>" ||
    commentText === "<p></p>\n";

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommentEmpty || addComment.isPending) return;

    const trimmed = commentText.trim();
    addComment.mutate(
      { itemId: item.id, content: trimmed },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Description with TextEditor */}
      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Description
        </h3>
        <TextEditor
          value={desc}
          onChange={setDesc}
          onBlur={handleDescBlur}
          placeholder="Add a description..."
        />
      </div>

      {/* Attachments */}
      <AttachmentUploader
        attachments={attachments}
        uploaderId={currentUserId}
        onAttachmentsChange={handleAttachmentsChange}
      />

      {/* Tabs for Comments & Activity */}
      <div className="flex flex-col gap-2">
        <SegmentedControl
          tabs={[
            {
              id: "comments",
              label: "Comments",
              icon: ChatCircleIcon,
            },
            { id: "activity", label: "Activity", icon: PulseIcon },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "comments" && (
          <div className="flex flex-col gap-3 mt-0 animate-in fade-in duration-200">
            {/* New Comment Form using TextEditor */}
            <form onSubmit={handleAddComment}>
              <TextEditor
                value={commentText}
                onChange={setCommentText}
                placeholder="Viết bình luận, nhắc đến @users..."
                rightAction={
                  <Button
                    type="submit"
                    disabled={isCommentEmpty || addComment.isPending}
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
                  {comments.map((comment: RetroComment) => (
                    <RetroCommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={(authorName) =>
                        setCommentText(`<p>@${authorName} </p>`)
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Chưa có bình luận nào"
                  description="Hãy là người đầu tiên để lại bình luận cho ghi chú retro này."
                  className="py-4 px-5 sm:p-4 bg-muted/30 border border-border/40 rounded-lg text-xs"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="flex flex-col gap-4 mt-2 animate-in fade-in duration-200">
            <EmptyState
              title="No activity yet"
              description="Activity history will appear here."
              className="py-6 px-5 sm:p-6 bg-muted/50 border border-border/60 rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
