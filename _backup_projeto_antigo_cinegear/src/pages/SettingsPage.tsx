import React from 'react';
import { PageTransition } from '@/components/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Building2, Mail, Phone, MapPin, FileText, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <PageTransition>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">Dados da locadora e preferências</p>
        </div>

        {/* Company info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 premium-shadow space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Dados da empresa</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da empresa</Label>
              <Input defaultValue={user?.company || 'Minha Locadora'} />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input defaultValue="12.345.678/0001-90" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input defaultValue="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email || 'contato@locadora.com'} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Textarea defaultValue="Rua das Câmeras, 123 - São Paulo, SP" rows={2} />
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">Salvar alterações</Button>
        </motion.div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 premium-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Logo da empresa</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Usado em orçamentos, contratos e documentos PDF.</p>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para selecionar</p>
            <Button variant="outline" size="sm" className="mt-3">Selecionar arquivo</Button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 premium-shadow">
          <h2 className="font-semibold mb-4">Aparência</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Tema</p>
              <p className="text-xs text-muted-foreground">Alterne entre modo claro e escuro</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border/50 hover:bg-surface-hover transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="text-sm">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;
