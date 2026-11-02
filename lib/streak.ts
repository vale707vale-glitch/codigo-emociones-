import type { EmotionLog, UserProfile } from "@/types";
import { dateKey } from "@/lib/date";
import { COURAGE_THRESHOLD } from "@/lib/hawkinsMap";
import { saveProfile } from "@/lib/storage";

export function computeCurrentStreak(createdAtList: string[]): number {
  const days = new Set(createdAtList.map((iso) => dateKey(iso)));
  const cursor = new Date();
  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeCourageStreak(logs: EmotionLog[]): number {
  const byDay = new Map<string, { count: number; minLevel: number }>();
  for (const log of logs) {
    const key = dateKey(log.createdAt);
    const entry = byDay.get(key) ?? { count: 0, minLevel: Infinity };
    entry.count++;
    entry.minLevel = Math.min(entry.minLevel, log.emotionLevel);
    byDay.set(key, entry);
  }
  const cursor = new Date();
  if (!byDay.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (true) {
    const entry = byDay.get(dateKey(cursor));
    if (!entry || entry.minLevel < COURAGE_THRESHOLD) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function deriveProfile(
  profile: UserProfile,
  logs: EmotionLog[]
): UserProfile {
  const currentStreak = computeCurrentStreak(logs.map((log) => log.createdAt));
  const highestLevelAchieved = logs.reduce(
    (max, log) => Math.max(max, log.emotionLevel),
    profile.highestLevelAchieved
  );
  if (
    currentStreak === profile.currentStreak &&
    highestLevelAchieved === profile.highestLevelAchieved
  ) {
    return profile;
  }
  return { ...profile, currentStreak, highestLevelAchieved };
}

export function syncAndSaveProfile(
  profile: UserProfile,
  logs: EmotionLog[]
): Promise<void> {
  return saveProfile(deriveProfile(profile, logs));
}
