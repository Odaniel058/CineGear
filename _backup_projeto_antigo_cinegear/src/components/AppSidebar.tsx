import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import {
  LayoutDashboard, Package, CalendarDays, FileText, Users, Boxes,
  ScrollText, DollarSign, BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, Sun, Moon, Film
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Inventário', icon: Package, path: '/inventory' },
  { label: 'Reservas', icon: CalendarDays, path: '/reservations' },
  { label: 'Orçamentos', icon: FileText, path: '/quotes' },
  { label: 'Agenda', icon: CalendarDays, path: '/agenda' },
  { label: 'Clientes', icon: Users, path: '/clients' },
  { label: 'Kits', icon: Boxes, path: '/kits' },
  { label: 'Contratos', icon: ScrollText, path: '/contracts' },
  { label: 'Financeiro', icon: DollarSign, path: '/financial' },
  { label: 'Relatórios', icon: BarChart3, path: '/reports' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
          <Film className="h-4 w-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg tracking-tight text-foreground whitespace-nowrap overflow-hidden"
            >
              CineGear
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px] flex-shrink-0" /> : <Moon className="h-[18px] w-[18px] flex-shrink-0" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
