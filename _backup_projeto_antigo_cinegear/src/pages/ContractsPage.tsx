import React from 'react';
import { PageTransition } from '@/components/PageTransition';
import { StatusBadge } from '@/components/StatusBadge';
import { contractsData } from '@/data/mock-data';
import { ScrollText, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ContractsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
            <p className="text-sm text-muted-foreground mt-1">{contractsData.length} contratos</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Novo contrato
          </Button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Contrato</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Reserva</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {contractsData.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ScrollText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-mono">{c.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{c.reservationId}</td>
                    <td className="px-4 py-3 text-sm font-medium">{c.clientName}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.createdAt}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">R$ {c.value.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ContractsPage;
