import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as frappeCall, r as camelizeKeys } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { n as Workflow } from "../_libs/lucide-react.mjs";
import { c as StatusTabs, i as SectionCard, r as SearchInput, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { n as ListPagination } from "./ListControls-CdCTDF4c.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { n as getOpportunities } from "./opportunities.service-B9jqmObh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.workflow-lz3uIR49.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEP_LABELS = {
	received: "Reçues",
	reviewed: "Étudiées",
	quote_sent: "Devis envoyé",
	awaiting_client: "En attente client",
	won: "Gagnées",
	lost: "Perdues"
};
/** Tab `opportunity.list_opportunities` la plus proche de chaque étape de workflow. */
var STEP_TO_TAB = {
	received: "Offres",
	reviewed: "Offres",
	quote_sent: "Offres",
	awaiting_client: "Offres",
	won: "Gagnées",
	lost: "Archivées"
};
/**
* // API CALL : frappeCall("opportunity.list_opportunities", { tab: "Offres" })
* // approximation : les compteurs par étape de workflow sont dérivés des
* // `counts` renvoyés par `list_opportunities` (mapping best-effort tab -> étape).
*/
async function getWorkflowStages() {
	const raw = await frappeCall("opportunity.list_opportunities", { tab: "Offres" });
	const counts = camelizeKeys(raw)["counts"] ?? {};
	return Object.keys(STEP_LABELS).map((step) => ({
		id: step,
		step,
		label: STEP_LABELS[step],
		count: Number(counts[STEP_TO_TAB[step]] ?? 0),
		slaHours: null
	}));
}
/**
* // API CALL : frappeCall("opportunity.list_opportunities", { tab: <dérivé de step> })
*/
async function getWorkflowItems(params) {
	const page = params?.page ?? 1;
	const pageSize = params?.pageSize ?? 20;
	const tab = params?.step ? STEP_TO_TAB[params.step] : "Offres";
	const tabKeyEntry = Object.entries({
		offers: "Offres",
		won: "Gagnées",
		paused: "En pause",
		finished: "Terminées",
		archived: "Archivées",
		available: "Disponibles"
	}).find(([, backendValue]) => backendValue === tab);
	const result = await getOpportunities({
		tab: tabKeyEntry?.[0] ?? "offers",
		page,
		pageSize
	});
	return {
		items: result.items,
		total: result.total,
		page: result.page,
		pageSize: result.pageSize,
		totalPages: result.totalPages,
		counts: result.counts
	};
}
/**
* Workflow (Agence) — étapes de traitement des opportunités.
*
* // NOTE (ambiguïté CDC) : ce screen est probablement redondant avec
* // `agence.opportunites.tsx`, qui porte déjà les vraies actions métier du
* // workflow devis (Accepter -> Envoyer un devis, CDC §1.5.6/§2.3), branchées
* // sur `opportunities.service.ts`. `workflow.service.ts` documente lui-même
* // ce doublon (pas de doctype "Workflow" dédié côté `platform_core` — voir son
* // en-tête) : il ré-expose `opportunity.list_opportunities` sous une
* // nomenclature d'étapes différente (received/reviewed/quote_sent/
* // awaiting_client/won/lost) sans action "avancer" générique fiable.
* // Parti pris ici : cette page reste une vue de LECTURE (répartition par
* // étape + liste), sans dupliquer les boutons Accepter/Envoyer un devis —
* // pour ne pas risquer un double-appel divergent avec `agence.opportunites.tsx`
* // sur la même ressource backend. La modale "Étape suivante" est retirée au
* // profit d'un lien direct vers l'écran Opportunités, qui porte la vraie
* // action.
*/
var STEP_TABS = [
	{
		value: "all",
		label: "Toutes"
	},
	{
		value: "quote_sent",
		label: "Devis"
	},
	{
		value: "awaiting_client",
		label: "Négociation"
	},
	{
		value: "won",
		label: "Signature"
	}
];
var COLUMNS = [
	{
		key: "item",
		header: "Opportunité",
		width: "minmax(0,2.2fr)",
		render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13.5px] font-bold",
				children: item.projectTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: item.companyName
			})]
		})
	},
	{
		key: "stage",
		header: "Étape",
		render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: item.stepLabel })
	},
	{
		key: "quote",
		header: "Devis",
		render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-[13px]",
			children: item.quoteAmount === null ? "—" : String(item.quoteAmount)
		})
	},
	{
		key: "remaining",
		header: "Temps restant",
		render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-[13px] text-muted-foreground",
			children: item.remainingHours === null ? "—" : `${item.remainingHours} h`
		})
	}
];
function AgencyWorkflowPage() {
	const stagesQuery = useQuery({
		queryKey: [
			"agency",
			"workflow",
			"stages"
		],
		queryFn: getWorkflowStages
	});
	const stages = stagesQuery.data ?? [];
	const isStagesLoading = stagesQuery.isLoading;
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeStage, setActiveStage] = (0, import_react.useState)("all");
	const itemsQuery = useQuery({
		queryKey: [
			"agency",
			"workflow",
			"items",
			activeStage
		],
		queryFn: () => getWorkflowItems(activeStage === "all" ? {} : { step: activeStage })
	});
	const allItems = itemsQuery.data?.items ?? [];
	const isItemsLoading = itemsQuery.isLoading;
	const counts = itemsQuery.data?.counts ?? {};
	const page = itemsQuery.data?.page ?? 1;
	const totalPages = itemsQuery.data?.totalPages ?? null;
	const items = query.trim() ? allItems.filter((item) => `${item.projectTitle} ${item.companyName}`.toLowerCase().includes(query.trim().toLowerCase())) : allItems;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "agency",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, {
						className: "mt-1 h-[22px] w-[22px] shrink-0",
						strokeWidth: 1.6
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[24px] font-bold tracking-tight",
							children: "Workflow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Étapes de traitement de vos opportunités."
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Étapes du workflow",
						description: "Répartition de vos opportunités par étape.",
						children: isStagesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 4 }) : stages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: stages.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] text-muted-foreground",
									children: stage.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[26px] font-bold leading-none",
									children: stage.count
								})]
							}, stage.id))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						placeholder: "Rechercher une opportunité..."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
						tabs: STEP_TABS,
						value: activeStage,
						onChange: setActiveStage,
						counts
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: COLUMNS,
						rows: items,
						isLoading: isItemsLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page,
					totalPages
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-[13px] text-muted-foreground",
					children: [
						"Pour accepter une opportunité ou envoyer un devis, rendez-vous sur l'écran",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agence/opportunites",
							className: "font-semibold underline underline-offset-2",
							children: "Opportunités"
						}),
						"."
					]
				})
			]
		})
	});
}
//#endregion
export { AgencyWorkflowPage as component };
