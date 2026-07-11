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
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto relative z-10 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
