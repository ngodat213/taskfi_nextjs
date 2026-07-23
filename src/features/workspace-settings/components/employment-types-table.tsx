import { DotsThree, PencilSimple, Briefcase, CircleNotch } from "@phosphor-icons/react/dist/ssr";
;
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { useEmploymentTypes } from "@/features/workspace-settings/hooks/use-employment-types";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { EmploymentType } from "@/types/workspace.types";
import { useTranslations } from "next-intl";
;
import { TRANSLATION_KEYS } from "@/constants/translations";
import { EntityMemberCount } from "@/features/workspace-settings/components/entity-member-count";
import { useWorkspaceStore } from "@/store/workspace.store";

interface EmploymentTypesTableProps {
  onEdit?: (employmentType: EmploymentType) => void;
}

export function EmploymentTypesTable({ onEdit }: EmploymentTypesTableProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.tables.employmentTypes;
  const { data: employmentTypesResponse, isLoading } = useEmploymentTypes();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const employmentTypes = employmentTypesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-50">
        <CircleNotch className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (employmentTypes.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title={t(TK.emptyTitle)}
        description={t(TK.emptyDesc)}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t(TK.employmentTypeName)}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {t(TK.members)}
          </TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {employmentTypes.map((et) => (
          <TableRow key={et.id} className="group">
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-foreground">
                  {et.name}
                </span>
                {et.description && (
                  <span className="text-[12px] text-muted-foreground">
                    {et.description}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground mt-1 sm:hidden flex items-center gap-1.5">
                  <EntityMemberCount
                    workspaceId={activeWorkspaceId as string}
                    params={{ employmentTypeId: et.id }}
                  />{" "}
                  {t(TK.members).toLowerCase()}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-[13px] text-muted-foreground">
                <EntityMemberCount
                  workspaceId={activeWorkspaceId as string}
                  params={{ employmentTypeId: et.id }}
                />
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TableActionBtn onClick={() => onEdit?.(et)}>
                  <PencilSimple className="w-4 h-4" />
                </TableActionBtn>
                <TableActionBtn>
                  <DotsThree className="w-4 h-4" />
                </TableActionBtn>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
