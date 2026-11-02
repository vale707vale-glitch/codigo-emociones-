"use client";

export function SOSButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Anclaje rápido SOS"
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-red-300/40 bg-red-500/25 font-display text-lg tracking-wider text-red-100 shadow-lg shadow-red-900/30 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
    >
      SOS
    </button>
  );
}
