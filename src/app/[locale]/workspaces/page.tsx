"use client";
import { CommandIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useNavigationStore } from "@/store/navigation.store";
import { Workspace } from "@/types/workspace.types";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function WorkspaceSelectionPage() {
  const router = useRouter();
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const { data: response, isLoading } = useWorkspaces();
  const workspaces = Array.isArray(response?.data)
    ? response.data
    : response?.data?.data || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const pushNav = useNavigationStore((state) => state.push);
  const clearNav = useNavigationStore((state) => state.clear);

  const handleSelect = (id: string) => {
    const ws = workspaces.find((w: Workspace) => w.id === id);
    setWorkspace(id, ws);

    clearNav();
    if (ws) {
      pushNav({
        name: ws.name,
        description: ws.description,
        logoUrl: ws.logoUrl,
        backLink: "/workspaces",
      });
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl bg-transparent flex flex-col items-center"
      >
        {/* Beautiful Typography Section */}
        <div className="text-center mb-6 flex flex-col items-center">
          <motion.div
            variants={itemVariants}
            className="w-13 h-13 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-xs"
          >
            <CommandIcon className="w-6 h-6" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-2xl font-bold text-foreground tracking-tight mb-2"
          >
            Where work happens
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-[13px] text-muted-foreground max-w-72.5 leading-relaxed"
          >
            Choose a workspace to collaborate, manage projects, and achieve your
            goals together.
          </motion.p>
        </div>

        {/* Floating List */}
        <motion.div variants={itemVariants} className="w-full">
          <WorkspaceList
            workspaces={workspaces}
            isLoading={isLoading}
            onSelect={handleSelect}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </motion.div>

        {/* Footer Link */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex items-center justify-center text-[12px] text-muted-foreground pt-4 border-t border-border/40 w-full"
        >
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut
              ? "Signing out..."
              : "Sign in with a different account"}
            {!isLoggingOut && (
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </motion.div>
      </motion.div>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
