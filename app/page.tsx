"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { BreathingExercise } from "@/components/BreathingExercise";
import { CalibrateButton } from "@/components/CalibrateButton";
import { FrequencySlider } from "@/components/FrequencySlider";
import { GlassCard } from "@/components/GlassCard";
import { LevelDetail } from "@/components/LevelDetail";
import { JournalingBlock } from "@/components/JournalingBlock";
import { ConsciousnessGarden } from "@/components/ConsciousnessGarden";
import { LettingGoExercise } from "@/components/LettingGoExercise";
import { FocusWheelExercise } from "@/components/FocusWheelExercise";
import {
  AngerDischargeExercise,
  BodyScanExercise,
  CourageBridgeExercise,
} from "@/components/SomaticExercises";
import { Orb } from "@/components/Orb";
import { ClimbTaskList } from "@/components/ClimbTaskList";
import { SOSButton } from "@/components/SOSButton";
import { SOSModal } from "@/components/SOSModal";
import { formatDate, dateKey } from "@/lib/date";
import { getNearestLevel, hawkinsMap } from "@/lib/hawkinsMap";
import { getContent } from "@/lib/hawkinsContent";
import {
  getPreferences,
  savePreferences,
  type Preferences,
} from "@/lib/storage";
import { getInterventions, type Intervention } from "@/lib/interventions";
import { useAscenso } from "@/hooks/useAscenso";
import { computeCourageStreak } from "@/lib/streak";
import { BODY_SHIFTS, type BodyShift, type EmotionLog, type HawkinsLevel, type TriggerTag } from "@/types";

type View =
  | "dashboard"
  | "checkin"
  | "trigger"
  | "intervention"
  | "recheck"
  | "celebrate"
  | "consolidate";

const DEFAULT_COLOR = "#6366F1";

function fireConfetti() {
  confetti({
    particleCount: 140,
    spread: 90,
    origin: { y: 0.6 },
    colors: ["#FFD700", "#9ACD32", "#ffffff"],
  });
}

