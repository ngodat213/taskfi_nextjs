import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-display/table";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { PERMISSION_MATRIX } from "@/constants/permissions";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { cn } from "@/utils/cn";

interface PermissionMatrixTableProps {
  permissions: string[];
  onChange: (newPermissions: string[]) => void;
}

export function PermissionMatrixTable({
  permissions,
  onChange,
}: PermissionMatrixTableProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.modals.addRole.matrix;

  const handlePermissionChange = (permId: string, checked: boolean) => {
    if (checked) {
      if (!permissions.includes(permId)) {
        onChange([...permissions, permId]);
      }
    } else {
      onChange(permissions.filter((p) => p !== permId));
    }
  };

  const getRowPermissions = (row: (typeof PERMISSION_MATRIX)[0]) => {
    const perms: string[] = [];
    if (row.permissions.read) perms.push(row.permissions.read);
    if (row.permissions.create) perms.push(row.permissions.create);
    if (row.permissions.update) perms.push(row.permissions.update);
    if (row.permissions.delete) perms.push(row.permissions.delete);
    if (row.permissions.other?.id) perms.push(row.permissions.other.id);
    return perms;
  };

  const isRowFullySelected = (row: (typeof PERMISSION_MATRIX)[0]) => {
    const rowPerms = getRowPermissions(row);
    if (rowPerms.length === 0) return false;
    return rowPerms.every((p) => permissions.includes(p));
  };

  const handleSelectRow = (
    row: (typeof PERMISSION_MATRIX)[0],
    checked: boolean,
  ) => {
    const rowPerms = getRowPermissions(row);
    if (checked) {
      const newPerms = [...permissions];
      rowPerms.forEach((p) => {
        if (!newPerms.includes(p)) newPerms.push(p);
      });
      onChange(newPerms);
    } else {
      onChange(permissions.filter((p) => !rowPerms.includes(p)));
    }
  };

  const renderCheckbox = (permId?: string | null, label?: string) => (
    <TableCell className={cn("py-2.5", label ? "px-4" : "px-2 text-center")}>
      {permId &&
        (label ? (
          <label className="flex items-center justify-center gap-1.5 cursor-pointer">
            <Checkbox
              id={permId}
              title={permId}
              checked={permissions.includes(permId)}
              onChange={(e) => handlePermissionChange(permId, e.target.checked)}
            />
            <span className="text-[12px] text-muted-foreground font-medium">
              {label}
            </span>
          </label>
        ) : (
          <div className="flex justify-center">
            <Checkbox
              id={permId}
              title={permId}
              checked={permissions.includes(permId)}
              onChange={(e) => handlePermissionChange(permId, e.target.checked)}
            />
          </div>
        ))}
    </TableCell>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="border-b border-border hover:bg-muted">
            <TableHead className="py-2.5 px-4 text-[13px] font-semibold text-foreground w-[25%] h-auto">
              {t(TK.resource)}
            </TableHead>
            <TableHead className="py-2.5 px-2 text-[13px] font-semibold text-foreground text-center w-[15%] h-auto">
              {t(TK.read)}
            </TableHead>
            <TableHead className="py-2.5 px-2 text-[13px] font-semibold text-foreground text-center w-[15%] h-auto">
              {t(TK.create)}
            </TableHead>
            <TableHead className="py-2.5 px-2 text-[13px] font-semibold text-foreground text-center w-[15%] h-auto">
              {t(TK.update)}
            </TableHead>
            <TableHead className="py-2.5 px-2 text-[13px] font-semibold text-foreground text-center w-[15%] h-auto">
              {t(TK.delete)}
            </TableHead>
            <TableHead className="py-2.5 px-4 text-[13px] font-semibold text-foreground text-center w-[15%] h-auto">
              {t(TK.other)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_MATRIX.map((row) => (
            <TableRow
              key={row.resource}
              className="border-b border-border hover:bg-muted/50"
            >
              <TableCell className="py-2.5 px-4">
                <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                  <Checkbox
                    checked={isRowFullySelected(row)}
                    onChange={(e) => handleSelectRow(row, e.target.checked)}
                  />
                  <span className="text-[13.5px] font-medium text-foreground">
                    {row.label}
                  </span>
                </label>
              </TableCell>
              {renderCheckbox(row.permissions.read)}
              {renderCheckbox(row.permissions.create)}
              {renderCheckbox(row.permissions.update)}
              {renderCheckbox(row.permissions.delete)}
              {renderCheckbox(
                row.permissions.other?.id,
                row.permissions.other?.label,
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
