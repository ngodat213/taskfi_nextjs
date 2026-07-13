import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { Loader2 } from "lucide-react";
import { WorkspaceMemberQueryParams } from "@/types/workspace.types";
import { Avatar } from "@/components/ui/data-display/avatar";

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
  const remaining = total > 3 ? total - 3 : 0;

  if (total === 0) {
    return <span className="text-slate-400 text-[11.5px]">None</span>;
  }

  return (
    <div className="flex items-center -space-x-1.5">
      {members.map((m) => (
        <Avatar
          key={m.id || m.userId}
          fallback={m.username || "?"}
          size="sm"
          className="border-2 border-white ring-1 ring-slate-100 shadow-sm w-7 h-7 text-[10px]"
        />
      ))}
      {remaining > 0 && (
        <div className="relative rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white bg-slate-100 text-slate-500 font-medium w-7 h-7 text-[10px] shadow-sm ring-1 ring-slate-100 z-10">
          +{remaining}
        </div>
      )}
    </div>
  );
}
