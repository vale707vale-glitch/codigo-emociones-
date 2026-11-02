"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { GlassCard } from "@/components/GlassCard";
import { useAscenso } from "@/hooks/useAscenso";
import {
  bodyShiftStats,
  dailyAverages,
  percentAboveCourage,
  triggerRanking,
} from "@/lib/insights";
import {
  buildMonthlyReport,
  downloadTextFile,
  formatMonthLabel,
  listRecentMonths,
} from "@/lib/exportReport";
import { BODY_SHIFTS, type BodyShift } from "@/types";
import { exportAllData, importAllData } from "@/lib/storage";

const PIE_COLORS = ["#FFD700", "#9ACD32", "#00CED1", "#FF6347", "#B22222", "#4169E1"];

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function InsightsPage() {
  const { profile, logs, interventions, practices } = useAscenso();
  const mounted = useMounted();
  const months = useMemo(() => listRecentMonths(6), []);
  const [reportMonth, setReportMonth] = useState(months[0]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  async function handleExportBackup() {
    const data = await exportAllData();
    downloadTextFile("ascenso-backup.json", JSON.stringify(data, null, 2));
  }

  async function handleImportBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      setImportStatus("Importado correctamente. Recargando...");
      window.location.reload();
    } catch {
      setImportStatus("Archivo invalido");
    }
  }

  const averages = useMemo(() => dailyAverages(logs, 30), [logs]);
  const pctAbove = useMemo(() => percentAboveCourage(logs, 7), [logs]);
  const ranking = useMemo(() => triggerRanking(logs).slice(0, 6), [logs]);
  const practicesDone = useMemo(
    () =>
      practices.length +
      interventions.filter((i) => i.postLevel !== null).length,
    [practices, interventions]
  );
  const shifts = useMemo(() => bodyShiftStats(logs), [logs]);
  const shiftPct =
    shifts.total > 0 ? Math.round((shifts.positive / shifts.total) * 100) : 0;

  const pieData = ranking.filter((r) => r.lowCount > 0);
  const trendData = averages
    .filter((d) => d.count > 0)
    .map((d) => ({ day: d.day.slice(5), nivel: d.average }));

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 py-8">
      <h1 className="font-display text-4xl">Insights</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Sobre el Coraje (200)
          </p>
          <p className="mt-2 font-display text-3xl text-white">
            {pctAbove === null ? "-" : `${pctAbove}%`}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            de tu tiempo esta semana
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Registros totales
          </p>
          <p className="mt-2 font-display text-3xl text-white">{logs.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Nivel más alto alcanzado
          </p>
          <p className="mt-2 font-display text-3xl text-white">
            {profile?.highestLevelAchieved ?? 0}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Prácticas completadas
          </p>
          <p className="mt-2 font-display text-3xl text-white">
            {mounted ? practicesDone : 0}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            ejercicios del mapa + ascensor
          </p>
        </GlassCard>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-widest text-zinc-400">
          Últimos 30 días
        </h2>
        <div className="grid grid-cols-10 gap-1.5">
          {averages.map((day) => (
            <div
              key={day.day}
              title={
                day.count > 0
                  ? `${day.day}: nivel promedio ${day.average}`
                  : `${day.day}: sin registros`
              }
              className="aspect-square rounded-md"
              style={{
                backgroundColor:
                  day.count > 0 ? day.color : "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
      </section>

      {!mounted || logs.length === 0 ? (
        <GlassCard className="p-6 text-center text-sm text-zinc-400">
          Todavía no hay suficientes registros para ver tendencias. Hacé tu
          primer check-in desde Inicio.
        </GlassCard>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400">
              Evolución del nivel promedio
            </h2>
            <GlassCard className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="nivelFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="nivel"
                    stroke="#A78BFA"
                    strokeWidth={2}
                    fill="url(#nivelFill)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1b22",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 12,
                      color: "#f4f4f5",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400">
              Disparadores de caídas (&lt; 200)
            </h2>
            {pieData.length === 0 ? (
              <GlassCard className="p-6 text-center text-sm text-zinc-400">
                Sin caídas registradas por debajo de Coraje. Bien ahí.
              </GlassCard>
            ) : (
              <GlassCard className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-around">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="lowCount"
                      nameKey="tag"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={entry.tag}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1b22",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 12,
                        color: "#f4f4f5",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="space-y-2 text-sm">
                  {pieData.map((entry, i) => (
                    <li key={entry.tag} className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-zinc-300">
                        {entry.tag}: {entry.lowCount} de {entry.total} registros
                        en frecuencia baja
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </section>

          {shifts.total > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-widest text-zinc-400">
                Después del Ascensor
              </h2>
              <GlassCard className="space-y-4 p-5">
                <div>
                  <p className="font-display text-3xl text-white">
                    {shiftPct}%
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    de los re-checks con sensación registrada terminaron mejor
                    ({shifts.positive} de {shifts.total})
                  </p>
                </div>
                {BODY_SHIFTS.filter((s) => (shifts.counts[s] ?? 0) > 0).map(
                  (s: BodyShift) => {
                    const count = shifts.counts[s] ?? 0;
                    const isPositive = s !== "Sigo igual";
                    return (
                      <div key={s} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>{isPositive ? s : `${s} (sin cambio)`}</span>
                          <span>{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${(count / shifts.total) * 100}%`,
                              backgroundColor: isPositive ? "#9ACD32" : "#A1A1AA",
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </GlassCard>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400">
              Exportar
            </h2>
            <GlassCard className="flex flex-wrap items-center gap-3 p-5">
              <label
                htmlFor="report-month"
                className="text-sm text-zinc-400"
              >
                Resumen de:
              </label>
              <select
                id="report-month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-zinc-200"
              >
                {months.map((m) => (
                  <option key={m} value={m} className="bg-abyss">
                    {formatMonthLabel(m)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const content = buildMonthlyReport(
                    { logs, interventions, practices },
                    reportMonth
                  );
                  downloadTextFile(`ascenso-resumen-${reportMonth}.txt`, content);
                }}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
              >
                Descargar .txt
              </button>
              <p className="w-full text-xs leading-relaxed text-zinc-500">
                Registros, tiempo sobre Coraje, niveles frecuentes, disparadores
                y practicas del mes elegido. Ideal para llevar a terapia o
                coaching.
              </p>
              <div className="flex w-full flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={handleExportBackup}
                  className="rounded-full border border-white/25 px-5 py-2 text-sm text-zinc-200 transition-colors hover:border-white/60"
                >
                  Exportar backup (JSON)
                </button>
                <label className="rounded-full border border-white/25 px-5 py-2 text-sm text-zinc-200 transition-colors hover:border-white/60 cursor-pointer">
                  Importar backup
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
                {importStatus && (
                  <span className="text-xs text-zinc-400">{importStatus}</span>
                )}
              </div>
            </GlassCard>
          </section>
        </>
      )}
    </div>
  );
}
