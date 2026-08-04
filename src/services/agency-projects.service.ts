import type { PaginatedResponse, Project } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import { mapProject } from "@/services/projects.service";

/** Service projets côté Agence (projets en cours, suspensions, signalements). */

export interface AgencyProjectFilters {
  query?: string;
  status?: string;
  client?: string;
  period?: string;
  sort?: "recent" | "deadline" | "budget";
  page?: number;
  pageSize?: number;
}

export interface SuspensionCase {
  id: string;
  projectTitle: string;
  clientName: string;
  reason: string;
  category: "amicable" | "dispute";
  status: string;
  statusLabel: string;
  openedAt: string;
  moderator: string | null;
}

/**
 * // API CALL : frappeCall("opportunity.list_opportunities", { tab: "Gagnées", ...filters })
 * // Les projets "en cours" côté agence sont modélisés comme des opportunités
 * // au statut Gagnées/En cours (pas de doctype/endpoint "AgencyProject" séparé).
 * // `query`/`client`/`period`/`sort` sont désormais des paramètres confirmés de
 * // `opportunity.list_opportunities` (en plus de budget_min/budget_max/location/
 * // sub_category/need_type) — transmis tels quels.
 * // TODO backend: chaque opportunité référence un projet (`project`) mais on ne
 * // sait pas si la réponse embarque l'objet Project complet ou juste son id —
 * // on tente d'abord `item.project` s'il ressemble à un objet, sinon on mappe
 * // l'opportunité elle-même comme un Project (perte probable de champs).
 */
export async function getAgencyProjects(
  filters?: AgencyProjectFilters,
): Promise<PaginatedResponse<Project> & { counts: Record<string, number> }> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const raw = await frappeCall<unknown>("opportunity.list_opportunities", {
    tab: "Gagnées",
    query: filters?.query,
    status: filters?.status,
    client: filters?.client,
    period: filters?.period,
    sort: filters?.sort,
    page,
    page_size: pageSize,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const list = (Array.isArray(raw) ? raw : (data["results"] ?? data["items"] ?? [])) as unknown[];

  const items = list.map((entry) => {
    const camelized = camelizeKeys(entry) as Record<string, unknown>;
    const nestedProject = camelized["project"];
    const source =
      nestedProject !== null && typeof nestedProject === "object" ? nestedProject : camelized;
    return mapProject(source);
  });

  const counts = (data["counts"] ?? {}) as Record<string, number>;

  return {
    items,
    page,
    pageSize,
    total: items.length,
    totalPages: 1,
    counts,
  };
}

/**
 * Traduit un dossier `ProjectSuspension` (`opportunity.list_suspensions`,
 * champs `id/project_title/client_name/reason/category/status/status_label/
 * opened_at/moderator`) vers `SuspensionCase`. `category` backend est en
 * français ("Suspension amiable" / "Litige") — traduit vers l'union
 * `"amicable" | "dispute"` utilisée par le frontend.
 */
function mapSuspensionCase(raw: unknown): SuspensionCase {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const rawCategory = String(data["category"] ?? "").toLowerCase();
  const category: SuspensionCase["category"] = rawCategory.includes("litige")
    ? "dispute"
    : "amicable";

  return {
    id: String(data["id"] ?? data["name"] ?? ""),
    projectTitle: String(data["projectTitle"] ?? ""),
    clientName: String(data["clientName"] ?? ""),
    reason: String(data["reason"] ?? ""),
    category,
    status: String(data["status"] ?? ""),
    statusLabel: String(data["statusLabel"] ?? data["status"] ?? ""),
    openedAt: String(data["openedAt"] ?? ""),
    moderator: (data["moderator"] as string | null | undefined) ?? null,
  };
}

/**
 * Statuts `ProjectSuspension` considérés "clôturés" côté UI (onglet
 * "Clôturés") — le doctype n'a pas de statut `Closed` littéral, seulement des
 * issues terminales (cf. `projectsuspension.json` : Requested/Validated sont
 * en cours, les 4 autres sont terminales).
 */
const CLOSED_SUSPENSION_STATUSES = new Set(["Refused", "Resumed", "Founded", "Not Founded"]);

function isClosedSuspensionStatus(status: string): boolean {
  return CLOSED_SUSPENSION_STATUSES.has(status);
}

/**
 * // API CALL : frappeCall("opportunity.list_suspensions")
 * `opportunity.list_suspensions(tab?)` existe côté backend mais son `tab`
 * filtre sur le champ `status` brut (Requested/Validated/Refused/...), pas sur
 * le regroupement "amicable/dispute/closed" utilisé par les onglets de
 * `agence.suspension.tsx` — on récupère donc la liste complète (sans `tab`) et
 * on filtre/pagine/compte côté client, comme pour `notifications.service.ts`.
 * `period`/`sort` ne sont pas des paramètres de cet endpoint : tri par défaut
 * (plus récent en premier) appliqué côté client, `period` ignoré (aucun champ
 * de filtre période reçu de l'écran suspension actuellement).
 */
export async function getSuspensionCases(filters?: {
  query?: string;
  status?: string;
  period?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<SuspensionCase> & { counts: Record<string, number> }> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;

  const raw = await frappeCall<unknown>("opportunity.list_suspensions", {});
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const list = (Array.isArray(raw) ? raw : (data["results"] ?? data["items"] ?? [])) as unknown[];
  const allCases = list.map((entry) => mapSuspensionCase(entry));

  const counts: Record<string, number> = {
    all: allCases.length,
    amicable: allCases.filter((item) => item.category === "amicable").length,
    dispute: allCases.filter((item) => item.category === "dispute").length,
    closed: allCases.filter((item) => isClosedSuspensionStatus(item.status)).length,
  };

  let items = allCases;
  const activeTab = filters?.status;
  if (activeTab && activeTab !== "all") {
    items =
      activeTab === "closed"
        ? items.filter((item) => isClosedSuspensionStatus(item.status))
        : items.filter((item) => item.category === activeTab);
  }
  if (filters?.query) {
    const normalizedQuery = filters.query.trim().toLowerCase();
    items = items.filter((item) =>
      `${item.projectTitle} ${item.clientName} ${item.reason}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }
  items = [...items].sort((a, b) => (a.openedAt < b.openedAt ? 1 : -1));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  return {
    items: pagedItems,
    page,
    pageSize,
    total,
    totalPages,
    counts,
  };
}

/**
 * // API CALL : frappeCall("opportunity.get_suspension_history", { suspension: id })
 */
export async function getSuspensionHistory(
  id: string,
): Promise<Array<{ id: string; date: string; title: string; description: string }>> {
  if (!id) return [];
  const raw = await frappeCall<unknown>("opportunity.get_suspension_history", { suspension: id });
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list.map((entry) => {
    const data = camelizeKeys(entry) as Record<string, unknown>;
    return {
      id: String(data["id"] ?? data["name"] ?? ""),
      date: String(data["date"] ?? ""),
      title: String(data["title"] ?? ""),
      description: String(data["description"] ?? ""),
    };
  });
}

/**
 * // API CALL : frappeCall("opportunity.respond_to_suspension", { suspension: id, message, evidence_ids })
 */
export async function respondToSuspension(
  id: string,
  payload: { message: string; evidenceIds?: string[] },
): Promise<{ id: string; status: string }> {
  const raw = await frappeCall<unknown>("opportunity.respond_to_suspension", {
    suspension: id,
    message: payload.message,
    evidence_ids: payload.evidenceIds,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    id: String(data["id"] ?? id),
    status: String(data["status"] ?? "responded"),
  };
}