export default function Home() {
  const {
    profile,
    logs,
    loading,
    addLog,
    addIntervention,
    finishIntervention,
    editLog,
    markOnboarded,
  } = useAscenso();

  const [view, setView] = useState<View>("dashboard");
  const [sliderLevel, setSliderLevel] = useState(150);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [savedLevel, setSavedLevel] = useState<number | null>(null);
  const [savedName, setSavedName] = useState("");
  const [triggerTag, setTriggerTag] = useState<TriggerTag | null>(null);
  const [notes, setNotes] = useState("");
  const [bodyShift, setBodyShift] = useState<BodyShift | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeIntervention, setActiveIntervention] =
    useState<Intervention | null>(null);
  const [interventionLogId, setInterventionLogId] = useState<string | null>(
    null
  );
  const [improved, setImproved] = useState(false);
  const [practiceLevel, setPracticeLevel] = useState<number | null>(null);

  const lastLog = logs[0];
  const nearest = getNearestLevel(sliderLevel);

  const ambientColor =
    view === "dashboard"
      ? lastLog
        ? getNearestLevel(lastLog.emotionLevel).color
        : DEFAULT_COLOR
      : view === "intervention" && savedLevel !== null
        ? getNearestLevel(savedLevel).color
        : nearest.color;

  async function handleSave() {
    if (saving) return;
    const level = getNearestLevel(sliderLevel);
    setSaving(true);
    const log = await addLog({
      emotionLevel: level.level,
      emotionName: level.name,
      triggerTag,
      notes: notes.trim() ? notes.trim() : null,
    });
    setSaving(false);
    if (!log) return;
    setSavedLogId(log.id);
    setSavedLevel(log.emotionLevel);
    setSavedName(log.emotionName);
    if (log.emotionLevel < 200) {
      setView("intervention");
    } else {
      setPracticeLevel(log.emotionLevel);
      setView("consolidate");
    }
  }

  async function handleSelectIntervention(intervention: Intervention) {
    setActiveIntervention(intervention);
    if (savedLogId && savedLevel !== null) {
      const id = await addIntervention(savedLogId, savedLevel, intervention.id);
      setInterventionLogId(id);
    }
  }

  async function handleRecheckCommit(finalLevel: number) {
    setSliderLevel(finalLevel);
    if (interventionLogId) {
      await finishIntervention(interventionLogId, finalLevel);
    }
    if (savedLogId && bodyShift) {
      await editLog(savedLogId, { bodyShift });
    }
    const up = savedLevel !== null && finalLevel > savedLevel;
    setImproved(up);
    if (up) fireConfetti();
    setView("celebrate");
  }

  function handleBodyShift(shift: BodyShift) {
    setBodyShift((current) => (current === shift ? null : shift));
  }

  function handleFinishIntervention() {
    setActiveIntervention(null);
    setView("recheck");
  }

  function resetToDashboard() {
    setView("dashboard");
    setSliderLevel(150);
    setSavedLogId(null);
    setSavedLevel(null);
    setSavedName("");
    setTriggerTag(null);
    setNotes("");
    setBodyShift(null);
    setActiveIntervention(null);
    setInterventionLogId(null);
    setImproved(false);
    setPracticeLevel(null);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-24 w-24 animate-pulse rounded-full bg-white/10" />
      </div>
    );
  }

  if (profile && !profile.onboardedAt) {
    return <Onboarding onStart={() => markOnboarded()} />;
  }

  return (
    <AmbientBackground color={ambientColor}>
      {view === "dashboard" && (
        <DashboardView
          lastLog={lastLog ?? null}
          logs={logs}
          streak={profile?.currentStreak ?? 0}
          gardenStreak={computeCourageStreak(logs)}
          onCalibrate={() => setView("checkin")}
        />
      )}
      {view === "checkin" && (
        <CheckInView
          value={sliderLevel}
          onChange={setSliderLevel}
          onCommit={(level) => {
            setSliderLevel(level);
            setView("trigger");
          }}
        />
      )}
      {view === "trigger" && (
        <TriggerView
          level={nearest}
          tag={triggerTag}
          notes={notes}
          saving={saving}
          onTag={setTriggerTag}
          onNotes={setNotes}
          onSave={handleSave}
        />
      )}
      {view === "intervention" && savedLevel !== null && (
        <InterventionView
          savedLevel={savedLevel}
          savedName={savedName}
          seed={notes.trim() || triggerTag || null}
          intervention={activeIntervention}
          onSelect={handleSelectIntervention}
          onFinish={handleFinishIntervention}
          onSkip={resetToDashboard}
        />
      )}
      {view === "recheck" && (
        <ReCheckView
          value={sliderLevel}
          onChange={setSliderLevel}
          shift={bodyShift}
          onShift={handleBodyShift}
          onCommit={handleRecheckCommit}
        />
      )}
      {view === "celebrate" && (
        <CelebrateView
          improved={improved}
          before={savedLevel}
          after={nearest}
          onDone={resetToDashboard}
          onPractice={() => {
            setPracticeLevel(nearest.level);
            setView("consolidate");
          }}
        />
      )}
      {view === "consolidate" && practiceLevel !== null && (
        <ConsolidateView
          level={getNearestLevel(practiceLevel)}
          onDone={resetToDashboard}
        />
      )}
    </AmbientBackground>
  );
}

function AmbientBackground({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: `${color}12` }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: `${color}2e` }}
      />
      <div className="relative flex flex-1 flex-col px-6">{children}</div>
    </div>
  );
}

function Onboarding({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <Orb color="#6366F1" className="h-36 w-36" />
      <h1 className="font-display text-5xl">Ascenso</h1>
      <p className="text-lg leading-relaxed text-zinc-300">
        Basada en el Mapa de Conciencia de David R. Hawkins. Registrás cómo te
        sentís, la app calcula tu frecuencia vibracional y te propone
        micro-intervenciones para subir de nivel.
      </p>
      <GlassCard className="w-full p-6 text-left text-sm leading-relaxed text-zinc-300">
        <p>
          El mapa va de Vergüenza (20) a Paz (600). El nivel 200, Coraje, es la
          frontera: debajo la energía sobrevive, encima la energía crea. No se
          salta del 20 al 500: se sube de a peldaños.
        </p>
      </GlassCard>
      <button
        onClick={onStart}
        className="rounded-full bg-white px-10 py-4 font-display text-lg text-abyss transition-transform hover:scale-105 active:scale-95"
      >
        Empezar
      </button>
    </div>
  );
}

