import { Select } from "@/components/ui/forms/select";
import { Issue } from "@/types/issue.types";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useWorkspaceMembers,
  useWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import { PRIORITY_OPTIONS } from "@/features/dashboard/helpers/create-task.helpers";
import { ReactNode } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

interface PropertySelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  children: ReactNode;
  action?: ReactNode;
}

function PropertySelect({
  label,
  value,
  onChange,
  children,
  action,
}: PropertySelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {action}
      </div>
      <Select
        value={value}
        onChange={onChange}
        className="h-8 text-[13px] w-full font-medium"
      >
        {children}
      </Select>
    </div>
  );
}

interface IssuePropertiesProps {
  issue: Issue;
  onUpdate: (field: keyof Issue, value: unknown) => void;
}

export function IssueProperties({ issue, onUpdate }: IssuePropertiesProps) {
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

  return (
    <div className="w-full flex flex-col h-full gap-8">
      {/* Details List */}
      <div className="flex flex-col gap-4">
        {/* Type */}
        <PropertySelect
          label="Type"
          value={issue.type || ""}
          onChange={(val) => onUpdate("type", val)}
        >
          {["EPIC", "STORY", "TASK", "SUBTASK", "BUG"].map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </PropertySelect>

        {/* Status */}
        <PropertySelect
          label="Status"
          value={issue.status?.toLowerCase() || ""}
          onChange={(val) => onUpdate("status", val)}
        >
          <option value="">Select status...</option>
          {statuses.map((s) => (
            <option key={s.name} value={s.name.toLowerCase()}>
              {s.name}
            </option>
          ))}
        </PropertySelect>

        {/* Priority */}
        <PropertySelect
          label="Priority"
          value={priority}
          onChange={(val) => onUpdate("priority", val)}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </PropertySelect>

        {/* Assignee */}
        <PropertySelect
          label="Assignee"
          value={issue.assigneeId || ""}
          onChange={(val) => onUpdate("assigneeId", val || null)}
          action={
            currentUserId && issue.assigneeId !== currentUserId ? (
              <button
                onClick={() => onUpdate("assigneeId", currentUserId)}
                className="text-[10px] font-medium text-primary hover:underline"
              >
                Assign to me
              </button>
            ) : null
          }
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.username || m.email}
            </option>
          ))}
        </PropertySelect>

        {/* Reporter */}
        <PropertySelect
          label="Reporter"
          value={issue.reporterId || ""}
          onChange={(val) => onUpdate("reporterId", val || null)}
        >
          <option value="">System</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.username || m.email}
            </option>
          ))}
        </PropertySelect>

        {/* Story Points */}
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-1.5">
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
            className="h-8 text-[13px] w-full font-medium bg-card border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
