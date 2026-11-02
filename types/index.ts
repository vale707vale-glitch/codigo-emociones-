export type Category = "Baja" | "Alta";

export interface HawkinsLevel {
  level: number;
  name: string;
  color: string;
  category: Category;
  icon: string;
  description: string;
}

export type TriggerTag = "Trabajo" | "Dinero" | "Salud" | "Relaciones" | "Otro";

export const TRIGGER_TAGS: TriggerTag[] = [
  "Trabajo",
  "Dinero",
  "Salud",
  "Relaciones",
  "Otro",
];

export type BodyShift =
  | "Pecho más ligero"
  | "Mente más clara"
  | "Sigo igual";

export const BODY_SHIFTS: BodyShift[] = [
  "Pecho más ligero",
  "Mente más clara",
  "Sigo igual",
];

export interface EmotionLog {
  id: string;
  userId: string;
  emotionLevel: number;
  emotionName: string;
  triggerTag: TriggerTag | null;
  notes: string | null;
  bodyShift?: BodyShift | null;
  createdAt: string;
}

export type InterventionId =
  | "Breathing"
  | "Journaling"
  | "Movement"
  | "ControlList"
  | "Gratitude"
  | "MicroGoal"
  | "KindMessage"
  | "LovingKindness"
  | "Nature";

export interface InterventionLog {
  id: string;
  userId: string;
  emotionLogId: string;
  interventionType: InterventionId | (string & {});
  preLevel: number;
  postLevel: number | null;
  createdAt: string;
}

export interface PracticeLog {
  id: string;
  userId: string;
  level: number;
  kind: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  currentStreak: number;
  highestLevelAchieved: number;
  onboardedAt: string | null;
  createdAt: string;
}
