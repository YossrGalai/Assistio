import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  tone = "default",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const tones = {
    default: "from-slate-950 to-slate-800",
    success: "from-emerald-950 to-emerald-800",
    warning: "from-amber-950 to-amber-800",
    danger: "from-rose-950 to-rose-800",
  };

  return (
    <div className={cn("rounded-3xl bg-gradient-to-br p-[1px] shadow-card", tones[tone])}>
      <div className="rounded-[1.4rem] border border-white/10 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          </div>
          {trend ? (
            <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
              {trend}
            </Badge>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-card">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
