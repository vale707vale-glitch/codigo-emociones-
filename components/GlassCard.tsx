import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md",
        "transition-colors duration-300 hover:bg-white/15",
        className
      )}
    >
      {children}
    </div>
  );
}
