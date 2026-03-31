import React, { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { StatusBadge } from '@/components/StatusBadge';
import { quotesData } from '@/data/mock-data';
import { Search, Plus, FileText, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const QuotesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const statuses = ['all', 'draft', 'sent', 'approved', 'rejected', 'converted'];
  const statusLabels: Record<string, string> = { all: 'Todos', draft: 'Rascunho', sent: 'Enviado', approved: 'Aprovado', rejected: 'Recusado', converted: 'Convertido' };

  const filtered = quotesData.filter(q => {
    if (search && !q.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
            <p className="text-sm text-muted-foreground mt-1">{quotesData.length} orçamentos</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Novo orçamento
          </Button>
        </div>

        <div className="glass-card p-4 premium-shadow">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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

        <div className="grid gap-4">
          {filtered.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 premium-shadow hover:premium-shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">{q.id}</span>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="text-sm font-medium mt-0.5">{q.clientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold gradient-gold-text">R$ {q.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Válido até {q.validUntil}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {q.items.map((item, j) => (
                      <span key={j} className="text-xs bg-surface px-2 py-1 rounded border border-border/50 text-muted-foreground">
                        {item.qty}x {item.name} ({item.days}d)
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default QuotesPage;
