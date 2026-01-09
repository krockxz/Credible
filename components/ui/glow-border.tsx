"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlowBorder({
  children,
  className,
  glowColor = "var(--color-electric)",
  intensity = "medium",
}: GlowBorderProps) {
  const intensityMap = {
    low: "opacity-30 blur-sm",
    medium: "opacity-50 blur-md",
    high: "opacity-70 blur-lg",
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Glow effect */}
      <motion.div
        className={cn(
          "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--color-electric)] to-purple-600",
          intensityMap[intensity]
        )}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Content */}
      <div className="relative rounded-xl bg-white dark:bg-black">
        {children}
      </div>
    </div>
  );
}

interface ShimmerButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export function ShimmerButton({
  children,
  onClick,
  disabled = false,
  className,
  variant = "primary",
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "relative px-8 py-3 rounded-lg font-display text-sm uppercase tracking-wider overflow-hidden",
        variant === "primary"
          ? "bg-[var(--color-electric)] text-white"
          : "bg-transparent border border-[var(--color-electric)] text-[var(--color-electric)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
