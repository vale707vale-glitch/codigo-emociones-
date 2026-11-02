import type { EmotionLog, InterventionLog, PracticeLog } from "@/types";
import { COURAGE_THRESHOLD, getNearestLevel } from "@/lib/hawkinsMap";

export interface MonthlyReportInput {
  logs: EmotionLog[];
  interventions: InterventionLog[];
  practices: PracticeLog[];
}

export function listRecentMonths(count = 6): string[] {
  const months: string[] = [];
  const cursor = new Date();
  for (let i = 0; i < count; i++) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return months;
}

export function formatMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function buildMonthlyReport(
  input: MonthlyReportInput,
  yearMonth: string
): string {
  const { logs, interventions, practices } = input;
  const monthLogs = logs.filter((l) => monthKey(l.createdAt) === yearMonth);
  const monthInterventions = interventions.filter(
    (i) => monthKey(i.createdAt) === yearMonth && i.postLevel !== null
  );
  const monthPractices = practices.filter(
    (p) => monthKey(p.createdAt) === yearMonth
  );

  const lines: string[] = [];
  lines.push("ASCENSO - RESUMEN MENSUAL");
  lines.push(`Mes: ${formatMonthLabel(yearMonth)}`);
  lines.push(
    `Generado: ${new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}`
  );
  lines.push("");

  lines.push("REGISTROS");
  if (monthLogs.length === 0) {
    lines.push("Sin registros en este mes.");
  } else {
    const totalLevel = monthLogs.reduce((s, l) => s + l.emotionLevel, 0);
    const avg = Math.round(totalLevel / monthLogs.length);
    const highest = Math.max(...monthLogs.map((l) => l.emotionLevel));
    lines.push(`Total de calibraciones: ${monthLogs.length}`);
    lines.push(`Nivel promedio: ${avg} (${getNearestLevel(avg).name})`);
    lines.push(`Nivel mas alto: ${highest} (${getNearestLevel(highest).name})`);
  }
  lines.push("");

  lines.push("SOBRE CORAJE (200)");
  if (monthLogs.length > 0) {
    const above = monthLogs.filter((l) => l.emotionLevel >= COURAGE_THRESHOLD);
    const pct = Math.round((above.length / monthLogs.length) * 100);
    lines.push(
      `${above.length} de ${monthLogs.length} registros sobre Coraje (${pct}%).`
    );
    lines.push("(Porcentaje calculado sobre tus registros del mes.)");
  }
  lines.push("");

  lines.push("NIVELES MAS FRECUENTES");
  if (monthLogs.length > 0) {
    const byLevel = new Map<number, number>();
    for (const log of monthLogs) {
      byLevel.set(log.emotionLevel, (byLevel.get(log.emotionLevel) ?? 0) + 1);
    }
    const ranking = [...byLevel.entries()].sort((a, b) => b[1] - a[1]);
    ranking.forEach(([level, count], i) => {
      lines.push(
        `${i + 1}. ${getNearestLevel(level).name} (${level}) - ${count} ${
          count === 1 ? "registro" : "registros"
        }`
      );
    });
  }
  lines.push("");

  lines.push("DISPARADORES MAS COMUNES");
  const byTrigger = new Map<string, { total: number; low: number }>();
  for (const log of monthLogs) {
    if (!log.triggerTag) continue;
    const entry =
      byTrigger.get(log.triggerTag) ?? { total: 0, low: 0 };
    entry.total++;
    if (log.emotionLevel < COURAGE_THRESHOLD) entry.low++;
    byTrigger.set(log.triggerTag, entry);
  }
  if (byTrigger.size === 0) {
    lines.push("Sin disparadores registrados este mes.");
  } else {
    const triggerRanking = [...byTrigger.entries()].sort(
      (a, b) => b[1].total - a[1].total
    );
    triggerRanking.forEach(([tag, stat], i) => {
      lines.push(
        `${i + 1}. ${tag} - ${stat.total} registros (${
          stat.low
        } con nivel bajo)`
      );
    });
  }
  lines.push("");

  lines.push("PRACTICAS");
  lines.push(`Practicas completadas desde el mapa: ${monthPractices.length}`);
  lines.push(`Ciclos del Ascensor terminados: ${monthInterventions.length}`);
  lines.push("");
  lines.push("---");
  lines.push(
    "Herramienta de autoconocimiento inspirada en el Mapa de Conciencia de David R. Hawkins."
  );
  lines.push(
    "No reemplaza el acompanamiento de un profesional de salud mental."
  );

  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
