import {
  SearchSelect,
  SearchSelectOption,
} from "@/components/ui/forms/search-select";
import { Select } from "@/components/ui/forms/select";
import { Issue, IssueStatus, IssueType } from "@/types/issue.types";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useWorkspaceMembers,
  useWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import { PRIORITY_OPTIONS } from "@/features/dashboard/helpers/create-task.helpers";
import { ReactNode } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { cn } from "@/utils/cn";

interface PropertySelectProps {
  label: string;
  options: SearchSelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  action?: ReactNode;
  errorMessage?: string;
  clearable?: boolean;
}

function PropertySelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  action,
  errorMessage,
  clearable = false,
}: PropertySelectProps) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {action}
      </div>
      <SearchSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        clearable={clearable}
        className={cn(
          "h-9 text-[13px] w-full font-medium",
          errorMessage && "border-destructive focus:ring-destructive/20",
        )}
      />
      <ErrorTooltip message={errorMessage} />
    </div>
  );
}

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
  const priority = issue.priority || "MEDIUM";
  const { data: currentUserResponse } = useCurrentUser();
  const currentUserId = currentUserResponse?.data?.id;

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: 50 },
  );
  const members = membersResponse?.data?.data || [];

  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const statuses: { name: string }[] = configResponse?.data?.statuses || [];
  const issueTypes: { name: string }[] = configResponse?.data?.issueTypes || [];

  const typeOptions: SearchSelectOption[] = issueTypes.map((t) => ({
    value: t.name,
    label: t.name,
    icon: (
      <TypeIcon type={t.name as IssueType} className="w-3.5 h-3.5 shrink-0" />
    ),
  }));

  const statusOptions: SearchSelectOption[] = statuses.map((s) => ({
    value: s.name,
    label: s.name,
    badge: <StatusBadge status={s.name as IssueStatus} />,
  }));

  const priorityOptions: SearchSelectOption[] = PRIORITY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const matchedTypeValue =
    issueTypes.find(
      (t) => t.name.toLowerCase() === (issue.type || "").toLowerCase(),
    )?.name ||
    issue.type ||
    "";

  const matchedStatusValue =
    statuses.find(
      (s) => s.name.toLowerCase() === (issue.status || "").toLowerCase(),
    )?.name ||
    issue.status ||
    "";

  return (
    <div className="w-full flex flex-col h-full gap-8">
      {/* Details List */}
      <div className="flex flex-col gap-4">
        {/* Type */}
        <PropertySelect
          label="Type"
          options={typeOptions}
          value={matchedTypeValue}
          onChange={(val) => onUpdate("type", val)}
          errorMessage={fieldErrors?.type}
        />

        {/* Status */}
        <PropertySelect
          label="Status"
          options={statusOptions}
          value={matchedStatusValue}
          onChange={(val) => onUpdate("status", val)}
          errorMessage={fieldErrors?.status}
        />

        {/* Priority */}
        <PropertySelect
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(val) => onUpdate("priority", val)}
          errorMessage={fieldErrors?.priority}
        />

        {/* Assignee */}
        <div className="flex flex-col gap-1.5 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Assignee
            </span>
            {currentUserId && issue.assigneeId !== currentUserId ? (
              <button
                onClick={() => onUpdate("assigneeId", currentUserId)}
                className="text-[10px] font-medium text-primary hover:underline cursor-pointer"
              >
                Assign to me
              </button>
            ) : null}
          </div>
          <Select
            value={issue.assigneeId || ""}
            onChange={(val) => onUpdate("assigneeId", val || null)}
            className={cn(
              "h-8 text-[13px] w-full font-medium",
              fieldErrors?.assigneeId &&
                "border-destructive focus:ring-destructive/20",
            )}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.username || m.email}
              </option>
            ))}
          </Select>
          <ErrorTooltip message={fieldErrors?.assigneeId} />
        </div>

        {/* Reporter */}
        <div className="flex flex-col gap-1.5 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Reporter
            </span>
          </div>
          <Select
            value={issue.reporterId || ""}
            onChange={(val) => onUpdate("reporterId", val || null)}
            className={cn(
              "h-8 text-[13px] w-full font-medium",
              fieldErrors?.reporterId &&
                "border-destructive focus:ring-destructive/20",
            )}
          >
            <option value="">System</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.username || m.email}
              </option>
            ))}
          </Select>
          <ErrorTooltip message={fieldErrors?.reporterId} />
        </div>

        {/* Story Points */}
        <div className="flex flex-col gap-2 relative">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Story Points
          </span>
          <div className="grid grid-cols-4 gap-2 mt-0.5">
            {[
              { label: "?", value: null },
              { label: "0", value: 0 },
              { label: "1/2", value: 0.5 },
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "5", value: 5 },
              { label: "8", value: 8 },
              { label: "10", value: 10 },
              { label: "13", value: 13 },
              { label: "20", value: 20 },
              { label: "40", value: 40 },
            ].map((pt) => {
              const isSelected =
                issue.storyPoints === pt.value ||
                (pt.value === null &&
                  (issue.storyPoints === null ||
                    issue.storyPoints === undefined));

              return (
                <button
                  key={pt.label}
                  onClick={() => onUpdate("storyPoints", pt.value)}
                  className={`flex items-center justify-center h-10 rounded-lg border text-[14px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:border-border hover:bg-muted"
                  }`}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
          <ErrorTooltip message={fieldErrors?.storyPoints} />
        </div>

        {/* Sprint */}
        {issue.sprintId && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sprint
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
        <div className="flex flex-col gap-1.5 relative">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Due Date
          </span>
          <input
            type="date"
            value={
              issue.dueDate
                ? new Date(issue.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const val = e.target.value;
              onUpdate("dueDate", val ? new Date(val).toISOString() : null);
            }}
            className={cn(
              "h-8 text-[13px] w-full font-medium bg-card border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-colors",
              fieldErrors?.dueDate &&
                "border-destructive focus:ring-destructive/20",
            )}
          />
          <ErrorTooltip message={fieldErrors?.dueDate} />
        </div>

        {/* Activity */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Activity
          </span>
          <EmptyState
            title="No activity yet"
            description="Activity history will appear here."
            className="py-4 px-4 bg-muted/50 border border-border/60 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
