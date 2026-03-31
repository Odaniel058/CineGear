import React, { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { clientsData, reservationsData } from '@/data/mock-data';
import { Search, Plus, Users, Mail, Phone, Building2, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ClientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = clientsData.filter(c => {
    if (!search) return true;
    return c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
  });

  const selectedClient = clientsData.find(c => c.id === selected);
  const clientReservations = selected ? reservationsData.filter(r => r.clientId === selected) : [];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
            <p className="text-sm text-muted-foreground mt-1">{clientsData.length} clientes cadastrados</p>
          </div>
          <Button className="gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Novo cliente
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="space-y-3">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(c.id)}
                  className={`glass-card p-4 premium-shadow cursor-pointer transition-all duration-200 hover:premium-shadow-lg ${selected === c.id ? 'ring-1 ring-primary' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold gradient-gold-text">R$ {c.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{c.reservationCount} reservas</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="glass-card p-6 premium-shadow h-fit sticky top-24">
            {selectedClient ? (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">{selectedClient.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{selectedClient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClient.company}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {selectedClient.email}</div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {selectedClient.phone}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="font-mono text-xs">{selectedClient.document}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-3 border border-border/50 text-center">
                    <p className="text-lg font-bold">{selectedClient.reservationCount}</p>
                    <p className="text-xs text-muted-foreground">Reservas</p>
                  </div>
                  <div className="bg-surface rounded-lg p-3 border border-border/50 text-center">
                    <p className="text-lg font-bold gradient-gold-text">R$ {selectedClient.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total gasto</p>
                  </div>
                </div>
                {clientReservations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Reservas recentes</h4>
                    <div className="space-y-2">
                      {clientReservations.slice(0, 3).map(r => (
                        <div key={r.id} className="flex items-center justify-between p-2 rounded bg-surface border border-border/50 text-xs">
                          <span className="font-mono text-muted-foreground">{r.id}</span>
                          <span className="font-semibold">R$ {r.totalValue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Selecione um cliente para ver detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientsPage;
