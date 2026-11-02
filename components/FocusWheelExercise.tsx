"use client";

import { useState } from "react";

interface Mark {
  title: string;
  body: string;
  placeholder: string;
}

const MARKS: Mark[] = [
  {
    title: "Decilo claro",
    body: "Escribí exactamente qué no querés que siga pasando. Sin adornos.",
    placeholder: "No quiero que...",
  },
  {
    title: "Por qué pesa",
    body: "Terminá la idea: \"Me molesta porque...\". Escribí tu versión completa.",
    placeholder: "Me molesta porque...",
  },
  {
    title: "Lo de abajo",
    body: "¿Qué emoción hay debajo del enojo o la tristeza? Miedo, culpa, cansancio. Nombrala.",
    placeholder: "Debajo de todo esto hay...",
  },
  {
    title: "Permiso",
    body: "Escribí una frase dándote permiso a no arreglar nada todavía.",
    placeholder: "Ahora mismo no tengo que...",
  },
  {
    title: "Otra mirada",
    body: "Si un amigo tuyo sintiera exactamente esto, ¿qué le dirías? Escribilo como se lo dirías a él.",
    placeholder: "Le diría que...",
  },
  {
    title: "El matiz",
    body: "¿Es siempre igual de pesado o hay momentos en que pesa menos? Escribí cuándo.",
    placeholder: "Pesa menos cuando...",
  },
  {
    title: "Tu parte",
    body: "Escribí una cosa chica que sí depende de vos hoy, aunque sea mínima.",
    placeholder: "Hoy sí puedo...",
  },
  {
    title: "Ya pasó antes",
    body: "Recordá otra vez difícil que después se movió. Escribí ese recuerdo.",
    placeholder: "Aquella vez...",
  },
  {
    title: "Lo que sí querés",
    body: "Al revés de lo primero que escribiste: ¿qué preferís en su lugar? Una frase corta.",
    placeholder: "Prefiero...",
  },
  {
    title: "Un paso creíble",
    body: "El paso más chico posible hacia eso. Tan chico que hoy ya lo podés dar.",
    placeholder: "El paso más chico es...",
  },
  {
    title: "Las dos puntas",
    body: "Una sola frase que incluya dónde estás y hacia dónde vas. Tiene que sonarte verdadera.",
    placeholder: "Estoy en... y voy hacia...",
  },
  {
    title: "La última marca",
    body: "¿Cómo se sentiría el alivio en el cuerpo cuando llegue? Descríbilo, aunque hoy sea apenas una intuición.",
    placeholder: "El alivio se sentiría como...",
  },
];

type CenterState = "pending" | "active" | "filled";

