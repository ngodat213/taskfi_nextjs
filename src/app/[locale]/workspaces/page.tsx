"use client";

import { useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Command, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";

export default function WorkspaceSelectionPage() {
  const router = useRouter();
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const { data: response, isLoading } = useWorkspaces();
  const workspaces = Array.isArray(response?.data)
    ? response.data
    : response?.data?.data || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

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
        <WorkspaceList
          workspaces={workspaces}
          isLoading={isLoading}
          onSelect={handleSelect}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        {/* Footer Link */}
        <div className="mt-8 flex items-center justify-center text-[12px] text-slate-500">
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut
              ? "Signing out..."
              : "Sign in with a different account"}
            {!isLoggingOut && (
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
