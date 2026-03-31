import { z } from "zod";
import { Client, ClientAddress, ClientType } from "@/data/mock-data";

export interface ClientFormValues {
  type: ClientType;
  name: string;
  company: string;
  contactName: string;
  tradeName: string;
  legalName: string;
  stateRegistration: string;
  financialContact: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  financialEmail: string;
  document: string;
  website: string;
  notes: string;
  address: ClientAddress;
}

export interface CompanyLookupResult {
  legalName: string;
  tradeName: string;
  phone: string;
  email: string;
  address: ClientAddress;
}

const emptyAddress = (): ClientAddress => ({
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
});

export const createEmptyClientForm = (): ClientFormValues => ({
  type: "company",
  name: "",
  company: "",
  contactName: "",
  tradeName: "",
  legalName: "",
  stateRegistration: "",
  financialContact: "",
  phone: "",
  secondaryPhone: "",
  email: "",
  financialEmail: "",
  document: "",
  website: "",
  notes: "",
  address: emptyAddress(),
});

export const createClientFormFromRecord = (client: Client): ClientFormValues => ({
  type: client.type,
  name: client.name,
  company: client.company,
  contactName: client.contactName,
  tradeName: client.tradeName,
  legalName: client.legalName,
  stateRegistration: client.stateRegistration,
  financialContact: client.financialContact,
  phone: client.phone,
  secondaryPhone: client.secondaryPhone,
  email: client.email,
  financialEmail: client.financialEmail,
  document: client.document,
  website: client.website,
  notes: client.notes,
  address: { ...client.address },
});

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export const formatCpf = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
};

export const formatCnpj = (value: string) => {
  const digits = digitsOnly(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return digits.replace(/(\d{2})(\d+)/, "$1.$2");
  if (digits.length <= 8) return digits.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  if (digits.length <= 12) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
};

export const formatPhone = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
};

export const formatCep = (value: string) => {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return digits.replace(/(\d{5})(\d+)/, "$1-$2");
};

const allDigitsEqual = (digits: string) => /^(\d)\1+$/.test(digits);

