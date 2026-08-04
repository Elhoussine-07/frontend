import type { Invoice, PaginatedResponse } from "@/lib/types";
import { camelizeKeys, fetchBlob, GATEWAY_URL, frappeCall } from "@/services/http";

/** Service facturation. */

export interface InvoiceFilters {
  status?: "all" | "paid" | "to_pay" | "late";
  period?: string;
  projectId?: string;
  page?: number;
  pageSize?: number;
}

const STATUS_MAP: Record<string, Invoice["status"]> = {
  paid: "paid",
  payée: "paid",
  payee: "paid",
  "en attente": "to_pay",
  pending: "to_pay",
  unpaid: "to_pay",
  overdue: "late",
  "en retard": "late",
  late: "late",
};

const STATUS_LABELS: Record<Invoice["status"], string> = {
  paid: "Payée",
  to_pay: "À payer",
  late: "En retard",
};

function mapInvoiceStatus(raw: unknown): Invoice["status"] {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  return STATUS_MAP[key] ?? "to_pay";
}

/**
 * Traduit une `Invoice` Frappe (snake_case) vers `Invoice` (camelCase).
 * // TODO backend: `projectTitle`/`companyName` (libellés d'affichage) non
 * // confirmés dans le doctype `Invoice` — best-effort à partir des champs
 * // liés (`project`, `agency`).
 */
function mapInvoice(raw: unknown): Invoice {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const status = mapInvoiceStatus(data["status"]);
  const id = String(data["id"] ?? data["name"] ?? "");

  return {
    id,
    projectTitle: String(data["projectTitle"] ?? data["project"] ?? ""),
    companyName: String(data["companyName"] ?? data["agency"] ?? ""),
    amount: Number(data["amount"] ?? data["total"] ?? 0),
    issuedAt: String(data["issueDate"] ?? data["issuedAt"] ?? ""),
    dueAt: String(data["dueDate"] ?? data["dueAt"] ?? ""),
    status,
    statusLabel: String(data["statusLabel"] ?? STATUS_LABELS[status]),
    downloadUrl: String(
      data["downloadUrl"] ??
        `${GATEWAY_URL}/api/method/frappe.utils.print_format.download_pdf?doctype=Invoice&name=${encodeURIComponent(id)}`,
    ),
    agency: (data["agency"] as string | undefined) ?? undefined,
    project: (data["project"] as string | undefined) ?? undefined,
    proposal: (data["proposal"] as string | undefined) ?? undefined,
    tax: data["tax"] !== undefined ? Number(data["tax"]) : undefined,
    total: data["total"] !== undefined ? Number(data["total"]) : undefined,
    commissionRate:
      data["commissionRate"] !== undefined ? Number(data["commissionRate"]) : undefined,
    commissionAmount:
      data["commissionAmount"] !== undefined ? Number(data["commissionAmount"]) : undefined,
    amountDue: data["amountDue"] !== undefined ? Number(data["amountDue"]) : undefined,
    paymentDate: (data["paymentDate"] as string | null | undefined) ?? undefined,
    invoiceNumber: (data["invoiceNumber"] as string | undefined) ?? undefined,
  };
}

/**
 * // API CALL : frappeCall("payment.list_invoices", { status: filters?.status })
 */
export async function getInvoices(filters: InvoiceFilters): Promise<PaginatedResponse<Invoice>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const raw = await frappeCall<unknown>("payment.list_invoices", {
    status: filters.status && filters.status !== "all" ? filters.status : undefined,
  });
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  const items = list.map((item) => mapInvoice(item));

  return {
    items,
    page,
    pageSize,
    total: items.length,
    totalPages: 1,
  };
}

/**
 * // Dérivé de `payment.list_invoices` (somme côté client) — pas d'endpoint
 * // "summary" dédié confirmé.
 */
export async function getInvoicesSummary(): Promise<{
  totalPaid: number;
  pendingAmount: number;
}> {
  const raw = await frappeCall<unknown>("payment.list_invoices", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  const items = list.map((item) => mapInvoice(item));

  return items.reduce(
    (summary, invoice) => {
      if (invoice.status === "paid") {
        summary.totalPaid += invoice.amount;
      } else {
        summary.pendingAmount += invoice.amount;
      }
      return summary;
    },
    { totalPaid: 0, pendingAmount: 0 },
  );
}

/**
 * Téléchargement PDF d'une facture via l'utilitaire d'impression Frappe
 * standard (`frappe.utils.print_format.download_pdf`, hors préfixe
 * `platform_core.platform_core.api.` — c'est un utilitaire Frappe générique,
 * pas un endpoint de l'API métier). L'URL est identique à celle déjà
 * construite dans `mapInvoice::downloadUrl` ci-dessus — confirmée correcte,
 * pas de gap backend restant ici.
 */
export async function downloadInvoice(id: string): Promise<Blob> {
  const url = `${GATEWAY_URL}/api/method/frappe.utils.print_format.download_pdf?doctype=Invoice&name=${encodeURIComponent(id)}`;
  return fetchBlob(url);
}
