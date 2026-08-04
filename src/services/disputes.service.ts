import type { HistoryEntry } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/** Service litiges & suspensions. */

export type SuspensionCategory = "amicable" | "dispute";

export interface SuspensionRequestPayload {
  projectId: string;
  reason: string;
  category: SuspensionCategory;
}

const CATEGORY_MAP: Record<SuspensionCategory, string> = {
  amicable: "Suspension amiable",
  dispute: "Litige",
};

/**
 * // API CALL : frappeCall("project.request_suspension", { project, category, justification })
 */
export async function requestSuspension(
  payload: SuspensionRequestPayload,
): Promise<{ requestId: string; status: "under_review" }> {
  const raw = await frappeCall<unknown>("project.request_suspension", {
    project: payload.projectId,
    category: CATEGORY_MAP[payload.category] ?? "Suspension amiable",
    justification: payload.reason,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    requestId: String(data["requestId"] ?? data["name"] ?? ""),
    status: "under_review",
  };
}

/**
 * // API CALL :
 * //  - côté agence : frappeCall("opportunity.report_inactivity", { project: projectId, message: reason })
 * //  - côté client : frappeCall("project.report_agency_inactivity", { project: projectId, message: reason })
 * // TODO backend: `project.report_agency_inactivity` est un endpoint supposé
 * // ajouté par un autre agent en parallèle sur `platform_core` (non vérifiable
 * // depuis ce workspace) — si l'appel échoue en test réel (404/endpoint
 * // inconnu), c'est le signe qu'il n'a pas encore été livré côté backend.
 * // Le rôle courant est lu depuis `useAuthStore` pour choisir le bon endpoint.
 */
export async function reportProblem(
  projectId: string,
  reason: string,
): Promise<{ reportId: string; status: "sent" }> {
  const role = useAuthStore.getState().role;
  const method =
    role === "agency" ? "opportunity.report_inactivity" : "project.report_agency_inactivity";
  const raw = await frappeCall<unknown>(method, { project: projectId, message: reason });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    reportId: String(data["reportId"] ?? data["name"] ?? ""),
    status: "sent",
  };
}

/**
 * // API CALL : frappeCall("project.get_dispute", { project: projectId })
 */
export async function getDispute(projectId: string): Promise<{
  status: string;
  statusLabel: string;
  history: HistoryEntry[];
}> {
  const raw = await frappeCall<unknown>("project.get_dispute", { project: projectId });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    status: String(data["status"] ?? ""),
    statusLabel: String(data["statusLabel"] ?? data["status"] ?? ""),
    history: Array.isArray(data["history"]) ? (data["history"] as HistoryEntry[]) : [],
  };
}

/**
 * // API CALL : frappeCall("project.relaunch_search", { project: projectId })
 */
export async function relaunchAgencySearch(projectId: string): Promise<{ projectId: string }> {
  const raw = await frappeCall<unknown>("project.relaunch_search", { project: projectId });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { projectId: String(data["project"] ?? projectId) };
}

/**
 * // API CALL : frappeCall("project.signal_ready", { project: projectId })
 * (bouton "Signaler que je suis prêt" affiché côté page agence, hors périmètre
 * de cet agent — cette fonction est appelée depuis là-bas.)
 */
export async function signalReady(projectId: string): Promise<{ notified: boolean }> {
  const raw = await frappeCall<unknown>("project.signal_ready", { project: projectId });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { notified: Boolean(data["notified"] ?? true) };
}
