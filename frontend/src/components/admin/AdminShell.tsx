import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function AdminShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_40%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--background)))] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col md:flex-row">
        {sidebar}
        <main className={cn("flex-1 px-4 py-5 sm:px-6 lg:px-8")}>{children}</main>
      </div>
    </div>
  );
}
