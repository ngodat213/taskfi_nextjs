"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { ItemCard } from "@/components/ui/data-display/item-card";
import { LikeButton } from "@/components/ui/feedback/like-button";
import { SPRING_CARD_VARIANTS } from "@/constants/animations";
import { RetroItem, getRetroTags } from "@/types/retro.types";
import { cn } from "@/utils/cn";

interface RetroCardProps {
  item: RetroItem;
  categoryVariant: "emerald" | "amber" | "blue";
  onRetroClick?: (retroId: string) => void;
  onToggleComplete?: (itemId: string) => void;
  onVote?: (itemId: string) => void;
}

const retroCardVariants: Variants = SPRING_CARD_VARIANTS;

export function RetroCard({
  item,
  categoryVariant,
  onRetroClick,
  onToggleComplete,
  onVote,
}: RetroCardProps) {
  const isActionItem = item.category === "action_item";

  return (
    <motion.div
      layout
      variants={retroCardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -2, scale: 1.008 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <ItemCard
        onClick={() => onRetroClick?.(item.id)}
        isCompleted={item.completed}
        icon={
          isActionItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(item.id);
              }}
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer",
                item.completed
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-border hover:border-blue-500",
              )}
            >
              {item.completed && <CheckCircleIcon className="w-3.5 h-3.5" />}
            </button>
          ) : undefined
        }
        itemKey={!isActionItem ? item.createdAt : undefined}
        badge={
          <div className="flex items-center gap-1 flex-wrap">
            {getRetroTags(item).map((t) => (
              <Badge
                key={t}
                variant={categoryVariant}
                className="capitalize text-[10px]"
              >
                {t}
              </Badge>
            ))}
          </div>
        }
        action={
          <LikeButton
            votes={item.votes}
            onVote={() => onVote?.(item.id)}
            categoryVariant={categoryVariant}
          />
        }
        title={item.title}
        description={item.description}
        footerLeft={
          <>
            <Avatar
              src={item.authorAvatar}
              alt={item.authorName}
              size="sm"
              className="w-4.5 h-4.5 shrink-0"
            />
            <span className="font-medium text-foreground/80 truncate">
              {item.authorName}
            </span>
          </>
        }
        footerRight={
          !isActionItem ? (
            <span className="text-muted-foreground/60 text-[10.5px]">Note</span>
          ) : undefined
        }
      />
    </motion.div>
  );
}
