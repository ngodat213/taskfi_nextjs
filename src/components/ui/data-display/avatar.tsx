import * as React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setImageError(false);
    }, [src]);

    const sizeClasses = {
      sm: "w-8 h-8 text-[12px]",
      md: "w-9 h-9 text-[13px]",
      lg: "w-10 h-10 text-[14px]",
      xl: "w-12 h-12 text-[16px]",
    };

    const showImage = !!src && !imageError;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-border bg-muted text-muted-foreground",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt || "Avatar"}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-bold uppercase">
            {fallback?.charAt(0) || alt?.charAt(0) || "?"}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";

export { Avatar };
