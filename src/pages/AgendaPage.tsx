import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  RotateCcw,
  ScrollText,
  Sparkles,
} from "lucide-react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageTransition } from "@/components/PageTransition";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/contexts/AppDataContext";
import { AgendaEvent, AgendaEventType } from "@/data/mock-data";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ModalAsideCard, ModalHero, ModalSection } from "@/components/ui/modal-shell";
import { toast } from "sonner";

type AgendaView = "day" | "week" | "month";
type AgendaFilter = "all" | AgendaEventType;

const AgendaPage: React.FC = () => {
  const { state, upsertAgendaEvent } = useAppData();
  const [view, setView] = useState<AgendaView>("week");
  const [filter, setFilter] = useState<AgendaFilter>("all");
  const [focusDate, setFocusDate] = useState(new Date("2026-03-16T12:00:00"));
  const [selectedId, setSelectedId] = useState<string | null>(state.agendaEvents[0]?.id ?? null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "reservation" as AgendaEventType,
    reservationId: state.reservations[0]?.id ?? "",
    clientName: state.clients[0]?.name ?? "",
    title: "Novo evento",
    description: "",
    notes: "",
    date: "2026-03-16",
    time: "09:00",
    status: "pending" as AgendaEvent["status"],
  });

  const range = useMemo(() => {
    if (view === "day") {
      return { start: focusDate, end: focusDate };
    }
    if (view === "week") {
      return {
        start: startOfWeek(focusDate, { weekStartsOn: 1 }),
        end: endOfWeek(focusDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(focusDate),
      end: endOfMonth(focusDate),
    };
  }, [focusDate, view]);

  const visibleEvents = useMemo(() => {
    const base = state.agendaEvents.filter((event) => filter === "all" || event.type === filter);
    return base
      .filter((event) =>
        isWithinInterval(parseISO(`${event.date}T12:00:00`), {
          start: range.start,
          end: range.end,
        }),
      )
      .sort((left, right) => `${left.date}${left.time}`.localeCompare(`${right.date}${right.time}`));
  }, [filter, range.end, range.start, state.agendaEvents]);

  const grouped = useMemo(
    () =>
      visibleEvents.reduce<Record<string, AgendaEvent[]>>((accumulator, event) => {
        if (!accumulator[event.date]) accumulator[event.date] = [];
        accumulator[event.date].push(event);
        return accumulator;
      }, {}),
    [visibleEvents],
  );

  const orderedDates = Object.keys(grouped).sort();
  const selected = state.agendaEvents.find((event) => event.id === selectedId) ?? visibleEvents[0] ?? null;
  const linkedReservation = state.reservations.find((reservation) => reservation.id === form.reservationId);

  const currentLabel =
    view === "day"
      ? format(focusDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : view === "week"
        ? `${format(range.start, "dd MMM", { locale: ptBR })} - ${format(range.end, "dd MMM yyyy", { locale: ptBR })}`
        : format(focusDate, "MMMM 'de' yyyy", { locale: ptBR });

  const periodSummary =
    view === "month"
      ? "Visão mensal com eventos apenas do mês selecionado."
      : view === "week"
        ? "Visão semanal com atualização imediata ao navegar."
        : "Visão diária focada na operação do dia.";

  const openCreate = () => {
    const focusDateString = format(focusDate, "yyyy-MM-dd");
    setForm({
      type: "reservation",
      reservationId: state.reservations[0]?.id ?? "",
      clientName: state.clients[0]?.name ?? "",
      title: "Novo evento",
      description: "",
      notes: "",
      date: focusDateString,
      time: "09:00",
      status: "pending",
    });
    setEditorOpen(true);
  };

  const handleMoveDate = (direction: "prev" | "next") => {
    const factor = direction === "next" ? 1 : -1;
    setFocusDate((current) => {
      if (view === "month") return addMonths(current, factor);
      if (view === "week") return addWeeks(current, factor);
      return addDays(current, factor);
    });
  };

  const handleSaveEvent = async () => {
    if (!form.clientName || !form.date || !form.time || !form.title) {
      toast.error("Preencha os dados essenciais do evento.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    upsertAgendaEvent({
      type: form.type,
      reservationId: form.reservationId || undefined,
      clientId: linkedReservation?.clientId,
      clientName: form.clientName,
      equipment: linkedReservation?.equipment ?? ["Evento manual"],
      date: form.date,
      time: form.time,
      status: form.status,
      title: form.title,
      description: form.description,
      notes: form.notes,
    });
    setSaving(false);
    toast.success("Evento adicionado à agenda.");
    setEditorOpen(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
            <p className="mt-1 text-sm text-muted-foreground">Controle de período realmente funcional, com detalhe de evento e navegação fluida.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setFocusDate(new Date("2026-03-18T12:00:00"))}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Hoje
            </Button>
            <Button className="gradient-gold text-primary-foreground" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar evento
            </Button>
          </div>
        </div>

        <div className="glass-card p-4 premium-shadow">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleMoveDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="rounded-2xl border border-border/60 bg-surface/50 px-4 py-2">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Período ativo</p>
                <p className="mt-1 text-sm font-semibold capitalize">{currentLabel}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleMoveDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-muted-foreground">
              {periodSummary}
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-wrap gap-3 p-4 premium-shadow">
          <div className="flex gap-2">
            {(["day", "week", "month"] as const).map((item) => (
              <Button key={item} variant={view === item ? "default" : "outline"} size="sm" onClick={() => setView(item)} className={view === item ? "gradient-gold text-primary-foreground" : ""}>
                {item === "day" ? "Dia" : item === "week" ? "Semana" : "Mês"}
              </Button>
            ))}
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="flex flex-wrap gap-2">
            {(["all", "pickup", "return", "reservation"] as const).map((item) => (
              <Button key={item} variant={filter === item ? "default" : "outline"} size="sm" onClick={() => setFilter(item)} className={filter === item ? "gradient-gold text-primary-foreground" : ""}>
                {item === "all" ? "Todos" : item === "pickup" ? "Retiradas" : item === "return" ? "Devoluções" : "Reservas"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {orderedDates.length ? (
              orderedDates.map((date) => (
                <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize">{format(parseISO(`${date}T12:00:00`), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                      <p className="text-xs text-muted-foreground">{grouped[date].length} evento(s)</p>
                    </div>
                  </div>
                  <div className="ml-[52px] space-y-3">
                    {grouped[date].map((event) => (
                      <button key={event.id} type="button" onClick={() => setSelectedId(event.id)} className={`w-full text-left glass-card p-4 premium-shadow transition-all ${selectedId === event.id ? "border-primary/30 bg-primary/5" : "hover:premium-shadow-lg"}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${event.type === "pickup" ? "bg-info/10 text-info" : event.type === "return" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                              {event.type === "pickup" ? <ArrowUpRight className="h-4 w-4" /> : event.type === "return" ? <ArrowDownLeft className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{event.title || event.clientName}</p>
                              <p className="text-xs text-muted-foreground">{event.clientName} • {event.equipment.join(", ")}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{event.time}</p>
                            <StatusBadge status={event.status} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-card p-14 premium-shadow text-center text-muted-foreground">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm font-medium">Nenhum evento no período selecionado</p>
                <p className="mt-1 text-xs">Use os filtros, mude o período ou adicione um novo evento.</p>
              </div>
            )}
          </div>

          <div className="glass-card h-fit p-6 premium-shadow xl:sticky xl:top-8">
            {selected ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Detalhe do evento</p>
                    <h3 className="text-xl font-semibold">{selected.title || selected.clientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selected.type === "pickup" ? "Retirada" : selected.type === "return" ? "Devolução" : "Reserva"}
                    </p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                  <p className="mb-1 text-xs text-muted-foreground">Quando</p>
                  <p className="text-sm font-medium">{formatDateTime(selected.date, selected.time)}</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                  <p className="mb-2 text-sm font-medium">Contexto vinculado</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Cliente: {selected.clientName}</p>
                    <p>Reserva: {selected.reservationId || "Sem vínculo"}</p>
                    <p>{selected.description || "Sem descrição operacional adicional."}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Equipamentos envolvidos</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.equipment.map((item) => (
                      <span key={item} className="rounded-full border border-border/60 bg-surface px-3 py-1 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status rápido</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["pending", "confirmed", "completed"] as const).map((status) => (
                      <Button key={status} variant="outline" size="sm" onClick={() => { upsertAgendaEvent({ ...selected, status }); toast.success("Status do evento atualizado."); }}>
                        {status === "pending" ? "Pendente" : status === "confirmed" ? "Confirmado" : "Concluído"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-surface/30 p-4">
                  <p className="mb-2 text-sm font-medium">Notas</p>
                  <p className="text-sm text-muted-foreground">{selected.notes || "Sem observações internas."}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Selecione um evento para ver o detalhe.</p>
              </div>
            )}
          </div>
        </div>

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden p-0">
            <div className="grid max-h-[92vh] overflow-hidden xl:grid-cols-[0.9fr_1.5fr]">
              <div className="border-b border-border/60 p-8 xl:border-b-0 xl:border-r">
                <ModalHero
                  eyebrow="Agenda operacional"
                  title="Novo evento da agenda"
                  description="Crie eventos com contexto real de reserva, descrição operacional e notas internas."
                />
                <div className="mt-6 space-y-4">
                  <ModalAsideCard title="Período selecionado" description="A navegação da agenda agora respeita dia, semana e mês reais.">
                    <p className="text-sm font-medium capitalize">{currentLabel}</p>
                  </ModalAsideCard>
                  <ModalAsideCard title="Reserva vinculada" description="Quando houver vínculo, o evento herda equipamentos e cliente da reserva.">
                    <p className="text-sm font-medium">{linkedReservation?.id || "Sem vínculo"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{linkedReservation?.clientName || "Evento manual"}</p>
                  </ModalAsideCard>
                </div>
              </div>

              <div className="overflow-y-auto p-8">
                <div className="space-y-6">
                  <ModalSection title="Dados principais" description="Escolha o tipo do evento e o contexto que será exibido na operação.">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as AgendaEventType }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                          <option value="pickup">Retirada</option>
                          <option value="return">Devolução</option>
                          <option value="reservation">Reserva</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Reserva vinculada</Label>
                        <select
                          value={form.reservationId}
                          onChange={(event) => {
                            const reservation = state.reservations.find((item) => item.id === event.target.value);
                            setForm((current) => ({
                              ...current,
                              reservationId: event.target.value,
                              clientName: reservation?.clientName ?? current.clientName,
                              title: reservation ? `${current.type === "pickup" ? "Retirada" : current.type === "return" ? "Devolução" : "Reserva"} • ${reservation.id}` : current.title,
                            }));
                          }}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Sem vínculo</option>
                          {state.reservations.map((reservation) => (
                            <option key={reservation.id} value={reservation.id}>
                              {reservation.id} • {reservation.clientName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Título do evento</Label>
                        <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Input value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} />
                      </div>
                    </div>
                  </ModalSection>

                  <ModalSection title="Quando acontece" description="Data, horário e status rápido do evento.">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AgendaEvent["status"] }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                          <option value="pending">Pendente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="completed">Concluído</option>
                        </select>
                      </div>
                    </div>
                  </ModalSection>

                  <ModalSection title="Detalhes operacionais" description="Descreva rapidamente o contexto para a equipe de locação.">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Observações</Label>
                        <Textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                      </div>
                    </div>
                  </ModalSection>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-border/60 pt-6">
                  <Button variant="outline" onClick={() => setEditorOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="gradient-gold text-primary-foreground" onClick={handleSaveEvent} disabled={saving}>
                    {saving ? <Clock3 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Salvar evento
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default AgendaPage;
