import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { DatePicker } from "@/components/ui/forms/date-picker";
import { StoryPointsSelector } from "@/features/issue-detail/components/story-points-selector";
import { PropertySelect } from "@/features/issue-detail/components/property-select";
import { PropertyUserSelect } from "@/features/issue-detail/components/property-user-select";
import { SearchSelectOption } from "@/components/ui/forms/search-select";
import { Issue, IssueStatus, IssueType } from "@/types/issue.types";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useWorkspaceMembers,
  useWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import { PRIORITY_OPTIONS } from "@/features/dashboard/helpers/create-task.helpers";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import {
  TypeIcon,
  StatusBadge,
  PriorityIcon,
} from "@/features/dashboard/components/issue-table-row";
import { IssueActivities } from "./issue-activities";
import { APP_CONFIG } from "@/config/app.config";
import { buildMemberOptions } from "@/features/issue-detail/utils/issue-options.utils";

interface IssuePropertiesProps {
  issue: Issue;
  onUpdate: (field: keyof Issue, value: unknown) => void;
  fieldErrors?: Record<string, string>;
}

export function IssueProperties({
  issue,
  onUpdate,
  fieldErrors,
}: IssuePropertiesProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueProperties;

  const { data: currentUserResponse } = useCurrentUser();
  const currentUserId = currentUserResponse?.data?.id || "";

  const currentAssigneeId = issue.assigneeId || issue.assignee?.id || "";
  const currentReporterId = issue.reporterId || issue.reporter?.id || "";

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: APP_CONFIG.PAGINATION.MAX_LIMIT },
  );
  const members = membersResponse?.data?.data || [];

  const memberOptions = buildMemberOptions(
    members,
    currentAssigneeId,
    issue.assignee,
    currentReporterId,
    issue.reporter,
  );

  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const statuses: { name: string }[] = configResponse?.data?.statuses || [];
  const issueTypes: { name: string }[] = configResponse?.data?.issueTypes || [];

  const typeOptions: SearchSelectOption[] = issueTypes.map((tItem) => ({
    value: tItem.name,
    label: tItem.name,
    icon: (
      <TypeIcon
        type={tItem.name as IssueType}
        className="w-3.5 h-3.5 shrink-0"
      />
    ),
  }));

  const statusOptions: SearchSelectOption[] = statuses.map((sItem) => ({
    value: sItem.name,
    label: sItem.name,
    badge: <StatusBadge status={sItem.name as IssueStatus} />,
  }));

  const priorityOptions: SearchSelectOption[] = PRIORITY_OPTIONS.map((opt) => {
    const key = opt.value.toLowerCase() as keyof typeof TK.priorities;
    const translatedLabel = TK.priorities[key]
      ? t(TK.priorities[key])
      : opt.label;
    return {
      value: opt.value,
      label: translatedLabel,
      icon: (
        <PriorityIcon
          priority={opt.value as Issue["priority"]}
          className="w-3.5 h-3.5 shrink-0"
        />
      ),
    };
  });

  const matchedTypeValue =
    issueTypes.find(
      (tItem) => tItem.name.toLowerCase() === (issue.type || "").toLowerCase(),
    )?.name ||
    issue.type ||
    "";

  const matchedStatusValue =
    statuses.find(
      (sItem) =>
        sItem.name.toLowerCase() === (issue.status || "").toLowerCase(),
    )?.name ||
    issue.status ||
    "";

  const matchedPriorityValue =
    PRIORITY_OPTIONS.find(
      (opt) => opt.value.toLowerCase() === (issue.priority || "").toLowerCase(),
    )?.value ||
    issue.priority ||
    "";

  return (
    <div className="w-full flex flex-col h-full gap-8">
      {/* Details List */}
      <div className="flex flex-col gap-4">
        {/* Type */}
        <PropertySelect
          label={t(TK.type)}
          options={typeOptions}
          value={matchedTypeValue}
          onChange={(val) => onUpdate("type", val)}
          errorMessage={fieldErrors?.type}
        />

        {/* Status */}
        <PropertySelect
          label={t(TK.status)}
          options={statusOptions}
          value={matchedStatusValue}
          onChange={(val) => onUpdate("status", val)}
          errorMessage={fieldErrors?.status}
        />

        {/* Priority */}
        <PropertySelect
          label={t(TK.priority)}
          options={priorityOptions}
          value={matchedPriorityValue}
          onChange={(val) => onUpdate("priority", val)}
          placeholder={t(TK.selectPriority)}
          errorMessage={fieldErrors?.priority}
        />

        {/* Assignee */}
        <PropertyUserSelect
          label={t(TK.assignee)}
          value={currentAssigneeId}
          onChange={(val) => onUpdate("assigneeId", val)}
          options={memberOptions}
          unassignedLabel={t(TK.unassigned)}
          errorMessage={fieldErrors?.assigneeId}
          action={
            currentUserId && currentAssigneeId !== currentUserId ? (
              <button
                type="button"
                onClick={() => onUpdate("assigneeId", currentUserId)}
                className="text-[10px] font-medium text-primary hover:underline cursor-pointer"
              >
                {t(TK.assignToMe)}
              </button>
            ) : null
          }
        />

        {/* Reporter */}
        <PropertyUserSelect
          label={t(TK.reporter)}
          value={currentReporterId}
          onChange={(val) => onUpdate("reporterId", val)}
          options={memberOptions}
          unassignedLabel={t(TK.unassigned)}
          errorMessage={fieldErrors?.reporterId}
        />

        {/* Story Points */}
        <StoryPointsSelector
          label={t(TK.storyPoints)}
          value={issue.storyPoints}
          onChange={(val) => onUpdate("storyPoints", val)}
          errorMessage={fieldErrors?.storyPoints}
        />

        {/* Sprint */}
        {issue.sprintId && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t(TK.sprint)}
            </span>
            <div className="h-8 flex items-center">
              <span
                className="text-[13px] text-foreground font-medium hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                title={issue.sprintId}
              >
                {issue.sprintId}
              </span>
            </div>
          </div>
        )}

        {/* Due Date */}
        <DatePicker
          label={t(TK.dueDate)}
          value={issue.dueDate || null}
          onChange={(val) => onUpdate("dueDate", val)}
          errorMessage={fieldErrors?.dueDate}
        />

        {/* Activity */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {t(TK.activity)}
          </span>
          <IssueActivities issueId={issue.id} />
        </div>
      </div>
    </div>
  );
}
