"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { SOSModal, type SosMode } from "@/components/SOSModal";

const TOOLS: {
  mode: SosMode;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    mode: "scan",
    title: "Escáner corporal",
    description: "Ubicá lo que sentís recorriendo el cuerpo.",
    detail:
      "Cuando la emoción no tiene nombre, el cuerpo ya sabe. Este recorrido guiado te ayuda a encontrar dónde está la carga y qué forma tiene. Es el primer paso antes de soltarla o moverla: las emociones bajas se sienten como pesadez, frío o vacío; la activación, como tensión y calor.",
  },
  {
    mode: "release",
    title: "Soltar la emoción",
    description: "El método central de Hawkins, en 5 pasos guiados.",
    detail:
      "En lugar de resistir, suprimir o expresar, permitís que la emoción esté y su energía pase a través de vos. Funciona en cualquier nivel y se vuelve más natural con la práctica.",
  },
  {
    mode: "focuswheel",
    title: "Rueda de Enfoque",
    description: "Reencuadre progresivo estilo Abraham-Hicks.",
    detail:
      "Cuando un pensamiento gira y gira, no sirve discutirlo ni taparlo con positivismo. Esta técnica lo rodea de doce frases cada vez más amplias y creibles, hasta que el tema suelta presión. Regla única: nunca escribir algo que no puedas creer hoy.",
  },
  {
    mode: "breath",
    title: "Respiración 4-7-8",
    description: "Regulación rápida del sistema nervioso.",
    detail:
      "Inhalá 4 segundos, sostené 7 y exhalá 8. La exhalación larga activa la respuesta de calma del cuerpo. Ideal antes de dormir o en un pico de ansiedad.",
  },
  {
    mode: "ground",
    title: "Grounding 5-4-3-2-1",
    description: "Volver al presente con los cinco sentidos.",
    detail:
      "El miedo vive casi siempre en el futuro imaginario. Nombrar lo que ves, tocás, oís, olés y saboreás te trae de vuelta al aquí y ahora, donde el miedo no tiene de qué agarrarse.",
  },
  {
    mode: "affirm",
    title: "Afirmación de calma",
    description: "Un recordatorio amable para este momento.",
    detail:
      "Las palabras que te decís moldean tu estado. Estas frases apuntan a rendición y presencia, no a forzar sensaciones.",
  },
];

export default function RecursosPage() {
  const [activeTool, setActiveTool] = useState<SosMode | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-8 py-8">
      <h1 className="font-display text-4xl">Recursos</h1>

      <GlassCard className="space-y-2 p-6 text-sm leading-relaxed text-zinc-300">
        <p>
          Técnicas para practicar en cualquier momento, sin necesidad de
          registrar nada primero. Elegí una, hacela completa y volvé a tu día.
        </p>
        <p className="text-xs text-zinc-500">
          Para tareas específicas de cada nivel del mapa,{" "}
          <Link
            href="/mapa"
            className="underline underline-offset-4 hover:text-zinc-300"
          >
            abrí el Mapa
          </Link>{" "}
          y desplegá tu nivel actual.
        </p>
      </GlassCard>

      <div className="space-y-3">
        {TOOLS.map((tool) => (
          <GlassCard key={tool.mode} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg text-white">{tool.title}</p>
                <p className="mt-0.5 text-xs uppercase tracking-widest text-zinc-500">
                  {tool.description}
                </p>
              </div>
              <button
                onClick={() => setActiveTool(tool.mode)}
                className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
              >
                Abrir
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {tool.detail}
            </p>
          </GlassCard>
        ))}
      </div>

      {activeTool !== null && (
        <SOSModal initialMode={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}
