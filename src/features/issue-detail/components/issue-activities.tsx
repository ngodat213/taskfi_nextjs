import { Avatar } from "@/components/ui/data-display/avatar";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { useIssueActivities } from "@/features/projects/hooks/use-issues";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { IssueActivity } from "@/types/issue.types";
import { formatRelativeTime } from "@/utils/date";

interface IssueActivitiesProps {
  issueId: string;
}

const FIELD_LABELS: Record<string, string> = {
  "issue.created": "Khởi tạo",
  summary: "Tiêu đề",
  description: "Mô tả",
  status: "Trạng thái",
  priority: "Độ ưu tiên",
  type: "Loại công việc",
  assigneeId: "Người thực thi",
  assignee: "Người thực thi",
  reporterId: "Người báo cáo",
  reporter: "Người báo cáo",
  dueDate: "Ngày hết hạn",
  storyPoints: "Story Points",
  attachments: "Tệp đính kèm",
  links: "Liên kết",
  parentId: "Công việc cha",
  sprintId: "Sprint",
};

function formatFieldValue(value: string): string {
  if (!value) return "";
  if (value.startsWith("{") && value.endsWith("}")) {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      if (typeof parsed.summary === "string") {
        return parsed.summary;
      }
    } catch {
      // Return raw value if not valid JSON
    }
  }
  return value;
}

function renderActivityDetail(activity: IssueActivity) {
  const { fieldChanged, oldValue, newValue } = activity;

  if (fieldChanged === "issue.created") {
    const formattedSummary = formatFieldValue(newValue);
    return (
      <span className="text-[12px] text-muted-foreground">
        Đã tạo công việc
        {formattedSummary ? (
          <>
            :{" "}
            <span className="font-medium text-foreground">
              &quot;{formattedSummary}&quot;
            </span>
          </>
        ) : null}
      </span>
    );
  }

  if (fieldChanged === "description") {
    return (
      <span className="text-[12px] text-muted-foreground">
        Đã cập nhật nội dung mô tả
      </span>
    );
  }

  const cleanOld = formatFieldValue(oldValue);
  const cleanNew = formatFieldValue(newValue);

  if (!cleanOld && cleanNew) {
    return (
      <span className="text-[12px] text-muted-foreground">
        Thiết lập{" "}
        <span className="font-medium text-foreground">{cleanNew}</span>
      </span>
    );
  }

  if (cleanOld && !cleanNew) {
    return (
      <span className="text-[12px] text-muted-foreground">
        Xóa <span className="line-through opacity-70">{cleanOld}</span>
      </span>
    );
  }

  return (
    <span className="text-[12px] text-muted-foreground flex items-center gap-1 flex-wrap">
      <span className="line-through opacity-75">{cleanOld}</span>
      <span className="text-primary font-bold">&rarr;</span>
      <span className="font-semibold text-foreground">{cleanNew}</span>
    </span>
  );
}

export function IssueActivities({ issueId }: IssueActivitiesProps) {
  const { data: activities = [], isLoading } = useIssueActivities(issueId);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: 50 },
  );
  const members = membersResponse?.data?.data || [];

  if (isLoading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải lịch sử hoạt động...
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        title="Chưa có hoạt động"
        description="Lịch sử thay đổi công việc sẽ xuất hiện tại đây."
        className="py-4 px-4 bg-muted/30 border border-border/40 rounded-xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 py-1 max-h-105 overflow-y-auto pr-1">
      {activities.map((activity) => {
        const member = members.find((m) => m.userId === activity.userId);
        const userDisplayName =
          activity.user?.full_name ||
          activity.user?.name ||
          activity.user?.username ||
          member?.username ||
          member?.email ||
          "Thành viên";

        const avatarUrl =
          activity.user?.avatarUrl || activity.user?.avatar?.fileUrl;
        const initials = userDisplayName.slice(0, 2).toUpperCase();

        const fieldLabel =
          FIELD_LABELS[activity.fieldChanged] || activity.fieldChanged;

        return (
          <div
            key={activity.id}
            className="flex gap-2.5 items-start text-xs border-b border-border/30 pb-2.5 last:border-0 last:pb-0"
          >
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
                <div>{renderActivityDetail(activity)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
