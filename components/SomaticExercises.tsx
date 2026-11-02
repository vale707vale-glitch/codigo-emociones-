"use client";

import { useState } from "react";
import { Orb } from "@/components/Orb";

interface Step {
  title: string;
  body: string;
}

const SCAN_STEPS: Step[] = [
  {
    title: "Cerrá los ojos y respirá",
    body: "Tres respiraciones lentas. No hay nada que hacer todavía: solo bajá el ritmo.",
  },
  {
    title: "Recorré tu cuerpo",
    body: "De la cabeza a los pies, despacio: frente, mandíbula, cuello, pecho, estómago, panza, piernas, pies.",
  },
  {
    title: "Buscá el punto con más carga",
    body: "¿Dónde hay más volumen? Puede ser presión, vacío, calor, frío o tensión. Quedate ahí un momento.",
  },
  {
    title: "Caracterizala",
    body: "¿Se siente pesada o liviana? ¿Caliente o fría? ¿Tensa o suelta? Nombrala sin analizar por qué está.",
  },
  {
    title: "Tradućilo",
    body: "Pesadez, frío o vacío señalan niveles bajos (congelamiento). Tensión, calor o ganas de moverte señalan activación (movilización). Rigidez defensiva es orgullo armado. Ya sabés dónde estás parado.",
  },
];

const BRIDGE_STEPS: Step[] = [
  {
    title: "Sentate derecho",
    body: "Espalda erguida pero no rígida: que se sostenga sola, sin esfuerzo.",
  },
  {
    title: "Pies en el suelo",
    body: "Plantá los dos pies firmes y sentí el contacto completo: talón, planta, dedos. Ese contacto le dice a tu cerebro que estás acá.",
  },
  {
    title: "Soltá mandíbula y hombros",
    body: "Separá los dientes, aflojá la lengua. Dejá caer los hombros lejos de las orejas.",
  },
  {
    title: "Respirá al abdomen",
    body: "Tres respiraciones profundas: que se infle la panza al inhalar y baje todo al exhalar. Lento.",
  },
  {
    title: "Notá el cambio",
    body: "Esta es la fisiología del coraje: raíz, apertura, presencia. Desde acá sí podés actuar.",
  },
];

const DISCHARGE_STEPS: Step[] = [
  {
    title: "Ubicá la ira",
    body: "¿Dónde vive hoy? Puños, mandíbula, pecho, cuello. Poné atención ahí.",
  },
  {
    title: "Apretá al inhalar",
    body: "Cerrá los puños con fuerza y tensá los brazos mientras inhalás profundo. Aferrate a toda esa energía.",
  },
  {
    title: "Soltá al exhalar",
    body: "Al exhalar: abrí los puños de golpe, soltá los hombros y sacudí los brazos entero.",
  },
  {
    title: "Soltá un sonido",
    body: "Un suspiro fuerte, un 'ahhh', lo que salga. La ira necesita salida, no silencio.",
  },
  {
    title: "Repetí tres veces",
    body: "Inhalar apretando, exhalar soltando. Al terminar, notá qué quedó y dónde.",
  },
];

function StepFlow({
  label,
  steps,
  color,
  doneTitle,
  doneBody,
  onFinish,
}: {
  label: string;
  steps: Step[];
  color: string;
  doneTitle: string;
  doneBody: string;
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <Orb color={color} className="h-36 w-36" />
        <p className="font-display text-xl leading-relaxed text-white">
          {doneTitle}
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
          {doneBody}
        </p>
        <button
          onClick={onFinish}
          className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
        >
          Listo
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 py-2 text-center">
      <Orb color={color} className="h-20 w-20" />
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
          {label} · paso {step + 1} de {steps.length}
        </p>
        <h3 className="font-display text-2xl text-white">{steps[step].title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {steps[step].body}
        </p>
      </div>
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              i <= step ? "bg-white" : "bg-white/25"
            }`}
          />
        ))}
      </div>
      <button
        onClick={() => {
          if (step === steps.length - 1) setDone(true);
          else setStep((s) => s + 1);
        }}
        className="rounded-full bg-white px-10 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
      >
        {step === steps.length - 1 ? "Cerrar el ciclo" : "Seguir"}
      </button>
    </div>
  );
}

export function BodyScanExercise({
  color,
  onFinish,
}: {
  color: string;
  onFinish: () => void;
}) {
  return (
    <StepFlow
      label="Escáner corporal"
      steps={SCAN_STEPS}
      color={color}
      doneTitle="Ya sabés dónde estás."
      doneBody="Con la emoción ubicada en el cuerpo, elegí una intervención y mové esa energía. El cuerpo primero, el resto después."
      onFinish={onFinish}
    />
  );
}

export function CourageBridgeExercise({
  color,
  onFinish,
}: {
  color: string;
  onFinish: () => void;
}) {
  return (
    <StepFlow
      label="Puente al Coraje"
      steps={BRIDGE_STEPS}
      color={color}
      doneTitle="Cruzaste al Coraje."
      doneBody="El cuerpo ya está del otro lado de la línea. Elegí la acción pendiente más chica y dale el primer paso."
      onFinish={onFinish}
    />
  );
}

export function AngerDischargeExercise({
  color,
  onFinish,
}: {
  color: string;
  onFinish: () => void;
}) {
  return (
    <StepFlow
      label="Descarga de la ira"
      steps={DISCHARGE_STEPS}
      color={color}
      doneTitle="La energía se descargó."
      doneBody="Lo que queda después de mover la ira suele ser claridad: algún límite tuyo pide atención. Ahora podés elegir qué hacer con ella."
      onFinish={onFinish}
    />
  );
}
