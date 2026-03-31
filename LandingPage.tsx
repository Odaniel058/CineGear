import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Film,
  Package,
  CalendarDays,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  ScrollText,
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Clock,
  ChevronDown,
  Boxes,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Floating particle
const Particle: React.FC<{ delay: number; x: number; size: number }> = ({ delay, x, size }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20 pointer-events-none"
    style={{ width: size, height: size, left: `${x}%`, bottom: '-10px' }}
    animate={{ y: [0, -600], opacity: [0, 0.6, 0] }}
    transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: "linear" }}
  />
);

// ── Animated counter
const Counter: React.FC<{ to: number; suffix?: string; prefix?: string }> = ({ to, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(to * ease));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{prefix}{count.toLocaleString('pt-BR')}{suffix}</span>;
};

// ── Feature card data
const features = [
  {
    icon: Package,
    title: "Inventário Inteligente",
    description: "Controle cada equipamento em tempo real. Saiba exatamente o que está disponível, em manutenção ou reservado.",
    tag: "Core",
  },
  {
    icon: CalendarDays,
    title: "Reservas & Agenda",
    description: "Gerencie reservas com visualização de calendário. Evite conflitos e maximize a utilização do seu acervo.",
    tag: "Produtividade",
  },
  {
    icon: FileText,
    title: "Orçamentos Profissionais",
    description: "Gere orçamentos detalhados em segundos, com cálculo automático de valores e envio direto para o cliente.",
    tag: "Vendas",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "CRM completo para produtoras, diretores e freelancers. Histórico de locações e perfil financeiro centralizado.",
    tag: "Relacionamento",
  },
  {
    icon: ScrollText,
    title: "Contratos Digitais",
    description: "Gere contratos automaticamente a partir das reservas. Segurança jurídica para cada locação.",
    tag: "Jurídico",
  },
  {
    icon: BarChart3,
    title: "Relatórios & Analytics",
    description: "Dashboards com indicadores de receita, utilização de equipamentos e performance do negócio.",
    tag: "Inteligência",
  },
  {
    icon: Boxes,
    title: "Kits Pré-montados",
    description: "Monte pacotes com câmera, lentes e acessórios. Simplifique a operação e aumente o ticket médio.",
    tag: "Operações",
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description: "Fluxo de caixa, contas a receber e faturamento integrado ao ciclo de locação.",
    tag: "Financeiro",
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Locadoras ativas' },
  { value: 98, suffix: '%', label: 'Satisfação dos clientes' },
  { value: 12000, suffix: '+', label: 'Equipamentos gerenciados' },
  { value: 3, suffix: 'x', label: 'Mais produtividade' },
];

const testimonials = [
  {
    name: "Rodrigo Faria",
    role: "Sócio, LuzAction Rentals — SP",
    text: "O CineGear transformou nossa operação. Zeramos os conflitos de reserva e nossa equipe economiza horas por semana.",
    stars: 5,
  },
  {
    name: "Camila Dutra",
    role: "Gerente, Studio Norte — RJ",
    text: "A geração de orçamentos ficou absurdamente rápida. Clientes ficam impressionados com a profissionalidade dos documentos.",
    stars: 5,
  },
  {
    name: "Marcos Aurélio",
    role: "Diretor, Frame Rental — MG",
    text: "Finalmente um sistema feito para quem entende de cinema. A interface é linda e funciona de verdade.",
    stars: 5,
  },
];

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="flex items-center justify-between h-14 bg-background/80 backdrop-blur-xl rounded-2xl border border-border/60 px-5 premium-shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center gold-glow">
                <Film className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-base tracking-tight">CineGear</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              {['Funcionalidades', 'Preços', 'Sobre'].map(item => (
                <a key={item} href="#" className="hover:text-foreground transition-colors duration-200 font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl text-sm font-medium">
                  Entrar
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-xl gradient-gold text-primary-foreground font-semibold border-0 gold-glow hover:opacity-90 transition-opacity">
                  Começar grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-cinematic" />
        <div className="absolute inset-0 hero-grid-bg opacity-60" />
        <div className="absolute inset-0 hero-radial-fade" />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <Particle key={i} delay={i * 0.5} x={5 + i * 4.8} size={2 + Math.random() * 4} />
          ))}
        </div>

        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none animate-pulse-gold" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" style={{ animationDelay: '2s' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-28"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-semibold mb-8 uppercase tracking-widest"
          >
            <Sparkles className="h-3 w-3" />
            Sistema de Gestão Audiovisual
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight text-balance"
            >
              Gerencie sua{" "}
              <span className="gradient-gold-text">locadora</span>
              <br />
              como um{" "}
              <span className="relative">
                <span className="relative z-10">estúdio</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-[3px] bg-primary origin-left rounded-full"
                />
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed"
          >
            Inventário, reservas, orçamentos, contratos e financeiro em uma única plataforma.
            Feito para quem vive do audiovisual.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="h-13 px-8 text-base gradient-gold text-primary-foreground font-bold border-0 rounded-2xl gold-glow-intense hover:opacity-95 transition-opacity gap-2"
                >
                  Começar gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base rounded-2xl border-border/50 bg-background/40 backdrop-blur-sm hover:bg-background/60 gap-2"
                >
                  <Play className="h-4 w-4" />
                  Ver demonstração
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            {[
              { icon: Shield, text: 'Dados seguros' },
              { icon: Zap, text: 'Setup em 5 minutos' },
              { icon: Clock, text: 'Suporte em português' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 border-y border-border/50 bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map(({ value, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                <p className="font-display text-4xl md:text-5xl font-bold gradient-gold-text mb-1">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">Plataforma Completa</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Tudo que sua locadora precisa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Do inventário ao faturamento, cada módulo foi desenhado para a realidade das locadoras audiovisuais brasileiras.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-5 feature-card-hover group relative overflow-hidden cursor-default"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/3 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/15 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 pt-1.5">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-sm text-foreground mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-24 bg-surface border-y border-border/50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">Depoimentos</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Quem já usa, não larga
            </h2>
          </motion.div>

          <div className="relative h-56">
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) =>
                i === activeTestimonial ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 glass-card p-8 text-center"
                  >
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg text-foreground mb-5 italic font-light text-balance leading-relaxed max-w-2xl mx-auto">
                      "{t.text}"
                    </p>
                    <div>
                      <p className="font-display font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeTestimonial
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-border hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial-fade opacity-50 pointer-events-none" />
        <div className="absolute inset-0 hero-grid-bg opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold gold-glow-intense mb-8"
          >
            <Film className="h-8 w-8 text-primary-foreground" strokeWidth={2} />
          </motion.div>

          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Pronto para{" "}
            <span className="gradient-gold-text">profissionalizar</span>
            {" "}sua locadora?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 text-pretty">
            Comece gratuitamente hoje. Sem cartão de crédito, sem compromisso.
            Configure em menos de 5 minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  size="lg"
                  className="h-14 px-10 text-base gradient-gold text-primary-foreground font-bold border-0 rounded-2xl gold-glow-intense gap-2"
                >
                  Criar conta gratuita
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['14 dias grátis', 'Suporte em PT-BR', 'Cancele quando quiser', 'Dados no Brasil'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 py-10 px-6 bg-surface">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
              <Film className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm">CineGear</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CineGear. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
