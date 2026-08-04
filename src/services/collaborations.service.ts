import type { Collaboration, PaginatedResponse } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";

/**
 * Service collaborations (espace Client).
 *
 * NOTE : `profile.service.ts` expose aussi `getCollaborations` /
 * `submitCollaborationReview` (doublon volontaire, voir consigne) — les deux
 * fichiers pointent vers les mêmes appels réseau ci-dessous (voir `mapCollaboration`,
 * réutilisé par `profile.service.ts`).
 */

export interface CollaborationSearchParams {
  query?: string;
  agency?: string;
  period?: string;
  rating?: string;
  sort?: "recent" | "rating" | "budget";
  page?: number;
  pageSize?: number;
}

/**
 * Traduit une collaboration Frappe (snake_case) vers `Collaboration` (camelCase).
 * // TODO backend: forme exacte des champs non documentée précisément — mapping
 * // best-effort (agency_name/agency, rating, finished_projects_count, period,
 * // budget, review/comment, reviewer_rating).
 */
export function mapCollaboration(raw: unknown): Collaboration {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const agencyName = String(data["agencyName"] ?? data["agency"] ?? "");
  const initials = agencyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id: String(data["id"] ?? data["name"] ?? data["project"] ?? ""),
    agencyInitials: String(data["agencyInitials"] ?? initials),
    agencyName,
    agencyTagline: String(data["agencyTagline"] ?? data["slogan"] ?? ""),
    ratingReceived: Number(data["ratingReceived"] ?? data["rating"] ?? 0),
    finishedProjects: String(data["finishedProjects"] ?? data["finishedProjectsCount"] ?? ""),
    period: String(data["period"] ?? ""),
    budget: String(data["budget"] ?? ""),
    publicReview: String(data["publicReview"] ?? data["comment"] ?? ""),
    reviewLength: Number(
      data["reviewLength"] ?? String(data["publicReview"] ?? data["comment"] ?? "").length,
    ),
    yourRating: Number(data["yourRating"] ?? data["rating"] ?? 0),
  };
}

/**
 * // API CALL : frappeCall("client.list_collaborations")
 */
export async function getCollaborations(
  params?: CollaborationSearchParams,
): Promise<PaginatedResponse<Collaboration>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const raw = await frappeCall<unknown>("client.list_collaborations", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  const items = list.map((item) => mapCollaboration(item));

  return {
    items,
    page,
    pageSize,
    total: items.length,
    totalPages: 1,
  };
}

/**
 * Détail d'une collaboration (agence + projets partagés + avis éventuel).
 * // API CALL : frappeCall("client.get_collaboration", { collaboration_id })
 * // `collaboration_id` = nom de l'AgencyProfile concernée (voir contrat backend).
 * // TODO backend: forme exacte de `agency`/`projects` non documentée
 * // précisément — mapping best-effort vers `Collaboration` ci-dessous (voir
 * // `getCollaborationDetail` pour la forme brute complète si un appelant a
 * // besoin des projets liés plutôt que du seul résumé `Collaboration`).
 */
export async function getCollaboration(id: string): Promise<Collaboration> {
  const detail = await getCollaborationDetail(id);
  const agency = detail.agency;
  const agencyName = String(agency["agencyName"] ?? agency["name"] ?? "");
  const initials = agencyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id,
    agencyInitials: String(agency["agencyInitials"] ?? initials),
    agencyName,
    agencyTagline: String(agency["slogan"] ?? agency["agencyTagline"] ?? ""),
    ratingReceived: Number(agency["rating"] ?? 0),
    finishedProjects: String(detail.projects.length),
    period: String(agency["period"] ?? ""),
    budget: String(agency["budget"] ?? ""),
    publicReview: detail.review?.comment ?? "",
    reviewLength: detail.review?.comment.length ?? 0,
    yourRating: detail.review?.rating ?? 0,
  };
}

/**
 * Forme brute (non aplatie) de `client.get_collaboration`, exposée pour les
 * appelants qui ont besoin des projets liés / de l'avis complet plutôt que du
 * seul résumé `Collaboration`.
 */
export interface CollaborationDetail {
  agency: Record<string, unknown>;
  projects: unknown[];
  review: { rating: number; comment: string } | null;
}

export async function getCollaborationDetail(id: string): Promise<CollaborationDetail> {
  const raw = await frappeCall<unknown>("client.get_collaboration", { collaboration_id: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const review = data["review"] as Record<string, unknown> | null;
  return {
    agency: (data["agency"] ?? {}) as Record<string, unknown>,
    projects: Array.isArray(data["projects"]) ? (data["projects"] as unknown[]) : [],
    review: review
      ? { rating: Number(review["rating"] ?? 0), comment: String(review["comment"] ?? "") }
      : null,
  };
}

/**
 * // API CALL : frappeCall("review.submit_agency_review", { project: id, rating, comment: publicReview })
 */
export async function submitCollaborationReview(
  id: string,
  payload: { rating: number; publicReview: string },
): Promise<Collaboration> {
  const raw = await frappeCall<unknown>("review.submit_agency_review", {
    project: id,
    rating: payload.rating,
    comment: payload.publicReview,
  });
  return mapCollaboration(raw);
}
