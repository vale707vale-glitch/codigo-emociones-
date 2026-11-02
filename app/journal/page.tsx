"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useAscenso } from "@/hooks/useAscenso";
import { formatDate } from "@/lib/date";
import { getNearestLevel } from "@/lib/hawkinsMap";
import type { EmotionLog } from "@/types";

export default function JournalPage() {
  const { logs, loading, editLog, removeLog } = useAscenso();

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-5 py-8">
      <h1 className="font-display text-4xl">Diario</h1>

      {loading ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : logs.length === 0 ? (
        <GlassCard className="p-6 text-center text-sm text-zinc-400">
          Tu diario está vacío. Hacé tu primer check-in desde Inicio.
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <JournalEntry
              key={log.id}
              log={log}
              onEdit={editLog}
              onDelete={removeLog}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function JournalEntry({
  log,
  onEdit,
  onDelete,
}: {
  log: EmotionLog;
  onEdit: (
    id: string,
    patch: Partial<Pick<EmotionLog, "triggerTag" | "notes">>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [tag, setTag] = useState<string>(log.triggerTag ?? "");
  const [notes, setNotes] = useState(log.notes ?? "");
  const emotion = getNearestLevel(log.emotionLevel);

  async function handleSave() {
    await onEdit(log.id, {
      triggerTag: (tag || null) as EmotionLog["triggerTag"],
      notes: notes.trim() ? notes.trim() : null,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <GlassCard className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {["Trabajo", "Dinero", "Salud", "Relaciones", "Otro"].map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                tag === t
                  ? "border-white bg-white text-abyss"
                  : "border-white/25 text-zinc-300 hover:border-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-white/20 bg-white/5 p-3 text-sm focus:border-white/50 focus:outline-none"
        />
        <div className="flex justify-end gap-2 text-sm">
          <button
            onClick={() => {
              setNotes(log.notes ?? "");
              setTag(log.triggerTag ?? "");
              setEditing(false);
            }}
            className="px-4 py-2 text-zinc-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-white px-5 py-2 font-medium text-abyss"
          >
            Guardar
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex items-start justify-between gap-4 p-4">
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 inline-block h-3.5 w-3.5 shrink-0 rounded-full"
          style={{ backgroundColor: emotion.color }}
        />
        <div>
          <p className="text-sm text-white">
            {emotion.name} · nivel {emotion.level} {emotion.icon}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {formatDate(log.createdAt)}
            {log.triggerTag && ` · ${log.triggerTag}`}
          </p>
          {log.notes && (
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-zinc-300">
              {log.notes}
            </p>
          )}
          {log.bodyShift && (
            <p className="mt-1 text-xs text-zinc-500">
              Después: {log.bodyShift.toLowerCase()}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs">
        <button
          onClick={() => setEditing(true)}
          className="text-zinc-500 transition-colors hover:text-white"
        >
          Editar
        </button>
        {confirming ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(log.id)}
              className="font-medium text-red-400 hover:text-red-300"
            >
              Borrar
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-zinc-500 hover:text-white"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-zinc-500 transition-colors hover:text-red-300"
          >
            Borrar
          </button>
        )}
      </div>
    </GlassCard>
  );
}
