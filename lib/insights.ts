import type { BodyShift, EmotionLog } from "@/types";
import { COURAGE_THRESHOLD, getNearestLevel } from "@/lib/hawkinsMap";
import { dateKey, daysAgo, lastNDaysKeys } from "@/lib/date";

export interface DayAverage {
  day: string;
  average: number;
  color: string;
  count: number;
}

export function dailyAverages(logs: EmotionLog[], days = 30): DayAverage[] {
  const byDay = new Map<string, EmotionLog[]>();
  const window = new Set(lastNDaysKeys(days));
  for (const log of logs) {
    const key = dateKey(log.createdAt);
    if (!window.has(key)) continue;
    const bucket = byDay.get(key);
    if (bucket) bucket.push(log);
    else byDay.set(key, [log]);
  }
  return lastNDaysKeys(days).map((day) => {
    const bucket = byDay.get(day) ?? [];
    if (bucket.length === 0) {
      return { day, average: 0, color: "", count: 0 };
    }
    const average = Math.round(
      bucket.reduce((sum, log) => sum + log.emotionLevel, 0) / bucket.length
    );
    const nearest = getNearestLevel(average);
    return { day, average, color: nearest.color, count: bucket.length };
  });
}

function isWithinDays(isoDate: string, days: number): boolean {
  const limit = daysAgo(days - 1);
  limit.setHours(0, 0, 0, 0);
  return new Date(isoDate) >= limit;
}

export function percentAboveCourage(
  logs: EmotionLog[],
  days = 7
): number | null {
  const recent = logs.filter((log) => isWithinDays(log.createdAt, days));
  if (recent.length === 0) return null;
  const above = recent.filter(
    (log) => log.emotionLevel >= COURAGE_THRESHOLD
  ).length;
  return Math.round((above / recent.length) * 100);
}

export interface TriggerStat {
  tag: string;
  lowCount: number;
  total: number;
}

export function triggerRanking(logs: EmotionLog[]): TriggerStat[] {
  const stats = new Map<string, TriggerStat>();
  for (const log of logs) {
    if (!log.triggerTag) continue;
    const stat =
      stats.get(log.triggerTag) ??
      { tag: log.triggerTag, lowCount: 0, total: 0 };
    stat.total++;
    if (log.emotionLevel < COURAGE_THRESHOLD) stat.lowCount++;
    stats.set(log.triggerTag, stat);
  }
  return [...stats.values()].sort((a, b) => b.lowCount - a.lowCount);
}

const POSITIVE_SHIFTS: BodyShift[] = ["Pecho más ligero", "Mente más clara"];

export interface BodyShiftStat {
  total: number;
  positive: number;
  counts: Partial<Record<BodyShift, number>>;
}

export function bodyShiftStats(logs: EmotionLog[]): BodyShiftStat {
  let total = 0;
  let positive = 0;
  const counts: Partial<Record<BodyShift, number>> = {};
  for (const log of logs) {
    const shift = log.bodyShift;
    if (!shift) continue;
    total++;
    counts[shift] = (counts[shift] ?? 0) + 1;
    if (POSITIVE_SHIFTS.includes(shift)) positive++;
  }
  return { total, positive, counts };
}
