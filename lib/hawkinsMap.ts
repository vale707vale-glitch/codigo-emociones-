import type { HawkinsLevel } from "@/types";

export const hawkinsMap: HawkinsLevel[] = [
  { level: 20, name: "Vergüenza", color: "#4A0404", category: "Baja", icon: "🌑", description: "Humillación, cerca de la muerte psicológica." },
  { level: 30, name: "Culpa", color: "#8B0000", category: "Baja", icon: "😞", description: "Autorreproche, destrucción interior." },
  { level: 50, name: "Apatía", color: "#A52A2A", category: "Baja", icon: "🌫️", description: "Desesperación, falta de energía." },
  { level: 75, name: "Dolor", color: "#B22222", category: "Baja", icon: "😢", description: "Tristeza, pérdida, pesar." },
  { level: 100, name: "Miedo", color: "#DC143C", category: "Baja", icon: "😨", description: "Ansiedad, estado de alerta." },
  { level: 125, name: "Deseo", color: "#FF4500", category: "Baja", icon: "🌪️", description: "Adicción, codicia, nunca satisfecho." },
  { level: 150, name: "Ira", color: "#FF6347", category: "Baja", icon: "🔥", description: "Odio, frustración, agresividad." },
  { level: 175, name: "Orgullo", color: "#FF8C00", category: "Baja", icon: "🎭", description: "Arrogancia, negación, dependiente de lo externo." },
  { level: 200, name: "Coraje", color: "#FFD700", category: "Alta", icon: "🦁", description: "Punto de inflexión. Empoderamiento, honestidad." },
  { level: 250, name: "Neutralidad", color: "#9ACD32", category: "Alta", icon: "⚖️", description: "Soltar, flexibilidad, no juzgar." },
  { level: 310, name: "Voluntad", color: "#32CD32", category: "Alta", icon: "🌱", description: "Amistad, acción, seguridad." },
  { level: 350, name: "Aceptación", color: "#00FA9A", category: "Alta", icon: "🤝", description: "Perdón, responsabilidad propia." },
  { level: 400, name: "Razón", color: "#00CED1", category: "Alta", icon: "🧠", description: "Lógica, intelecto, comprensión." },
  { level: 500, name: "Amor", color: "#4169E1", category: "Alta", icon: "❤️", description: "Amor incondicional, compasión." },
  { level: 540, name: "Alegría", color: "#6A5ACD", category: "Alta", icon: "✨", description: "Serenidad, trascendencia." },
  { level: 600, name: "Paz", color: "#9370DB", category: "Alta", icon: "🕊️", description: "Iluminación, perfección." },
];

export const COURAGE_THRESHOLD = 200;
export const MIN_LEVEL = hawkinsMap[0].level;
export const MAX_LEVEL = hawkinsMap[hawkinsMap.length - 1].level;

export function getNearestLevel(value: number): HawkinsLevel {
  return hawkinsMap.reduce((best, entry) =>
    Math.abs(entry.level - value) < Math.abs(best.level - value) ? entry : best
  );
}

export function getLevelByExactValue(value: number): HawkinsLevel | undefined {
  return hawkinsMap.find((entry) => entry.level === value);
}

export function getRangeOf(level: number): "liberar" | "construir" | "expandir" {
  if (level < COURAGE_THRESHOLD) return "liberar";
  if (level < 350) return "construir";
  return "expandir";
}