function Wheel({
  color,
  filledCount,
  activeIndex,
  centerState,
}: {
  color: string;
  filledCount: number;
  activeIndex: number | null;
  centerState: CenterState;
}) {
  const allDone = filledCount >= MARKS.length;

  return (
    <div className="relative h-40 w-40 shrink-0 sm:h-44 sm:w-44">
      {allDone && (
        <div
          className="absolute inset-0 animate-pulse rounded-full blur-xl"
          style={{ backgroundColor: `${color}40` }}
        />
      )}
      <div
        className="absolute inset-1 rounded-full border transition-colors duration-1000"
        style={{ borderColor: allDone ? `${color}80` : "rgba(255,255,255,0.1)" }}
      />
      {MARKS.map((_, i) => {
        const angle = ((-90 + i * 30) * Math.PI) / 180;
        const left = 50 + 43 * Math.cos(angle);
        const top = 50 + 43 * Math.sin(angle);
        const filled = i < filledCount;
        const active = i === activeIndex;
        return (
          <span
            key={i}
            aria-hidden
            className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
              active ? "scale-150 animate-pulse bg-white/80" : ""
            }`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: filled ? color : undefined,
              boxShadow: filled ? `0 0 10px ${color}90` : undefined,
            }}
          >
            {!filled && !active && (
              <span className="absolute inset-[3px] rounded-full bg-white/20" />
            )}
          </span>
        );
      })}
      <span
        aria-hidden
        className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
          centerState === "active" ? "scale-110 animate-pulse bg-white/70" : ""
        }`}
        style={{
          backgroundColor:
            centerState === "filled"
              ? color
              : centerState === "active"
                ? undefined
                : "rgba(255,255,255,0.08)",
          boxShadow:
            centerState !== "pending" ? `0 0 12px ${color}90` : undefined,
          border:
            centerState === "pending"
              ? "1px solid rgba(255,255,255,0.2)"
              : undefined,
        }}
      />
    </div>
  );
}

export function FocusWheelExercise({
  color,
  seed,
  onFinish,
}: {
  color: string;
  seed?: string | null;
  onFinish: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "center" | "marks" | "done">(
    "intro"
  );
  const [mark, setMark] = useState(0);
  const [center, setCenter] = useState(seed?.trim() ?? "");
  const [texts, setTexts] = useState<string[]>(() =>
    Array(MARKS.length).fill("")
  );

  function clearAll() {
    setCenter("");
    setTexts(Array(MARKS.length).fill(""));
  }

  if (stage === "intro") {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 py-2 text-center">
        <Wheel color={color} filledCount={0} activeIndex={null} centerState="pending" />
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            Rueda de Enfoque
          </p>
          <h3 className="font-display text-2xl text-white">
            Aflojar un pensamiento sin mentirte
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Doce marcas alrededor de lo que te pesa, una por una. La regla:
            nunca vas a escribir algo que no puedas creer hoy. Solo frases un
            poco más amplias que la anterior.
          </p>
        </div>
        <button
          onClick={() => setStage("center")}
          className="rounded-full bg-white px-10 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
        >
          Empezar
        </button>
      </div>
    );
  }

  if (stage === "center") {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 py-2 text-center">
        <Wheel
          color={color}
          filledCount={0}
          activeIndex={null}
          centerState="active"
        />
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            El centro de la rueda
          </p>
          <h3 className="font-display text-xl text-white">
            ¿Qué está pesando?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            El pensamiento que da vueltas, tal cual aparece en tu cabeza.
          </p>
        </div>
        <textarea
          autoFocus
          value={center}
          onChange={(e) => setCenter(e.target.value)}
          rows={3}
          placeholder="Tal cual suena..."
          className="w-full resize-none rounded-2xl border border-white/20 bg-white/5 p-4 text-left text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/50 focus:outline-none"
        />
        <button
          onClick={() => setStage("marks")}
          disabled={!center.trim()}
          className="rounded-full bg-white px-10 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          Ponerlo en el centro
        </button>
        <p className="text-xs text-zinc-600">
          Nada de esto se guarda. Se borra al terminar.
        </p>
      </div>
    );
  }

  if (stage === "marks") {
    const current = MARKS[mark];
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-5 py-2 text-center">
        <Wheel
          color={color}
          filledCount={mark}
          activeIndex={mark}
          centerState="filled"
        />
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            Rueda de Enfoque · marca {mark + 1} de {MARKS.length}
          </p>
          <h3 className="font-display text-2xl text-white">
            {current.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            {current.body}
          </p>
        </div>
        <textarea
          autoFocus
          key={mark}
          value={texts[mark]}
          onChange={(e) =>
            setTexts((prev) =>
              prev.map((t, i) => (i === mark ? e.target.value : t))
            )
          }
          rows={3}
          placeholder={current.placeholder}
          className="w-full resize-none rounded-2xl border border-white/20 bg-white/5 p-4 text-left text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/50 focus:outline-none"
        />
        <button
          onClick={() => {
            if (mark === MARKS.length - 1) {
              clearAll();
              setStage("done");
            } else {
              setMark((m) => m + 1);
            }
          }}
          disabled={!texts[mark].trim()}
          className="rounded-full bg-white px-10 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          {mark === MARKS.length - 1 ? "Cerrar la rueda" : "Seguir"}
        </button>
        <p className="text-xs text-zinc-600">Se borra al terminar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <Wheel
        color={color}
        filledCount={MARKS.length}
        activeIndex={null}
        centerState="filled"
      />
      <p className="font-display text-xl leading-relaxed text-white">
        Diste la vuelta completa.
      </p>
      <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
        Si algo se movió, ya sabés que funciona. Si nada se movió, también
        sirve: escribiste doce veces la verdad en lugar de una sola mentira
        optimista. Y lo que escribiste ya no existe.
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
