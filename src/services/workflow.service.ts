import type { Opportunity } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import {
  acceptOpportunity,
  getOpportunities,
  refuseOpportunity,
} from "@/services/opportunities.service";

/**
 * Service workflow de traitement des opportunités (côté Agence).
 *
 * // TODO backend: ce service semble redondant avec `opportunities.service.ts` —
 * // il n'y a pas de doctype/endpoint "Workflow" dédié côté `platform_core`.
 * // `opportunity.accept` / `opportunity.decline` / `opportunity.send_quote`
 * // couvrent déjà la progression d'une opportunité (Offre -> Acceptée -> Devis
 * // envoyé -> Gagnée/Perdue). On mappe donc ce service, au mieux, sur
 * // `opportunity.list_opportunities` pour la lecture, et sur les fonctions
 * // `opportunities.service.ts` déjà branchées pour l'avancement, sans créer de
 * // nouvel endpoint. À réévaluer avec le CDC : ce fichier pourrait être retiré
 * // au profit de `opportunities.service.ts` dans une passe ultérieure (hors
 * // scope ici : on garde les signatures exportées inchangées).
 */

export type WorkflowStep =
  "received" | "reviewed" | "quote_sent" | "awaiting_client" | "won" | "lost";

export interface WorkflowStage {
  id: string;
  step: WorkflowStep;
  label: string;
  count: number;
  slaHours: number | null;
}

const STEP_LABELS: Record<WorkflowStep, string> = {
  received: "Reçues",
  reviewed: "Étudiées",
  quote_sent: "Devis envoyé",
  awaiting_client: "En attente client",
  won: "Gagnées",
  lost: "Perdues",
};

/** Tab `opportunity.list_opportunities` la plus proche de chaque étape de workflow. */
const STEP_TO_TAB: Record<WorkflowStep, string> = {
  received: "Offres",
  reviewed: "Offres",
  quote_sent: "Offres",
  awaiting_client: "Offres",
  won: "Gagnées",
  lost: "Archivées",
};

/**
 * // API CALL : frappeCall("opportunity.list_opportunities", { tab: "Offres" })
 * // approximation : les compteurs par étape de workflow sont dérivés des
 * // `counts` renvoyés par `list_opportunities` (mapping best-effort tab -> étape).
 */
export async function getWorkflowStages(): Promise<WorkflowStage[]> {
  const raw = await frappeCall<unknown>("opportunity.list_opportunities", {
    tab: "Offres",
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const counts = (data["counts"] ?? {}) as Record<string, number>;

  return (Object.keys(STEP_LABELS) as WorkflowStep[]).map((step) => ({
    id: step,
    step,
    label: STEP_LABELS[step],
    count: Number(counts[STEP_TO_TAB[step]] ?? 0),
    slaHours: null,
  }));
}

/**
 * // API CALL : frappeCall("opportunity.list_opportunities", { tab: <dérivé de step> })
 */
export async function getWorkflowItems(params?: {
  step?: WorkflowStep;
  query?: string;
  sort?: "recent" | "deadline";
  page?: number;
  pageSize?: number;
}): Promise<{
  items: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<string, number>;
}> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const tab = params?.step ? STEP_TO_TAB[params.step] : "Offres";

  const tabKeyEntry = Object.entries({
    offers: "Offres",
    won: "Gagnées",
    paused: "En pause",
    finished: "Terminées",
    archived: "Archivées",
    available: "Disponibles",
  }).find(([, backendValue]) => backendValue === tab);

  const result = await getOpportunities({
    tab: (tabKeyEntry?.[0] ?? "offers") as
      "offers" | "won" | "paused" | "finished" | "archived" | "available",
    page,
    pageSize,
  });

  return {
    items: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages,
    counts: result.counts,
  };
}

/**
 * // TODO backend: pas d'endpoint "advance" générique. On mappe au mieux vers
 * // `opportunity.accept` / `opportunity.decline` selon `toStep`. Les étapes
 * // intermédiaires (quote_sent, awaiting_client) n'ont pas d'action dédiée
 * // distincte de `sendQuote` côté `opportunities.service.ts` — cette fonction
 * // reste donc partielle, à utiliser avec prudence.
 */
export async function advanceWorkflowItem(
  id: string,
  payload: { toStep: WorkflowStep; note?: string },
): Promise<{ id: string; step: WorkflowStep }> {
  if (payload.toStep === "won" || payload.toStep === "reviewed") {
    await acceptOpportunity(id);
    return { id, step: payload.toStep };
  }
  if (payload.toStep === "lost") {
    await refuseOpportunity(id);
    return { id, step: payload.toStep };
  }
  throw new Error(
    `advanceWorkflowItem : pas d'action backend connue pour l'étape "${payload.toStep}" (TODO backend, voir workflow.service.ts)`,
  );
}
