import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  index?: number;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, change, changeType = 'neutral', icon: Icon, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="glass-card p-5 premium-shadow hover:premium-shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {change && (
          <span className={`text-xs font-medium ${changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </motion.div>
  );
};
