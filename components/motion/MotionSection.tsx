"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface MotionSectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  delay?: number;
}

export function MotionSection({ children, className = "", delay = 0, ...rest }: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay }}
      className={className}
      {...(rest as any)}
    >
      {children}
    </motion.section>
  );
}

export function MotionDiv({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: EASE_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