function DashboardView({
  lastLog,
  logs,
  streak,
  gardenStreak,
  onCalibrate,
}: {
  lastLog: EmotionLog | null;
  logs: EmotionLog[];
  streak: number;
  gardenStreak: number;
  onCalibrate: () => void;
}) {
  const [sosOpen, setSosOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const color = lastLog
    ? getNearestLevel(lastLog.emotionLevel).color
    : DEFAULT_COLOR;
  const needsSOS = lastLog !== null && lastLog.emotionLevel < 200;

  useEffect(() => {
    getPreferences().then(setPrefs);
  }, []);

  const now = new Date();
  const daysSince = lastLog
    ? Math.floor((now.getTime() - new Date(lastLog.createdAt).getTime()) / 86400000)
    : null;
  const loggedToday = logs.some((l) => dateKey(l.createdAt) === dateKey(now));

  let nudge: string | null = null;
  if (daysSince !== null && daysSince >= 2) {
    nudge = `Llevás ${daysSince} días sin calibrarte. ¿Cómo venís?`;
  } else if (
    prefs?.idealCheckinHour != null &&
    now.getHours() >= prefs.idealCheckinHour &&
    !loggedToday
  ) {
    nudge = "Es tu momento del día para calibrarte.";
  }

  async function setIdealHour(hour: number | null) {
    const next = { idealCheckinHour: hour };
    await savePreferences(next);
    setPrefs(next);
    setShowPicker(false);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-9 py-10 text-center">
      {streak > 0 && (
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs tracking-wide text-zinc-300">
          Racha de {streak} {streak === 1 ? "día" : "días"}
        </span>
      )}
      <ConsciousnessGarden streak={gardenStreak} />
      <Orb color={color} className="h-56 w-56 sm:h-72 sm:w-72" />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-white sm:text-5xl">
          ¿En qué frecuencia estás ahora?
        </h1>
        {lastLog && (
          <p className="text-sm text-zinc-400">
            Último registro: {getNearestLevel(lastLog.emotionLevel).name} ·{" "}
            {formatDate(lastLog.createdAt)}
          </p>
        )}
      </div>
      <CalibrateButton onClick={onCalibrate} color={color} />
      {nudge && (
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs tracking-wide text-zinc-300">
            {nudge}
          </span>
          <button
            onClick={onCalibrate}
            className="text-xs text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Calibrarme ahora
          </button>
        </div>
      )}
      <div>
        {!showPicker ? (
          <button
            onClick={() => setShowPicker(true)}
            className="text-xs text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-400 hover:underline"
          >
            {prefs?.idealCheckinHour != null
              ? `Recordatorio diario a las ${prefs.idealCheckinHour}h · cambiar`
              : "Configurar recordatorio diario"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <label htmlFor="ideal-hour">Mi hora ideal:</label>
            <select
              id="ideal-hour"
              value={prefs?.idealCheckinHour ?? ""}
              onChange={(e) =>
                setIdealHour(e.target.value === "" ? null : Number(e.target.value))
              }
              className="rounded-lg border border-white/20 bg-transparent px-2 py-1 text-zinc-200"
            >
              <option value="" disabled>
                Elegir hora
              </option>
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h} className="bg-abyss">
                  {h}h
                </option>
              ))}
            </select>
            {prefs?.idealCheckinHour != null && (
              <button
                onClick={() => setIdealHour(null)}
                className="text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
              >
                quitar
              </button>
            )}
          </div>
        )}
      </div>
      {needsSOS && (
        <>
          <button
            onClick={() => setSosOpen(true)}
            className="-mt-4 text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
          >
            ¿Necesitás calma ahora?
          </button>
          <SOSButton onClick={() => setSosOpen(true)} />
        </>
      )}
      {sosOpen && <SOSModal onClose={() => setSosOpen(false)} />}
    </div>
  );
}

