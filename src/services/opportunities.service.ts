import type { Opportunity, PaginatedResponse, Project } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import { mapProject } from "@/services/projects.service";

/** Service opportunités (côté Agence). */

export type OpportunityTab = "offers" | "won" | "paused" | "finished" | "archived" | "available";

export interface OpportunityFilters {
  tab: OpportunityTab;
  budget?: string;
  location?: string;
  publishedAt?: string;
  subCategory?: string;
  needType?: string;
  page?: number;
  pageSize?: number;
}

const TAB_TO_BACKEND: Record<OpportunityTab, string> = {
  offers: "Offres",
  won: "Gagnées",
  paused: "En pause",
  finished: "Terminées",
  archived: "Archivées",
  available: "Disponibles",
};

const STEP_LABELS: Record<string, string> = {
  offers: "Nouvelle offre",
  won: "Gagné",
  paused: "En pause",
  finished: "Terminé",
  archived: "Archivé",
  available: "Disponible",
};

function mapStepFromStatus(rawStatus: unknown): string {
  const value = String(rawStatus ?? "")
    .trim()
    .toLowerCase();
  const entry = Object.entries(TAB_TO_BACKEND).find(
    ([, backendValue]) => backendValue.toLowerCase() === value,
  );
  return entry ? entry[0] : value || "offers";
}

/**
 * Traduit une `Opportunity` Frappe (snake_case) vers le type `Opportunity`
 * (camelCase) du frontend.
 * // TODO backend: forme exacte des champs "d'affichage" (companyInitials,
 * // companyName, projectTitle, category, quoteAmount, remainingHours) non
 * // confirmée — best-effort à partir des champs probables / du projet lié.
 */
function mapOpportunity(raw: unknown): Opportunity {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const step = mapStepFromStatus(data["status"]);
  const companyName = String(data["companyName"] ?? data["clientName"] ?? "");

  return {
    // `list_opportunities` aliases Frappe's document name as `opportunity`.
    id: String(data["id"] ?? data["name"] ?? data["opportunity"] ?? ""),
    step,
    stepLabel: String(data["stepLabel"] ?? STEP_LABELS[step] ?? step),
    companyInitials: String(data["companyInitials"] ?? companyName.slice(0, 2).toUpperCase()),
    companyName,
    projectTitle: String(data["projectTitle"] ?? data["title"] ?? ""),
    budgetMin: data["budgetMin"] !== undefined ? Number(data["budgetMin"]) : null,
    budgetMax: data["budgetMax"] !== undefined ? Number(data["budgetMax"]) : null,
    location: String(data["location"] ?? ""),
    category: String(data["category"] ?? ""),
    relevance: Number(data["matchingScore"] ?? data["relevance"] ?? 0),
    publishedAt: String(data["publishedAt"] ?? data["creation"] ?? ""),
    quoteAmount:
      data["quoteAmount"] !== undefined && data["quoteAmount"] !== null
        ? Number(data["quoteAmount"])
        : null,
    remainingHours:
      data["remainingHours"] !== undefined && data["remainingHours"] !== null
        ? Number(data["remainingHours"])
        : null,
    project: (data["project"] as string | undefined) ?? undefined,
    agency: (data["agency"] as string | undefined) ?? undefined,
    successPrediction:
      data["successPrediction"] !== undefined ? Number(data["successPrediction"]) : undefined,
    source: (data["source"] as string | undefined) ?? undefined,
    acceptedOn: (data["acceptedOn"] as string | undefined) ?? undefined,
    archivedOn: (data["archivedOn"] as string | undefined) ?? undefined,
    archiveReason: (data["archiveReason"] as string | undefined) ?? undefined,
  };
}

/**
 * // API CALL : frappeCall("opportunity.list_opportunities", { tab, budget_min, budget_max, location, sub_category, need_type })
 */
export async function getOpportunities(
  filters: OpportunityFilters,
): Promise<PaginatedResponse<Opportunity> & { counts: Record<string, number> }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const [budgetMin, budgetMax] = (filters.budget ?? "").split("-");

  const raw = await frappeCall<unknown>("opportunity.list_opportunities", {
    tab: TAB_TO_BACKEND[filters.tab],
    budget_min: budgetMin || undefined,
    budget_max: budgetMax || undefined,
    location: filters.location,
    sub_category: filters.subCategory,
    need_type: filters.needType,
    page,
    page_size: pageSize,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const list = (Array.isArray(raw) ? raw : (data["results"] ?? data["items"] ?? [])) as unknown[];
  const items = list.map((item) => mapOpportunity(item));
  const counts = (data["counts"] ?? {}) as Record<string, number>;

  return {
    items,
    page,
    pageSize,
    total: Number(data["total"] ?? items.length),
    totalPages: 1,
    counts,
  };
}

/**
 * // API CALL : frappeCall("opportunity.accept", { opportunity: id })   (étape 1/2)
 */
export async function acceptOpportunity(id: string): Promise<{ status: string }> {
  const raw = await frappeCall<unknown>("opportunity.accept", { opportunity: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { status: String(data["status"] ?? "accepted_awaiting_quote") };
}

/**
 * // API CALL : frappeCall("opportunity.decline", { opportunity: id })
 */
export async function refuseOpportunity(id: string): Promise<{ status: string }> {
  const raw = await frappeCall<unknown>("opportunity.decline", { opportunity: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { status: String(data["status"] ?? "refused") };
}

/**
 * // API CALL : frappeCall("opportunity.send_quote", { opportunity: id, amount })   (étape 2/2)
 */
export async function sendQuote(
  id: string,
  amount: number,
): Promise<{ status: string; clientResponseDeadlineHours: number }> {
  const raw = await frappeCall<unknown>("opportunity.send_quote", {
    opportunity: id,
    amount,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    status: String(data["status"] ?? "quote_sent"),
    clientResponseDeadlineHours: Number(data["clientResponseDeadlineHours"] ?? 48),
  };
}

export interface OpportunityCdcResponse {
  project: Project;
  cdcUrl: string;
}

/**
 * // API CALL : frappeCall("opportunity.view_cdc", { opportunity: id })
 */
export async function getOpportunityCdc(id: string): Promise<OpportunityCdcResponse> {
  const raw = await frappeCall<unknown>("opportunity.view_cdc", { opportunity: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const nestedProject = data["project"];
  const project = mapProject(
    nestedProject !== null && typeof nestedProject === "object" ? nestedProject : data,
  );
  return {
    project,
    cdcUrl: String(data["cdcUrl"] ?? data["cdcFile"] ?? ""),
  };
}
