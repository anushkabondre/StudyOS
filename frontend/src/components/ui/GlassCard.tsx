import type { ReactNode } from "react";
import clsx from "clsx";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-800/80",
        "bg-slate-900/60 backdrop-blur-xl",
        "shadow-[0_8px_40px_rgba(0,0,0,0.35)]",
        "transition-all duration-300",
        "hover:border-blue-500/40",
        className
      )}
    >
      {children}
    </div>
  );
}