function CheckInView({
  value,
  onChange,
  onCommit,
}: {
  value: number;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
}) {
  const [infoLevel, setInfoLevel] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-10">
      <h1 className="text-center font-display text-3xl text-white sm:text-4xl">
        Deslizá hasta donde sentís tu frecuencia
      </h1>
      <FrequencySlider
        value={value}
        onChange={onChange}
        onCommit={onCommit}
        onInfo={setInfoLevel}
      />
      <p className="text-xs text-zinc-500">Deslizá la barra o usá las flechas del teclado</p>

      {infoLevel !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={() => setInfoLevel(null)}
        >
          <GlassCard className="max-h-[85vh] w-full max-w-sm overflow-y-auto p-6">
            <div onClick={(e) => e.stopPropagation()}>
              <LevelDetail level={getNearestLevel(infoLevel)} />
              <Link
                href="/mapa"
                className="mt-4 block text-xs text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
              >
                Ver el mapa completo
              </Link>
              <button
                onClick={() => setInfoLevel(null)}
                className="mt-3 w-full rounded-full bg-white py-2.5 text-sm font-medium text-abyss transition-transform hover:scale-[1.02] active:scale-95"
              >
                Entendido
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function TriggerView({
  level,
  tag,
  notes,
  saving,
  onTag,
  onNotes,
  onSave,
}: {
  level: HawkinsLevel;
  tag: TriggerTag | null;
  notes: string;
  saving: boolean;
  onTag: (tag: TriggerTag) => void;
  onNotes: (notes: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-7 py-10 text-center">
      <p
        className="font-display text-3xl text-white"
        style={{ color: level.color }}
      >
        Nivel {level.level} · {level.name} {level.icon}
      </p>
      <div className="w-full">
        <p className="mb-3 text-xs uppercase tracking-widest text-zinc-400">
          ¿Qué lo disparó?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(["Trabajo", "Dinero", "Salud", "Relaciones", "Otro"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => onTag(t)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  tag === t
                    ? "border-white bg-white text-abyss"
                    : "border-white/25 text-zinc-300 hover:border-white/60"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onNotes(e.target.value)}
        placeholder="Notas (opcional): ¿qué pasó exactamente?"
        rows={3}
        className="w-full resize-none rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/50 focus:outline-none"
      />
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-full bg-white px-10 py-3.5 font-display text-lg text-abyss transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Registrar"}
      </button>
    </div>
  );
}

function InterventionView(props: {
  savedLevel: number;
  savedName: string;
  seed: string | null;
  intervention: Intervention | null;
  onSelect: (i: Intervention) => void;
  onFinish: () => void;
  onSkip: () => void;
}) {
  const {
    savedLevel,
    savedName,
    seed,
    intervention,
    onSelect,
    onFinish,
    onSkip,
  } = props;
  const emotion = getNearestLevel(savedLevel);
  const options = getInterventions(savedLevel, savedName);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <Orb color={emotion.color} className="h-28 w-28" />
      <h1 className="font-display text-3xl text-white sm:text-4xl">
        La {emotion.name.toLowerCase()} es energía en movimiento. Subamos juntos
        hacia el Coraje (200).
      </h1>

      {!intervention && (
        <>
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {options.map((option) => (
              <button key={option.id} onClick={() => onSelect(option)}>
                <GlassCard className="flex h-full flex-col gap-2 p-5 text-left">
                  <span className="font-display text-lg text-white">
                    {option.title}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {option.description}
                  </span>
                </GlassCard>
              </button>
            ))}
          </div>
          <button
            onClick={onSkip}
            className="text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
          >
            Ahora no, volver al inicio
          </button>
        </>
      )}

      {intervention?.kind === "breathing" && (
        <BreathingExercise color={emotion.color} cycles={3} onFinish={onFinish} />
      )}

      {intervention?.kind === "action" && (
        <GlassCard className="flex w-full max-w-md flex-col items-center gap-4 p-6">
          <p className="font-display text-xl text-white">{intervention.title}</p>
          <p className="text-sm text-zinc-400">{intervention.description}</p>
          <button
            onClick={onFinish}
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
          >
            Listo, lo hice
          </button>
        </GlassCard>
      )}

      {intervention?.kind === "journaling" && (
        <JournalingBlock onFinish={onFinish} />
      )}

      {intervention?.kind === "lettinggo" && (
        <LettingGoExercise color={emotion.color} onFinish={onFinish} />
      )}

      {intervention?.kind === "focuswheel" && (
        <FocusWheelExercise
          color={emotion.color}
          seed={seed}
          onFinish={onFinish}
        />
      )}

      {intervention?.kind === "scan" && (
        <BodyScanExercise color={emotion.color} onFinish={onFinish} />
      )}

      {intervention?.kind === "posture" && (
        <CourageBridgeExercise color={emotion.color} onFinish={onFinish} />
      )}

      {intervention?.kind === "discharge" && (
        <AngerDischargeExercise color={emotion.color} onFinish={onFinish} />
      )}
    </div>
  );
}

function ReCheckView({
  value,
  onChange,
  shift,
  onShift,
  onCommit,
}: {
  value: number;
  onChange: (v: number) => void;
  shift: BodyShift | null;
  onShift: (shift: BodyShift) => void;
  onCommit: (v: number) => void;
}) {
  const nearest = getNearestLevel(value);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10">
      <h1 className="text-center font-display text-3xl text-white sm:text-4xl">
        ¿Cómo te sentís ahora?
      </h1>
      <FrequencySlider value={value} onChange={onChange} />
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          ¿Qué notás en tu cuerpo?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {BODY_SHIFTS.map((option) => (
            <button
              key={option}
              onClick={() => onShift(option)}
              aria-pressed={shift === option}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                shift === option
                  ? "border-white bg-white text-abyss"
                  : "border-white/25 text-zinc-300 hover:border-white/60"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onCommit(nearest.level)}
        className="rounded-full bg-white px-10 py-3.5 font-display text-lg text-abyss transition-transform hover:scale-105 active:scale-95"
      >
        Continuar
      </button>
      <p className="text-xs text-zinc-500">Los chips son opcionales</p>
    </div>
  );
}

function getMomentumSuggestion(afterLevel: number) {
  const sorted = [...hawkinsMap].sort((a, b) => a.level - b.level);
  const next = sorted.find((l) => l.level > afterLevel) ?? null;
  const target = next ?? getNearestLevel(afterLevel);
  const tasks = getContent(target.level)?.climbs ?? [];
  if (tasks.length === 0) return null;
  const task = tasks[afterLevel % tasks.length];
  return { target, task, hasNext: next !== null };
}

function CelebrateView({
  improved,
  before,
  after,
  onDone,
  onPractice,
}: {
  improved: boolean;
  before: number | null;
  after: HawkinsLevel;
  onDone: () => void;
  onPractice: () => void;
}) {
  const momentum = getMomentumSuggestion(after.level);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <Orb color={after.color} className="h-40 w-40" />
      {improved && before !== null ? (
        <>
          <h1 className="font-display text-4xl text-white">Subiste de nivel</h1>
          <p className="text-lg text-zinc-300">
            De {before} a {after.level} · {after.name} {after.icon}
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl text-white">
            Gracias por practicar
          </h1>
          <p className="text-zinc-400">
            Estás en {after.name}. Cada registro entrena tu conciencia.
          </p>
        </>
      )}
      {momentum && (
        <GlassCard className="w-full max-w-md p-5 text-left">
          <p
            className="mb-1.5 text-xs uppercase tracking-widest"
            style={{ color: momentum.target.color }}
          >
            {momentum.hasNext
              ? `¿Seguimos subiendo? Un paso hacia ${momentum.target.name}`
              : `Consolidá ${momentum.target.name} con una práctica`}
          </p>
          <p className="text-sm leading-relaxed text-zinc-200">
            {momentum.task.text}
          </p>
        </GlassCard>
      )}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={onDone}
          className="rounded-full bg-white px-10 py-4 font-display text-lg text-abyss transition-transform hover:scale-105 active:scale-95"
        >
          Volver al inicio
        </button>
        {momentum && (
          <button
            onClick={onPractice}
            className="text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
          >
            Practicar este nivel
          </button>
        )}
      </div>
    </div>
  );
}

function ConsolidateView({
  level,
  onDone,
}: {
  level: HawkinsLevel;
  onDone: () => void;
}) {
  const content = getContent(level.level);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <Orb color={level.color} className="h-28 w-28" />
      <div>
        <h1 className="font-display text-3xl text-white sm:text-4xl">
          Estás en {level.name} {level.icon}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Los niveles altos no se sostienen solos: se practican. Elegí una
          acción concreta y hacela hoy.
        </p>
      </div>
      {content && (
        <GlassCard className="w-full p-5 text-left">
          <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
            Prácticas para consolidar
          </p>
          <ClimbTaskList
            tasks={content.climbs}
            level={level.level}
            color={level.color}
          />
        </GlassCard>
      )}
      <button
        onClick={onDone}
        className="text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
      >
        Volver al inicio
      </button>
    </div>
  );
}
