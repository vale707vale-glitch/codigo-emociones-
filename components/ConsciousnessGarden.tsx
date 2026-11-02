import { GlassCard } from "@/components/GlassCard";

const STAGES = [
  { minDays: 14, emoji: "🌳", label: "Árbol de presencia" },
  { minDays: 7, emoji: "🌻", label: "Floración" },
  { minDays: 3, emoji: "🌿", label: "Brote fuerte" },
  { minDays: 1, emoji: "🌱", label: "Semilla germinando" },
];

export function ConsciousnessGarden({ streak }: { streak: number }) {
  const stageIndex = STAGES.findIndex((s) => streak >= s.minDays);
  const stage = stageIndex >= 0 ? STAGES[stageIndex] : null;
  const next = stage ? STAGES[stageIndex + 1] : null;

  return (
    <GlassCard className="flex items-center gap-4 px-5 py-3">
      <span
        key={stage?.emoji ?? "seed"}
        className="animate-sprout text-3xl leading-none"
        aria-hidden
      >
        {stage?.emoji ?? "🌰"}
      </span>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">
          Tu jardín de la conciencia
        </p>
        {stage ? (
          <>
            <p className="text-sm text-zinc-200">
              {streak} {streak === 1 ? "día" : "días"} sosteniendo Coraje ·{" "}
              {stage.label}
            </p>
            {next && (
              <p className="mt-0.5 text-xs text-zinc-500">
                Faltan {next.minDays - streak}{" "}
                {next.minDays - streak === 1 ? "día" : "días"} para{" "}
                {next.emoji} {next.label.toLowerCase()}
              </p>
            )}
            {!next && (
              <p className="mt-0.5 text-xs text-zinc-500">
                Etapa máxima alcanzada. Seguí regándola con presencia.
              </p>
            )}
          </>
        ) : (
          <p className="max-w-[240px] text-sm leading-snug text-zinc-200">
            Un día completo sobre Coraje (200) y germina tu primera semilla.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
