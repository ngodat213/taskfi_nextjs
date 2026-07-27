"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowCounterClockwise, Check } from "@phosphor-icons/react/dist/ssr";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";

interface RestoreButtonProps {
  onRestore: () => void;
  className?: string;
}

export function RestoreButton({ onRestore, className }: RestoreButtonProps) {
  const [step, setStep] = useState<"idle" | "confirming" | "restored">("idle");
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
    e.stopPropagation();

    if (step === "restored") return;

    if (step === "idle") {
      // Step 1: Switch to confirming state
      setStep("confirming");

      // Auto reset if user doesn't click confirm within 3 seconds
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStep("idle");
      }, 3000);
      return;
    }

    if (step === "confirming") {
      // Step 2: Confirmed! Trigger particle burst & restore
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setStep("restored");

      const colors = ["#10b981", "#34d399", "#6ee7b7", "#059669"];
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 45 * Math.PI) / 180,
        distance: 26 + (i % 3) * 3.5,
        color: colors[i % colors.length],
      }));

      setParticles(newParticles);

      setTimeout(() => {
        onRestore();
      }, 450);
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Floating particles ring */}
      <AnimatePresence>
        {step === "restored" && (
          <>
            <motion.span
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 1, y: -20, scale: 1.1 }}
              exit={{ opacity: 0, y: -28, scale: 0.8 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute -top-1 font-bold text-[10.5px] text-emerald-500 pointer-events-none select-none z-20"
            >
              Restored!
            </motion.span>

            {particles.map((p) => {
              const x = Math.cos(p.angle) * p.distance;
              const y = Math.sin(p.angle) * p.distance;

              return (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x, y, scale: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
          variant={
            step === "confirming"
              ? ButtonVariant.Primary
              : ButtonVariant.Outline
          }
          size={ButtonSize.Sm}
          onClick={handleClick}
          className={cn(
            "gap-1 rounded-md text-[10.5px] h-6 px-2 transition-all duration-200 shrink-0 font-medium cursor-pointer",
            step === "idle" &&
              "hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400",
            step === "confirming" &&
              "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm animate-pulse",
            step === "restored" &&
              "bg-emerald-500 text-white border-emerald-500 shadow-sm",
            className,
          )}
        >
          <motion.div
            animate={
              step === "confirming"
                ? { scale: [1.25, 1] }
                : step === "restored"
                  ? { rotate: [-180, 0], scale: [1.35, 1] }
                  : { rotate: 0, scale: 1 }
            }
            transition={{
              duration: 0.35,
              type: "spring",
              stiffness: 500,
              damping: 18,
            }}
          >
            {step === "confirming" || step === "restored" ? (
              <Check className="w-3 h-3 text-white" />
            ) : (
              <ArrowCounterClockwise className="w-3 h-3 text-emerald-500" />
            )}
          </motion.div>
          <span>
            {step === "idle"
              ? "Restore"
              : step === "confirming"
                ? "Confirm?"
                : "Restored"}
          </span>
        </Button>
      </motion.div>
    </div>
  );
}
