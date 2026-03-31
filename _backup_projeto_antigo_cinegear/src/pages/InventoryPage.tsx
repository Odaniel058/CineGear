import React, { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { StatusBadge } from '@/components/StatusBadge';
import { equipmentData } from '@/data/mock-data';
import { Search, Filter, Plus, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const categories = ['Todas', 'Câmeras', 'Lentes', 'Iluminação', 'Áudio', 'Grip', 'Monitores', 'Acessórios'];
const statuses = ['Todos', 'available', 'reserved', 'maintenance', 'unavailable'];
const statusLabels: Record<string, string> = { Todos: 'Todos', available: 'Disponível', reserved: 'Reservado', maintenance: 'Manutenção', unavailable: 'Indisponível' };

const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [status, setStatus] = useState('Todos');

  const filtered = equipmentData.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'Todas' && e.category !== category) return false;
    if (status !== 'Todos' && e.status !== status) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventário</h1>
            <p className="text-sm text-muted-foreground mt-1">{equipmentData.length} equipamentos cadastrados</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Novo equipamento
          </Button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 premium-shadow">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou marca..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {statuses.map(s => (
              <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${status === s ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Equipamento</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Marca</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nº Série</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Diária</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Local</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((eq, i) => (
                  <motion.tr
                    key={eq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{eq.name}</p>
                          <p className="text-xs text-muted-foreground">{eq.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{eq.category}</td>
                    <td className="px-4 py-3 text-sm">{eq.brand}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono text-xs">{eq.serialNumber}</td>
                    <td className="px-4 py-3"><StatusBadge status={eq.status} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">R$ {eq.dailyRate}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{eq.location}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhum equipamento encontrado</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default InventoryPage;
