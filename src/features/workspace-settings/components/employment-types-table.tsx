import { MoreHorizontal, Pencil, Briefcase } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { useEmploymentTypes } from "@/features/employment-types/hooks/use-employment-types";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { EmploymentType } from "@/types/workspace.types";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { TRANSLATION_KEYS } from "@/constants/translations";

interface EmploymentTypesTableProps {
  onEdit?: (employmentType: EmploymentType) => void;
}

export function EmploymentTypesTable({ onEdit }: EmploymentTypesTableProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.tables.employmentTypes;
  const { data: employmentTypesResponse, isLoading } = useEmploymentTypes();
  const employmentTypes = employmentTypesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
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
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {employmentTypes.map((et) => (
          <TableRow key={et.id} className="group">
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-slate-800">
                  {et.name}
                </span>
                {et.description && (
                  <span className="text-[12px] text-slate-500">
                    {et.description}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TableActionBtn onClick={() => onEdit?.(et)}>
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
