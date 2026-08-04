import { a as frappeCall, r as camelizeKeys } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { R as Eye, d as Star, s as TrendingUp, tt as ChartColumn } from "../_libs/lucide-react.mjs";
import { a as StatCard, i as SectionCard, o as StatGrid, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton, r as StatSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as FilterSelect } from "./ListControls-CdCTDF4c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.analytics-BeA7jtYn.js
var import_jsx_runtime = require_jsx_runtime();
function emptyMetric() {
	return {
		value: 0,
		variation: "0%",
		series: []
	};
}
function mapMetric(raw) {
	if (raw === null || typeof raw !== "object") return emptyMetric();
	const data = raw;
	return {
		value: Number(data["value"] ?? 0),
		variation: String(data["variation"] ?? "0%"),
		series: Array.isArray(data["series"]) ? data["series"].map((point) => {
			const p = point;
			return {
				date: String(p["date"] ?? ""),
				value: Number(p["value"] ?? 0)
			};
		}) : []
	};
}
/**
* `agency.analytics` est la source unique côté backend pour le PQI, les
* recommandations et les métriques — on l'appelle une fois et on en extrait le
* sous-objet pertinent dans chaque fonction ci-dessous.
*/
async function fetchAgencyAnalytics() {
	const raw = await frappeCall("agency.analytics");
	return camelizeKeys(raw);
}
/**
* // API CALL : frappeCall("agency.analytics") — extrait `pqiScore`/`pqiDetails`
*/
async function getPqi() {
	const data = await fetchAgencyAnalytics();
	const details = data["pqiDetails"] ?? {};
	const factors = Array.isArray(details["factors"]) ? details["factors"].map((factor) => {
		const f = factor;
		return {
			id: String(f["id"] ?? f["label"] ?? ""),
			label: String(f["label"] ?? ""),
			value: Number(f["value"] ?? 0),
			max: Number(f["max"] ?? 100)
		};
	}) : [];
	return {
		score: Number(data["pqiScore"] ?? 0),
		label: String(details["label"] ?? ""),
		factors,
		penaltyNote: details["penaltyNote"] ?? null
	};
}
/**
* // TODO backend: pas d'endpoint dédié pour les alertes proactives PQI — les
* // alertes sont poussées via le doctype `Notification`, pas listées
* // séparément. Approximation : on interroge `notification.list_active` et on
* // filtre côté client sur `category` (best-effort, catégorie exacte non
* // confirmée : on tente "pqi"/"alert").
*/
async function getProactiveAlerts() {
	const raw = await frappeCall("notification.list_active", {});
	return (Array.isArray(raw) ? raw : []).map((item) => camelizeKeys(item)).filter((item) => {
		const category = String(item["category"] ?? "").toLowerCase();
		return category.includes("pqi") || category.includes("alert");
	}).map((item) => ({
		title: String(item["title"] ?? ""),
		description: String(item["body"] ?? item["description"] ?? ""),
		variationPercent: Number(item["variationPercent"] ?? 0)
	}));
}
/**
* // API CALL : frappeCall("agency.analytics") — extrait le champ recommandations IA
*/
async function getRecommendations() {
	return ((await fetchAgencyAnalytics())["recommendations"] ?? []).map((item, index) => {
		const r = item;
		return {
			id: String(r["id"] ?? index),
			title: String(r["title"] ?? ""),
			description: String(r["description"] ?? "")
		};
	});
}
/**
* // API CALL : frappeCall("agency.analytics") — englobe vues, opportunités,
* // visibilité, note client (`range` non utilisé côté backend actuellement,
* // conservé pour compat de signature).
*/
async function getAnalyticsMetrics(_range) {
	const data = await fetchAgencyAnalytics();
	return {
		profileViews: mapMetric(data["profileViews"]),
		averagePosition: mapMetric(data["averagePosition"]),
		averageRating: mapMetric(data["averageRating"]),
		externalVisits: mapMetric(data["externalVisits"])
	};
}
/** Analytics PQI (Agence) — indicateurs de performance, graphiques, statistiques. */
function AgencyAnalyticsPage() {
	const pqiQuery = useQuery({
		queryKey: [
			"agency",
			"analytics",
			"pqi"
		],
		queryFn: getPqi
	});
	const pqiScore = pqiQuery.data?.score ?? null;
	const pqiLabel = pqiQuery.data?.label ?? null;
	const pqiFactors = pqiQuery.data?.factors ?? [];
	const penaltyNote = pqiQuery.data?.penaltyNote ?? null;
	const isPqiLoading = pqiQuery.isLoading;
	const metricsQuery = useQuery({
		queryKey: [
			"agency",
			"analytics",
			"metrics"
		],
		queryFn: () => getAnalyticsMetrics("30d")
	});
	const emptyMetric = {
		value: 0,
		variation: "0%",
		series: []
	};
	const profileViews = metricsQuery.data?.profileViews ?? emptyMetric;
	const averagePosition = metricsQuery.data?.averagePosition ?? emptyMetric;
	const averageRating = metricsQuery.data?.averageRating ?? emptyMetric;
	const externalVisits = metricsQuery.data?.externalVisits ?? emptyMetric;
	const isMetricsLoading = metricsQuery.isLoading;
	const alertsQuery = useQuery({
		queryKey: [
			"agency",
			"analytics",
			"alerts"
		],
		queryFn: getProactiveAlerts
	});
	const alerts = alertsQuery.data ?? [];
	const isAlertsLoading = alertsQuery.isLoading;
	const recommendationsQuery = useQuery({
		queryKey: [
			"agency",
			"analytics",
			"recommendations"
		],
		queryFn: getRecommendations
	});
	const recommendations = recommendationsQuery.data ?? [];
	const isRecommendationsLoading = recommendationsQuery.isLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "agency",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[24px] font-bold tracking-tight",
							children: "Analytics PQI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Suivez vos performances et améliorez votre visibilité."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full sm:w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Période",
							placeholder: "30 derniers jours"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Score PQI",
						description: "Indice de performance et de qualité de votre agence.",
						action: pqiLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: pqiLabel }) : null,
						children: isPqiLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 4 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, {
										className: "h-[22px] w-[22px]",
										strokeWidth: 1.6
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[34px] font-bold leading-none",
										children: [pqiScore === null ? "—" : pqiScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[14px] font-normal text-muted-foreground",
											children: "/100"
										})]
									})]
								}),
								pqiFactors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: pqiFactors.map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-[13px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: factor.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [
												factor.value,
												"/",
												factor.max
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5 h-1.5 w-full rounded-full bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 rounded-full bg-primary",
											style: { width: `${factor.value / factor.max * 100}%` }
										})
									})] }, factor.id))
								}),
								penaltyNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] text-muted-foreground",
									children: penaltyNote
								}) : null
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: isMetricsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatSkeleton, { count: 4 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatGrid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Eye,
							label: "Vues du profil",
							value: profileViews.value === null ? "—" : String(profileViews.value),
							footer: profileViews.variation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: TrendingUp,
							label: "Position moyenne",
							value: averagePosition.value === null ? "—" : String(averagePosition.value),
							footer: averagePosition.variation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Star,
							label: "Note moyenne",
							value: averageRating.value === null ? "—" : String(averageRating.value),
							suffix: "/5",
							footer: averageRating.variation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ChartColumn,
							label: "Visites externes",
							value: externalVisits.value === null ? "—" : String(externalVisits.value),
							footer: externalVisits.variation
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Évolution",
						description: "Courbes des indicateurs sur la période sélectionnée.",
						children: isMetricsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : profileViews.series.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid grid-cols-1 gap-2",
							children: profileViews.series.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-[13px] text-muted-foreground",
									children: point.date
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-semibold",
									children: point.value
								})]
							}, point.date))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Alertes proactives",
						description: "Variations détectées sur vos indicateurs.",
						children: isAlertsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: alerts.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13.5px] font-semibold",
									children: alert.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] text-muted-foreground",
									children: alert.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[13px] font-semibold",
									children: [alert.variationPercent, "%"]
								})
							] }, alert.title))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Recommandations",
						description: "Actions suggérées pour améliorer votre score.",
						children: isRecommendationsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : recommendations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: recommendations.map((recommendation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13.5px] font-semibold",
								children: recommendation.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: recommendation.description
							})] }, recommendation.id))
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { AgencyAnalyticsPage as component };
