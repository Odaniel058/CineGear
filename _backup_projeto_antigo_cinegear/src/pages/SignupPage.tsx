import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Film, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignupPage: React.FC = () => {
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(name, company, email, password);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CineGear</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Comece a gerenciar sua locadora</h2>
            <p className="text-muted-foreground leading-relaxed">Cadastre-se gratuitamente e tenha acesso a todas as ferramentas.</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 CineGear</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CineGear</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Criar conta</h1>
          <p className="text-sm text-muted-foreground mb-8">Cadastre sua locadora no CineGear</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input id="name" placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Nome da locadora</Label>
              <Input id="company" placeholder="Nome da sua empresa" value={company} onChange={e => setCompany(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-gold text-primary-foreground hover:opacity-90" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
