"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";

import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";

interface DeleteButtonProps {
  onDelete: () => void;
  className?: string;
  title?: string;
}

export function DeleteButton({
  onDelete,
  className,
  title,
}: DeleteButtonProps) {
  const [step, setStep] = useState<"idle" | "confirming" | "deleting">("idle");
  const [particles, setParticles] = useState<
    { id: number; angle: number; distance: number; color: string }[]
  >([]);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (step === "deleting") return;

    if (step === "idle") {
      setStep("confirming");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStep("idle");
      }, 3000);
      return;
    }

    if (step === "confirming") {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setStep("deleting");

      const colors = ["#ef4444", "#f87171", "#fca5a5", "#dc2626"];
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 45 * Math.PI) / 180,
        distance: 24 + (i % 3) * 3.5,
        color: colors[i % colors.length],
      }));

      setParticles(newParticles);

      setTimeout(() => {
        onDelete();
        setStep("idle");
      }, 350);
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <AnimatePresence>
        {step === "deleting" && (
          <>
            {particles.map((p) => {
              const x = Math.cos(p.angle) * p.distance;
              const y = Math.sin(p.angle) * p.distance;

              return (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x, y, scale: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ backgroundColor: p.color }}
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-10"
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
      >
        <Button
          type="button"
          variant={ButtonVariant.Ghost}
          onClick={handleClick}
          title={
            step === "confirming"
              ? "Click again to confirm delete"
              : title || "Delete Attachment"
          }
          className={cn(
            "h-6 p-0 rounded-md transition-all shrink-0 cursor-pointer overflow-hidden",
            step === "idle" &&
              "w-6 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100",
            step === "confirming" &&
              "w-auto px-2 bg-red-600 text-white border border-red-600 hover:bg-red-700 shadow-sm animate-pulse opacity-100 font-semibold text-[10.5px]",
            step === "deleting" &&
              "w-auto px-2 bg-red-500 text-white border border-red-500 opacity-100 font-semibold text-[10.5px]",
            className,
          )}
        >
          <motion.div
            animate={
              step === "confirming"
                ? { scale: [1.25, 1] }
                : step === "deleting"
                  ? { scale: [1.35, 1] }
                  : { scale: 1 }
            }
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 18,
            }}
            className="flex items-center gap-1"
          >
            {step === "confirming" ? (
              <>
                <CheckIcon className="w-3 h-3 text-white" />
                <span>Confirm?</span>
              </>
            ) : step === "deleting" ? (
              <span>Deleting...</span>
            ) : (
              <XIcon className="w-3.5 h-3.5" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
