import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { useIssue, useUpdateIssue } from "@/features/projects/hooks/use-issues";
import { Issue, IssueType } from "@/types/issue.types";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { IssueMainContent } from "@/features/issue-detail/components/issue-main-content";
import { IssueProperties } from "@/features/issue-detail/components/issue-properties";
import { IssueSummaryInput } from "@/features/issue-detail/components/issue-summary-input";
import { useAutoError } from "@/hooks/use-auto-error";
import { updateIssueSchema } from "@/features/issue-detail/schemas/issue-detail.schema";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigationStore } from "@/store/navigation.store";
import {
  STAGGER_CONTAINER_VARIANTS,
  SLIDE_IN_LEFT_VARIANTS,
  SLIDE_IN_RIGHT_VARIANTS,
  FADE_SLIDE_UP_VARIANTS,
} from "@/constants/animations";

import { AiChatSidebar, IssueFormDraft } from "@/features/ai-assistant";

interface IssueDetailViewProps {
  projectId: string;
  issueId: string;
  onClose: () => void;
  onIssueSelect?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
}

export function IssueDetailView({
  projectId,
  issueId,
  onClose,
  onIssueSelect,
}: IssueDetailViewProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueDetailView;

  const { data: issueResponse, isLoading } = useIssue(projectId, issueId);
  const issue = issueResponse?.data;
  const updateIssue = useUpdateIssue();
  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const handleApplyFormDraft = (draft: IssueFormDraft) => {
    if (!issue) return;

    const payload: Partial<Issue> = {};
    if (draft.summary) payload.summary = draft.summary;
    if (draft.description) payload.description = draft.description;
    if (draft.type) payload.type = draft.type as IssueType;
    if (draft.status) payload.status = draft.status as Issue["status"];
    if (draft.priority) payload.priority = draft.priority as Issue["priority"];

    if (Object.keys(payload).length === 0) return;

    updateIssue.mutate(
      {
        projectId,
        issueId: issue.id,
        data: payload,
      },
      {
        onError: (err) => handleApiError(err, "draft"),
      },
    );
  };

  useEffect(() => {
    if (issue?.issueKey) {
      const stack = useNavigationStore.getState().stack;
      const lastItem = stack[stack.length - 1];
      if (
        lastItem &&
        lastItem.id === `issue-${issueId}` &&
        lastItem.name !== issue.issueKey
      ) {
        const newStack = [...stack];
        newStack[newStack.length - 1] = {
          ...lastItem,
          name: issue.issueKey,
          iconType: (issue.type || "task").toLowerCase(),
        };
        useNavigationStore.getState().setStack(newStack);
      }
    }
  }, [issue?.issueKey, issue?.type, issueId]);

  const handleUpdate = (field: keyof Issue, value: unknown) => {
    if (!issue) return;
    clearFieldError(field as string);

    const parseResult = updateIssueSchema.safeParse({ [field]: value });
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message;
      if (errorMessage) {
        handleApiError(new Error(errorMessage), field as string);
        return;
      }
    }

    updateIssue.mutate(
      {
        projectId,
        issueId: issue.id,
        data: { [field]: value } as Partial<Issue>,
      },
      {
        onError: (err) => handleApiError(err, field as string),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100 text-muted-foreground bg-transparent">
        {t(TK.loading)}
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-100 text-red-500 gap-4 bg-transparent">
        <div>{t(TK.notFound)}</div>
        <Button variant={ButtonVariant.Outline} onClick={onClose}>
          {t(TK.back)}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      className="flex flex-col lg:flex-row h-full bg-transparent w-full overflow-hidden"
    >
      {/* AI Chatbox Sidebar (Left) */}
      <motion.div
        variants={SLIDE_IN_LEFT_VARIANTS}
        className="hidden lg:flex shrink-0"
      >
        <AiChatSidebar
          onApplyFormDraft={handleApplyFormDraft}
          contextIssue={issue}
        />
      </motion.div>

      {/* Main Content Area (Right) */}
      <motion.div
        variants={FADE_SLIDE_UP_VARIANTS}
        className="flex-1 h-full py-6 pl-6 pr-0 lg:py-8 lg:pl-6 lg:pr-0 bg-transparent overflow-hidden flex flex-col"
      >
        <div className="flex flex-col gap-6 w-full h-full">
          {/* Main Issue Card */}
          <div className="w-full h-full bg-card/60 backdrop-blur-md rounded-l-xl border border-border/50 flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto hide-scrollbar flex-1">
              {/* Header */}
              <motion.div variants={FADE_SLIDE_UP_VARIANTS}>
                <div className="flex items-center gap-2 mb-2">
                  <TypeIcon
                    type={issue.type as IssueType}
                    className="w-4.5 h-4.5 shrink-0"
                  />
                  <span className="text-sm font-bold text-foreground tracking-tight">
                    {issue.issueKey}
                  </span>
                </div>

                <IssueSummaryInput
                  initialSummary={issue.summary}
                  onUpdateSummary={(newSummary) =>
                    handleUpdate("summary", newSummary)
                  }
                  errorMessage={fieldErrors["summary"]}
                  isDone={(issue.status || "").toLowerCase() === "done"}
                />
              </motion.div>

              {/* Main Grid */}
              <div className="flex flex-col-reverse 2xl:flex-row gap-5 2xl:gap-12 w-full">
                <IssueMainContent
                  issue={issue}
                  projectId={projectId}
                  onUpdate={handleUpdate}
                  fieldErrors={fieldErrors}
                  onIssueSelect={onIssueSelect}
                />

                <motion.div
                  variants={SLIDE_IN_RIGHT_VARIANTS}
                  className="w-full 2xl:w-75 shrink-0"
                >
                  <IssueProperties
                    issue={issue}
                    onUpdate={handleUpdate}
                    fieldErrors={fieldErrors}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
