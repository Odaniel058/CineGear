import React, { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { StatusBadge } from '@/components/StatusBadge';
import { agendaEvents } from '@/data/mock-data';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AgendaPage: React.FC = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [filter, setFilter] = useState<'all' | 'pickup' | 'return'>('all');

  const filtered = agendaEvents.filter(e => filter === 'all' || e.type === filter);

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof agendaEvents>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
            <p className="text-sm text-muted-foreground mt-1">Calendário operacional</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium px-3">Março 2026</span>
            <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="glass-card p-4 premium-shadow">
          <div className="flex gap-3">
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === v ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                  {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
            <div className="border-l border-border/50 pl-3 flex gap-2">
              {(['all', 'pickup', 'return'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                  {f === 'all' ? 'Todos' : f === 'pickup' ? 'Retiradas' : 'Devoluções'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, events]) => (
            <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="text-xs text-muted-foreground">{events.length} evento{events.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="space-y-2 ml-[52px]">
                {events.map(e => (
                  <div key={e.id} className="glass-card p-4 premium-shadow flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${e.type === 'pickup' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'}`}>
                        {e.type === 'pickup' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{e.clientName}</p>
                        <p className="text-xs text-muted-foreground">{e.equipment.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{e.time}</span>
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default AgendaPage;
