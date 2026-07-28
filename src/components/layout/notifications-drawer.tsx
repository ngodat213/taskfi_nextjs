"use client";

import { useState } from "react";
import { BellIcon, XIcon, CheckCircleIcon, CheckSquareIcon, BookmarkSimpleIcon, BugIcon, GitBranchIcon, GitPullRequestIcon, TrashIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/string";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";

export interface TaskFiNotificationItem {
  id: string;
  actorName: string;
  actorAvatarBg?: string;
  actionText: string;
  timestamp: string;
  read: boolean;
  itemType: "task" | "subtask" | "bug" | "story" | "pr";
  itemTitle: string;
  itemKey: string;
  itemStatus: string;
  updatesCountText?: string;
}

const INITIAL_TASKFI_NOTIFICATIONS: TaskFiNotificationItem[] = [
  {
    id: "notif-1",
    actorName: "Dat Ngo",
    actorAvatarBg: "bg-emerald-500 text-white",
    actionText: "changed a task status from In Progress to In Design",
    timestamp: "10 mins ago",
    read: false,
    itemType: "task",
    itemTitle: "TaskFi v1.4 Release Deployment & Clean Code",
    itemKey: "TASK-104",
    itemStatus: "In Design",
    updatesCountText: "+3 updates from Dat Ngo",
  },
  {
    id: "notif-2",
    actorName: "Alex Rivers",
    actorAvatarBg: "bg-blue-600 text-white",
    actionText: "mentioned you in issue discussion",
    timestamp: "45 mins ago",
    read: false,
    itemType: "subtask",
    itemTitle: "Socket Cluster NestJS Realtime Integration",
    itemKey: "TASK-112",
    itemStatus: "In Review",
    updatesCountText: "+2 mentions from Alex Rivers",
  },
  {
    id: "notif-3",
    actorName: "Sam Lee",
    actorAvatarBg: "bg-purple-600 text-white",
    actionText: "approved Pull Request #42",
    timestamp: "2 hours ago",
    read: false,
    itemType: "pr",
    itemTitle: "Refactor Calendar & Documents Store Clean Architecture",
    itemKey: "PR-42",
    itemStatus: "Approved",
    updatesCountText: "+1 transition from Sam Lee",
  },
  {
    id: "notif-4",
    actorName: "System Admin",
    actorAvatarBg: "bg-amber-500 text-white",
    actionText: "marked milestone Sprint 24 as completed",
    timestamp: "1 day ago",
    read: true,
    itemType: "story",
    itemTitle: "Sprint 24 Design Tokens & Layout Standard",
    itemKey: "SPRINT-24",
    itemStatus: "Completed",
  },
  {
    id: "notif-5",
    actorName: "Alex Rivers",
    actorAvatarBg: "bg-blue-600 text-white",
    actionText: "resolved a bug in sidebar navigation",
    timestamp: "2 days ago",
    read: true,
    itemType: "bug",
    itemTitle: "Sidebar Workspace Active State Sync Issue",
    itemKey: "BUG-08",
    itemStatus: "Resolved",
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
}: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<TaskFiNotificationItem[]>(
    INITIAL_TASKFI_NOTIFICATIONS,
  );
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    return true;
  });

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getItemTypeIcon = (type: TaskFiNotificationItem["itemType"]) => {
    switch (type) {
      case "task":
        return <CheckSquareIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case "subtask":
        return <GitBranchIcon className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
      case "bug":
        return <BugIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case "story":
        return (
          <BookmarkSimpleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        );
      case "pr":
        return (
          <GitPullRequestIcon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
        );
      default:
        return <CheckSquareIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Compact Drawer Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 33 }}
            className="relative z-10 w-full max-w-95 my-3 mr-3 h-[calc(100dvh-24px)] bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col select-none overflow-hidden"
          >
            {/* Header Section */}
            <div className="p-3.5 sm:p-4 border-b border-border/60 flex items-center justify-between gap-2.5 bg-card shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xs">
                  <BellIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Team activity & task updates
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-7.5 h-7.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Tabs & Quick Actions Bar */}
            <div className="px-3.5 py-2 border-b border-border/40 flex items-center justify-between gap-2 bg-secondary/30 shrink-0">
              <div className="flex items-center gap-1 bg-secondary/80 p-0.5 rounded-lg border border-border/50">
                {(["all", "unread"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={cn(
                      "px-3 py-0.5 rounded-md text-[11.5px] font-semibold capitalize transition-all cursor-pointer",
                      activeFilter === tab
                        ? "bg-card text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-2 py-0.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckIcon className="w-3 h-3 text-blue-500" />
                    <span>Read all</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-1 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                    title="Clear all"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List (Clean Layout Inspired by Reference Image) */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                  <CheckCircleIcon className="w-10 h-10 mb-2.5 text-muted-foreground/30" />
                  <h4 className="text-[13.5px] font-bold text-foreground">
                    All caught up!
                  </h4>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5 max-w-xs">
                    No {activeFilter !== "all" ? activeFilter : ""}{" "}
                    notifications at the moment.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    onClick={() => handleToggleRead(notif.id)}
                    className={cn(
                      "group p-3 rounded-xl border transition-all cursor-pointer flex gap-3 select-none",
                      notif.read
                        ? "bg-card/40 border-border/30 hover:bg-muted/40 opacity-75"
                        : "bg-card border-border/70 hover:border-blue-500/40 shadow-2xs ring-1 ring-blue-500/10",
                    )}
                  >
                    {/* Circle Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs mt-0.5",
                        notif.actorAvatarBg || "bg-amber-500 text-white",
                      )}
                    >
                      {getInitials(notif.actorName)}
                    </div>

                    {/* Notification Body Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {/* Header Sentence: Actor + Action + Timestamp + Unread Blue Dot */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] leading-snug text-foreground/90 font-normal">
                          <span className="font-bold text-foreground">
                            {notif.actorName}
                          </span>{" "}
                          {notif.actionText}{" "}
                          <span className="text-muted-foreground text-[11px] font-medium whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </p>

                        {!notif.read && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-0.5 shadow-2xs"
                            title="Unread notification"
                          />
                        )}
                      </div>

                      {/* Item Title & Type Icon */}
                      <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground truncate mt-0.5">
                        {getItemTypeIcon(notif.itemType)}
                        <span className="truncate hover:text-blue-500 transition-colors">
                          {notif.itemTitle}
                        </span>
                      </div>

                      {/* Item Key & Status */}
                      <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                        <span>{notif.itemKey}</span>
                        <span>•</span>
                        <span className="text-foreground/80 font-semibold">
                          {notif.itemStatus}
                        </span>
                      </div>

                      {/* Grouped Updates Sub-row */}
                      {notif.updatesCountText && (
                        <div className="flex items-center gap-1.5 pt-1.5 mt-0.5">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center shrink-0",
                              notif.actorAvatarBg || "bg-amber-500 text-white",
                            )}
                          >
                            {getInitials(notif.actorName)}
                          </div>
                          <span className="text-[11.5px] font-medium text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
                            {notif.updatesCountText}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-3.5 py-2.5 border-t border-border/60 bg-card shrink-0 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">
                {filteredNotifications.length} notifications
              </span>
              <Button
                variant={ButtonVariant.Ghost}
                size={ButtonSize.Sm}
                onClick={onClose}
                className="text-[11.5px] h-6.5 px-2.5"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
