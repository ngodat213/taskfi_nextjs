"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/data-display/badge";
import { Avatar } from "@/components/ui/data-display/avatar";
import { AvatarGroup } from "@/components/ui/data-display/avatar-group";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { APP_CONFIG } from "@/config/app.config";

export function ProjectGroupSection({
  group,
}: {
  group: { id: string; name: string };
}) {
  const t = useTranslations("Projects");
  const TK = TRANSLATION_KEYS.PROJECTS.allProjects;

  const { data: projectsResponse, isLoading: isLoadingProjects } = useProjects(
    group.id,
    {
      page: 1,
      limit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    },
  );

  const groupProjects = projectsResponse?.data?.data || [];

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <Avatar
          fallback={group.name}
          className="w-5 h-5 rounded text-[10px] text-slate-700 bg-white shadow-sm border-slate-200"
        />
        <span className="text-[13px] font-semibold text-slate-900 tracking-tight">
          {group.name}
        </span>
        <div className="px-1.5 py-[1px] rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase ml-0.5 flex items-center justify-center min-w-[60px]">
          {isLoadingProjects ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
          ) : (
            t(TK.projectsCount, { count: groupProjects.length })
          )}
        </div>
      </div>

      {/* Table Header (Hidden on small screens) */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] px-4 py-1 mb-0.5 gap-4">
        <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
          {t(TK.projectName)}
        </span>
        <span className="hidden lg:block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
          {t(TK.type)}
        </span>
        <span className="hidden lg:block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
          {t(TK.group)}
        </span>
        <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
          {t(TK.projectLead)}
        </span>
      </div>

      {/* Clean White Rows - Responsive Grid */}
      <div className="flex flex-col gap-2 sm:gap-1.5">
        {isLoadingProjects ? (
          <div className="flex items-center justify-center p-8 bg-white border border-slate-200 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : groupProjects.length === 0 ? (
          <div className="text-sm text-slate-400 py-4 px-4 bg-white border border-slate-200 rounded-lg border-dashed">
            {t(TK.noProjects)}
          </div>
        ) : (
          groupProjects.map((project) => {
            return (
              <div
                key={project.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-4 items-start md:items-center px-4 py-3 sm:py-2.5 bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 cursor-pointer group"
              >
                {/* Project Name */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center bg-white shadow-sm flex-shrink-0 group-hover:border-blue-200 transition-colors mt-0.5 sm:mt-0 overflow-hidden">
                    {project.logoUrl ? (
                      <Image
                        src={project.logoUrl}
                        alt={project.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-blue-500 leading-[1.1] text-center uppercase">
                        {project.key.slice(0, 4)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 sm:gap-0">
                    <span className="text-[13.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.name}
                    </span>
                    <span className="text-[11.5px] text-slate-500 line-clamp-1">
                      {project.key}{" "}
                      <span className="mx-1 text-slate-300">•</span>{" "}
                      {project.description || t(TK.noDescription)}
                    </span>
                  </div>
                </div>

                {/* Type - Hidden on smaller screens, shown inline later */}
                <div className="hidden lg:flex items-center">
                  <Badge
                    variant="blue"
                    className="text-[10px] uppercase font-semibold"
                  >
                    {project.projectType}
                  </Badge>
                </div>

                {/* Group - Hidden on smaller screens */}
                <div className="hidden lg:flex items-center">
                  <Badge
                    variant="slate"
                    className="text-[10px] uppercase font-semibold"
                  >
                    {group.name}
                  </Badge>
                </div>

                {/* Members */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center gap-2">
                    <AvatarGroup
                      mockCount={3}
                      max={3}
                      avatarClassName="w-5 h-5 border-[1.5px] border-white"
                    />
                    <span className="text-[12.5px] text-slate-600 group-hover:text-slate-900 transition-colors">
                      1
                    </span>
                  </div>
                </div>

                {/* Mobile Extra Info (Type, Group, Members inline for small screens) */}
                <div className="flex md:hidden items-center gap-2 flex-wrap pl-11">
                  <Badge
                    variant="blue"
                    className="text-[10px] uppercase font-semibold"
                  >
                    {project.projectType}
                  </Badge>
                  <Badge
                    variant="slate"
                    className="text-[10px] uppercase font-semibold"
                  >
                    {group.name}
                  </Badge>
                  <div className="flex items-center gap-1.5 ml-1">
                    <AvatarGroup
                      mockCount={1}
                      max={1}
                      avatarClassName="w-4 h-4 border border-white"
                    />
                    <span className="text-[11px] text-slate-500">1</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
