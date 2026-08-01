import Image from "next/image";

import {
  BriefcaseIcon,
  CaretRightIcon,
  CircleNotchIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Workspace } from "@/types/workspace.types";

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
    <div className="flex flex-col gap-2 w-full max-w-90">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <CircleNotchIcon className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        workspaces.map((ws: Workspace) => {
          return (
            <button
              key={ws.id}
              onClick={() => onSelect(ws.id)}
              className="group flex items-center gap-3 w-full p-2.5 pr-3.5 bg-secondary/60 hover:bg-secondary border border-border/80 hover:border-border rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 text-left"
            >
              {ws.logoUrl ? (
                <Image
                  src={ws.logoUrl.replace("hhttps", "https")}
                  alt={ws.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border/60 transition-transform duration-200 group-hover:scale-105 bg-background"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/60 transition-transform duration-200 group-hover:scale-105 bg-secondary text-foreground">
                  <BriefcaseIcon className="w-4 h-4" strokeWidth={2.5} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {ws.name}
                </div>
              </div>

              <CaretRightIcon className="w-3.5 h-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>
          );
        })
      )}

      {/* Create New */}
      <button
        onClick={onCreateClick}
        className="group flex items-center gap-3 w-full p-2.5 pr-3.5 bg-background/50 hover:bg-secondary/60 border border-dashed border-border hover:border-primary/50 rounded-xl transition-all duration-200 text-left mt-1"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-dashed border-border bg-card group-hover:border-primary/50 transition-colors">
          <PlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Create new workspace
          </div>
        </div>
      </button>
    </div>
  );
}
