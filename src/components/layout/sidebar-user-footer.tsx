"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/string";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { GearIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useUserStore } from "@/store/user.store";

export interface SidebarUserFooterProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
  isCollapsed?: boolean;
  getInitials?: (name?: string | null) => string;
}

export function SidebarUserFooter({
  user: userProp,
  isCollapsed = false,
}: SidebarUserFooterProps) {
  const { data: meResponse } = useCurrentUser();
  const storeUser = useUserStore((state) => state.user);

  const currentUser = meResponse?.data;

  const user = currentUser
    ? {
        name: currentUser.full_name,
        email: currentUser.email,
        avatarUrl: currentUser.avatar?.fileUrl,
      }
    : userProp || storeUser;

  const avatarUrl = user?.avatarUrl;

  return (
    <div className="p-2 border-t border-border/40 shrink-0">
      <Link
        href="/user-settings"
        className={cn(
          "group/user flex items-center rounded-xl p-1.5 transition-all select-none cursor-pointer hover:bg-secondary/60",
          isCollapsed ? "justify-center" : "gap-2.5",
        )}
      >
        <Tooltip
          position={isCollapsed ? "right" : "top"}
          content={user?.name || "User settings"}
        >
          <div className="relative w-7.5 h-7.5 rounded-full bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            {avatarUrl &&
            (avatarUrl.startsWith("http") || avatarUrl.startsWith("/")) ? (
              <Image
                src={avatarUrl}
                alt={user?.name || "User"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              getInitials(user?.name || "User")
            )}
          </div>
        </Tooltip>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <div className="flex flex-col truncate">
                <span className="text-[12.5px] font-bold text-foreground truncate group-hover/user:text-primary transition-colors leading-tight">
                  {user?.name || "User Profile"}
                </span>
                <span className="text-[10.5px] text-muted-foreground truncate font-medium leading-tight mt-0.5">
                  Account & Settings
                </span>
              </div>

              <GearIcon className="w-3.5 h-3.5 text-muted-foreground group-hover/user:text-foreground group-hover/user:rotate-45 transition-all duration-300 shrink-0 ml-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
}
