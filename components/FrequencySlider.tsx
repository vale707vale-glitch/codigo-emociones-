"use client";

import { useRef, useState } from "react";
import {
  hawkinsMap,
  MAX_LEVEL,
  MIN_LEVEL,
  getNearestLevel,
} from "@/lib/hawkinsMap";
import { cn } from "@/lib/cn";

interface FrequencySliderProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  onInfo?: (level: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const trackGradient = `linear-gradient(to top, ${hawkinsMap
  .map(
    (entry) =>
      `${entry.color} ${((entry.level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL)) * 100}%`
  )
  .join(", ")})`;

export function FrequencySlider({
  value,
  onChange,
  onCommit,
  onInfo,
}: FrequencySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const nearest = getNearestLevel(value);
  const ratio = (value - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL);

  function updateFromPointer(clientY: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = 1 - (clientY - rect.top) / rect.height;
    const next = Math.round(MIN_LEVEL + clamp(raw, 0, 1) * (MAX_LEVEL - MIN_LEVEL));
    if (next !== value) onChange(next);
  }

  return (
    <div className="flex items-center gap-6 select-none">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Frecuencia emocional"
        aria-valuemin={MIN_LEVEL}
        aria-valuemax={MAX_LEVEL}
        aria-valuenow={value}
        aria-valuetext={`${nearest.level} ${nearest.name}`}
        tabIndex={0}
        onKeyDown={(e) => {
          const step =
            e.key === "ArrowUp" ? 10 : e.key === "ArrowDown" ? -10 : 0;
          if (!step) return;
          e.preventDefault();
          onChange(clamp(value + step, MIN_LEVEL, MAX_LEVEL));
        }}
        onPointerDown={(e) => {
          setDragging(true);
          trackRef.current?.setPointerCapture(e.pointerId);
          updateFromPointer(e.clientY);
        }}
        onPointerMove={(e) => dragging && updateFromPointer(e.clientY)}
        onPointerUp={() => {
          setDragging(false);
          onCommit?.(nearest.level);
        }}
        onPointerCancel={() => setDragging(false)}
        className="relative h-80 w-16 cursor-grab touch-none rounded-full border border-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:cursor-grabbing"
        style={{ background: trackGradient }}
      >
        <div
          className={cn(
            "absolute left-1/2 h-12 w-12 -translate-x-1/2 translate-y-1/2 rounded-full",
            "border-2 border-white/80 transition-transform",
            dragging && "scale-110"
          )}
          style={{
            bottom: `calc(${ratio * 100}% )`,
            backgroundColor: nearest.color,
            boxShadow: `0 0 24px ${nearest.color}, 0 0 8px #ffffff88`,
          }}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2",
            "flex items-baseline gap-2 whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-4 py-1.5 backdrop-blur-md",
            "transition-opacity duration-200",
            dragging ? "opacity-100" : "opacity-0"
          )}
          style={{ bottom: `calc(${ratio * 100}% + 52px)` }}
        >
          <span className="font-display text-2xl leading-none text-white">
            {nearest.level}
          </span>
          <span className="text-xs text-zinc-300">{nearest.name}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left">
        <span className="text-sm text-zinc-400">Nivel {nearest.level}</span>
        <span className="font-display text-4xl text-white">
          {nearest.name} {nearest.icon}
        </span>
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: nearest.color }}
        >
          {nearest.category === "Alta" ? "Frecuencia alta" : "Frecuencia baja"}
        </span>
        {onInfo && (
          <button
            onClick={() => onInfo(nearest.level)}
            className="mt-1 w-fit rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-white/50 hover:text-white"
            aria-label={`Qué significa ${nearest.name}`}
          >
            ¿Qué significa esto?
          </button>
        )}
      </div>
    </div>
  );
}
