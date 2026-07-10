import Image from "next/image";
import { Plus, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { Workspace } from "@/features/workspaces/types/workspace.types";

interface WorkspaceListProps {
  workspaces: Workspace[];
  isLoading: boolean;
  onSelect: (id: string) => void;
  onCreateClick: () => void;
}

export function WorkspaceList({
  workspaces,
  isLoading,
  onSelect,
  onCreateClick,
}: WorkspaceListProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[360px]">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : (
        workspaces.map((ws: Workspace) => {
          return (
            <button
              key={ws.id}
              onClick={() => onSelect(ws.id)}
              className="group flex items-center gap-3 w-full p-2 pr-3 bg-white/40 hover:bg-white/80 backdrop-blur-xl border border-white/60 hover:border-slate-200/80 rounded-[14px] shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 text-left"
            >
              {ws.logoUrl ? (
                <Image
                  src={ws.logoUrl.replace("hhttps", "https")}
                  alt={ws.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border transition-transform duration-300 group-hover:scale-105 bg-slate-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 bg-blue-50 text-blue-600 border-blue-100/50">
                  <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {ws.name}
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          );
        })
      )}

      {/* Create New */}
      <button
        onClick={onCreateClick}
        className="group flex items-center gap-3 w-full p-2 pr-3 bg-slate-50/30 hover:bg-white/80 backdrop-blur-xl border border-slate-200/40 hover:border-blue-200 rounded-[14px] shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 text-left mt-1"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-dashed border-slate-300 bg-white group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
            Create new workspace
          </div>
        </div>
      </button>
    </div>
  );
}
