"use client";

import { StarIcon, DownloadSimpleIcon, ShareNetworkIcon, ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { DocumentItem } from "@/features/documents/types/documents.types";
import { getFileTypeStyle } from "@/features/documents/utils/documents.utils";
import { TableRow, TableCell } from "@/components/ui/data-display/table";

interface DocumentCardProps {
  doc: DocumentItem;
  viewMode: "grid" | "list";
  onToggleStar: (id: string) => void;
}

export function DocumentCard({
  doc,
  viewMode,
  onToggleStar,
}: DocumentCardProps) {
  const typeInfo = getFileTypeStyle(doc.type);
  const IconComp = typeInfo.icon;

  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className={cn(
          "bg-card border border-border/80 hover:border-primary/50 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group select-none relative overflow-hidden backdrop-blur-xs",
          typeInfo.accentBorder,
          "border-t-2",
        )}
      >
        {/* Ambient Top Glow Effect */}
        <div
          className={cn(
            "absolute -top-10 -right-10 w-28 h-28 rounded-full bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl",
            typeInfo.accentGlow,
          )}
        />

        {/* Top Row: File Icon, Meta & StarIcon Action */}
        <div className="flex items-start justify-between gap-2.5 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform duration-200",
                typeInfo.style,
              )}
            >
              <IconComp className="w-4.5 h-4.5" weight="duotone" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-extrabold uppercase tracking-wider border w-fit shadow-3xs",
                  typeInfo.badgeStyle,
                )}
              >
                {doc.category}
              </span>
              <span className="text-[10.5px] font-semibold text-muted-foreground mt-0.5">
                {doc.extension} • {doc.size}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(doc.id);
            }}
            className={cn(
              "p-1 rounded-md border transition-all cursor-pointer z-10",
              doc.starred
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-3xs"
                : "bg-muted/40 border-border/40 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20",
            )}
            title={doc.starred ? "Unstar" : "StarIcon document"}
          >
            <StarIcon
              className="w-3.5 h-3.5"
              weight={doc.starred ? "fill" : "regular"}
            />
          </button>
        </div>

        {/* Document Title & Description */}
        <div className="flex flex-col gap-0.5 z-10">
          <h4 className="text-[13.5px] font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
            {doc.title}
          </h4>
          <p className="text-[11.5px] text-muted-foreground line-clamp-1 leading-normal font-normal">
            {doc.description}
          </p>
        </div>

        {/* Footer Row: Author & Action Buttons */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10.5px] text-muted-foreground z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-4.5 h-4.5 rounded-full text-[9px] font-bold flex items-center justify-center border border-border/60 shrink-0 shadow-3xs",
                doc.author.avatarBg ||
                  "bg-primary/10 text-primary border-primary/20",
              )}
            >
              {doc.author.name[0]}
            </div>
            <span className="font-semibold text-foreground truncate max-w-22.5">
              {doc.author.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mr-1">
              <ClockIcon className="w-3 h-3" />
              <span>{doc.updatedAt}</span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Share Link"
            >
              <ShareNetworkIcon className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Download"
            >
              <DownloadSimpleIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // List view mode: TableRow matching my-tasks table design
  return (
    <TableRow className="group cursor-pointer transition-colors">
      {/* Title & File Icon */}
      <TableCell className="align-middle px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-3xs group-hover:scale-105 transition-transform duration-200",
              typeInfo.style,
            )}
          >
            <IconComp className="w-4 h-4" weight="duotone" />
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="text-[13px] font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight truncate">
              {doc.title}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
              {doc.description}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell className="align-middle">
        <span
          className={cn(
            "px-1.5 py-0.2 rounded text-[9.5px] font-extrabold uppercase tracking-wider border shrink-0",
            typeInfo.badgeStyle,
          )}
        >
          {doc.category}
        </span>
      </TableCell>

      {/* File Size & Extension */}
      <TableCell className="align-middle text-[12px] text-foreground/80 font-medium">
        {doc.extension} • {doc.size}
      </TableCell>

      {/* Last Updated */}
      <TableCell className="align-middle text-[12px] text-muted-foreground">
        {doc.updatedAt}
      </TableCell>

      {/* Author */}
      <TableCell className="align-middle">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-4.5 h-4.5 rounded-full text-[9px] font-bold flex items-center justify-center border border-border/60 shrink-0 shadow-3xs",
              doc.author.avatarBg ||
                "bg-primary/10 text-primary border-primary/20",
            )}
          >
            {doc.author.name[0]}
          </div>
          <span className="text-[12px] text-foreground font-medium">
            {doc.author.name}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right align-middle pr-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(doc.id);
            }}
            className={cn(
              "p-1 rounded-md transition-colors cursor-pointer",
              doc.starred
                ? "text-amber-500 bg-amber-500/10"
                : "text-muted-foreground hover:bg-muted hover:text-amber-500",
            )}
            title={doc.starred ? "Unstar" : "StarIcon document"}
          >
            <StarIcon
              className="w-3.5 h-3.5"
              weight={doc.starred ? "fill" : "regular"}
            />
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Download"
          >
            <DownloadSimpleIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
