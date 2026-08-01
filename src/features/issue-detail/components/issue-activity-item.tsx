import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/data-display/avatar";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { ACTIVITY_FIELD_TRANSLATION_KEYS } from "@/features/issue-detail/constants/issue-activity.constants";
import {
  formatFieldValue,
  getActivityUserAvatarUrl,
  getActivityUserDisplayName,
  getInitials,
} from "@/features/issue-detail/utils/issue-activity.utils";
import { IssueActivity } from "@/types/issue.types";
import { WorkspaceMember } from "@/types/workspace.types";
import { formatRelativeTime } from "@/utils/date";

export interface IssueActivityItemProps {
  activity: IssueActivity;
  members: WorkspaceMember[];
}

function renderActivityDetail(
  activity: IssueActivity,
  t: ReturnType<typeof useTranslations>,
  TK: typeof TRANSLATION_KEYS.DASHBOARD.IssueActivities,
) {
  const { fieldChanged, oldValue, newValue } = activity;
  const oldVal = formatFieldValue(oldValue);
  const newVal = formatFieldValue(newValue);

  if (fieldChanged === "issue.created") {
    return (
      <span className="text-[12px] text-muted-foreground">
        {t(TK.createdTask)}
        {newVal && (
          <span className="font-medium text-foreground">
            {" "}
            : &quot;{newVal}&quot;
          </span>
        )}
      </span>
    );
  }

  if (fieldChanged === "description") {
    return (
      <span className="text-[12px] text-muted-foreground">
        {t(TK.updatedDescription)}
      </span>
    );
  }

  return (
    <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1 flex-wrap">
      {!oldVal && (
        <span>
          {t(TK.setAction)}{" "}
          <span className="font-medium text-foreground">{newVal}</span>
        </span>
      )}
      {!newVal && (
        <span>
          {t(TK.removedAction)}{" "}
          <span className="line-through opacity-70">{oldVal}</span>
        </span>
      )}
      {oldVal && newVal && (
        <>
          <span className="line-through opacity-75">{oldVal}</span>
          <span className="text-primary font-bold">&rarr;</span>
          <span className="font-semibold text-foreground">{newVal}</span>
        </>
      )}
    </span>
  );
}

export function IssueActivityItem({
  activity,
  members,
}: IssueActivityItemProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueActivities;

  const member = members.find((m) => m.userId === activity.userId);
  const userDisplayName = getActivityUserDisplayName(
    activity.user,
    member,
    t(TK.memberFallback),
  );
  const avatarUrl = getActivityUserAvatarUrl(activity.user);
  const initials = getInitials(userDisplayName);

  const translationKey = ACTIVITY_FIELD_TRANSLATION_KEYS[activity.fieldChanged];
  const fieldLabel = translationKey ? t(translationKey) : activity.fieldChanged;

  return (
    <div className="flex gap-2.5 items-start text-xs border-b border-border/30 pb-2.5 last:border-0 last:pb-0">
      <Avatar
        src={avatarUrl}
        alt={userDisplayName}
        fallback={initials}
        size="sm"
        className="mt-0.5 shrink-0 w-6 h-6 text-[10px]"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="font-semibold text-foreground text-[12px]">
            {userDisplayName}
          </span>
          <span className="text-[10px] text-muted-foreground/70 shrink-0">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
        <div className="mt-0.5 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {fieldLabel}
          </span>
          <div>{renderActivityDetail(activity, t, TK)}</div>
        </div>
      </div>
    </div>
  );
}
