import type { ComponentType } from "react";
import { BarChart3, Bell, FileText, LayoutDashboard, Shield, Users } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export type AdminSectionId = "dashboard" | "users" | "requests" | "categories" | "reviews";

const navItems: Array<{
  id: AdminSectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}> = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, description: "Vue d'ensemble" },
  { id: "users", label: "Utilisateurs", icon: Users, description: "Gestion des comptes" },
  { id: "requests", label: "Demandes", icon: FileText, description: "Suivi des demandes" },
  { id: "categories", label: "Catégories", icon: Shield, description: "Catalogue métier" },
  { id: "reviews", label: "Avis", icon: BarChart3, description: "Réputation et avis" },
];

export function AdminSidebar({
  activeSection,
  onChangeSection,
  activityCount,
}: {
  activeSection: AdminSectionId;
  onChangeSection: (section: AdminSectionId) => void;
  activityCount: number;
}) {
  return (
    <aside className="border-b border-white/10 bg-slate-950 text-white md:min-h-screen md:w-[300px] md:border-b-0 md:border-r md:border-white/10">
      <div className="sticky top-0 flex h-full flex-col px-4 py-5 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-slate-950">
              A
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">ASSISTIO</p>
              <h1 className="text-xl font-bold">Panneau admin</h1>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/60">État du système</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold">{activityCount}</p>
              <Bell className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-1 text-xs text-white/50">Activités récentes surveillées</p>
          </div>
        </div>

        <nav className="mt-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start rounded-2xl border px-4 py-4 text-left text-white transition-all hover:bg-white/10",
                  active
                    ? "border-amber-400/40 bg-amber-400/10 text-white shadow-[0_0_0_1px_rgba(251,191,36,0.25)]"
                    : "border-white/10 bg-white/0",
                )}
                onClick={() => onChangeSection(item.id)}
              >
                <Icon className={cn("mt-0.5 h-5 w-5", active ? "text-amber-300" : "text-white/65")} />
                <span className="flex flex-col items-start">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-xs text-white/50">{item.description}</span>
                </span>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 p-4 text-sm text-white/80">
          <p className="font-semibold text-white">Opérations en direct</p>
          <p className="mt-1 text-white/60">
            Les demandes, avis et participations restent visibles depuis un seul endroit.
          </p>
        </div>
      </div>
    </aside>
  );
}
