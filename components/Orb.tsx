import { cn } from "@/lib/cn";

interface OrbProps {
  color: string;
  className?: string;
}

export function Orb({ color, className }: OrbProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 rounded-full animate-orb-pulse"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}bb 0%, ${color}44 45%, transparent 72%)`,
          filter: "blur(14px)",
        }}
      />
      <div
        className="absolute inset-[12%] rounded-full animate-breathe"
        style={{
          background: `radial-gradient(circle at 40% 40%, #ffffff2e 0%, ${color}aa 38%, ${color}22 78%, transparent 100%)`,
          boxShadow: `0 0 70px ${color}59, inset 0 0 45px ${color}40`,
        }}
      />
      <div
        className="absolute inset-[30%] rounded-full"
        style={{
          background: `radial-gradient(circle at 42% 38%, #ffffff66 0%, ${color}cc 60%, transparent 100%)`,
        }}
      />
    </div>
  );
}
