import { MoreHorizontal, Pencil, Building2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { useDepartments } from "@/features/departments/hooks/use-departments";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { Department } from "@/types/workspace.types";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { EntityMemberCount } from "@/features/workspace-settings/components/entity-member-count";
import { useWorkspaceStore } from "@/store/workspace.store";

interface DepartmentsTableProps {
  onEdit?: (department: Department) => void;
}

export function DepartmentsTable({ onEdit }: DepartmentsTableProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.tables.departments;
  const { data: departmentsResponse, isLoading } = useDepartments();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const departments = departmentsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={t(TK.emptyTitle)}
        description={t(TK.emptyDesc)}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t(TK.departmentName)}</TableHead>
          <TableHead className="hidden sm:table-cell">{t(TK.members)}</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((d) => (
          <TableRow key={d.id} className="group">
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-slate-800">
                  {d.name}
                </span>
                {d.description && (
                  <span className="text-[12px] text-slate-500">
                    {d.description}
                  </span>
                )}
                <span className="text-[11px] text-slate-500 mt-1 sm:hidden flex items-center gap-1.5">
                  <EntityMemberCount
                    workspaceId={activeWorkspaceId as string}
                    params={{ departmentId: d.id }}
                  />{" "}
                  {t(TK.members).toLowerCase()}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-[13px] text-slate-600">
                <EntityMemberCount
                  workspaceId={activeWorkspaceId as string}
                  params={{ departmentId: d.id }}
                />
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TableActionBtn onClick={() => onEdit?.(d)}>
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
