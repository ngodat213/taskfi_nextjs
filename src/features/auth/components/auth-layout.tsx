"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/layout/animated-background";

interface AuthLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({
  title,
  description,
  icon,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden font-sans">
      {/* Background Blurs */}
      <AnimatedBackground />

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-[480px] p-8 md:p-10 rounded-xl bg-transparent"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center mb-5 text-foreground">
            {icon}
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-1.5 text-center">
            {title}
          </h1>
          <p className="text-[13px] text-muted-foreground text-center">
            {description}
          </p>
        </div>

        {children}

        {footer && (
          <div className="mt-8 text-center flex items-center justify-center gap-1 text-[13px]">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
