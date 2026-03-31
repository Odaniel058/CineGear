import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, CartesianGrid, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import {
  AlertCircle, ArrowDownLeft, ArrowRight, ArrowUpRight,
  CalendarCheck, Clock, CreditCard, DollarSign,
  Plus, TrendingUp, Wrench,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/contexts/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2.5 border-border/60 premium-shadow text-xs">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const periodOptions = [
  { value: "month",   label: "Mês" },
  { value: "quarter", label: "Trimestre" },
  { value: "year",    label: "Ano" },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, analytics } = useAppData();
  const [period, setPeriod] = useState("month");

  const todayPickups  = state.agendaEvents.filter(e => e.date === "2026-03-16" && e.type === "pickup");
  const todayReturns  = state.agendaEvents.filter(e => e.date === "2026-03-16" && e.type === "return");
  const upcomingRes   = state.reservations.filter(r => r.status === "approved").slice(0, 4);
  const maintenanceEq = state.equipment.filter(e => e.status === "maintenance");

  const chartData = useMemo(() => {
    if (period === "quarter") return analytics.monthlyRevenue.slice(-3);
    if (period === "year")    return analytics.monthlyRevenue;
    return analytics.monthlyRevenue.slice(-6);
  }, [analytics.monthlyRevenue, period]);

  return (
    <PageTransition>
      <div className="space-y-7">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Visão geral da operação em tempo real.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Nova reserva",    path: "/reservations" },
              { label: "Novo orçamento",  path: "/quotes/new" },
              { label: "Novo cliente",    path: "/clients" },
            ].map(({ label, path }) => (
              <Button key={label} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={() => navigate(path)}>
                <Plus className="h-3.5 w-3.5" />{label}
              </Button>
            ))}
            <Button
              size="sm"
              className="gradient-gold text-primary-foreground border-0 rounded-xl text-xs gap-1.5 gold-glow"
              onClick={() => navigate("/inventory")}
            >
              <Plus className="h-3.5 w-3.5" />Novo equipamento
            </Button>
          </div>
        </div>

        {/* ── Period filter ── */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl w-fit border border-border/50">
          {periodOptions.map(({ value, label }) => (
            <motion.button
              key={value}
              onClick={() => setPeriod(value)}
              className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                period === value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period === value && (
                <motion.div
                  layoutId="period-pill"
                  className="absolute inset-0 gradient-gold rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard icon={DollarSign}    title="Faturamento"      value={formatCurrency(analytics.kpis.monthlyRevenue)}    change="+12%"              changeType="positive" subtitle="vs. mês ant." index={0} onClick={() => navigate("/finance")} />
          <KPICard icon={TrendingUp}    title="Receita prevista" value={formatCurrency(analytics.kpis.projectedRevenue)}  change="Projeção dinâmica" changeType="neutral"  index={1} onClick={() => navigate("/reports")} />
          <KPICard icon={CreditCard}    title="Ticket médio"     value={formatCurrency(analytics.kpis.averageTicket)}     change="+5%"               changeType="positive" subtitle="por reserva"  index={2} onClick={() => navigate("/finance")} />
          <KPICard icon={CalendarCheck} title="Reservas"         value={String(analytics.kpis.approvedReservations)}      change="+3"                changeType="positive" subtitle="em aberto"   index={3} onClick={() => navigate("/reservations")} />
          <KPICard icon={AlertCircle}   title="Em aberto"        value={formatCurrency(analytics.kpis.outstandingAmount)} change="pendente"          changeType="negative"                        index={4} onClick={() => navigate("/finance")} />
        </div>

        {/* ── Charts row ── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-6 premium-shadow"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-sm">Faturamento mensal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Receita por período</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg gradient-gold-text">
                  {formatCurrency(analytics.kpis.monthlyRevenue)}
                </p>
                <p className="text-xs text-success">↑ 12% este mês</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--primary)/0.06)", radius: 6 }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 premium-shadow flex flex-col"
          >
            <div className="mb-4">
              <h3 className="font-display font-semibold text-sm">Reservas por status</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribuição atual</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={analytics.reservationStatus}
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {analytics.reservationStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v} reservas`}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-auto">
              {analytics.reservationStatus.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                  <span className="text-muted-foreground truncate">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Line chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 premium-shadow"
        >
          <div className="flex items-center gap-4 mb-5">
            <div>
              <h3 className="font-display font-semibold text-sm">Receita prevista vs realizada</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Comparativo mensal do ano</p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block rounded" />Realizado</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-muted-foreground inline-block rounded" />Previsto</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue"   stroke="hsl(var(--primary))"          strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 3 }}          name="Realizado" />
              <Line type="monotone" dataKey="projected" stroke="hsl(var(--muted-foreground))" strokeWidth={2}   dot={false} strokeDasharray="6 4" name="Previsto" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Today events ── */}
        <div className="grid lg:grid-cols-2 gap-5">
          {[
            {
              title: "Retiradas hoje",
              icon: ArrowUpRight,
              iconClass: "text-info",
              events: todayPickups,
              empty: "Nenhuma retirada hoje.",
            },
            {
              title: "Devoluções hoje",
              icon: ArrowDownLeft,
              iconClass: "text-success",
              events: todayReturns,
              empty: "Nenhuma devolução hoje.",
            },
          ].map(({ title, icon: Icon, iconClass, events, empty }) => (
            <motion.button
              key={title}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate("/calendar")}
              className="glass-card p-6 premium-shadow text-left hover:premium-shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-surface ${iconClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-display font-semibold text-sm">{title}</h3>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
              <div className="space-y-2.5">
                {events.length ? events.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/40">
                    <div>
                      <p className="text-sm font-medium">{ev.clientName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{ev.equipment.join(", ")}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-xs text-muted-foreground">{ev.time}</p>
                      <StatusBadge status={ev.status} />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">{empty}</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Upcoming + Maintenance ── */}
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate("/reservations")}
            className="glass-card p-6 premium-shadow text-left hover:premium-shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-surface text-primary">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-display font-semibold text-sm">Próximas reservas</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </div>
            <div className="space-y-2.5">
              {upcomingRes.length ? upcomingRes.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/40">
                  <div>
                    <p className="text-sm font-medium">{r.clientName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(r.pickupDate)} → {formatDate(r.returnDate)}</p>
                  </div>
                  <span className="text-sm font-bold gradient-gold-text flex-shrink-0 ml-3">{formatCurrency(r.totalValue)}</span>
                </div>
              )) : <p className="text-sm text-muted-foreground py-4 text-center">Sem reservas aprovadas.</p>}
            </div>
          </motion.button>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -2 }}
            onClick={() => { navigate("/inventory"); toast.success("Itens em manutenção destacados no inventário."); }}
            className="glass-card p-6 premium-shadow text-left hover:premium-shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-surface text-warning">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-display font-semibold text-sm">Manutenção</h3>
                {maintenanceEq.length > 0 && (
                  <span className="text-[10px] font-bold bg-warning/15 text-warning border border-warning/25 px-2 py-0.5 rounded-full">
                    {maintenanceEq.length}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </div>
            <div className="space-y-2.5">
              {maintenanceEq.length ? maintenanceEq.map(eq => (
                <div key={eq.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/40">
                  <div>
                    <p className="text-sm font-medium">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.brand} • {eq.category}</p>
                  </div>
                  <StatusBadge status="maintenance" />
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum equipamento em manutenção.</p>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
