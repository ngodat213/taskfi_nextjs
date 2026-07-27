import { CircleNotch, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/data-display/badge";
import { Avatar } from "@/components/ui/data-display/avatar";
import { AvatarGroup } from "@/components/ui/data-display/avatar-group";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { Project } from "@/types/project.types";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { APP_CONFIG } from "@/config/app.config";
import { useRouter } from "next/navigation";

export function ProjectGroupSection({
  group,
  onEditProject,
}: {
  group: { id: string; name: string };
  onEditProject?: (project: Project) => void;
}) {
  const t = useTranslations("Projects");
  const TK = TRANSLATION_KEYS.PROJECTS.allProjects;
  const router = useRouter();

  const { data: projectsResponse, isLoading: isLoadingProjects } = useProjects(
    group.id,
    {
      page: 1,
      limit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    },
  );

  const groupProjects = projectsResponse?.data?.data || [];

  let content = null;
  if (isLoadingProjects) {
    content = (
      <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
        <CircleNotch className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  } else if (groupProjects.length === 0) {
    content = (
      <div className="text-sm text-muted-foreground py-4 px-4 bg-card border border-border rounded-lg border-dashed">
        {t(TK.noProjects)}
      </div>
    );
  } else {
    content = groupProjects.map((project) => (
      <div
        key={project.id}
        onClick={() => router.push(`/projects/${project.id}`)}
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-4 items-start md:items-center px-4 py-3 sm:py-2.5 bg-card border border-border/80 rounded-xl shadow-2xs hover:border-border transition-all duration-200 cursor-pointer group"
      >
        {/* Project Name */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-md border border-border flex items-center justify-center bg-card shadow-sm shrink-0 group-hover:border-blue-200 transition-colors mt-0.5 sm:mt-0 overflow-hidden">
            {project.logo?.fileUrl || project.logoUrl ? (
              <Image
                src={project.logo?.fileUrl || project.logoUrl || ""}
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
            <span className="text-[13.5px] font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {project.name}
            </span>
            <span className="text-[11.5px] text-muted-foreground line-clamp-1">
              {project.key}{" "}
              <span className="mx-1 text-muted-foreground">•</span>{" "}
              {project.description || t(TK.noDescription)}
            </span>
          </div>
        </div>

        {/* Type - Hidden on smaller screens, shown inline later */}
        <div className="hidden lg:flex items-center">
          <Badge variant="blue" className="text-[10px] uppercase font-semibold">
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

        {/* Members & Actions */}
        <div className="hidden md:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AvatarGroup
              mockCount={3}
              max={3}
              avatarClassName="w-5 h-5 border-[1.5px] border-white"
            />
            <span className="text-[12.5px] text-muted-foreground group-hover:text-slate-900 transition-colors">
              1
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProject?.(project);
            }}
            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-primary hover:bg-muted transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
            title="Edit Project"
          >
            <PencilSimple className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Extra Info (Type, Group, Members inline for small screens) */}
        <div className="flex md:hidden items-center justify-between gap-2 pl-11 w-full">
          <div className="flex items-center gap-2 flex-wrap">
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
            <div className="flex items-center gap-1.5 shrink-0">
              <AvatarGroup
                mockCount={1}
                max={1}
                avatarClassName="w-4 h-4 border border-white"
              />
              <span className="text-[11px] text-muted-foreground">1</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProject?.(project);
            }}
            className="p-1 rounded-md text-muted-foreground/70 hover:text-primary hover:bg-muted transition-all cursor-pointer"
            title="Edit Project"
          >
            <PencilSimple className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    ));
  }

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <Avatar
          fallback={group.name}
          className="w-5 h-5 rounded text-[10px] text-foreground bg-card shadow-sm border border-border"
        />
        <span className="text-[13px] font-semibold text-foreground tracking-tight">
          {group.name}
        </span>
        <div className="px-1.5 py-px bg-secondary text-muted-foreground rounded text-xs font-semibold uppercase ml-0.5 flex items-center justify-center min-w-15">
          {isLoadingProjects ? (
            <CircleNotch className="w-2.5 h-2.5 animate-spin" />
          ) : (
            t(TK.projectsCount, { count: groupProjects.length })
          )}
        </div>
      </div>

      {/* Table Header (Hidden on small screens) */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] px-4 py-1 mb-0.5 gap-4">
        <span className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.projectName)}
        </span>
        <span className="hidden lg:block text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.type)}
        </span>
        <span className="hidden lg:block text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.group)}
        </span>
        <span className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.projectLead)}
        </span>
      </div>

      {/* Clean White Rows - Responsive Grid */}
      <div className="flex flex-col gap-2 sm:gap-1.5">{content}</div>
    </div>
  );
}
