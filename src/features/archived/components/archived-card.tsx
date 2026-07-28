"use client";

import { motion } from "framer-motion";
import { FileTextIcon, LightningIcon } from "@phosphor-icons/react/dist/ssr";
import { TypeIcon } from "@/features/issues/components/issue-table-row";
import { ArchivedItem } from "@/features/archived/types/archived.types";
import { RestoreButton } from "@/components/ui/feedback/restore-button";
import { Badge } from "@/components/ui/data-display/badge";
import { Avatar } from "@/components/ui/data-display/avatar";
import { ItemCard } from "@/components/ui/data-display/item-card";
import { SPRING_CARD_VARIANTS } from "@/constants/animations";

const archivedItemVariants = {
  ...SPRING_CARD_VARIANTS,
  exit: { opacity: 0, scale: 0.95 },
};

interface ArchivedCardProps {
  item: ArchivedItem;
  onRestore: (id: string) => void;
}

export function ArchivedCard({ item, onRestore }: ArchivedCardProps) {
  const isIssue = item.type === "issue";
  const isSprint = item.type === "sprint";
  const isDocument = item.type === "document";

  return (
    <motion.div
      layout
      variants={archivedItemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -2, scale: 1.008 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <ItemCard
        icon={
          isIssue ? (
            <TypeIcon type="task" className="w-4 h-4" />
          ) : isSprint ? (
            <LightningIcon className="w-4 h-4 text-emerald-500" />
          ) : (
            <FileTextIcon className="w-4 h-4 text-purple-500" />
          )
        }
        itemKey={item.key}
        badge={
          <Badge
            variant={isSprint ? "emerald" : isDocument ? "purple" : "blue"}
            className="capitalize text-[10px]"
          >
            {item.type}
          </Badge>
        }
        action={<RestoreButton onRestore={() => onRestore(item.id)} />}
        title={item.title}
        subHeader={
          item.reason ? (
            <>
              <span className="text-muted-foreground/60 shrink-0">Reason:</span>
              <span className="truncate italic">{item.reason}</span>
            </>
          ) : undefined
        }
        footerLeft={
          <>
            <Avatar
              src={item.archivedByAvatar}
              alt={item.archivedBy}
              size="sm"
              className="w-4.5 h-4.5 shrink-0"
            />
            <span className="font-medium text-foreground/80 truncate">
              {item.archivedBy}
            </span>
          </>
        }
        footerRight={
          <span className="text-muted-foreground/80">{item.archivedAt}</span>
        }
      />
    </motion.div>
  );
}
