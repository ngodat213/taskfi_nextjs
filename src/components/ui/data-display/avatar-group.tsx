import * as React from "react";

import { cn } from "@/utils/cn";

import { Avatar } from "./avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: Array<{
    id?: string;
    name?: string;
    avatarUrl?: string;
  }>;
  total?: number;
  max?: number;
  avatarClassName?: string;
  remainingClassName?: string;
  mockCount?: number;
}

export function AvatarGroup({
  users = [],
  total,
  max = 3,
  avatarClassName,
  remainingClassName,
  mockCount = 0,
  className,
  ...props
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remaining = total !== undefined ? Math.max(0, total - max) : 0;

  const mockColors = ["bg-border", "bg-border", "bg-slate-400"];

  return (
    <div className={cn("flex items-center -space-x-1.5", className)} {...props}>
      {displayUsers.map((user, i) => (
        <Avatar
          key={user.id || i}
          src={user.avatarUrl}
          fallback={user.name || "?"}
          className={avatarClassName}
        />
      ))}

      {users.length === 0 &&
        mockCount > 0 &&
        Array.from({ length: Math.min(mockCount, max) }).map((_, i) => (
          <Avatar
            key={`mock-${i}`}
            className={cn(avatarClassName, mockColors[i % mockColors.length])}
          />
        ))}

      {remaining > 0 && (
        <div
          className={cn(
            "relative rounded-full flex items-center justify-center shrink-0 z-10 font-medium bg-secondary text-muted-foreground",
            avatarClassName,
            remainingClassName,
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
