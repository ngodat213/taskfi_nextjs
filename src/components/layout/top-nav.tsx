"use client";

import {
  Bell,
  HelpCircle,
  Settings,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import React from "react";
import { useProject } from "@/features/projects/hooks/use-project";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbSegments = segments.filter(
    (seg, index) => !(index === 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(seg)),
  );

  const projectIndex = breadcrumbSegments.findIndex(
    (seg) => seg === "projects",
  );
  const projectId =
    projectIndex !== -1 && projectIndex + 1 < breadcrumbSegments.length
      ? breadcrumbSegments[projectIndex + 1]
      : undefined;

  const { data: projectResponse, isLoading: isLoadingProject } =
    useProject(projectId);
  const project = projectResponse?.data;

  return (
    <header className="h-[56px] w-full bg-transparent flex items-center justify-between px-4 flex-shrink-0 z-30 sticky top-0">
      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 rounded-lg transition-colors"
        >
          <Menu className="w-[20px] h-[20px]" />
        </button>
      </div>

      {/* Left section - Breadcrumbs (Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-[14px] font-medium ml-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.back()}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
          <button
            onClick={() => router.forward()}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ChevronRight className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {breadcrumbSegments.length === 0 ? (
            <div className="flex items-center gap-2 px-2 py-1.5 text-slate-700">
              <span>Home</span>
            </div>
          ) : (
            breadcrumbSegments.map((seg, index) => {
              const isLast = index === breadcrumbSegments.length - 1;
              const isProjectIdSeg = index === projectIndex + 1;

              let title =
                seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

              if (isProjectIdSeg) {
                if (isLoadingProject) {
                  title = "";
                } else if (project?.name) {
                  title = project.name;
                }
              }

              const targetPath =
                "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/");

              return (
                <React.Fragment key={seg}>
                  <div
                    onClick={() => router.push(targetPath)}
                    className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors cursor-pointer text-slate-700"
                  >
                    <span
                      className={cn(
                        !isProjectIdSeg && "capitalize",
                        isLast ? "text-slate-800" : "text-slate-600",
                      )}
                    >
                      {title}
                    </span>
                  </div>
                  {!isLast && (
                    <span className="text-slate-400 font-light px-1">/</span>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative group hidden lg:block mr-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-[200px] h-8 pl-8 pr-3 bg-slate-100/50 border border-transparent rounded-lg text-[13px] text-slate-700 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all hover:bg-slate-100"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
          <Link href="/user-settings">
            <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
              <Settings className="w-[18px] h-[18px]" />
            </button>
          </Link>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white text-[12px] font-bold ml-2 cursor-pointer hover:opacity-90 transition-opacity">
          TN
        </div>
      </div>
    </header>
  );
}
