import { camelizeKeys, frappeCall, restCall } from "@/services/http";

/** Service Prospection IA — microservice `prospection-service` via le Gateway. */

export type LeadTemperature = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  initials: string;
  companyName: string;
  location: string;
  ipAddress: string;
  actions: string[];
  temperature: LeadTemperature;
  temperatureLabel: string;
  score: number;
}

const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  hot: "Chaud",
  warm: "Tiède",
  cold: "Froid",
};

function mapTemperature(raw: unknown): LeadTemperature {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (value === "hot" || value === "chaud") return "hot";
  if (value === "warm" || value === "tiède" || value === "tiede") return "warm";
  return "cold";
}

function mapLead(raw: unknown): Lead {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const companyName = String(data["companyName"] ?? "");
  const temperature = mapTemperature(data["classification"] ?? data["temperature"]);

  return {
    id: String(data["id"] ?? ""),
    initials: String(
      data["initials"] ??
        companyName
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join(""),
    ),
    companyName,
    location: String(data["location"] ?? ""),
    ipAddress: String(data["ipAddress"] ?? ""),
    actions: Array.isArray(data["actions"]) ? (data["actions"] as string[]) : [],
    temperature,
    temperatureLabel: String(data["temperatureLabel"] ?? TEMPERATURE_LABELS[temperature]),
    score: Number(data["score"] ?? 0),
  };
}

/**
 * // API CALL : restCall('prospection', '/leads', { method: 'GET', query: { classification, from, to } })
 * // TODO backend/frontend: la signature actuelle (`page`/`pageSize`/`temperature`)
 * // ne couvre pas les paramètres `from`/`to` (plage de dates) documentés côté
 * // backend — non exposés par l'appelant actuel, à ajouter si un filtre par
 * // date est requis. Les compteurs par température sont dérivés côté client
 * // (pas de `counters` confirmé dans la réponse brute).
 */
export async function getLeads(params?: {
  page?: number;
  pageSize?: number;
  temperature?: LeadTemperature;
}): Promise<{
  items: Lead[];
  counters: {
    hot: number;
    warm: number;
    cold: number;
    hotDelta: number;
    warmDelta: number;
    coldDelta: number;
  };
  hasMore: boolean;
}> {
  const raw = await restCall<unknown>("prospection", "/leads", {
    method: "GET",
    query: {
      classification: params?.temperature,
      page: params?.page,
      page_size: params?.pageSize,
    },
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const list = (
    Array.isArray(raw) ? raw : (data["leads"] ?? data["items"] ?? data["results"] ?? [])
  ) as unknown[];
  const items = list.map((item) => mapLead(item));

  const counters = {
    hot: items.filter((item) => item.temperature === "hot").length,
    warm: items.filter((item) => item.temperature === "warm").length,
    cold: items.filter((item) => item.temperature === "cold").length,
    hotDelta: 0,
    warmDelta: 0,
    coldDelta: 0,
  };

  return {
    items,
    counters,
    hasMore: Boolean(data["hasMore"] ?? false),
  };
}

/**
 * // API CALL : restCall('prospection', `/leads/${leadId}/generate-email`, { method: 'POST' })
 */
export async function generateProspectionEmail(
  leadId: string,
): Promise<{ subject: string; body: string }> {
  const raw = await restCall<unknown>("prospection", `/leads/${leadId}/generate-email`, {
    method: "POST",
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const draft = (data["draft"] ?? data) as Record<string, unknown>;
  return {
    subject: String(draft["subject"] ?? ""),
    body: String(draft["body"] ?? ""),
  };
}

/**
 * // API CALL : restCall('prospection', `/leads/${leadId}/send-email`, { method: 'POST', body: { subject, body } })
 * Envoie l'e-mail de prospection généré (ou édité) par l'agence à un lead.
 * Endpoint microservice ajouté par un autre agent en parallèle sur
 * `prospection-service` (non vérifiable depuis ce workspace) — voir consigne.
 */
export async function sendProspectionEmail(
  leadId: string,
  payload: { subject: string; body: string },
): Promise<{ sent: boolean }> {
  const raw = await restCall<unknown>("prospection", `/leads/${leadId}/send-email`, {
    method: "POST",
    body: payload,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { sent: Boolean(data["sent"] ?? true) };
}

export interface ProspectionSettings {
  scoring: {
    hotMin: number;
    warmMin: number;
  };
}

/**
 * // TODO backend: pas d'endpoint GET/PUT "settings" dédié côté
 * // `prospection-service`. Approximation en lecture via
 * // `frappeCall("prospection.get_scoring_rules")` (règles de scoring, côté
 * // `platform_core`) — pas d'équivalent PUT identifié pour la sauvegarde
 * // (`updateProspectionSettings` n'existe d'ailleurs pas dans ce service).
 */
export async function getProspectionSettings(): Promise<ProspectionSettings> {
  const raw = await frappeCall<unknown>("prospection.get_scoring_rules", {});
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const scoring = (data["scoring"] ?? data) as Record<string, unknown>;
  return {
    scoring: {
      hotMin: Number(scoring["hotMin"] ?? 70),
      warmMin: Number(scoring["warmMin"] ?? 40),
    },
  };
}
