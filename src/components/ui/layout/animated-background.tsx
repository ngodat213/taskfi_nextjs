"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Sidebar Ambient Glow Blob */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 w-95 h-95 bg-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px]"
      />

      {/* Main Top Right Ambient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[25%] w-[40%] max-w-125 aspect-square bg-teal-400/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]"
      />

      {/* Bottom Right Ambient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[5%] right-[10%] w-[35%] max-w-100 aspect-square bg-violet-400/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]"
      />

      {/* Mid Center Ambient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-[30%] right-[25%] w-[30%] max-w-87.5 aspect-square bg-rose-400/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]"
      />
    </div>
  );
}
