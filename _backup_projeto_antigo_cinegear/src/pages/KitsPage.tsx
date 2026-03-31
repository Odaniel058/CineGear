import React from 'react';
import { PageTransition } from '@/components/PageTransition';
import { kitsData } from '@/data/mock-data';
import { Boxes, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const KitsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kits</h1>
            <p className="text-sm text-muted-foreground mt-1">{kitsData.length} kits configurados</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Novo kit
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kitsData.map((kit, i) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 premium-shadow hover:premium-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Boxes className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{kit.name}</h3>
                  <p className="text-xs text-muted-foreground">{kit.items.length} itens</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{kit.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {kit.items.map((item, j) => (
                  <span key={j} className="inline-flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded border border-border/50 text-muted-foreground">
                    <Package className="h-3 w-3" /> {item}
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Diária do kit</span>
                <span className="text-lg font-bold gradient-gold-text">R$ {kit.dailyRate}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default KitsPage;
