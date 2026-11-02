import type { HawkinsLevel } from "@/types";
import { getContent } from "@/lib/hawkinsContent";
import { ClimbTaskList } from "@/components/ClimbTaskList";

export function LevelDetail({ level }: { level: HawkinsLevel }) {
  const content = getContent(level.level);

  return (
    <div className="space-y-4 text-left">
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: level.color }}
        >
          {level.category === "Alta" ? "Frecuencia alta" : "Frecuencia baja"}
        </p>
        <h3 className="font-display text-3xl text-white">
          {level.name} {level.icon}
        </h3>
        <p className="mt-0.5 text-sm text-zinc-500">Nivel {level.level}</p>
      </div>

      <p className="text-sm italic leading-relaxed text-zinc-300">
        &ldquo;{content?.worldview}&rdquo;
      </p>

      <p className="text-sm leading-relaxed text-zinc-400">{level.description}</p>

      {content && (
        <>
          <p className="text-sm leading-relaxed text-zinc-400">
            {content.detail}
          </p>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Cómo se siente en el cuerpo
              </p>
              <span
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs"
                style={{ color: level.color }}
                title="Estado del sistema nervioso según la teoría polivagal"
              >
                {content.nervousSystem}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-200">
              {content.bodySignal}
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
              Cómo subir de peldaño
            </p>
            <ClimbTaskList
              tasks={content.climbs}
              level={level.level}
              color={level.color}
            />
          </div>
        </>
      )}
    </div>
  );
}
