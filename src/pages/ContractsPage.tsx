import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Plus, Printer, ScrollText } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/contexts/AppDataContext";
import { Contract, ContractStatus } from "@/data/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { downloadContractPdf, printContract } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const templateContract = (reservationId: string, clientName: string) =>
  `Contrato gerado automaticamente para a reserva ${reservationId}, vinculada ao cliente ${clientName}. As partes concordam com a devolução integral dos itens nas mesmas condições da retirada.`;

const ContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, upsertContract } = useAppData();
  const [selectedId, setSelectedId] = useState<string | null>(state.contracts[0]?.id ?? null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({
    reservationId: state.reservations[0]?.id ?? "",
    status: "draft" as ContractStatus,
    content: templateContract(state.reservations[0]?.id ?? "RES-001", state.reservations[0]?.clientName ?? "Cliente"),
  });

  const selected = state.contracts.find((contract) => contract.id === selectedId) ?? null;

  const handleGenerate = () => {
    const reservation = state.reservations.find((item) => item.id === form.reservationId);
    if (!reservation) {
      toast.error("Selecione uma reserva válida para gerar o contrato.");
      return;
    }

    const record = upsertContract({
      reservationId: reservation.id,
      clientId: reservation.clientId,
      clientName: reservation.clientName,
      status: form.status,
      createdAt: "2026-03-16",
      value: reservation.totalValue,
      content: form.content || templateContract(reservation.id, reservation.clientName),
    });
    setSelectedId(record.id);
    setEditorOpen(false);
    toast.success("Contrato gerado com sucesso.");
  };

  const updateStatus = (contract: Contract, status: ContractStatus) => {
    upsertContract({ ...contract, status });
    setSelectedId(contract.id);
    toast.success("Status do contrato atualizado.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
            <p className="text-sm text-muted-foreground mt-1">Gere, visualize, imprima e baixe contratos vinculados às reservas.</p>
          </div>
          <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Novo contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl glass-card premium-shadow-lg">
              <DialogHeader>
                <DialogTitle>Gerar contrato a partir de reserva</DialogTitle>
                <p className="text-sm text-muted-foreground">Prepare o contrato com mais contexto antes de imprimir ou baixar o PDF.</p>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reserva</Label>
                  <select
                    value={form.reservationId}
                    onChange={(event) => {
                      const reservation = state.reservations.find((item) => item.id === event.target.value);
                      setForm((current) => ({
                        ...current,
                        reservationId: event.target.value,
                        content: templateContract(reservation?.id ?? "", reservation?.clientName ?? "Cliente"),
                      }));
                    }}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                  >
                    {state.reservations.map((reservation) => (
                      <option key={reservation.id} value={reservation.id}>
                        {reservation.id} • {reservation.clientName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContractStatus }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full">
                    <option value="draft">Rascunho</option>
                    <option value="signed">Assinado</option>
                    <option value="active">Ativo</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo do contrato</Label>
                  <Textarea rows={8} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditorOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="gradient-gold text-primary-foreground" onClick={handleGenerate}>
                    Gerar contrato
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid xl:grid-cols-[1.2fr_1fr] gap-6">
          <div className="glass-card premium-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Contrato</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Reserva</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Cliente</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {state.contracts.map((contract, index) => (
                    <motion.tr key={contract.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.04 }} className={`border-b border-border/50 hover:bg-surface cursor-pointer ${selectedId === contract.id ? "bg-primary/5" : ""}`} onClick={() => setSelectedId(contract.id)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ScrollText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono">{contract.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{contract.reservationId}</td>
                      <td className="px-4 py-3 text-sm font-medium">{contract.clientName}</td>
                      <td className="px-4 py-3"><StatusBadge status={contract.status} /></td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">{formatCurrency(contract.value)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6 premium-shadow h-fit xl:sticky xl:top-8">
            {selected ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">Detalhe do contrato</p>
                    <h3 className="text-xl font-semibold">{selected.id}</h3>
                    <p className="text-sm text-muted-foreground">{selected.clientName}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Reserva</p>
                    <p className="text-sm font-medium">{selected.reservationId}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Emissão</p>
                    <p className="text-sm font-medium">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Valor</p>
                  <p className="text-2xl font-semibold gradient-gold-text">{formatCurrency(selected.value)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status rápido</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["draft", "signed", "active", "completed"] as const).map((status) => (
                      <Button key={status} variant="outline" size="sm" onClick={() => updateStatus(selected, status)}>
                        {status === "draft" ? "Rascunho" : status === "signed" ? "Assinado" : status === "active" ? "Ativo" : "Concluído"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-surface/30 p-4">
                  <p className="text-sm font-medium mb-2">Conteúdo</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.content}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => printContract(selected, state.reservations.find((reservation) => reservation.id === selected.reservationId), state.settings)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadContractPdf(selected, state.reservations.find((reservation) => reservation.id === selected.reservationId), state.settings)}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/clients")}>
                    <Eye className="h-4 w-4 mr-2" />
                    Cliente
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/reservations")}>
                    <Eye className="h-4 w-4 mr-2" />
                    Reserva
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ScrollText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Selecione um contrato para visualizar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContractsPage;
