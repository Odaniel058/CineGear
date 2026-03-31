import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Film, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-cinematic opacity-60" />
      <div className="absolute inset-0 hero-grid-bg opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-8 animate-glow-pulse"
        >
          <Film className="h-8 w-8 text-primary-foreground" strokeWidth={2} />
        </motion.div>

        {/* 404 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-8xl font-bold gradient-gold-text leading-none mb-4"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold mb-3"
        >
          Página não encontrada
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-sm mb-8 leading-relaxed"
        >
          A rota <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono">{location.pathname}</code> não existe.
          Verifique o endereço ou volte ao início.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Link to="/">
            <Button className="gradient-gold text-primary-foreground border-0 rounded-xl gap-2 gold-glow">
              <Home className="h-4 w-4" />
              Início
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
