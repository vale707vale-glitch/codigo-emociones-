"use client";

import { useEffect, useState } from "react";
import type {
  EmotionLog,
  InterventionLog,
  PracticeLog,
  TriggerTag,
  UserProfile,
} from "@/types";
import {
  completeIntervention,
  createEmotion,
  createIntervention,
  deleteEmotion,
  ensureProfile,
  listEmotions,
  listInterventions,
  listPractices,
  saveProfile,
  updateEmotion,
} from "@/lib/storage";
import { deriveProfile } from "@/lib/streak";

export function useAscenso() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<EmotionLog[] | null>(null);
  const [interventions, setInterventions] = useState<InterventionLog[]>([]);
  const [practices, setPractices] = useState<PracticeLog[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const p = await ensureProfile();
      const all = await listEmotions();
      if (!cancelled) {
        setProfile(deriveProfile(p, all));
        setLogs(all);
        setInterventions(await listInterventions());
        setPractices(await listPractices());
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function reload() {
    const p = await ensureProfile();
    const all = await listEmotions();
    setProfile(deriveProfile(p, all));
    setLogs(all);
    setInterventions(await listInterventions());
    setPractices(await listPractices());
  }

  async function addLog(input: {
    emotionLevel: number;
    emotionName: string;
    triggerTag: TriggerTag | null;
    notes: string | null;
  }): Promise<EmotionLog | null> {
    if (!profile) return null;
    const log = await createEmotion(input, profile.id);
    const all = await listEmotions();
    const derived = deriveProfile(profile, all);
    await saveProfile(derived);
    setLogs(all);
    setProfile(derived);
    return log;
  }

  async function editLog(
    id: string,
    patch: Partial<Pick<EmotionLog, "triggerTag" | "notes" | "bodyShift">>
  ) {
    await updateEmotion(id, patch);
    await reload();
  }

  async function removeLog(id: string) {
    await deleteEmotion(id);
    await reload();
  }

  async function addIntervention(
    emotionLogId: string,
    preLevel: number,
    type: InterventionLog["interventionType"]
  ): Promise<string | null> {
    if (!profile) return null;
    const log = await createIntervention({
      userId: profile.id,
      emotionLogId,
      interventionType: type,
      preLevel,
    });
    return log.id;
  }

  async function finishIntervention(id: string, postLevel: number) {
    await completeIntervention(id, postLevel);
  }

  async function markOnboarded() {
    if (!profile) return;
    const next = { ...profile, onboardedAt: new Date().toISOString() };
    await saveProfile(next);
    setProfile(next);
  }

  return {
    profile,
    logs: logs ?? [],
    interventions,
    practices,
    loading: profile === null || logs === null,
    addLog,
    editLog,
    removeLog,
    addIntervention,
    finishIntervention,
    markOnboarded,
  };
}
