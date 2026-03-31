import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { DollarSign, TrendingUp, CreditCard, CalendarCheck, AlertCircle, ArrowUpRight, ArrowDownLeft, Wrench, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { monthlyRevenue, reservationsByStatus, agendaEvents, reservationsData, equipmentData } from '@/data/mock-data';

const DashboardPage: React.FC = () => {
  const todayPickups = agendaEvents.filter(e => e.date === '2026-03-16' && e.type === 'pickup');
  const todayReturns = agendaEvents.filter(e => e.date === '2026-03-16' && e.type === 'return');
  const upcomingReservations = reservationsData.filter(r => r.status === 'approved').slice(0, 4);
  const maintenanceEquipment = equipmentData.filter(e => e.status === 'maintenance');

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da sua locadora</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard icon={DollarSign} title="Faturamento do mês" value="R$ 45.600" change="+12%" changeType="positive" subtitle="vs. mês anterior" index={0} />
          <KPICard icon={TrendingUp} title="Receita prevista" value="R$ 50.000" change="89% atingido" changeType="neutral" index={1} />
          <KPICard icon={CreditCard} title="Ticket médio" value="R$ 2.850" change="+5%" changeType="positive" subtitle="por reserva" index={2} />
          <KPICard icon={CalendarCheck} title="Reservas aprovadas" value="12" change="+3" changeType="positive" subtitle="este mês" index={3} />
          <KPICard icon={AlertCircle} title="Valor em aberto" value="R$ 8.200" change="4 cobranças" changeType="negative" index={4} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-6 premium-shadow">
            <h3 className="text-sm font-semibold mb-4">Faturamento mensal</h3>
            <ResponsiveContainer width="100%" height={260}>
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
            <h3 className="text-sm font-semibold mb-4">Reservas por status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={reservationsByStatus} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {reservationsByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
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

        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 premium-shadow">
          <h3 className="text-sm font-semibold mb-4">Receita prevista vs realizada</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Realizado" />
              <Line type="monotone" dataKey="projected" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Previsto" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Operations today */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 premium-shadow">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="h-4 w-4 text-info" />
              <h3 className="text-sm font-semibold">Retiradas hoje</h3>
            </div>
            {todayPickups.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma retirada hoje</p>
            ) : (
              <div className="space-y-3">
                {todayPickups.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                    <div>
                      <p className="text-sm font-medium">{e.clientName}</p>
                      <p className="text-xs text-muted-foreground">{e.equipment.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{e.time}</span>
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6 premium-shadow">
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownLeft className="h-4 w-4 text-success" />
              <h3 className="text-sm font-semibold">Devoluções hoje</h3>
            </div>
            {todayReturns.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma devolução hoje</p>
            ) : (
              <div className="space-y-3">
                {todayReturns.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                    <div>
                      <p className="text-sm font-medium">{e.clientName}</p>
                      <p className="text-xs text-muted-foreground">{e.equipment.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{e.time}</span>
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Upcoming & Maintenance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-6 premium-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Próximas reservas</h3>
            </div>
            <div className="space-y-3">
              {upcomingReservations.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{r.clientName}</p>
                    <p className="text-xs text-muted-foreground">{r.pickupDate} — {r.returnDate}</p>
                  </div>
                  <span className="text-sm font-semibold gradient-gold-text">R$ {r.totalValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-card p-6 premium-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Equipamentos em manutenção</h3>
            </div>
            {maintenanceEquipment.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum equipamento em manutenção</p>
            ) : (
              <div className="space-y-3">
                {maintenanceEquipment.map(eq => (
                  <div key={eq.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                    <div>
                      <p className="text-sm font-medium">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">{eq.brand} • {eq.category}</p>
                    </div>
                    <StatusBadge status="maintenance" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
