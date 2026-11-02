import type {
  EmotionLog,
  InterventionLog,
  PracticeLog,
  TriggerTag,
  UserProfile,
} from "@/types";

const KEYS = {
  profile: "ascenso.profile",
  emotions: "ascenso.emotions",
  interventions: "ascenso.interventions",
  practices: "ascenso.practices",
  preferences: "ascenso.preferences",
} as const;

export interface Preferences {
  idealCheckinHour: number | null;
}

export async function getPreferences(): Promise<Preferences> {
  return read<Preferences>(KEYS.preferences, { idealCheckinHour: null });
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  await write(KEYS.preferences, prefs);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function write<T>(key: string, value: T): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function ensureProfile(): Promise<UserProfile> {
  const existing = read<UserProfile | null>(KEYS.profile, null);
  if (existing) return existing;
  const fresh: UserProfile = {
    id: crypto.randomUUID(),
    currentStreak: 0,
    highestLevelAchieved: 0,
    onboardedAt: null,
    createdAt: new Date().toISOString(),
  };
  await write(KEYS.profile, fresh);
  return fresh;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await write(KEYS.profile, profile);
}

export async function listEmotions(): Promise<EmotionLog[]> {
  const logs = await read<EmotionLog[]>(KEYS.emotions, []);
  return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface NewEmotionInput {
  emotionLevel: number;
  emotionName: string;
  triggerTag: TriggerTag | null;
  notes: string | null;
}

export async function createEmotion(
  input: NewEmotionInput,
  userId: string
): Promise<EmotionLog> {
  const log: EmotionLog = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    createdAt: new Date().toISOString(),
  };
  const logs = await read<EmotionLog[]>(KEYS.emotions, []);
  logs.push(log);
  await write(KEYS.emotions, logs);
  return log;
}

export async function updateEmotion(
  id: string,
  patch: Partial<Omit<EmotionLog, "id" | "userId" | "createdAt">>
): Promise<void> {
  const logs = await read<EmotionLog[]>(KEYS.emotions, []);
  const next = logs.map((log) => (log.id === id ? { ...log, ...patch } : log));
  await write(KEYS.emotions, next);
}

export async function deleteEmotion(id: string): Promise<void> {
  const logs = await read<EmotionLog[]>(KEYS.emotions, []);
  await write(
    KEYS.emotions,
    logs.filter((log) => log.id !== id)
  );
  const interventions = await read<InterventionLog[]>(
    KEYS.interventions,
    []
  );
  await write(
    KEYS.interventions,
    interventions.filter((i) => i.emotionLogId !== id)
  );
}

export async function listInterventions(): Promise<InterventionLog[]> {
  const logs = await read<InterventionLog[]>(KEYS.interventions, []);
  return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createIntervention(input: {
  userId: string;
  emotionLogId: string;
  interventionType: InterventionLog["interventionType"];
  preLevel: number;
}): Promise<InterventionLog> {
  const log: InterventionLog = {
    id: crypto.randomUUID(),
    postLevel: null,
    createdAt: new Date().toISOString(),
    ...input,
  };
  const logs = await read<InterventionLog[]>(KEYS.interventions, []);
  logs.push(log);
  await write(KEYS.interventions, logs);
  return log;
}

export async function completeIntervention(
  id: string,
  postLevel: number
): Promise<void> {
  const logs = await read<InterventionLog[]>(KEYS.interventions, []);
  const next = logs.map((log) =>
    log.id === id ? { ...log, postLevel } : log
  );
  await write(KEYS.interventions, next);
}

export async function listPractices(): Promise<PracticeLog[]> {
  const logs = await read<PracticeLog[]>(KEYS.practices, []);
  return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createPractice(input: {
  userId: string;
  level: number;
  kind: string;
}): Promise<PracticeLog> {
  const log: PracticeLog = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  const logs = await read<PracticeLog[]>(KEYS.practices, []);
  logs.push(log);
  await write(KEYS.practices, logs);
  return log;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  profile: UserProfile | null;
  emotions: EmotionLog[];
  interventions: InterventionLog[];
  practices: PracticeLog[];
  preferences: Preferences;
}

export async function exportAllData(): Promise<BackupData> {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: read<UserProfile | null>(KEYS.profile, null),
    emotions: read<EmotionLog[]>(KEYS.emotions, []),
    interventions: read<InterventionLog[]>(KEYS.interventions, []),
    practices: read<PracticeLog[]>(KEYS.practices, []),
    preferences: read<Preferences>(KEYS.preferences, { idealCheckinHour: null }),
  };
}

export async function importAllData(data: Partial<BackupData>): Promise<void> {
  if (data.profile) await write(KEYS.profile, data.profile);
  if (Array.isArray(data.emotions)) await write(KEYS.emotions, data.emotions);
  if (Array.isArray(data.interventions))
    await write(KEYS.interventions, data.interventions);
  if (Array.isArray(data.practices)) await write(KEYS.practices, data.practices);
  if (data.preferences) await write(KEYS.preferences, data.preferences);
}
