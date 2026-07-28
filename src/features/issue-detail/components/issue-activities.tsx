import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { useIssueActivities } from "@/features/projects/hooks/use-issues";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { IssueActivityItem } from "@/features/issue-detail/components/issue-activity-item";
import { APP_CONFIG } from "@/config/app.config";

interface IssueActivitiesProps {
  issueId: string;
}

export function IssueActivities({ issueId }: IssueActivitiesProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueActivities;

  const { data: activities = [], isLoading } = useIssueActivities(issueId);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: APP_CONFIG.PAGINATION.MAX_LIMIT },
  );
  const members = membersResponse?.data?.data || [];

  if (isLoading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
        {t(TK.loading)}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        title={t(TK.emptyTitle)}
        description={t(TK.emptyDesc)}
        className="py-4 px-4 bg-muted/30 border border-border/40 rounded-xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 py-1 max-h-105 overflow-y-auto pr-1">
      {activities.map((activity) => (
        <IssueActivityItem
          key={activity.id}
          activity={activity}
          members={members}
        />
      ))}
    </div>
  );
}
