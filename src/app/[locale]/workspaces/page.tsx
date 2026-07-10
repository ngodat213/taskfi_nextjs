"use client";

import { useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  Plus,
  Briefcase,
  Command,
  Cloud,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { AnimatedBackground } from "@/components/ui/animated-background";

const MOCK_WORKSPACES = [
  {
    id: "ws-1",
    name: "Acme Corp",
    role: "Admin",
    icon: Command,
    color: "bg-blue-50 text-blue-600 border-blue-100/50",
  },
  {
    id: "ws-2",
    name: "Startup Inc",
    role: "Member",
    icon: Cloud,
    color: "bg-purple-50 text-purple-600 border-purple-100/50",
  },
  {
    id: "ws-3",
    name: "Personal",
    role: "Owner",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  },
];

export default function WorkspaceSelectionPage() {
  const router = useRouter();
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);

  const handleSelect = (id: string) => {
    setWorkspace(id);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Beautiful Typography Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-10 h-10 bg-slate-900 rounded-[12px] flex items-center justify-center shadow-lg mb-5 shadow-slate-900/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            Where work happens
          </h1>
          <p className="text-[13.5px] text-slate-500 max-w-[300px] leading-relaxed">
            Choose a workspace to collaborate, manage projects, and achieve your
            goals together.
          </p>
        </div>

        {/* Floating List without the enclosing white box */}
        <div className="flex flex-col gap-2 w-full max-w-[360px]">
          {MOCK_WORKSPACES.map((ws) => {
            const Icon = ws.icon;
            return (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws.id)}
                className="group flex items-center gap-3 w-full p-2 pr-3 bg-white/40 hover:bg-white/80 backdrop-blur-xl border border-white/60 hover:border-slate-200/80 rounded-[14px] shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 text-left"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105",
                    ws.color,
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {ws.name}
                  </div>
                  <div className="text-[11.5px] text-slate-500 truncate mt-0.5">
                    {ws.role}
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            );
          })}

          {/* Create New */}
          <button
            onClick={() => {}}
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

        {/* Footer Link */}
        <div className="mt-8 flex items-center justify-center text-[12px] text-slate-500">
          <button className="font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group">
            Sign in with a different account
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
