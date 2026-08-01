"use client";

import { ReactNode } from "react";

import { Variants, motion } from "framer-motion";

import { AnimatedBackground } from "@/components/ui/layout/animated-background";

interface AuthLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function AuthLayout({
  title,
  description,
  icon,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden font-sans p-4">
      {/* Background Blurs & Grid Texture */}
      <AnimatedBackground />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none -z-10" />

      {/* Form Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-120 p-8 sm:p-10 rounded-2xl bg-transparent"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            variants={itemVariants}
            className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary shadow-xs"
          >
            {icon}
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 text-center tracking-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-[13px] text-muted-foreground text-center max-w-70"
          >
            {description}
          </motion.p>
        </div>

        <motion.div variants={itemVariants}>{children}</motion.div>

        {footer && (
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center flex items-center justify-center gap-1 text-[13px] text-muted-foreground pt-4 border-t border-border/40"
          >
            {footer}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
