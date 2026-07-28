"use client";

import { TeamMemberVelocity } from "@/features/reports/types/reports.types";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/string";
import { CheckCircleIcon, ClockIcon, UserCheckIcon, WarningCircleIcon, LightningIcon } from "@phosphor-icons/react/dist/ssr";

interface TeamWorkloadCardProps {
  member: TeamMemberVelocity;
}

export function TeamWorkloadCard({ member }: TeamWorkloadCardProps) {
  const statusConfig = {
    optimal: {
      label: "OPTIMAL",
      badge:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      dot: "bg-blue-500",
      progressBg: "bg-blue-500",
      glow: "from-blue-500/15 to-transparent",
      icon: UserCheckIcon,
    },
    overburdened: {
      label: "HIGH LOAD",
      badge:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500",
      progressBg: "bg-amber-500",
      glow: "from-amber-500/15 to-transparent",
      icon: WarningCircleIcon,
    },
    available: {
      label: "AVAILABLE",
      badge:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-500",
      progressBg: "bg-emerald-500",
      glow: "from-emerald-500/15 to-transparent",
      icon: LightningIcon,
    },
  }[member.status];

  return (
    <div
      className={cn(
        "relative group cursor-pointer select-none rounded-xl p-3.5 border transition-all duration-200 overflow-hidden flex flex-col justify-between gap-3 shadow-2xs hover:border-border z-0",
        "bg-card border-border/80",
      )}
    >
      {/* Ambient Background Glow */}
      <div
        className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-3xl",
          statusConfig.glow,
        )}
      />

      {/* Top Header Row: Avatar, Name/Role & Status Badge */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "w-8.5 h-8.5 rounded-full flex items-center justify-center text-[11.5px] font-bold text-white shrink-0 border border-white/20 shadow-2xs group-hover:scale-105 transition-transform duration-200",
              member.avatarBg,
            )}
          >
            {getInitials(member.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <h5 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight truncate">
              {member.name}
            </h5>
            <span className="text-[10.5px] font-medium text-muted-foreground truncate">
              {member.role}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border shrink-0 select-none",
            statusConfig.badge,
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              statusConfig.dot,
            )}
          />
          {statusConfig.label}
        </span>
      </div>

      {/* Capacity Progress Bar */}
      <div className="flex flex-col gap-1 z-10">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground font-medium">Capacity</span>
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <span>
              {member.completedPoints}/{member.assignedPoints} pts
            </span>
            <span className="text-muted-foreground text-[10px] font-normal">
              ({member.completionRate}%)
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border/40">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              statusConfig.progressBg,
            )}
            style={{
              width: `${Math.min(member.completionRate, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] z-10 text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            <strong className="text-foreground font-semibold">
              {member.tasksCompleted}
            </strong>{" "}
            tasks
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            <strong className="text-foreground font-semibold">
              {member.avgTimePerTask}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export function TeamWorkloadTable({
  members,
}: {
  members: TeamMemberVelocity[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
      {members.map((member) => (
        <TeamWorkloadCard key={member.id} member={member} />
      ))}
    </div>
  );
}
