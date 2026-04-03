import React from "react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: "Disponivel", className: "bg-success/15 text-success border-success/30" },
  reserved: { label: "Reservado", className: "bg-info/15 text-info border-info/30" },
  maintenance: { label: "Manutencao", className: "bg-warning/15 text-warning border-warning/30" },
  quote: { label: "Orcamento", className: "bg-muted text-muted-foreground border-border" },
  approved: { label: "Aprovado", className: "bg-success/15 text-success border-success/30" },
  in_progress: { label: "Em andamento", className: "bg-info/15 text-info border-info/30" },
  completed: { label: "Finalizado", className: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Cancelado", className: "bg-destructive/15 text-destructive border-destructive/30" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
  sent: { label: "Enviado", className: "bg-info/15 text-info border-info/30" },
  rejected: { label: "Recusado", className: "bg-destructive/15 text-destructive border-destructive/30" },
  converted: { label: "Convertido", className: "bg-primary/15 text-primary border-primary/30" },
  signed: { label: "Assinado", className: "bg-success/15 text-success border-success/30" },
  active: { label: "Ativo", className: "bg-info/15 text-info border-info/30" },
  pending: { label: "Pendente", className: "bg-warning/15 text-warning border-warning/30" },
  confirmed: { label: "Confirmado", className: "bg-success/15 text-success border-success/30" },
};

const PULSE_STATUSES = new Set(["in_progress", "maintenance", "active", "reserved", "sent"]);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" };
  const hasPulse = PULSE_STATUSES.has(status);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className)}>
      {hasPulse && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: "currentColor" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
        </span>
      )}
      {config.label}
    </span>
  );
};
