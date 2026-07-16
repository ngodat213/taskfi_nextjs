import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { Loader2 } from "lucide-react";
import { WorkspaceMemberQueryParams } from "@/types/workspace.types";
import { AvatarGroup } from "@/components/ui/data-display/avatar-group";

interface EntityMemberCountProps {
  workspaceId: string;
  params: WorkspaceMemberQueryParams;
}

export function EntityMemberCount({
  workspaceId,
  params,
}: EntityMemberCountProps) {
  const { data, isLoading } = useWorkspaceMembers(workspaceId, {
    limit: 3,
    ...params,
  });

  if (isLoading) {
    return <Loader2 className="w-4 h-4 animate-spin text-slate-400" />;
  }

  const members = data?.data?.data || [];
  const total = data?.data?.total || 0;

  if (total === 0) {
    return <span className="text-slate-400 text-[11.5px]">None</span>;
  }

  return (
    <AvatarGroup
      users={members.map((m) => ({ id: m.id || m.userId, name: m.username }))}
      total={total}
      max={3}
      avatarClassName="w-7 h-7 text-[10px] border-2 border-white ring-1 ring-slate-100 shadow-sm"
    />
  );
}
