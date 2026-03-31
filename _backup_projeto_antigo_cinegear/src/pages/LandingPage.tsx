import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Film, ArrowRight, Package, CalendarDays, Users, BarChart3, DollarSign, FileText, CheckCircle2, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Package, title: 'Inventário Completo', desc: 'Gerencie câmeras, lentes, iluminação, áudio e acessórios com status em tempo real.' },
  { icon: CalendarDays, title: 'Reservas & Agenda', desc: 'Controle retiradas, devoluções e disponibilidade com calendário visual.' },
  { icon: FileText, title: 'Orçamentos & Contratos', desc: 'Crie orçamentos profissionais, gere PDFs e converta em reservas.' },
  { icon: Users, title: 'CRM de Clientes', desc: 'Histórico completo de clientes, empresas e produtoras.' },
  { icon: DollarSign, title: 'Financeiro', desc: 'Faturamento, receita prevista, cobranças e indicadores em um só lugar.' },
  { icon: BarChart3, title: 'Relatórios', desc: 'Análises detalhadas por período com exportação em PDF e CSV.' },
];

const steps = [
  { num: '01', title: 'Cadastre seus equipamentos', desc: 'Adicione câmeras, lentes, iluminação e acessórios ao inventário.' },
  { num: '02', title: 'Receba solicitações', desc: 'Crie orçamentos rápidos e converta em reservas aprovadas.' },
  { num: '03', title: 'Gerencie a operação', desc: 'Acompanhe retiradas, devoluções e manutenções na agenda.' },
  { num: '04', title: 'Acompanhe resultados', desc: 'Veja faturamento, relatórios e métricas financeiras.' },
];

const benefits = [
  { icon: Zap, title: 'Rápido e intuitivo', desc: 'Interface moderna para equipes ágeis.' },
  { icon: Shield, title: 'Seguro e confiável', desc: 'Dados isolados por locadora, acesso controlado.' },
  { icon: Clock, title: 'Economize tempo', desc: 'Automações e fluxos que reduzem trabalho manual.' },
  { icon: CheckCircle2, title: 'Profissional', desc: 'Orçamentos e contratos com visual premium.' },
];

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">CineGear</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Para Locadoras</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-gold text-primary-foreground hover:opacity-90">Criar conta</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
              <Zap className="h-3 w-3" /> Plataforma para locadoras audiovisuais
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Gerencie sua locadora{' '}
              <span className="gradient-gold-text">audiovisual</span>{' '}
              em um só lugar
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Controle inventário, reservas, clientes e faturamento com um sistema feito para locadoras de equipamentos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gradient-gold text-primary-foreground hover:opacity-90 px-8 h-12 text-base">
                  Criar conta da locadora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base">Entrar</Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 lg:mt-24 relative"
          >
            <div className="glass-card premium-shadow-lg p-4 sm:p-6 rounded-2xl overflow-hidden">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Faturamento', value: 'R$ 45.600' },
                    { label: 'Reservas', value: '48' },
                    { label: 'Ticket médio', value: 'R$ 950' },
                    { label: 'Equipamentos', value: '156' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-surface rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                      <p className="text-xl font-bold mt-1 gradient-gold-text">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-surface rounded-lg border border-border/50 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-primary/5 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Tudo que sua locadora precisa</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Ferramentas completas para gerenciar equipamentos, clientes e operação.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 premium-shadow hover:premium-shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-surface/50 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Como funciona</h2>
            <p className="text-muted-foreground text-lg">Quatro passos para digitalizar sua locadora.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl font-extrabold gradient-gold-text">{s.num}</span>
                <h3 className="font-semibold text-lg mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Feito para locadoras</h2>
            <p className="text-muted-foreground text-lg">O sistema que entende o dia a dia da sua operação.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 premium-shadow text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Comece agora gratuitamente</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Crie sua conta e teste o CineGear. Sem compromisso, sem cartão de crédito.</p>
            <Link to="/signup">
              <Button size="lg" className="gradient-gold text-primary-foreground hover:opacity-90 px-10 h-12 text-base">
                Criar conta da locadora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-gold flex items-center justify-center">
              <Film className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">CineGear</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 CineGear. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
