"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { BreathingExercise } from "@/components/BreathingExercise";
import { GlassCard } from "@/components/GlassCard";
import { JournalingBlock } from "@/components/JournalingBlock";
import {
  AngerDischargeExercise,
  BodyScanExercise,
  CourageBridgeExercise,
} from "@/components/SomaticExercises";
import { ensureProfile, createPractice } from "@/lib/storage";
import { LettingGoExercise } from "@/components/LettingGoExercise";
import { FocusWheelExercise } from "@/components/FocusWheelExercise";
import type { ClimbTask } from "@/lib/hawkinsContent";

const KIND_LABEL: Record<ClimbTask["kind"], string> = {
  breathing: "Respiración",
  journaling: "Escritura",
  action: "Acción",
  lettinggo: "Soltar",
  scan: "Escáner",
  posture: "Postura",
  discharge: "Descarga",
  focuswheel: "Rueda",
};

function fireMiniConfetti() {
  confetti({
    particleCount: 45,
    spread: 60,
    startVelocity: 25,
    origin: { y: 0.8 },
    colors: ["#FFD700", "#9ACD32", "#ffffff"],
  });
}

export function ClimbTaskList({
  tasks,
  level,
  color,
}: {
  tasks: ClimbTask[];
  level: number;
  color: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  async function completeTask(index: number) {
    setActiveIndex(null);
    if (done.has(index)) return;
    fireMiniConfetti();
    setDone((prev) => new Set(prev).add(index));
    if (saving) return;
    try {
      setSaving(true);
      const profile = await ensureProfile();
      await createPractice({
        userId: profile.id,
        level,
        kind: tasks[index].kind,
      });
    } finally {
      setSaving(false);
    }
  }

  if (activeIndex !== null) {
    const task = tasks[activeIndex];
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm leading-relaxed text-zinc-200">
          {task.text}
        </p>
        {task.kind === "breathing" && (
          <BreathingExercise
            color={color}
            cycles={3}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "journaling" && (
          <JournalingBlock onFinish={() => completeTask(activeIndex)} />
        )}
        {task.kind === "lettinggo" && (
          <LettingGoExercise
            color={color}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "focuswheel" && (
          <FocusWheelExercise
            color={color}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "scan" && (
          <BodyScanExercise
            color={color}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "posture" && (
          <CourageBridgeExercise
            color={color}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "discharge" && (
          <AngerDischargeExercise
            color={color}
            onFinish={() => completeTask(activeIndex)}
          />
        )}
        {task.kind === "action" && (
          <GlassCard className="flex w-full flex-col items-center gap-4 p-5">
            <button
              onClick={() => completeTask(activeIndex)}
              className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
            >
              Listo, lo hice
            </button>
          </GlassCard>
        )}
        <button
          onClick={() => setActiveIndex(null)}
          className="text-xs text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <li key={task.text}>
          <button
            onClick={() => setActiveIndex(index)}
            className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors hover:border-white/30"
          >
            <span
              className={`mt-px shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                done.has(index)
                  ? "border-lime-300/40 text-lime-300"
                  : "border-white/15 text-zinc-400"
              }`}
            >
              {done.has(index) ? "Hecha ✓" : KIND_LABEL[task.kind]}
            </span>
            <span
              className={`text-sm leading-relaxed ${
                done.has(index) ? "text-zinc-400" : "text-zinc-200"
              }`}
            >
              {task.text}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
