import type { Agency, AgencyProfile, HistoryEntry, PaginatedResponse, Project } from "@/lib/types";
import { camelizeKeys, frappeCall, restCall } from "@/services/http";
import { mapProject } from "@/services/projects.service";

/** Service agences. */

export interface AgencySearchParams {
  query?: string;
  category?: string;
  subCategory?: string;
  sort?: "relevance" | "rating" | "recent";
  page?: number;
  pageSize?: number;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * Traduit une agence Frappe (snake_case) vers le type `Agency` (camelCase).
 * // TODO backend: forme exacte des champs non documentée précisément — mapping
 * // best-effort sur les noms les plus probables (name/agency_name, location,
 * // description, rating, reviews_count, matching_score).
 */
function mapAgency(raw: unknown): Agency {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const name = String(data["agencyName"] ?? data["name"] ?? "");
  return {
    id: String(data["id"] ?? data["agency"] ?? data["name"] ?? ""),
    name,
    logoText: String(data["logoText"] ?? initialsFromName(name)),
    location: String(data["location"] ?? ""),
    description: String(data["description"] ?? ""),
    rating: Number(data["rating"] ?? 0),
    reviewsCount: Number(data["reviewsCount"] ?? 0),
    matchingScore:
      data["matchingScore"] !== undefined && data["matchingScore"] !== null
        ? Number(data["matchingScore"])
        : null,
  };
}

/**
 * // API CALL : frappeCall("agency.list_agencies", { query, category, location, page, page_size })
 * // (allow_guest côté backend)
 */
export async function searchAgencies(
  params: AgencySearchParams,
): Promise<PaginatedResponse<Agency> & { foundCount: number }> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const raw = await frappeCall<unknown>("agency.list_agencies", {
    query: params.query,
    category: params.category,
    location: params.subCategory,
    page,
    page_size: pageSize,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const results = (data["results"] ??
    data["items"] ??
    (Array.isArray(raw) ? raw : [])) as unknown[];
  const items = results.map((item) => mapAgency(item));
  const total = Number(data["total"] ?? items.length);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    foundCount: total,
  };
}

/**
 * // API CALL : frappeCall("agency.get_profile", { agency: id }) — allow_guest
 */
export async function getAgency(id: string): Promise<Agency> {
  const raw = await frappeCall<unknown>("agency.get_profile", { agency: id });
  return mapAgency(raw);
}

/**
 * // API CALL : restCall('matching', `/${projectId}/shortlist`, { method: 'GET' })
 * // ROUTAGE : `microservices/matching-service/.../MatchingController.java` monte
 * // `@RequestMapping("/api/matching")` et le Gateway route `/api/matching/**` en
 * // passthrough (sans réécriture) — `restCall("matching", path)` préfixe déjà
 * // `/api/matching`, `path` ne doit donc pas le répéter (sinon 404 : le chemin
 * // serait doublé en `/api/matching/api/matching/...`). Corrigé ici — la version
 * // précédente de cette fonction avait le même bug que celui trouvé et corrigé
 * // dans `briefing.service.ts` pour `ia-service`.
 */
export async function getProjectShortlist(projectId: string): Promise<Agency[]> {
  const raw = await restCall<unknown>("matching", `/${projectId}/shortlist`, {
    method: "GET",
  });
  const list = (
    Array.isArray(raw) ? raw : (camelizeKeys(raw) as Record<string, unknown>)["shortlist"]
  ) as unknown[] | undefined;
  return (list ?? []).map((item) => mapAgency(item));
}

/**
 * // API CALL :
 * //  - si `brief` est fourni : frappeCall("quick_actions.send_multicast", { project: projectId, agencies: JSON.stringify(agencyIds) })
 * //    (Multicast avec formulaire personnalisé)
 * //  - sinon : boucle frappeCall("quick_actions.contact_from_shortlist", { project: projectId, agency: id })
 * //    pour chaque agence (envoi direct depuis la Shortlist)
 */
export async function contactAgencies(
  projectId: string,
  agencyIds: string[],
  brief: unknown,
): Promise<{ sentCount: number }> {
  if (brief !== undefined && brief !== null) {
    const raw = await frappeCall<unknown>("quick_actions.send_multicast", {
      project: projectId,
      agencies: JSON.stringify(agencyIds),
      brief,
    });
    const data = camelizeKeys(raw) as Record<string, unknown>;
    return { sentCount: Number(data["sentCount"] ?? agencyIds.length) };
  }

  let sentCount = 0;
  for (const agencyId of agencyIds) {
    await frappeCall<unknown>("quick_actions.contact_from_shortlist", {
      project: projectId,
      agency: agencyId,
    });
    sentCount += 1;
  }
  return { sentCount };
}

/**
 * // API CALL : frappeCall("agency.my_agencies")
 */
export async function getMyAgencies(): Promise<
  Array<{
    id: string;
    initials: string;
    name: string;
    tagline: string;
    membership: "owner" | "member";
  }>
> {
  const raw = await frappeCall<unknown>("agency.my_agencies");
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list.map((item) => {
    const data = camelizeKeys(item) as Record<string, unknown>;
    const name = String(data["agencyName"] ?? data["name"] ?? "");
    const membership = String(data["membership"] ?? data["role"] ?? "").toLowerCase();
    return {
      id: String(data["id"] ?? data["name"] ?? ""),
      initials: String(data["initials"] ?? initialsFromName(name)),
      name,
      tagline: String(data["tagline"] ?? data["slogan"] ?? ""),
      membership: membership === "owner" ? "owner" : "member",
    };
  });
}

/**
 * // API CALL : frappeCall("agency.join_request", { agency: id })
 */
export async function requestToJoinAgency(id: string): Promise<{ requested: boolean }> {
  const raw = await frappeCall<unknown>("agency.join_request", { agency: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { requested: Boolean(data["requested"] ?? true) };
}

/**
 * Version "riche" de `getAgency`, pour le profil public complet
 * (`agences.$id.tsx`) : `agency.get_profile` (allow_guest, vérifié en lisant
 * `platform_core/platform_core/api/agency.py`) renvoie `doc.as_dict()` en
 * entier — y compris les tables enfants (`services`/`portfolio`/`team`/
 * `certifications`) que `mapAgency`/`getAgency` (ci-dessus, utilisé par les
 * cartes de résultats de recherche) ignorent volontairement pour rester
 * léger. Fonction additive, ne remplace pas `getAgency`.
 * // API CALL : frappeCall("agency.get_profile", { agency: id }) — allow_guest
 */
export async function getAgencyProfile(id: string): Promise<Agency & Partial<AgencyProfile>> {
  const raw = await frappeCall<unknown>("agency.get_profile", { agency: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const base = mapAgency(raw);

  return {
    ...base,
    foundedYear: String(data["yearFounded"] ?? ""),
    teamSize: String(data["teamSize"] ?? ""),
    website: String(data["website"] ?? ""),
    languages: Array.isArray(data["languages"]) ? (data["languages"] as string[]) : [],
    remoteWork: Boolean(data["remoteWork"] ?? false),
    legalIdValue: String(data["legalId"] ?? ""),
    legalIdValid: Boolean(data["legalIdVerified"] ?? false),
    techStack: Array.isArray(data["techStack"]) ? (data["techStack"] as string[]) : [],
    skills: Array.isArray(data["skills"]) ? (data["skills"] as string[]) : [],
    phoneCountryCode: String(data["phoneCountryCode"] ?? ""),
    phone: String(data["phone"] ?? ""),
    email: String(data["email"] ?? ""),
    address: String(data["address"] ?? data["location"] ?? ""),
    logo: (data["logo"] as string | null | undefined) ?? undefined,
    slogan: (data["slogan"] as string | undefined) ?? undefined,
    coverImage: (data["coverImage"] as string | null | undefined) ?? undefined,
    services: Array.isArray(data["services"]) ? (data["services"] as string[]) : undefined,
    portfolio: Array.isArray(data["portfolio"])
      ? (data["portfolio"] as AgencyProfile["portfolio"])
      : undefined,
    team: Array.isArray(data["team"]) ? (data["team"] as AgencyProfile["team"]) : undefined,
    certifications: Array.isArray(data["certifications"])
      ? (data["certifications"] as string[])
      : undefined,
  };
}

export interface AgencyReview {
  id: string;
  authorInitials: string;
  authorName: string;
  rating: number;
  comment: string;
  publishedAt: string;
}

/**
 * // API CALL : frappeCall("review.list_agency_reviews", { agency: id, page, page_size }) — allow_guest
 * // TODO backend: `AgencyReview` (cf. `platform_core/platform_core/api/review.py`)
 * // n'expose ni auteur ni initiales (avis internalisés/anonymisés côté
 * // plateforme, cf. CDC "anti-faux-avis") — `authorName`/`authorInitials`
 * // n'ont donc pas de source réelle : affichés en "Client vérifié" plutôt que
 * // fabriqués.
 */
export async function listAgencyReviews(
  id: string,
  page = 1,
  pageSize = 10,
): Promise<AgencyReview[]> {
  const raw = await frappeCall<unknown>("review.list_agency_reviews", {
    agency: id,
    page,
    page_size: pageSize,
  });
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list.map((item, index) => {
    const data = camelizeKeys(item) as Record<string, unknown>;
    return {
      id: String(data["name"] ?? index),
      authorInitials: "CV",
      authorName: "Client vérifié",
      rating: Number(data["rating"] ?? 0),
      comment: String(data["comment"] ?? ""),
      publishedAt: String(data["creation"] ?? ""),
    };
  });
}

/**
 * Flux Unicast (CDC §1.5.4) : contact direct d'une agence depuis son profil
 * public, avec un formulaire dynamique Projet/Stage/Job. Pas de fonction
 * unique côté backend pour ça : `quick_actions.start_contact` crée un
 * `Project` brouillon (et génère un CDC preview, cf.
 * `platform_core/platform_core/api/quick_actions.py::start_contact`), puis
 * `quick_actions.send_unicast` le poste et crée l'`Opportunity` vers
 * l'agence ciblée. Réservé aux clients connectés
 * (`require_user_type("client")` côté backend) — un appel sans token
 * échouera en 401, intercepté globalement par `services/http.ts`.
 * // API CALL : frappeCall("quick_actions.start_contact", { need_type, ...fields })
 * // API CALL : frappeCall("quick_actions.send_unicast", { project, agency })
 */
export async function contactAgencyUnicast(
  agencyId: string,
  payload: {
    needType: "Projet" | "Stage" | "Job";
    title?: string;
    description: string;
    category?: string;
    budgetMin?: number;
    budgetMax?: number;
    location?: string;
  },
): Promise<{ projectId: string; opportunityId: string }> {
  const draft = await frappeCall<unknown>("quick_actions.start_contact", {
    need_type: payload.needType,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    budget_min: payload.budgetMin,
    budget_max: payload.budgetMax,
    location: payload.location,
  });
  const draftData = camelizeKeys(draft) as Record<string, unknown>;
  const projectId = String(draftData["name"] ?? draftData["id"] ?? "");

  const sent = await frappeCall<unknown>("quick_actions.send_unicast", {
    project: projectId,
    agency: agencyId,
  });
  const sentData = camelizeKeys(sent) as Record<string, unknown>;

  return {
    projectId: String(sentData["project"] ?? projectId),
    opportunityId: String(sentData["opportunity"] ?? ""),
  };
}

/**
 * // API CALL : frappeCall("agency.toggle_project_favorite", { project })
 * Bascule le statut favori d'un projet public pour l'agence active — utilisé
 * par le bouton "Enregistrer" de `routes/projets.tsx`.
 */
export async function toggleProjectFavorite(projectId: string): Promise<{ favorited: boolean }> {
  const raw = await frappeCall<unknown>("agency.toggle_project_favorite", { project: projectId });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { favorited: Boolean(data["favorited"] ?? false) };
}

/**
 * // API CALL : frappeCall("agency.list_favorite_projects")
 */
export async function listFavoriteProjects(): Promise<Project[]> {
  const raw = await frappeCall<unknown>("agency.list_favorite_projects", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list.map((item) => mapProject(item));
}

export interface SubCategoryOption {
  id: string;
  name: string;
  categoryId: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string | null;
  subCategories: SubCategoryOption[];
}

/**
 * // API CALL : frappeCall("utils.get_categories") — allow_guest
 * Taxonomie catégories/sous-catégories (`ServiceCategory`/`ServiceSubCategory`),
 * réutilisée pour les filtres réels de `routes/projets.tsx` (catégorie/
 * sous-catégorie, auparavant en texte libre faute d'endpoint identifié).
 */
export async function getCategories(): Promise<CategoryOption[]> {
  const raw = await frappeCall<unknown>("utils.get_categories", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list.map((item) => {
    const data = camelizeKeys(item) as Record<string, unknown>;
    const subCategoriesRaw = Array.isArray(data["subCategories"])
      ? (data["subCategories"] as unknown[])
      : [];
    return {
      id: String(data["name"] ?? ""),
      name: String(data["categoryName"] ?? ""),
      icon: (data["icon"] as string | null | undefined) ?? null,
      subCategories: subCategoriesRaw.map((sub) => {
        const subData = camelizeKeys(sub) as Record<string, unknown>;
        return {
          id: String(subData["name"] ?? ""),
          name: String(subData["subCategoryName"] ?? ""),
          categoryId: String(subData["category"] ?? ""),
        };
      }),
    };
  });
}

/**
 * Une opportunité "récente" telle que renvoyée par `agency.get_dashboard`
 * (`recent_opportunities`) — forme allégée (jointure SQL brute côté backend :
 * `opportunity`/`status`/`matching_score`/`creation`/`project`/`title`/
 * `budget_min`/`budget_max`), différente du type `Opportunity` complet de
 * `opportunities.service.ts` (pas de nom de client, pas d'étape libellée).
 */
export interface AgencyDashboardOpportunity {
  id: string;
  projectId: string;
  projectTitle: string;
  status: string;
  matchingScore: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  publishedAt: string;
}

const AGENCY_ACTIVITY_LABELS: Record<string, string> = {
  "Profile View": "Consultation du profil",
  "Website Click": "Clic vers votre site",
  "Search Impression": "Impression dans les résultats de recherche",
};

/**
 * `agency.get_dashboard` alimente "Activités récentes" à partir du doctype
 * `AgencyActivity` (suivi analytics : vues de profil / clics site / impressions
 * de recherche — pas un journal d'activité métier générique). Les entrées ne
 * portent pas d'identifiant propre (`name` non exposé par l'endpoint) : on
 * synthétise un id stable à partir de l'index.
 */
function mapAgencyActivity(raw: unknown, index: number): HistoryEntry {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const eventType = String(data["eventType"] ?? "");
  return {
    id: `agency-activity-${index}`,
    date: String(data["createdDate"] ?? data["creation"] ?? ""),
    title: AGENCY_ACTIVITY_LABELS[eventType] ?? (eventType || "Activité"),
    description: "",
  };
}

export interface AgencyDashboardOverview {
  pqiScore: number;
  openOpportunitiesCount: number;
  inProgressCount: number;
  averageClientRating: number;
  recentOpportunities: AgencyDashboardOpportunity[];
  recentActivity: HistoryEntry[];
}

/**
 * // API CALL : frappeCall("agency.get_dashboard")
 * Agrégat dédié au tableau de bord Agence en un seul appel — remplace la
 * composition précédente de `agence.tableau-de-bord.tsx` (`profile.service.ts
 * ::getAgencyDashboard` + `getAgencyProjects` juste pour dériver les stats).
 */
export async function getAgencyDashboardOverview(): Promise<AgencyDashboardOverview> {
  const raw = await frappeCall<unknown>("agency.get_dashboard", {});
  const data = camelizeKeys(raw) as Record<string, unknown>;

  const recentOpportunitiesList = (
    Array.isArray(data["recentOpportunities"]) ? data["recentOpportunities"] : []
  ) as unknown[];
  const recentActivityList = (
    Array.isArray(data["recentActivity"]) ? data["recentActivity"] : []
  ) as unknown[];

  return {
    pqiScore: Number(data["pqiScore"] ?? 0),
    openOpportunitiesCount: Number(data["openOpportunitiesCount"] ?? 0),
    inProgressCount: Number(data["inProgressCount"] ?? 0),
    averageClientRating: Number(data["averageClientRating"] ?? 0),
    recentOpportunities: recentOpportunitiesList.map((entry) => {
      const item = camelizeKeys(entry) as Record<string, unknown>;
      return {
        id: String(item["opportunity"] ?? ""),
        projectId: String(item["project"] ?? ""),
        projectTitle: String(item["title"] ?? ""),
        status: String(item["status"] ?? ""),
        matchingScore: item["matchingScore"] !== undefined ? Number(item["matchingScore"]) : null,
        budgetMin: item["budgetMin"] !== undefined ? Number(item["budgetMin"]) : null,
        budgetMax: item["budgetMax"] !== undefined ? Number(item["budgetMax"]) : null,
        publishedAt: String(item["creation"] ?? ""),
      };
    }),
    recentActivity: recentActivityList.map((entry, index) => mapAgencyActivity(entry, index)),
  };
}
