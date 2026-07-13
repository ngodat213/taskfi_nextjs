import {
  MoreHorizontal,
  Calendar,
  MapPin,
  Folder,
  Users,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import { Badge } from "@/components/ui/data-display/badge";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { Avatar } from "@/components/ui/data-display/avatar";
import { TablePagination } from "@/components/ui/data-display/table-pagination";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";

import {
  useWorkspaceMembers,
  useRemoveWorkspaceMember,
} from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useTranslations, useLocale } from "next-intl";
import { AddNewUserModal } from "./add-new-user-modal";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { WorkspaceMember } from "@/types/workspace.types";

export function MembersTable() {
  const t = useTranslations("WorkspaceSettings");
  const locale = useLocale();
  const TK = TRANSLATION_KEYS.tables.members;
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<WorkspaceMember | null>(
    null,
  );

  const { data, isLoading } = useWorkspaceMembers(activeWorkspaceId as string, {
    page,
    limit,
  });

  const removeMutation = useRemoveWorkspaceMember();

  const handleRemoveMember = async (memberId: string) => {
    if (
      confirm(
        t("messages.removeConfirm") ||
          "Are you sure you want to remove this member?",
      )
    ) {
      await removeMutation.mutateAsync({
        workspaceId: activeWorkspaceId as string,
        memberId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const members = data?.data?.data || [];

  return (
    <div className="flex flex-col w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(TK.member)}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t(TK.position)}
            </TableHead>
            <TableHead className="hidden xl:table-cell">
              {t(TK.details)}
            </TableHead>
            <TableHead className="hidden lg:table-cell">{t(TK.role)}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t(TK.status)}
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-[300px] p-0">
                <EmptyState
                  icon={Users}
                  title={t(TK.emptyTitle)}
                  description={t(TK.emptyDesc)}
                />
              </TableCell>
            </TableRow>
          ) : (
            members.map((m, i) => (
              <TableRow key={i} className="group">
                {/* Employee Info */}
                <TableCell className="border-l-2 border-transparent group-hover:border-blue-500 transition-colors align-top md:align-middle">
                  <div className="flex items-start md:items-center gap-3">
                    <Avatar
                      fallback={m.username}
                      size="sm"
                      className="mt-0.5 md:mt-0 bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 border-blue-200/60 shadow-sm ring-1 ring-transparent group-hover:ring-blue-100 transition-all"
                    />
                    <div className="flex flex-col min-w-0 flex-1 w-full whitespace-normal">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors line-clamp-1">
                          {m.username}
                        </span>
                        <span className="text-[9px] px-1.5 py-[1px] rounded bg-slate-100 text-slate-500 font-bold tracking-wider uppercase hidden lg:inline-block">
                          {t(TK.fullTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-[1px]">
                        <span className="text-[11.5px] text-slate-500 truncate">
                          {m.email}
                        </span>
                        <span className="text-slate-300 hidden xl:inline-block text-[10px]">
                          •
                        </span>
                        <span className="text-[11px] text-slate-400 truncate hidden xl:inline-block">
                          {m.phone || "N/A"}
                        </span>
                      </div>

                      {/* Mobile inline info */}
                      <div className="flex flex-col gap-2 mt-2.5 md:hidden w-full">
                        <span className="text-[12px] text-slate-700 font-medium">
                          {m.jobTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Position & Skills */}
                <TableCell className="hidden md:table-cell align-top md:align-middle">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-700 font-medium text-[12.5px]">
                        {m.jobTitle || t(TK.memberRoleDefault)}
                      </span>
                      <span className="text-slate-300 text-[10px]">•</span>
                      <span className="text-slate-500 text-[12px]">
                        {m.department || t(TK.departmentDefault)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Folder className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 text-[11.5px]">
                        {t(TK.projectsCount, { count: 0 })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {(m.tags || []).slice(0, 2).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="slate"
                          className="px-1.5 py-0.5 bg-white shadow-sm rounded text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>

                {/* Details */}
                <TableCell className="hidden xl:table-cell align-top md:align-middle">
                  <div className="flex flex-col gap-1.5 text-[12.5px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.location || t(TK.notAvailable)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {t(TK.joined)}{" "}
                        {new Date(m.createdAt).toLocaleDateString(locale, {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className="hidden lg:table-cell align-top md:align-middle">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-slate-700">
                      {m.roleName}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="hidden sm:table-cell align-top md:align-middle">
                  <Badge
                    variant={
                      m.status === "pending"
                        ? "amber"
                        : (m.status || "active") === "active"
                          ? "emerald"
                          : "slate"
                    }
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                  >
                    {m.status === "pending"
                      ? t(TK.statusPending)
                      : (m.status || "active") === "active"
                        ? t(TK.statusActive)
                        : t(TK.statusInactive)}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right align-top md:align-middle pr-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TableActionBtn
                      onClick={() => {
                        setMemberToEdit(m);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </TableActionBtn>
                    <TableActionBtn
                      onClick={() => handleRemoveMember(m.userId)}
                      disabled={removeMutation.isPending}
                    >
                      {removeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </TableActionBtn>
                    <TableActionBtn>
                      <MoreHorizontal className="w-4 h-4" />
                    </TableActionBtn>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        page={page}
        limit={limit}
        total={data?.data?.total || 0}
        totalPages={data?.data?.totalPages || 0}
        hasPreviousPage={data?.data?.hasPreviousPage || false}
        hasNextPage={data?.data?.hasNextPage || false}
        onPageChange={setPage}
      />

      <AddNewUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setMemberToEdit(null);
        }}
        mode="edit"
        memberToEdit={memberToEdit}
      />
    </div>
  );
}
