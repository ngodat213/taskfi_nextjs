import { FileTextIcon, FilePdfIcon, FigmaLogoIcon, CodeIcon, TableIcon, ArchiveIcon } from "@phosphor-icons/react/dist/ssr";
import { DocumentFileType } from "@/features/documents/types/documents.types";

export function getFileTypeStyle(type: DocumentFileType) {
  switch (type) {
    case "pdf":
      return {
        icon: FilePdfIcon,
        style: "text-rose-500 bg-rose-500/10 border-rose-500/25",
        accentGlow: "from-rose-500/20 via-rose-500/5 to-transparent",
        accentBorder: "border-t-rose-500",
        badgeStyle:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "figma":
      return {
        icon: FigmaLogoIcon,
        style: "text-purple-500 bg-purple-500/10 border-purple-500/25",
        accentGlow: "from-purple-500/20 via-purple-500/5 to-transparent",
        accentBorder: "border-t-purple-500",
        badgeStyle:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "markdown":
      return {
        icon: CodeIcon,
        style: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
        accentGlow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        accentBorder: "border-t-emerald-500",
        badgeStyle:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "spreadsheet":
      return {
        icon: TableIcon,
        style: "text-amber-500 bg-amber-500/10 border-amber-500/25",
        accentGlow: "from-amber-500/20 via-amber-500/5 to-transparent",
        accentBorder: "border-t-amber-500",
        badgeStyle:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "archive":
      return {
        icon: ArchiveIcon,
        style: "text-indigo-500 bg-indigo-500/10 border-indigo-500/25",
        accentGlow: "from-indigo-500/20 via-indigo-500/5 to-transparent",
        accentBorder: "border-t-indigo-500",
        badgeStyle:
          "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      };
    default:
      return {
        icon: FileTextIcon,
        style: "text-blue-500 bg-blue-500/10 border-blue-500/25",
        accentGlow: "from-blue-500/20 via-blue-500/5 to-transparent",
        accentBorder: "border-t-blue-500",
        badgeStyle:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
  }
}

export function getFolderColorStyle(color: string) {
  switch (color) {
    case "green":
      return {
        style:
          "text-emerald-500 bg-emerald-500/10 border-emerald-500/25 group-hover:bg-emerald-500/15",
        glow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
        accentLine: "bg-emerald-500",
        iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500",
      };
    case "purple":
      return {
        style:
          "text-purple-500 bg-purple-500/10 border-purple-500/25 group-hover:bg-purple-500/15",
        glow: "from-purple-500/15 via-purple-500/5 to-transparent",
        accentLine: "bg-purple-500",
        iconBg: "bg-purple-500/15 border-purple-500/30 text-purple-500",
      };
    case "amber":
      return {
        style:
          "text-amber-500 bg-amber-500/10 border-amber-500/25 group-hover:bg-amber-500/15",
        glow: "from-amber-500/15 via-amber-500/5 to-transparent",
        accentLine: "bg-amber-500",
        iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-500",
      };
    case "rose":
      return {
        style:
          "text-rose-500 bg-rose-500/10 border-rose-500/25 group-hover:bg-rose-500/15",
        glow: "from-rose-500/15 via-rose-500/5 to-transparent",
        accentLine: "bg-rose-500",
        iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-500",
      };
    case "indigo":
      return {
        style:
          "text-indigo-500 bg-indigo-500/10 border-indigo-500/25 group-hover:bg-indigo-500/15",
        glow: "from-indigo-500/15 via-indigo-500/5 to-transparent",
        accentLine: "bg-indigo-500",
        iconBg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-500",
      };
    default:
      return {
        style:
          "text-blue-500 bg-blue-500/10 border-blue-500/25 group-hover:bg-blue-500/15",
        glow: "from-blue-500/15 via-blue-500/5 to-transparent",
        accentLine: "bg-blue-500",
        iconBg: "bg-blue-500/15 border-blue-500/30 text-blue-500",
      };
  }
}
