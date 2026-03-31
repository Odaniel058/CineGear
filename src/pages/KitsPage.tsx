import React, { useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Package, Plus, Pencil, Trash2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useAppData } from "@/contexts/AppDataContext";
import { Kit } from "@/data/mock-data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const emptyKit = {
  name: "",
  itemIds: [] as string[],
  items: [] as string[],
  dailyRate: 0,
  description: "",
};

const KitsPage: React.FC = () => {
  const { state, upsertKit, deleteKit } = useAppData();
  const [selectedId, setSelectedId] = useState<string | null>(state.kits[0]?.id ?? null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Kit | null>(null);
  const [form, setForm] = useState(emptyKit);

  const selected = state.kits.find((kit) => kit.id === selectedId) ?? null;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyKit);
    setEditorOpen(true);
  };

  const openEdit = (kit: Kit) => {
    setEditingId(kit.id);
    setSelectedId(kit.id);
    setForm(kit);
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.itemIds.length || !form.dailyRate) {
      toast.error("Defina nome, itens e valor da diária para o kit.");
      return;
    }

    const items = state.equipment.filter((equipment) => form.itemIds.includes(equipment.id)).map((equipment) => equipment.name);
    const record = upsertKit({ ...form, items, id: editingId ?? undefined });
    setSelectedId(record.id);
    setEditorOpen(false);
    setEditingId(null);
    toast.success(editingId ? "Kit atualizado." : "Kit criado.");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteKit(deleteTarget.id);
    setDeleteTarget(null);
    if (selectedId === deleteTarget.id) setSelectedId(null);
    toast.success("Kit excluído.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kits</h1>
            <p className="text-sm text-muted-foreground mt-1">Monte kits reutilizáveis para orçamentos e reservas.</p>
          </div>
          <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo kit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl glass-card premium-shadow-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar kit" : "Novo kit"}</DialogTitle>
                <p className="text-sm text-muted-foreground">Monte combinações reutilizáveis com mais contexto visual para orçamento e reserva.</p>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do kit</Label>
                  <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Diária do kit</Label>
                  <Input type="number" min={0} value={form.dailyRate} onChange={(event) => setForm((current) => ({ ...current, dailyRate: Number(event.target.value) }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Equipamentos do kit</Label>
                <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-auto rounded-xl border border-border/60 p-3 bg-surface/30">
                  {state.equipment.map((equipment) => (
                    <label key={equipment.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-surface">
                      <input
                        type="checkbox"
                        checked={form.itemIds.includes(equipment.id)}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            itemIds: event.target.checked
                              ? [...current.itemIds, equipment.id]
                              : current.itemIds.filter((itemId) => itemId !== equipment.id),
                          }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium">{equipment.name}</p>
                        <p className="text-xs text-muted-foreground">{equipment.category} • {formatCurrency(equipment.dailyRate)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditorOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gradient-gold text-primary-foreground" onClick={handleSave}>
                  Salvar kit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {state.kits.map((kit, index) => (
              <motion.div key={kit.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className={`glass-card p-5 premium-shadow transition-all ${selectedId === kit.id ? "border-primary/30 bg-primary/5" : "hover:premium-shadow-lg"}`}>
                <button type="button" className="w-full text-left" onClick={() => setSelectedId(kit.id)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Boxes className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{kit.name}</h3>
                      <p className="text-xs text-muted-foreground">{kit.items.length} itens</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{kit.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {kit.items.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded border border-border/50 text-muted-foreground">
                        <Package className="h-3 w-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-lg font-bold gradient-gold-text">{formatCurrency(kit.dailyRate)}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(kit)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(kit)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-6 premium-shadow h-fit lg:sticky lg:top-8">
            {selected ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">Detalhe do kit</p>
                  <h3 className="text-xl font-semibold">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Diária do kit</p>
                  <p className="text-2xl font-semibold gradient-gold-text">{formatCurrency(selected.dailyRate)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Itens incluídos</p>
                  {selected.items.map((item) => (
                    <div key={item} className="rounded-xl border border-border/60 bg-surface/40 p-3 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => openEdit(selected)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={() => setDeleteTarget(selected)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Boxes className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Selecione um kit para ver detalhes.</p>
              </div>
            )}
          </div>
        </div>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="glass-card premium-shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir kit</AlertDialogTitle>
              <AlertDialogDescription>
                O kit deixará de aparecer em novos orçamentos e reservas, mas não altera registros antigos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
};

export default KitsPage;
