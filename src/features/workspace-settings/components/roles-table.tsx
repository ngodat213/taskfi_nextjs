import { DotsThreeIcon, ShieldIcon, PencilSimpleIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useWorkspaceRoles } from "@/features/workspaces/hooks/use-workspaces";
import { cn } from "@/utils/cn";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { useTranslations } from "next-intl";
import { EntityMemberCount } from "@/features/workspace-settings/components/entity-member-count";

import { WorkspaceRole } from "@/types/workspace.types";
import { SYSTEM_ROLES } from "@/features/workspace-settings/constants/role.constants";
import { TRANSLATION_KEYS } from "@/constants/translations";

export function RolesTable({
  onEdit,
}: {
  onEdit?: (role: WorkspaceRole) => void;
}) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.tables.roles;
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: rolesResponse, isLoading } = useWorkspaceRoles(
    activeWorkspaceId as string,
  );

  if (isLoading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="h-50 p-0 text-center">
              <div className="flex items-center justify-center h-full w-full">
                <CircleNotchIcon className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  const roles = rolesResponse?.data?.data || [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t(TK.roleName)}</TableHead>
          <TableHead className="hidden sm:table-cell">{t(TK.type)}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {t(TK.members)}
          </TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="h-75 p-0">
              <EmptyState
                icon={ShieldIcon}
                title={t(TK.emptyTitle)}
                description={t(TK.emptyDesc)}
              />
            </TableCell>
          </TableRow>
        ) : (
          roles.map((r, i) => {
            const isSystem = SYSTEM_ROLES.includes(r.name.toLowerCase());

            const typeLabel = isSystem ? t(TK.system) : t(TK.custom);

            return (
              <TableRow key={r.id || i} className="group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[13.5px] font-medium text-foreground capitalize">
                      {r.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {r.description || t(TK.noDescription)}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 bg-secondary border border-border/60 text-muted-foreground rounded-md w-fit mt-1 sm:hidden">
                      {typeLabel}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 sm:hidden flex items-center gap-1.5">
                      <EntityMemberCount
                        workspaceId={activeWorkspaceId as string}
                        params={{ roleId: r.id }}
                      />{" "}
                      {t(TK.members).toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium",
                      isSystem
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-purple-50 text-purple-700 border-purple-100",
                    )}
                  >
                    {typeLabel}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-[13px] text-muted-foreground">
                    <EntityMemberCount
                      workspaceId={activeWorkspaceId as string}
                      params={{ roleId: r.id }}
                    />
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isSystem && (
                      <TableActionBtn
                        className="hover:text-blue-500 hover:bg-blue-50"
                        onClick={() => onEdit?.(r)}
                      >
                        <PencilSimpleIcon className="w-4 h-4" />
                      </TableActionBtn>
                    )}
                    <TableActionBtn>
                      <DotsThreeIcon className="w-4 h-4" />
                    </TableActionBtn>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
