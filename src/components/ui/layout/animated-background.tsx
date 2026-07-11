"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[15%] w-[40%] max-w-[500px] aspect-square bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"
      />
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
        className="absolute bottom-[10%] right-[15%] w-[35%] max-w-[400px] aspect-square bg-violet-400/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"
      />
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
        className="absolute top-[20%] right-[30%] w-[30%] max-w-[350px] aspect-square bg-rose-400/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"
      />
    </>
  );
}
