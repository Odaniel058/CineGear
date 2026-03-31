import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Trash2,
  MapPin,
  Barcode,
  ClipboardList,
  Sparkles,
  Camera,
  Wrench,
  Wallet,
  Boxes,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/contexts/AppDataContext";
import { Equipment, EquipmentStatus } from "@/data/mock-data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const statusOptions: Array<{ value: EquipmentStatus; label: string }> = [
  { value: "available", label: "Disponível" },
  { value: "reserved", label: "Reservado" },
  { value: "maintenance", label: "Manutenção" },
  { value: "unavailable", label: "Indisponível" },
];

const emptyForm: Omit<Equipment, "id"> = {
  name: "",
  category: "",
  brand: "",
  model: "",
  serialNumber: "",
  status: "available",
  dailyRate: 0,
  location: "",
  notes: "",
  supplier: "",
  acquisitionDate: "",
  acquisitionCost: 0,
};

const InventoryPage: React.FC = () => {
  const { state, upsertEquipment, deleteEquipment } = useAppData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [selectedId, setSelectedId] = useState<string | null>(state.equipment[0]?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Equipment, "id">>(emptyForm);

  const categories = useMemo(() => ["Todas", ...new Set(state.equipment.map((item) => item.category))], [state.equipment]);
  const brands = useMemo(() => ["Todas", ...new Set(state.equipment.map((item) => item.brand))], [state.equipment]);

  const filtered = state.equipment.filter((item) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      !searchValue ||
      item.name.toLowerCase().includes(searchValue) ||
      item.model.toLowerCase().includes(searchValue) ||
      item.serialNumber.toLowerCase().includes(searchValue);

    if (!matchesSearch) return false;
    if (category !== "Todas" && item.category !== category) return false;
    if (brand !== "Todas" && item.brand !== brand) return false;
    if (status !== "Todos" && item.status !== status) return false;
    return true;
  });

  const selected = state.equipment.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  const inventoryStats = useMemo(() => {
    const available = state.equipment.filter((item) => item.status === "available").length;
    const maintenance = state.equipment.filter((item) => item.status === "maintenance").length;
    const reserved = state.equipment.filter((item) => item.status === "reserved").length;
    const monthlyPotential = state.equipment.reduce((sum, item) => sum + item.dailyRate * 22, 0);

    return { available, maintenance, reserved, monthlyPotential };
  }, [state.equipment]);

  const topCategories = useMemo(() => {
    const groups = new Map<string, number>();
    state.equipment.forEach((item) => {
      groups.set(item.category, (groups.get(item.category) ?? 0) + 1);
    });
    return [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [state.equipment]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (item: Equipment) => {
    setForm({
      name: item.name,
      category: item.category,
      brand: item.brand,
      model: item.model,
      serialNumber: item.serialNumber,
      status: item.status,
      dailyRate: item.dailyRate,
      location: item.location,
      notes: item.notes,
      supplier: item.supplier || "",
      acquisitionDate: item.acquisitionDate || "",
      acquisitionCost: item.acquisitionCost || 0,
    });
    setSelectedId(item.id);
    setEditingId(item.id);
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.brand || !form.model || !form.serialNumber || !form.location || form.dailyRate <= 0) {
      toast.error("Preencha todos os campos obrigatórios do equipamento.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const record = upsertEquipment({ ...form, id: editingId ?? undefined });
    setSelectedId(record.id);
    setEditingId(null);
    setEditorOpen(false);
    setSaving(false);
    toast.success(editingId ? "Equipamento atualizado com sucesso." : "Equipamento criado com sucesso.");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEquipment(deleteTarget.id);
    if (selectedId === deleteTarget.id) {
      setSelectedId(null);
    }
    toast.success("Equipamento excluído.");
    setDeleteTarget(null);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card px-6 py-7 premium-shadow-lg">
          <div className="absolute inset-0 gradient-cinematic opacity-95" />
          <div className="absolute inset-0 hero-grid-bg opacity-35" />
          <div className="absolute right-[-8rem] top-[-5rem] h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute left-[-5rem] bottom-[-6rem] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Inventory Control
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Inventário com leitura rápida, contexto operacional e margem de receita.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                  Veja disponibilidade, tensões de manutenção e potencial de faturamento sem perder tempo em uma tabela fria.
                </p>
              </div>

              <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold" size="lg" className="self-start" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Novo equipamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl glass-card premium-shadow-lg">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar equipamento" : "Novo equipamento"}</DialogTitle>
                    <p className="text-sm text-muted-foreground">Formulário ampliado para operação, controle interno e contexto financeiro do ativo.</p>
                  </DialogHeader>
                  <div className="rounded-2xl border border-border/60 bg-surface/30 p-4">
                    <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">Dados principais</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Marca</Label>
                        <Input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Modelo</Label>
                        <Input value={form.model} onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Número de série</Label>
                        <Input value={form.serialNumber} onChange={(event) => setForm((current) => ({ ...current, serialNumber: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                          value={form.status}
                          onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as EquipmentStatus }))}
                          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                        >
                          {statusOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Preço da diária</Label>
                        <Input
                          type="number"
                          min={0}
                          value={form.dailyRate}
                          onChange={(event) => setForm((current) => ({ ...current, dailyRate: Number(event.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Localização</Label>
                        <Input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-surface/30 p-4">
                    <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">Aquisição e fornecedor</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Fornecedor</Label>
                        <Input value={form.supplier || ""} onChange={(event) => setForm((current) => ({ ...current, supplier: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de aquisição</Label>
                        <Input type="date" value={form.acquisitionDate || ""} onChange={(event) => setForm((current) => ({ ...current, acquisitionDate: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Custo</Label>
                        <Input type="number" min={0} value={form.acquisitionCost || 0} onChange={(event) => setForm((current) => ({ ...current, acquisitionCost: Number(event.target.value) }))} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-border/60 bg-surface/30 p-4">
                    <Label>Notas internas</Label>
                    <Textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setEditorOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="gold" onClick={handleSave} disabled={saving}>
                      {saving ? "Salvando..." : "Salvar equipamento"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Disponíveis agora",
                  value: inventoryStats.available,
                  helper: "prontos para reserva",
                  icon: Camera,
                },
                {
                  label: "Em manutenção",
                  value: inventoryStats.maintenance,
                  helper: "pedem atenção da operação",
                  icon: Wrench,
                },
                {
                  label: "Em reserva",
                  value: inventoryStats.reserved,
                  helper: "já alocados em jobs",
                  icon: Boxes,
                },
                {
                  label: "Potencial mensal",
                  value: formatCurrency(inventoryStats.monthlyPotential),
                  helper: "22 diárias por item",
                  icon: Wallet,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                    <div className="rounded-xl bg-white/8 p-2 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-white/55">{item.helper}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="glass-card p-4 premium-shadow">
              <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, modelo ou série..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <select value={brand} onChange={(event) => setBrand(event.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    {brands.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Todos", ...statusOptions.map((item) => item.value)].map((item) => {
                  const active = status === item;
                  const label = item === "Todos" ? "Todos" : statusOptions.find((option) => option.value === item)?.label ?? item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatus(item)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        active
                          ? "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "border-border/60 bg-surface/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card premium-shadow overflow-hidden">
              <div className="border-b border-border/60 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Acervo operacional</p>
                    <p className="text-xs text-muted-foreground">{filtered.length} itens encontrados para a visão atual.</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                    {topCategories.map(([name, count]) => (
                      <span key={name} className="rounded-full border border-border/60 bg-surface px-3 py-1">
                        {name}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 text-left">
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Equipamento</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Categoria</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Local</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Diária</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`cursor-pointer border-b border-border/40 transition-colors hover:bg-surface/70 ${
                          selectedId === item.id ? "bg-primary/6" : ""
                        }`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <Package className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.brand} • {item.model}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{item.category}</td>
                        <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{item.location}</td>
                        <td className="px-5 py-4 text-right text-sm font-semibold">{formatCurrency(item.dailyRate)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); openEdit(item); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); setDeleteTarget(item); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="p-14 text-center text-muted-foreground">
                  <Package className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p className="text-sm font-medium">Nenhum equipamento encontrado</p>
                  <p className="mt-1 text-xs">Ajuste os filtros ou cadastre um novo item no inventário.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 premium-shadow xl:sticky xl:top-8">
              {selected ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Detalhe do equipamento</p>
                      <h3 className="text-2xl font-semibold">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground">{selected.brand} • {selected.model}</p>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
                      <p className="text-xs text-muted-foreground">Diária</p>
                      <p className="mt-1 font-display text-2xl font-bold gradient-gold-text">{formatCurrency(selected.dailyRate)}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
                      <p className="text-xs text-muted-foreground">Aquisição</p>
                      <p className="mt-1 text-sm font-medium">{selected.acquisitionDate || "Não informada"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {selected.acquisitionCost ? formatCurrency(selected.acquisitionCost) : "Sem custo cadastrado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Barcode className="h-4 w-4" />
                      <span>{selected.serialNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selected.location}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <ClipboardList className="mt-0.5 h-4 w-4" />
                      <span>{selected.notes}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-surface/30 p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">Fornecedor e contexto</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Fornecedor</span>
                        <span className="font-medium">{selected.supplier || "Não informado"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Categoria</span>
                        <span className="font-medium">{selected.category}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Status atual</span>
                        <span className="font-medium">{statusOptions.find((item) => item.value === selected.status)?.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" variant="outline" onClick={() => openEdit(selected)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => setDeleteTarget(selected)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Selecione um equipamento para ver os detalhes.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="glass-card premium-shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir equipamento</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação remove {deleteTarget?.name} do inventário mockado e atualiza o restante do app.
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

export default InventoryPage;
