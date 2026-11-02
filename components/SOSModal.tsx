"use client";

import { useState } from "react";
import {
  BreathingExercise,
  PATTERN_478,
} from "@/components/BreathingExercise";
import { GlassCard } from "@/components/GlassCard";
import { LettingGoExercise } from "@/components/LettingGoExercise";
import { FocusWheelExercise } from "@/components/FocusWheelExercise";
import { BodyScanExercise } from "@/components/SomaticExercises";

const CALM_COLOR = "#38BDF8";

const AFFIRMATIONS = [
  "Estoy a salvo en este momento.",
  "Esta emoción es energía en movimiento: puedo sentirla y dejarla pasar.",
  "Respiro lento y mi cuerpo se calma solo.",
  "No tengo que arreglar nada ahora. Solo estar presente.",
  "Esto va a pasar. Ya pasó antes.",
];

const GROUNDING_STEPS = [
  "Mirá alrededor y nombrá 5 cosas que podés VER.",
  "Tocá 4 objetos cerca tuyo. Notá temperatura y textura.",
  "Escuchá 3 sonidos, lejos o cerca.",
  "Encontrá 2 aromas, o imaginá 2 que te gusten.",
  "Notá 1 sabor en tu boca, o tomá un sorbo de agua lento.",
];

type SosMode =
  | "menu"
  | "breath"
  | "ground"
  | "affirm"
  | "release"
  | "scan"
  | "focuswheel";

export type { SosMode };

export function SOSModal({
  onClose,
  initialMode = "menu",
}: {
  onClose: () => void;
  initialMode?: SosMode;
}) {
  const [mode, setMode] = useState<SosMode>(initialMode);
  const [groundStep, setGroundStep] = useState(0);
  const [affirmIndex, setAffirmIndex] = useState(
    () => Math.floor(Math.random() * AFFIRMATIONS.length)
  );

  const groundingDone = groundStep >= GROUNDING_STEPS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <GlassCard className="max-h-[85vh] w-full max-w-sm overflow-y-auto p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-red-300">
              Anclaje rápido
            </p>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="h-8 w-8 rounded-full border border-white/15 text-sm text-zinc-400 transition-colors hover:border-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>

          {mode === "menu" && (
            <div className="space-y-3">
              <SosOption
                title="Soltar la emoción"
                description="Método Hawkins: permitir que la energía pase."
                onClick={() => setMode("release")}
              />
              <SosOption
                title="Respiración 4-7-8"
                description="Inhalá 4, sostené 7, exhalá 8. Tres ciclos."
                onClick={() => setMode("breath")}
              />
              <SosOption
                title="Grounding 5-4-3-2-1"
                description="Volvé al presente con tus cinco sentidos."
                onClick={() => {
                  setGroundStep(0);
                  setMode("ground");
                }}
              />
              <SosOption
                title="Afirmación de calma"
                description="Un recordatorio amable para este momento."
                onClick={() => setMode("affirm")}
              />
              <SosOption
                title="Rueda de Enfoque"
                description="Doce frases para aflojar un pensamiento que pesa."
                onClick={() => setMode("focuswheel")}
              />
            </div>
          )}

          {mode === "release" && (
            <LettingGoExercise color={CALM_COLOR} onFinish={onClose} />
          )}

          {mode === "scan" && (
            <BodyScanExercise color={CALM_COLOR} onFinish={onClose} />
          )}

          {mode === "focuswheel" && (
            <FocusWheelExercise color={CALM_COLOR} onFinish={onClose} />
          )}

          {mode === "breath" && (
            <div className="flex flex-col items-center gap-4 py-2">
              <BreathingExercise
                color={CALM_COLOR}
                cycles={3}
                phases={PATTERN_478}
                onFinish={() => setMode("menu")}
              />
            </div>
          )}

          {mode === "ground" && (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              {!groundingDone ? (
                <>
                  <p className="font-mono text-xs text-zinc-500">
                    Paso {groundStep + 1} de {GROUNDING_STEPS.length}
                  </p>
                  <p className="font-display text-xl leading-relaxed text-white">
                    {GROUNDING_STEPS[groundStep]}
                  </p>
                  <button
                    onClick={() => setGroundStep((s) => s + 1)}
                    className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
                  >
                    Listo
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-xl leading-relaxed text-white">
                    De vuelta acá. Mirá cómo se siente tu cuerpo ahora.
                  </p>
                  <button
                    onClick={() => setMode("menu")}
                    className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
                  >
                    Terminar
                  </button>
                </>
              )}
            </div>
          )}

          {mode === "affirm" && (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <p className="font-display text-2xl leading-relaxed text-white">
                &ldquo;{AFFIRMATIONS[affirmIndex]}&rdquo;
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setAffirmIndex((i) => (i + 1) % AFFIRMATIONS.length)
                  }
                  className="rounded-full border border-white/25 px-6 py-3 text-sm text-zinc-200 transition-colors hover:border-white/60"
                >
                  Otra
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
                >
                  Listo
                </button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function SosOption({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/30">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>
    </button>
  );
}
