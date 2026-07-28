import Image from "next/image";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface LogoPickerProps {
  previewUrl?: string;
  onChange: (file: File) => void;
  changeLabel?: string;
  className?: string;
}

export function LogoPicker({
  previewUrl,
  onChange,
  changeLabel = "Change",
  className,
}: LogoPickerProps) {
  const isValidPreview =
    Boolean(previewUrl) &&
    typeof previewUrl === "string" &&
    (previewUrl.startsWith("http://") ||
      previewUrl.startsWith("https://") ||
      previewUrl.startsWith("/") ||
      previewUrl.startsWith("blob:") ||
      previewUrl.startsWith("data:"));

  return (
    <div className={cn("flex justify-center mb-2", className)}>
      <div className="relative w-18 h-18 rounded-full bg-muted border border-dashed border-border flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer group overflow-hidden shadow-sm">
        {isValidPreview ? (
          <>
            <Image
              src={previewUrl}
              alt="Logo"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <span className="text-white text-[11px] font-medium">
                {changeLabel}
              </span>
            </div>
          </>
        ) : (
          <PlusIcon className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-colors" />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
