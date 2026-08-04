import { camelizeKeys, frappeCall } from "@/services/http";

/** Service analytics agence. */

export interface PqiFactor {
  id: string;
  label: string;
  value: number;
  max: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface MetricWithSeries {
  value: number;
  variation: string;
  series: TimeSeriesPoint[];
}

export interface AnalyticsMetrics {
  profileViews: MetricWithSeries;
  averagePosition: MetricWithSeries;
  averageRating: MetricWithSeries;
  externalVisits: MetricWithSeries;
}

function emptyMetric(): MetricWithSeries {
  return { value: 0, variation: "0%", series: [] };
}

function mapMetric(raw: unknown): MetricWithSeries {
  if (raw === null || typeof raw !== "object") return emptyMetric();
  const data = raw as Record<string, unknown>;
  return {
    value: Number(data["value"] ?? 0),
    variation: String(data["variation"] ?? "0%"),
    series: Array.isArray(data["series"])
      ? (data["series"] as unknown[]).map((point) => {
          const p = point as Record<string, unknown>;
          return { date: String(p["date"] ?? ""), value: Number(p["value"] ?? 0) };
        })
      : [],
  };
}

/**
 * `agency.analytics` est la source unique côté backend pour le PQI, les
 * recommandations et les métriques — on l'appelle une fois et on en extrait le
 * sous-objet pertinent dans chaque fonction ci-dessous.
 */
async function fetchAgencyAnalytics(): Promise<Record<string, unknown>> {
  const raw = await frappeCall<unknown>("agency.analytics");
  return camelizeKeys(raw) as Record<string, unknown>;
}

/**
 * // API CALL : frappeCall("agency.analytics") — extrait `pqiScore`/`pqiDetails`
 */
export async function getPqi(): Promise<{
  score: number;
  label: string;
  factors: PqiFactor[];
  penaltyNote: string | null;
}> {
  const data = await fetchAgencyAnalytics();
  const details = (data["pqiDetails"] ?? {}) as Record<string, unknown>;
  const factors = Array.isArray(details["factors"])
    ? (details["factors"] as unknown[]).map((factor) => {
        const f = factor as Record<string, unknown>;
        return {
          id: String(f["id"] ?? f["label"] ?? ""),
          label: String(f["label"] ?? ""),
          value: Number(f["value"] ?? 0),
          max: Number(f["max"] ?? 100),
        };
      })
    : [];

  return {
    score: Number(data["pqiScore"] ?? 0),
    label: String(details["label"] ?? ""),
    factors,
    penaltyNote: (details["penaltyNote"] as string | undefined) ?? null,
  };
}

/**
 * // TODO backend: pas d'endpoint dédié pour les alertes proactives PQI — les
 * // alertes sont poussées via le doctype `Notification`, pas listées
 * // séparément. Approximation : on interroge `notification.list_active` et on
 * // filtre côté client sur `category` (best-effort, catégorie exacte non
 * // confirmée : on tente "pqi"/"alert").
 */
export async function getProactiveAlerts(): Promise<
  Array<{ title: string; description: string; variationPercent: number }>
> {
  const raw = await frappeCall<unknown>("notification.list_active", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return list
    .map((item) => camelizeKeys(item) as Record<string, unknown>)
    .filter((item) => {
      const category = String(item["category"] ?? "").toLowerCase();
      return category.includes("pqi") || category.includes("alert");
    })
    .map((item) => ({
      title: String(item["title"] ?? ""),
      description: String(item["body"] ?? item["description"] ?? ""),
      variationPercent: Number(item["variationPercent"] ?? 0),
    }));
}

/**
 * // API CALL : frappeCall("agency.analytics") — extrait le champ recommandations IA
 */
export async function getRecommendations(): Promise<
  Array<{ id: string; title: string; description: string }>
> {
  const data = await fetchAgencyAnalytics();
  const list = (data["recommendations"] ?? []) as unknown[];
  return list.map((item, index) => {
    const r = item as Record<string, unknown>;
    return {
      id: String(r["id"] ?? index),
      title: String(r["title"] ?? ""),
      description: String(r["description"] ?? ""),
    };
  });
}

/**
 * // API CALL : frappeCall("agency.analytics") — englobe vues, opportunités,
 * // visibilité, note client (`range` non utilisé côté backend actuellement,
 * // conservé pour compat de signature).
 */
export async function getAnalyticsMetrics(_range?: string): Promise<AnalyticsMetrics> {
  const data = await fetchAgencyAnalytics();
  return {
    profileViews: mapMetric(data["profileViews"]),
    averagePosition: mapMetric(data["averagePosition"]),
    averageRating: mapMetric(data["averageRating"]),
    externalVisits: mapMetric(data["externalVisits"]),
  };
}
