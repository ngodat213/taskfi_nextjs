import { Variants } from "framer-motion";

/**
 * Ultra-smooth, GPU-accelerated tab content transition variants.
 * Avoids heavy filter blur for maximum 60-120fps performance.
 */
export const TAB_CONTENT_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
      mass: 0.7,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.995,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const SPRING_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 26,
    },
  },
};

export const SLIDE_IN_LEFT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
    },
  },
};

export const SLIDE_IN_RIGHT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
    },
  },
};

export const FADE_SLIDE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 360,
      damping: 26,
    },
  },
};
