import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { KPICard } from '@/components/KPICard';
import { DollarSign, TrendingUp, CreditCard, CalendarCheck, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { monthlyRevenue } from '@/data/mock-data';

const FinancialPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão financeira da locadora</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard icon={DollarSign} title="Faturamento mensal" value="R$ 45.600" change="+12%" changeType="positive" subtitle="vs. mês anterior" index={0} />
          <KPICard icon={TrendingUp} title="Receita prevista" value="R$ 50.000" change="89%" changeType="neutral" subtitle="atingido" index={1} />
          <KPICard icon={CreditCard} title="Ticket médio" value="R$ 2.850" change="+5%" changeType="positive" index={2} />
          <KPICard icon={AlertCircle} title="Valor em aberto" value="R$ 8.200" change="4 cobranças" changeType="negative" index={3} />
          <KPICard icon={CalendarCheck} title="Reservas aprovadas" value="12" change="+3 este mês" changeType="positive" index={4} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 premium-shadow">
            <h3 className="text-sm font-semibold mb-4">Faturamento mensal</h3>
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
            <h3 className="text-sm font-semibold mb-4">Tendências</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Realizado" />
                <Line type="monotone" dataKey="projected" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Previsto" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 premium-shadow">
          <h3 className="text-sm font-semibold mb-4">Cobranças recentes</h3>
          <div className="space-y-3">
            {[
              { client: 'Rafael Mendes', desc: 'RES-001 • Sony FX6 + acessórios', value: 3690, status: 'Pago' },
              { client: 'Bruno Costa', desc: 'RES-002 • RED Komodo 6K + grip', value: 5190, status: 'Pendente' },
              { client: 'Diego Almeida', desc: 'RES-004 • Kit áudio completo', value: 2240, status: 'Pago' },
              { client: 'Ana Clara Silva', desc: 'RES-003 • Canon C70 + iluminação', value: 4400, status: 'Pendente' },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                <div>
                  <p className="text-sm font-medium">{t.client}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">R$ {t.value.toLocaleString()}</p>
                  <span className={`text-xs font-medium ${t.status === 'Pago' ? 'text-success' : 'text-warning'}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default FinancialPage;
