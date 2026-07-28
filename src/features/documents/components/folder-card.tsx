"use client";

import { FolderSimpleIcon, UserIcon, DotsThreeVerticalIcon, FilesIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { FolderItem } from "@/features/documents/types/documents.types";
import { getFolderColorStyle } from "@/features/documents/utils/documents.utils";
import { TableRow, TableCell } from "@/components/ui/data-display/table";

interface FolderCardProps {
  folder: FolderItem;
  isSelected: boolean;
  viewMode: "grid" | "list";
  onSelect: (folderId: string) => void;
}

export function FolderCard({
  folder,
  isSelected,
  viewMode,
  onSelect,
}: FolderCardProps) {
  const colorStyle = getFolderColorStyle(folder.color);

  if (viewMode === "grid") {
    return (
      <motion.div
        onClick={() => onSelect(folder.id)}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className={cn(
          "relative group cursor-pointer select-none rounded-xl p-3 sm:p-3.5 border transition-all duration-200 overflow-hidden flex flex-col justify-between gap-2.5 backdrop-blur-xs",
          isSelected
            ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-md"
            : "bg-card border-border/80 hover:border-primary/50 hover:shadow-md hover:bg-card",
        )}
      >
        {/* Subtle Ambient Background Radial Glow */}
        <div
          className={cn(
            "absolute -top-12 -right-12 w-28 h-28 rounded-full bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl",
            colorStyle.glow,
          )}
        />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform duration-200",
              colorStyle.iconBg,
            )}
          >
            <FolderSimpleIcon className="w-4.5 h-4.5" weight="duotone" />
          </div>

          <div className="flex items-center gap-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border shadow-3xs",
                folder.groupType === "team"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
              )}
            >
              <span
                className={cn(
                  "w-1 h-1 rounded-full",
                  folder.groupType === "team" ? "bg-blue-500" : "bg-purple-500",
                )}
              />
              {folder.groupType === "team" ? "Team" : "Project"}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              title="More options"
            >
              <DotsThreeVerticalIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex flex-col gap-0.5 z-10">
          <h4 className="text-[13px] font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
            {folder.name}
          </h4>
          <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">
            {folder.teamName || folder.projectName}
          </p>
        </div>

        {/* Footer Meta Row */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10.5px] text-muted-foreground z-10">
          <div className="flex items-center gap-1 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30">
            <FilesIcon className="w-3 h-3 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              {folder.fileCount} files
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary border border-primary/20 text-[8.5px] font-bold flex items-center justify-center">
              {folder.owner[0]}
            </div>
            <span className="font-medium text-[10.5px] truncate max-w-20">
              {folder.owner}
            </span>
          </div>
        </div>

        {/* Bottom Accent Line Highlight */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            colorStyle.accentLine,
          )}
        />
      </motion.div>
    );
  }

  // List view mode: TableRow matching my-tasks table design
  return (
    <TableRow
      onClick={() => onSelect(folder.id)}
      className={cn(
        "group cursor-pointer transition-colors",
        isSelected ? "bg-primary/5 font-semibold" : "",
      )}
    >
      {/* Folder Name & Icon */}
      <TableCell className="align-middle px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-3xs group-hover:scale-105 transition-transform duration-200",
              colorStyle.iconBg,
            )}
          >
            <FolderSimpleIcon className="w-4 h-4" weight="duotone" />
          </div>
          <span className="text-[13px] font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
            {folder.name}
          </span>
        </div>
      </TableCell>

      {/* Scope / Group */}
      <TableCell className="align-middle">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border shrink-0",
            folder.groupType === "team"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          )}
        >
          <span
            className={cn(
              "w-1 h-1 rounded-full",
              folder.groupType === "team" ? "bg-blue-500" : "bg-purple-500",
            )}
          />
          {folder.groupType === "team" ? "Team" : "Project"}
        </span>
      </TableCell>

      {/* Target Project / Team Name */}
      <TableCell className="align-middle text-[12px] text-muted-foreground font-medium">
        {folder.teamName || folder.projectName}
      </TableCell>

      {/* File Count */}
      <TableCell className="align-middle">
        <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
          <FilesIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">
            {folder.fileCount} files
          </span>
        </div>
      </TableCell>

      {/* Owner */}
      <TableCell className="align-middle">
        <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
          <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{folder.owner}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right align-middle pr-4">
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/60 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <DotsThreeVerticalIcon className="w-3.5 h-3.5" />
        </button>
      </TableCell>
    </TableRow>
  );
}
