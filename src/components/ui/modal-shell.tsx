import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const ModalHero: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}> = ({ eyebrow = "Fluxo premium", title, description, className, actions }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-[28px] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(202,157,45,0.16),_transparent_44%)] p-6",
      className,
    )}
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  </div>
);

export const ModalSection: React.FC<{
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, className, children }) => (
  <section className={cn("rounded-[26px] border border-border/60 bg-surface/35 p-5", className)}>
    <div className="mb-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
    {children}
  </section>
);

export const ModalAsideCard: React.FC<{
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, className, children }) => (
  <div className={cn("rounded-[24px] border border-border/60 bg-background/40 p-4", className)}>
    <p className="text-sm font-semibold">{title}</p>
    {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    <div className="mt-4">{children}</div>
  </div>
);
