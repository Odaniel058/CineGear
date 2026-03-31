export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", options);

export const formatDateTime = (date: string, time: string) =>
  `${formatDate(date)} às ${time}`;
