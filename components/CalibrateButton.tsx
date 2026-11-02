"use client";

import { cn } from "@/lib/cn";

interface CalibrateButtonProps {
  onClick: () => void;
  color?: string;
  className?: string;
}

export function CalibrateButton({
  onClick,
  color = "#FFD700",
  className,
}: CalibrateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "animate-glow group relative rounded-full px-14 py-5",
        "font-display text-2xl text-abyss",
        "transition-transform duration-300 hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className
      )}
      style={{
        background: `linear-gradient(135deg, #ffffffee, ${color})`,
        boxShadow: `0 0 45px ${color}80`,
      }}
    >
      Calibrar
    </button>
  );
}
