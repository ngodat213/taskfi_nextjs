"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface LikeButtonProps {
  votes: number;
  onVote: () => void;
  categoryVariant?: "emerald" | "amber" | "blue";
  className?: string;
}

export function LikeButton({
  votes,
  onVote,
  categoryVariant = "blue",
  className,
}: LikeButtonProps) {
  const [isBursting, setIsBursting] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; angle: number; distance: number; color: string }[]
  >([]);

  const triggerBurst = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote();

    setIsBursting(true);

    const colors =
      categoryVariant === "emerald"
        ? ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]
        : categoryVariant === "amber"
          ? ["#f59e0b", "#fbbf24", "#fde68a", "#d97706"]
          : ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i * 45 * Math.PI) / 180,
      distance: 24 + (i % 3) * 4,
      color: colors[i % colors.length],
    }));

    setParticles(newParticles);

    setTimeout(() => {
      setIsBursting(false);
    }, 600);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Floating particles ring */}
      <AnimatePresence>
        {isBursting && (
          <>
            {/* Floating "+1" popup */}
            <motion.span
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 1, y: -22, scale: 1.1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "absolute -top-1 font-bold text-[11px] pointer-events-none select-none z-20",
                categoryVariant === "emerald" && "text-emerald-500",
                categoryVariant === "amber" && "text-amber-500",
                categoryVariant === "blue" && "text-blue-500",
              )}
            >
              +1
            </motion.span>

            {/* Sparkle particles */}
            {particles.map((p) => {
              const x = Math.cos(p.angle) * p.distance;
              const y = Math.sin(p.angle) * p.distance;

              return (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x, y, scale: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ backgroundColor: p.color }}
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-10"
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={triggerBurst}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-[10.5px] font-semibold text-foreground transition-all cursor-pointer relative overflow-hidden select-none",
          categoryVariant === "emerald" &&
            "hover:bg-emerald-500/10 hover:border-emerald-500/40",
          categoryVariant === "amber" &&
            "hover:bg-amber-500/10 hover:border-amber-500/40",
          categoryVariant === "blue" &&
            "hover:bg-blue-500/10 hover:border-blue-500/40",
          className,
        )}
      >
        <motion.div
          animate={
            isBursting
              ? { scale: [1.45, 1], rotate: [-15, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
        >
          <ThumbsUp
            className={cn(
              "w-3 h-3 transition-colors",
              categoryVariant === "emerald" && "text-emerald-500",
              categoryVariant === "amber" && "text-amber-500",
              categoryVariant === "blue" && "text-blue-500",
            )}
          />
        </motion.div>
        <span>{votes}</span>
      </motion.button>
    </div>
  );
}
