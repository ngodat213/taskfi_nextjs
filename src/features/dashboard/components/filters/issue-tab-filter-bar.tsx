"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";
import { IssueType, IssuePriority } from "@/types/issue.types";
import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";

import {
  useWorkspaceConfig,
  useWorkspaceMembers,
} from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

interface IssueTabFilterBarProps {
  q: string;
  onSearchChange: (val: string) => void;
  assigneeFilter: string;
  onAssigneeChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
}

export function IssueTabFilterBar({
  q,
  onSearchChange,
  assigneeFilter,
  onAssigneeChange,
  typeFilter,
  onTypeChange,
  priorityFilter,
  onPriorityChange,
}: IssueTabFilterBarProps) {
  const t = useTranslations("Dashboard");

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: 50 },
  );

  const members = membersResponse?.data?.data || [];

  const dynamicTypes =
    configResponse?.data?.issueTypes?.map((t) => t.name) ||
    Object.values(IssueType);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          variant="pill"
          placeholder={t(TRANSLATION_KEYS.DASHBOARD.searchPlaceholder)}
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
        />
      </div>

      {/* Assignee Filter */}
      <Select
        value={assigneeFilter || "Assignee"}
        onChange={(val) => onAssigneeChange(val === "Assignee" ? "" : val)}
        wrapperClassName="w-fit min-w-[130px]"
        className="h-8 text-[12.5px] rounded-full border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
      >
        <option value="Assignee" disabled hidden>
          {t("filters.Assignee" as Parameters<typeof t>[0])}
        </option>
        <option value="all">
          {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
            filter: t("filters.Assignee" as Parameters<typeof t>[0]),
          })}
        </option>
        <option value="unassigned">Unassigned</option>
        {members.map((m) => (
          <option key={m.userId} value={m.userId}>
            {m.username || m.email}
          </option>
        ))}
      </Select>

      {/* Type Filter */}
      <Select
        value={typeFilter || "Type"}
        onChange={(val) => onTypeChange(val === "Type" ? "" : val)}
        wrapperClassName="w-fit min-w-[130px]"
        className="h-8 text-[12.5px] rounded-full border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
      >
        <option value="Type" disabled hidden>
          {t("filters.Type" as Parameters<typeof t>[0])}
        </option>
        <option value="all">
          {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
            filter: t("filters.Type" as Parameters<typeof t>[0]),
          })}
        </option>
        {dynamicTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      {/* Priority Filter */}
      <Select
        value={priorityFilter || "Priority"}
        onChange={(val) => onPriorityChange(val === "Priority" ? "" : val)}
        wrapperClassName="w-fit min-w-[130px]"
        className="h-8 text-[12.5px] rounded-full border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
      >
        <option value="Priority" disabled hidden>
          {t("filters.Priority" as Parameters<typeof t>[0])}
        </option>
        <option value="all">
          {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
            filter: t("filters.Priority" as Parameters<typeof t>[0]),
          })}
        </option>
        {Object.values(IssuePriority).map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </Select>
    </div>
  );
}
