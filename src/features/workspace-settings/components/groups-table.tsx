import { MoreHorizontal, Users, Pencil } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { useGroups } from "@/features/groups/hooks/use-groups";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { Avatar } from "@/components/ui/data-display/avatar";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { Group } from "@/types/group.types";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { EntityMemberCount } from "@/features/workspace-settings/components/entity-member-count";
import { useWorkspaceStore } from "@/store/workspace.store";

interface GroupsTableProps {
  onEdit?: (group: Group) => void;
}

export function GroupsTable({ onEdit }: GroupsTableProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.tables.groups;
  const { data: groupsResponse, isLoading } = useGroups();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const groups = groupsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t(TK.emptyTitle)}
        description={t(TK.emptyDesc)}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t(TK.groupName)}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {t(TK.members)}
          </TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((g) => (
          <TableRow key={g.id} className="group">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar
                  src={g.logoUrl}
                  alt={g.name}
                  fallback={g.name.charAt(0)}
                  size="md"
                />
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-medium text-foreground">
                    {g.name}
                  </span>
                  {g.description && (
                    <span className="text-[12px] text-muted-foreground">
                      {g.description}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground mt-1 sm:hidden flex items-center gap-1.5">
                    <EntityMemberCount
                      workspaceId={activeWorkspaceId as string}
                      params={{ groupId: g.id }}
                    />{" "}
                    {t(TK.members).toLowerCase()}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-[13px] text-muted-foreground">
                <EntityMemberCount
                  workspaceId={activeWorkspaceId as string}
                  params={{ groupId: g.id }}
                />
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TableActionBtn onClick={() => onEdit?.(g)}>
                  <Pencil className="w-4 h-4" />
                </TableActionBtn>
                <TableActionBtn>
                  <MoreHorizontal className="w-4 h-4" />
                </TableActionBtn>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
