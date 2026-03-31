import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Loader2, MapPin, Phone, Search, ShieldCheck, UserRound } from "lucide-react";
import { Client } from "@/data/mock-data";
import {
  ClientFormValues,
  createClientFormFromRecord,
  createEmptyClientForm,
  formatCep,
  formatCnpj,
  formatCpf,
  formatPhone,
  lookupCompanyByCnpj,
  normalizeClientPayload,
  validateClientForm,
} from "@/lib/client-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";

type FieldErrors = Record<string, string>;

interface ClientEditorDialogProps {
  open: boolean;
  editingClient?: Client | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: Omit<Client, "id">, id?: string) => Promise<void> | void;
}

const sectionTitleClass = "mb-4 flex items-center gap-2 text-sm font-semibold";

const getError = (errors: FieldErrors, path: string) => errors[path];

const ClientEditorDialog: React.FC<ClientEditorDialogProps> = ({
  open,
  editingClient,
  onOpenChange,
  onSave,
}) => {
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<ClientFormValues>(createEmptyClientForm());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(editingClient ? createClientFormFromRecord(editingClient) : createEmptyClientForm());
    setErrors({});
    setLookupMessage("");
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }, [editingClient, open]);

  const isCompany = form.type === "company";
  const headerDescription = useMemo(
    () =>
      isCompany
        ? "Cadastro empresarial completo para produtoras, agências e locadoras parceiras."
        : "Cadastro mais enxuto para profissionais independentes e pessoas físicas.",
    [isCompany],
  );

  const setField = <K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const setAddressField = (field: keyof ClientFormValues["address"], value: string) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [field]: value,
      },
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`address.${field}`];
      return next;
    });
  };

  const handleTypeChange = (type: ClientFormValues["type"]) => {
    setForm((current) => ({
      ...current,
      type,
      name: type === "company" ? current.name : current.contactName || current.name,
      company: type === "company" ? current.company : "Pessoa Física",
      tradeName: type === "company" ? current.tradeName : "",
      legalName: type === "company" ? current.legalName : "",
      stateRegistration: type === "company" ? current.stateRegistration : "",
      document: "",
    }));
    setErrors({});
    setLookupMessage("");
  };

  const handleLookupCnpj = async () => {
    setLookupLoading(true);
    setLookupMessage("");

    try {
      const result = await lookupCompanyByCnpj(form.document);
      setForm((current) => ({
        ...current,
        name: current.name || result.tradeName || result.legalName,
        company: result.legalName || current.company,
        tradeName: result.tradeName || current.tradeName,
        legalName: result.legalName || current.legalName,
        phone: current.phone || result.phone,
        email: current.email || result.email,
        address: {
          ...current.address,
          ...result.address,
        },
      }));
      setLookupMessage("CNPJ encontrado. Você pode ajustar qualquer campo manualmente.");
      toast.success("Dados empresariais preenchidos com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível consultar o CNPJ.";
      setLookupMessage(message);
      toast.error(message);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async () => {
    const parsed = validateClientForm(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(nextErrors);
      toast.error("Revise os campos destacados antes de salvar.");
      return;
    }

    setSaving(true);
    try {
      await onSave(normalizeClientPayload(form), editingClient?.id);
      toast.success(editingClient ? "Cliente atualizado com sucesso." : "Cliente salvo com sucesso.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden border-border/60 bg-card/95 p-0 backdrop-blur-xl">
        <div className="grid max-h-[92vh] grid-cols-1 overflow-hidden xl:grid-cols-[0.9fr_1.6fr]">
          <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top,_rgba(202,157,45,0.18),_transparent_45%)] p-8 xl:border-b-0 xl:border-r">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl">{editingClient ? "Editar cliente" : "Novo cliente"}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {headerDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
              {[
                { icon: UserRound, title: "Dados principais", description: "Contato principal, tipo de cliente e identidade comercial." },
                { icon: Building2, title: "Dados empresariais", description: "Razão social, CNPJ e dados fiscais quando for PJ." },
                { icon: Phone, title: "Contato e cobrança", description: "Telefones, emails e responsável financeiro." },
                { icon: MapPin, title: "Endereço", description: "Base de faturamento e operação, com CEP completo." },
                { icon: ShieldCheck, title: "Observações internas", description: "Instruções comerciais e notas da operação." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-border/50 bg-background/30 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto p-8">
            <div className="space-y-8">
              <section className="rounded-[28px] border border-border/60 bg-surface/40 p-6">
                <div className={sectionTitleClass}>
                  <UserRound className="h-4 w-4 text-primary" />
                  Dados principais
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3 lg:col-span-2">
                    <Label>Tipo de cliente</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { value: "company" as const, title: "Pessoa Jurídica", description: "Produtoras, agências e empresas." },
                        { value: "individual" as const, title: "Pessoa Física", description: "Profissionais autônomos e freelancers." },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleTypeChange(option.value)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            form.type === option.value
                              ? "border-primary/40 bg-primary/10 premium-shadow"
                              : "border-border/60 bg-background/40 hover:border-primary/20"
                          }`}
                        >
                          <p className="text-sm font-semibold">{option.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nome do contato</Label>
                    <Input
                      id="contactName"
                      ref={firstFieldRef}
                      value={form.contactName}
                      onChange={(event) => setField("contactName", event.target.value)}
                    />
                    {getError(errors, "contactName") ? <p className="text-xs text-destructive">{getError(errors, "contactName")}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">{isCompany ? "Nome principal de exibição" : "Nome completo"}</Label>
                    <Input id="name" value={form.name} onChange={(event) => setField("name", event.target.value)} />
                    {getError(errors, "name") ? <p className="text-xs text-destructive">{getError(errors, "name")}</p> : null}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-surface/40 p-6">
                <div className={sectionTitleClass}>
                  <Building2 className="h-4 w-4 text-primary" />
                  Dados da empresa
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {isCompany ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="tradeName">Nome fantasia</Label>
                        <Input id="tradeName" value={form.tradeName} onChange={(event) => setField("tradeName", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="legalName">Razão social</Label>
                        <Input id="legalName" value={form.legalName} onChange={(event) => setField("legalName", event.target.value)} />
                        {getError(errors, "legalName") ? <p className="text-xs text-destructive">{getError(errors, "legalName")}</p> : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document">CNPJ</Label>
                        <div className="flex gap-2">
                          <Input
                            id="document"
                            value={form.document}
                            onChange={(event) => setField("document", formatCnpj(event.target.value))}
                          />
                          <Button type="button" variant="outline" className="shrink-0" onClick={handleLookupCnpj} disabled={lookupLoading}>
                            {lookupLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Buscar CNPJ
                          </Button>
                        </div>
                        {getError(errors, "document") ? <p className="text-xs text-destructive">{getError(errors, "document")}</p> : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stateRegistration">Inscrição estadual</Label>
                        <Input id="stateRegistration" value={form.stateRegistration} onChange={(event) => setField("stateRegistration", event.target.value)} />
                      </div>
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="company">Empresa / nome fiscal resumido</Label>
                        <Input id="company" value={form.company} onChange={(event) => setField("company", event.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="document">CPF</Label>
                        <Input id="document" value={form.document} onChange={(event) => setField("document", formatCpf(event.target.value))} />
                        {getError(errors, "document") ? <p className="text-xs text-destructive">{getError(errors, "document")}</p> : null}
                      </div>
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {lookupMessage ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4"
                    >
                      <Alert className="border-primary/20 bg-primary/5 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{lookupMessage}</span>
                      </Alert>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-surface/40 p-6">
                <div className={sectionTitleClass}>
                  <Phone className="h-4 w-4 text-primary" />
                  Contato
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone principal</Label>
                    <Input id="phone" value={form.phone} onChange={(event) => setField("phone", formatPhone(event.target.value))} />
                    {getError(errors, "phone") ? <p className="text-xs text-destructive">{getError(errors, "phone")}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Telefone secundário / WhatsApp</Label>
                    <Input id="secondaryPhone" value={form.secondaryPhone} onChange={(event) => setField("secondaryPhone", formatPhone(event.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email principal</Label>
                    <Input id="email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
                    {getError(errors, "email") ? <p className="text-xs text-destructive">{getError(errors, "email")}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financialEmail">Email financeiro</Label>
                    <Input id="financialEmail" type="email" value={form.financialEmail} onChange={(event) => setField("financialEmail", event.target.value)} />
                    {getError(errors, "financialEmail") ? <p className="text-xs text-destructive">{getError(errors, "financialEmail")}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financialContact">Responsável financeiro</Label>
                    <Input id="financialContact" value={form.financialContact} onChange={(event) => setField("financialContact", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">{isCompany ? "Site institucional" : "Site / portfólio"}</Label>
                    <Input id="website" value={form.website} onChange={(event) => setField("website", event.target.value)} />
                    {getError(errors, "website") ? <p className="text-xs text-destructive">{getError(errors, "website")}</p> : null}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-surface/40 p-6">
                <div className={sectionTitleClass}>
                  <MapPin className="h-4 w-4 text-primary" />
                  Endereço
                </div>
                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" value={form.address.zipCode} onChange={(event) => setAddressField("zipCode", formatCep(event.target.value))} />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input id="street" value={form.address.street} onChange={(event) => setAddressField("street", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" value={form.address.number} onChange={(event) => setAddressField("number", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" value={form.address.complement} onChange={(event) => setAddressField("complement", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Bairro</Label>
                    <Input id="district" value={form.address.district} onChange={(event) => setAddressField("district", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={form.address.city} onChange={(event) => setAddressField("city", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={form.address.state} onChange={(event) => setAddressField("state", event.target.value.toUpperCase().slice(0, 2))} />
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-surface/40 p-6">
                <div className={sectionTitleClass}>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Observações
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações internas</Label>
                  <Textarea id="notes" rows={5} value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Condições comerciais, preferências, riscos, faturamento, horário de retirada..." />
                </div>
              </section>
            </div>

            <DialogFooter className="mt-8 gap-3 border-t border-border/60 pt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button className="gradient-gold text-primary-foreground" onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar cliente
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditorDialog;