export const isValidCpf = (value: string) => {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || allDigitsEqual(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
};

export const isValidCnpj = (value: string) => {
  const cnpj = digitsOnly(value);
  if (cnpj.length !== 14 || allDigitsEqual(cnpj)) return false;

  const calc = (base: string, factors: number[]) => {
    const total = base.split("").reduce((sum, digit, index) => sum + Number(digit) * factors[index], 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const first = calc(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calc(cnpj.slice(0, 12) + String(first), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj === `${cnpj.slice(0, 12)}${first}${second}`;
};

const addressSchema = z.object({
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
});

export const clientFormSchema = z.object({
  type: z.enum(["individual", "company"]),
  name: z.string().min(2, "Informe o nome principal do cliente."),
  company: z.string(),
  contactName: z.string().min(2, "Informe o nome do contato."),
  tradeName: z.string(),
  legalName: z.string(),
  stateRegistration: z.string(),
  financialContact: z.string(),
  phone: z.string().min(14, "Informe um telefone válido."),
  secondaryPhone: z.string(),
  email: z.string().email("Informe um email principal válido."),
  financialEmail: z.string(),
  document: z.string().min(11, "Informe CPF ou CNPJ."),
  website: z.string(),
  notes: z.string(),
  address: addressSchema,
}).superRefine((values, ctx) => {
  if (values.type === "company") {
    if (!values.legalName.trim()) {
      ctx.addIssue({ code: "custom", message: "Informe a razão social.", path: ["legalName"] });
    }
    if (!isValidCnpj(values.document)) {
      ctx.addIssue({ code: "custom", message: "CNPJ inválido.", path: ["document"] });
    }
  }

  if (values.type === "individual") {
    if (!isValidCpf(values.document)) {
      ctx.addIssue({ code: "custom", message: "CPF inválido.", path: ["document"] });
    }
  }

  const financialEmail = values.financialEmail.trim();
  if (financialEmail && !z.string().email().safeParse(financialEmail).success) {
    ctx.addIssue({ code: "custom", message: "Email financeiro inválido.", path: ["financialEmail"] });
  }

  const website = values.website.trim();
  if (website && !z.string().url().safeParse(website).success) {
    ctx.addIssue({ code: "custom", message: "Site inválido. Use URL completa.", path: ["website"] });
  }
});

export const validateClientForm = (values: ClientFormValues) => clientFormSchema.safeParse(values);

export const normalizeClientPayload = (values: ClientFormValues): Omit<Client, "id"> => {
  const trimmedContact = values.contactName.trim();
  const trimmedTrade = values.tradeName.trim();
  const trimmedLegal = values.legalName.trim();
  const primaryName = values.type === "company"
    ? trimmedTrade || trimmedLegal || trimmedContact
    : values.name.trim() || trimmedContact;
  const companyLabel = values.type === "company" ? trimmedLegal || trimmedTrade : "Pessoa Física";

  return {
    type: values.type,
    name: primaryName,
    company: companyLabel,
    contactName: trimmedContact,
    tradeName: trimmedTrade,
    legalName: trimmedLegal,
    stateRegistration: values.stateRegistration.trim(),
    financialContact: values.financialContact.trim(),
    phone: values.phone.trim(),
    secondaryPhone: values.secondaryPhone.trim(),
    email: values.email.trim(),
    financialEmail: values.financialEmail.trim(),
    document: values.document.trim(),
    website: values.website.trim(),
    notes: values.notes.trim(),
    address: {
      zipCode: values.address.zipCode.trim(),
      street: values.address.street.trim(),
      number: values.address.number.trim(),
      complement: values.address.complement.trim(),
      district: values.address.district.trim(),
      city: values.address.city.trim(),
      state: values.address.state.trim(),
    },
  };
};

const fallbackDirectory: Record<string, CompanyLookupResult> = {
  "19131243000197": {
    legalName: "OpenAI Brasil Tecnologia LTDA",
    tradeName: "OpenAI Brasil",
    phone: "(11) 4000-2026",
    email: "contato@openaibrasil.com",
    address: {
      zipCode: "04538-132",
      street: "Avenida Brigadeiro Faria Lima",
      number: "4055",
      complement: "11 andar",
      district: "Itaim Bibi",
      city: "São Paulo",
      state: "SP",
    },
  },
};

export const lookupCompanyByCnpj = async (cnpj: string): Promise<CompanyLookupResult> => {
  const digits = digitsOnly(cnpj);
  if (!isValidCnpj(digits)) {
    throw new Error("CNPJ inválido. Revise os números e tente novamente.");
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
    if (!response.ok) {
      throw new Error("Consulta indisponível.");
    }

    const payload = await response.json() as {
      razao_social?: string;
      nome_fantasia?: string;
      ddd_telefone_1?: string;
      email?: string;
      cep?: string;
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      municipio?: string;
      uf?: string;
    };

    return {
      legalName: payload.razao_social ?? "",
      tradeName: payload.nome_fantasia ?? "",
      phone: payload.ddd_telefone_1 ? formatPhone(payload.ddd_telefone_1) : "",
      email: payload.email ?? "",
      address: {
        zipCode: formatCep(payload.cep ?? ""),
        street: payload.logradouro ?? "",
        number: payload.numero ?? "",
        complement: payload.complemento ?? "",
        district: payload.bairro ?? "",
        city: payload.municipio ?? "",
        state: payload.uf ?? "",
      },
    };
  } catch (error) {
    const fallback = fallbackDirectory[digits];
    if (fallback) {
      return fallback;
    }

    throw new Error(
      error instanceof Error
        ? "Não foi possível consultar o CNPJ agora. Você ainda pode preencher manualmente."
        : "Não foi possível consultar o CNPJ agora. Você ainda pode preencher manualmente.",
    );
  }
};
