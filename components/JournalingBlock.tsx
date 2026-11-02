"use client";

import { useEffect, useState } from "react";

export function JournalingBlock({ onFinish }: { onFinish: () => void }) {
  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinish();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, onFinish]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <p className="font-mono text-sm text-zinc-400">
        Se borra solo en {minutes}:{seconds}
      </p>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder="Escribí sin filtro. Nadie va a leer esto."
        className="w-full resize-none rounded-2xl border border-white/20 bg-white/5 p-4 text-left text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/50 focus:outline-none"
      />
      <button
        onClick={onFinish}
        className="rounded-full bg-white px-8 py-3 text-sm font-medium text-abyss transition-transform hover:scale-105 active:scale-95"
      >
        Soltar y terminar
      </button>
    </div>
  );
}
