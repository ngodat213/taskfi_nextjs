"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { usePathname, useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const router = useRouter();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  useEffect(() => {
    if (!activeWorkspaceId) {
      router.push("/workspaces");
    }
  }, [activeWorkspaceId, router]);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setSidebarOpen(false);
  }

  if (!activeWorkspaceId) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content View Container */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 relative w-full h-full overflow-hidden">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full flex flex-col"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
