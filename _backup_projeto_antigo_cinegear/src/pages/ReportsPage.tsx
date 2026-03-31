import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { KPICard } from '@/components/KPICard';
import { DollarSign, CalendarCheck, CreditCard, AlertCircle, CheckCircle2, XCircle, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { monthlyRevenue, reservationsByStatus } from '@/data/mock-data';

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState('current');
  const periods = [
    { value: 'current', label: 'Mês atual' },
    { value: 'jan', label: 'Janeiro' },
    { value: 'feb', label: 'Fevereiro' },
    { value: 'mar', label: 'Março' },
    { value: 'annual', label: 'Anual 2026' },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-sm text-muted-foreground mt-1">Análises detalhadas do período</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Exportar PDF</Button>
            <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-2" /> Exportar CSV</Button>
          </div>
        </div>

        <div className="glass-card p-4 premium-shadow">
          <div className="flex gap-2 flex-wrap">
            {periods.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p.value ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface text-muted-foreground hover:bg-surface-hover border border-border/50'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard icon={DollarSign} title="Faturamento" value="R$ 45.600" change="+12%" changeType="positive" index={0} />
          <KPICard icon={CalendarCheck} title="Reservas" value="48" change="+8" changeType="positive" index={1} />
          <KPICard icon={CreditCard} title="Ticket médio" value="R$ 950" index={2} />
          <KPICard icon={AlertCircle} title="Em aberto" value="R$ 8.200" changeType="negative" index={3} />
          <KPICard icon={CheckCircle2} title="Concluídas" value="28" change="58%" changeType="positive" index={4} />
          <KPICard icon={XCircle} title="Canceladas" value="3" change="6%" changeType="negative" index={5} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 premium-shadow">
            <h3 className="text-sm font-semibold mb-4">Faturamento por mês</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 premium-shadow">
            <h3 className="text-sm font-semibold mb-4">Status das reservas</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={reservationsByStatus} innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {reservationsByStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {reservationsByStatus.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                  <span className="text-muted-foreground">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Equipment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 premium-shadow">
          <h3 className="text-sm font-semibold mb-4">Equipamentos mais alugados</h3>
          <div className="space-y-3">
            {[
              { name: 'Sony FX6', count: 18, revenue: 14400 },
              { name: 'RED Komodo 6K', count: 12, revenue: 14400 },
              { name: 'Aputure 600d Pro', count: 15, revenue: 3750 },
              { name: 'Canon C70', count: 10, revenue: 6500 },
              { name: 'ARRI SkyPanel S60-C', count: 8, revenue: 3600 },
            ].map((eq, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-6">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{eq.name}</span>
                    <span className="text-xs text-muted-foreground">{eq.count} locações</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-1.5">
                    <div className="h-1.5 rounded-full gradient-gold" style={{ width: `${(eq.count / 18) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold gradient-gold-text min-w-[80px] text-right">R$ {eq.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ReportsPage;
