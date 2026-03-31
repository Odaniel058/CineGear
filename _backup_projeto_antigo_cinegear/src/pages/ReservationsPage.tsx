import React, { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { StatusBadge } from '@/components/StatusBadge';
import { reservationsData } from '@/data/mock-data';
import { Search, Plus, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ReservationsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statuses = ['all', 'quote', 'approved', 'in_progress', 'completed', 'cancelled'];
  const statusLabels: Record<string, string> = { all: 'Todas', quote: 'Orçamento', approved: 'Aprovadas', in_progress: 'Em andamento', completed: 'Finalizadas', cancelled: 'Canceladas' };

  const filtered = reservationsData.filter(r => {
    if (search && !r.clientName.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reservas</h1>
            <p className="text-sm text-muted-foreground mt-1">{reservationsData.length} reservas</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Nova reserva
          </Button>
        </div>

        <div className="glass-card p-4 premium-shadow">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por cliente ou ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Equipamentos</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Período</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{r.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.clientName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{r.equipment.join(', ')}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.pickupDate} → {r.returnDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">R$ {r.totalValue.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhuma reserva encontrada</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ReservationsPage;
