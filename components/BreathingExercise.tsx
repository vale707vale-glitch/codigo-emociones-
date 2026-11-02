"use client";

import { useEffect, useState } from "react";
import { Orb } from "@/components/Orb";

export interface BreathPhase {
  label: string;
  seconds: number;
  scale: number;
}

const BOX_PATTERN: BreathPhase[] = [
  { label: "Inhalá", seconds: 4, scale: 1.55 },
  { label: "Exhalá", seconds: 4, scale: 1 },
];

export const PATTERN_478: BreathPhase[] = [
  { label: "Inhalá", seconds: 4, scale: 1.55 },
  { label: "Sostené", seconds: 7, scale: 1.55 },
  { label: "Exhalá", seconds: 8, scale: 1 },
];

interface BreathingExerciseProps {
  color: string;
  cycles?: number;
  phases?: BreathPhase[];
  onFinish?: () => void;
}

export function BreathingExercise({
  color,
  cycles = 3,
  phases = BOX_PATTERN,
  onFinish,
}: BreathingExerciseProps) {
  const [tick, setTick] = useState(0);
  const phase = phases[tick % phases.length];
  const finished = tick >= cycles * phases.length;

  useEffect(() => {
    if (finished) return;
    const id = setTimeout(
      () => setTick((t) => t + 1),
      phase.seconds * 1000
    );
    return () => clearTimeout(id);
  }, [tick, finished, phase]);

  useEffect(() => {
    if (!finished) return;
    const id = setTimeout(() => onFinish?.(), 600);
    return () => clearTimeout(id);
  }, [finished, onFinish]);

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Orb color={color} className="h-40 w-40" />
        <p className="text-zinc-300">Bien hecho. Respirá profundo una vez más.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="h-48 w-48 transition-transform ease-in-out"
        style={{
          transform: `scale(${phase.scale})`,
          transitionDuration: `${phase.seconds * 1000}ms`,
        }}
      >
        <Orb color={color} className="h-full w-full" />
      </div>
      <p className="font-display text-3xl text-white">{phase.label}</p>
      <div className="flex gap-2">
        {Array.from({ length: cycles }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              i < Math.floor(tick / phases.length) ? "bg-white" : "bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
