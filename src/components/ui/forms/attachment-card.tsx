import {
  File as FileIcon,
  X,
  ImageSquare as ImageIcon,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";
import { IssueAttachment } from "@/types/issue.types";
import {
  getCloudinaryUrl,
  formatBytes,
  getFileNameFromUrl,
  isImageUrl,
} from "@/utils/cloudinary";

export interface AttachmentCardProps {
  item: IssueAttachment | string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  className?: string;
}

export function AttachmentCard({
  item,
  onRemove,
  showRemoveButton = true,
  className,
}: AttachmentCardProps) {
  const rawUrl =
    typeof item === "string"
      ? item
      : item.fileUrl ||
        (item as unknown as Record<string, string>).file_url ||
        "";
  const fileUrl = getCloudinaryUrl(rawUrl) || rawUrl;
  const fileSize =
    typeof item === "object"
      ? item.fileSize || (item as unknown as Record<string, number>).file_size
      : undefined;

  if (!fileUrl) return null;

  const fileName = getFileNameFromUrl(fileUrl);
  const isImage = isImageUrl(fileUrl);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/60 group hover:border-primary/50 transition-colors",
        className,
      )}
    >
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 overflow-hidden flex-1 pr-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          {isImage ? (
            <ImageIcon className="w-4 h-4 text-primary" />
          ) : (
            <FileIcon className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-[12px] font-medium text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-1">
            {fileName}
            <ArrowSquareOut className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          {fileSize && (
            <span className="text-[10px] text-muted-foreground">
              {formatBytes(fileSize)}
            </span>
          )}
        </div>
      </a>

      {showRemoveButton && onRemove && (
        <Button
          type="button"
          variant={ButtonVariant.Ghost}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={onRemove}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}

export interface LocalFileCardProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

export function LocalFileCard({
  file,
  onRemove,
  className,
}: LocalFileCardProps) {
  const isImage = file.type.startsWith("image/");
  const extension = file.name.split(".").pop();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/60 group",
        className,
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1 pr-2">
        <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
          {isImage ? (
            <ImageIcon className="w-4 h-4 text-blue-500" />
          ) : (
            <FileIcon className="w-4 h-4 text-blue-500" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-[12px] font-medium text-foreground truncate">
            {file.name}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>{formatBytes(file.size)}</span>
            {extension && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="uppercase">{extension}</span>
              </>
            )}
          </span>
        </div>
      </div>
      {onRemove && (
        <Button
          type="button"
          variant={ButtonVariant.Ghost}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={onRemove}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
