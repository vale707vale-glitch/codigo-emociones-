"use client";

import { useState } from "react";
import { Orb } from "@/components/Orb";

const STEPS = [
  {
    title: "Ubicá la emoción",
    body: "¿Dónde la sentís en el cuerpo? Pecho, garganta, estómago... Poné atención ahí, sin necesidad de precisar.",
  },
  {
    title: "No la juzgues",
    body: "No la llames mala ni te preguntes por qué está. Mirála como mirás una nube que cruza el cielo.",
  },
  {
    title: "Permití que esté",
    body: "No intentes cambiarla, arreglarla ni entenderla. Solo permitile ocupar su lugar un rato.",
  },
  {
    title: "Quedate con ella",
    body: "Respirá lento y quedate con la sensación. Si aprieta, dejá que apriete. Si vibra, dejá que vibre.",
  },
  {
    title: "Dejala pasar",
    body: "La energía que permitís se mueve sola. No la empujes: acompañala mientras pasa.",
  },
];

export function LettingGoExercise({
  color,
  onFinish,
}: {
  color: string;
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <Orb color={color} className="h-36 w-36" />
        <p className="font-display text-xl leading-relaxed text-white">
          La energía ya se movió.
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
          Si queda algo, podés repetirlo las veces que haga falta. Cada vez que
          soltás, subís un peldaño.
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
          Soltar · paso {step + 1} de {STEPS.length}
        </p>
        <h3 className="font-display text-2xl text-white">
          {STEPS[step].title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {STEPS[step].body}
        </p>
      </div>
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
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
          if (step === STEPS.length - 1) setDone(true);
          else setStep((s) => s + 1);
        }}
        className="rounded-full bg-white px-10 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
      >
        {step === STEPS.length - 1 ? "Cerrar el ciclo" : "Seguir"}
      </button>
    </div>
  );
}
