"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { usePathname, useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";

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
    <div className="flex h-screen overflow-hidden bg-[#FCFCFD] w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-blue-100/40 via-sky-50/20 to-transparent blur-[100px] pointer-events-none z-0 opacity-70" />
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-sky-100/40 via-blue-50/20 to-transparent blur-[100px] pointer-events-none z-0 opacity-70" />

        <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto relative z-10 w-full h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
