import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { h as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { c as StatusTabs, i as SectionCard, l as TextAreaField, r as SearchInput, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { n as ListPagination, t as FilterSelect } from "./ListControls-CdCTDF4c.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { i as respondToSuspension, n as getSuspensionCases, r as getSuspensionHistory } from "./agency-projects.service-G52u-XRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.suspension-DCZwbSgv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Suspension (Agence) — litiges, signalements, historique. */
var TABS = [
	{
		value: "all",
		label: "Tous"
	},
	{
		value: "amicable",
		label: "Résolution amiable"
	},
	{
		value: "dispute",
		label: "Litige"
	},
	{
		value: "closed",
		label: "Clôturés"
	}
];
function buildColumns(onSelect) {
	return [
		{
			key: "case",
			header: "Dossier",
			width: "minmax(0,2.2fr)",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13.5px] font-bold",
					children: item.projectTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13px] text-muted-foreground",
					children: item.clientName
				})]
			})
		},
		{
			key: "reason",
			header: "Motif",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px]",
				children: item.reason
			})
		},
		{
			key: "status",
			header: "Statut",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: item.statusLabel })
		},
		{
			key: "openedAt",
			header: "Ouvert le",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: item.openedAt
			})
		},
		{
			key: "moderator",
			header: "Modérateur",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: item.moderator ?? "—"
			})
		},
		{
			key: "action",
			header: "Action",
			render: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onSelect(item),
				className: "rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
				children: "Répondre"
			})
		}
	];
}
function AgencySuspensionPage() {
	const queryClient = useQueryClient();
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [isRespondOpen, setIsRespondOpen] = (0, import_react.useState)(false);
	const [response, setResponse] = (0, import_react.useState)("");
	const [selectedCase, setSelectedCase] = (0, import_react.useState)(null);
	const [page] = (0, import_react.useState)(1);
	const casesQuery = useQuery({
		queryKey: [
			"agency",
			"suspensions",
			activeTab,
			query,
			page
		],
		queryFn: () => getSuspensionCases({
			...query.trim() ? { query: query.trim() } : {},
			...activeTab !== "all" ? { status: activeTab } : {},
			page,
			pageSize: 20
		})
	});
	const cases = casesQuery.data?.items ?? [];
	const isLoading = casesQuery.isLoading;
	const counts = casesQuery.data?.counts ?? {};
	const totalPages = casesQuery.data?.totalPages ?? null;
	const historyQuery = useQuery({
		queryKey: [
			"agency",
			"suspensions",
			"history",
			selectedCase?.id
		],
		queryFn: () => getSuspensionHistory(selectedCase?.id ?? ""),
		enabled: selectedCase !== null
	});
	const history = historyQuery.data ?? [];
	const isHistoryLoading = historyQuery.isLoading;
	const respondMutation = useMutation({
		mutationFn: (payload) => {
			if (!selectedCase) throw new Error("Sélectionnez d'abord un dossier dans la liste.");
			return respondToSuspension(selectedCase.id, payload);
		},
		onSuccess: () => {
			toast("Réponse envoyée");
			queryClient.invalidateQueries({ queryKey: ["agency", "suspensions"] });
			setIsRespondOpen(false);
			setResponse("");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Endpoint indisponible pour le moment.");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		role: "agency",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
							className: "mt-1 h-[22px] w-[22px] shrink-0",
							strokeWidth: 1.6
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[24px] font-bold tracking-tight",
								children: "Suspension"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[14px] text-muted-foreground",
								children: "Litiges, signalements et suivi de leur résolution."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (!selectedCase) {
								toast("Sélectionnez d'abord un dossier dans la liste ci-dessous.");
								return;
							}
							setIsRespondOpen(true);
						},
						className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:justify-self-end",
						children: "Répondre à un signalement"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						placeholder: "Rechercher un dossier..."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
						tabs: TABS,
						value: activeTab,
						onChange: setActiveTab,
						counts
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Statut",
							placeholder: "Tous les statuts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Période",
							placeholder: "Toutes les périodes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Motif",
							placeholder: "Tous les motifs"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: buildColumns((item) => {
							setSelectedCase(item);
							setIsRespondOpen(true);
						}),
						rows: cases,
						isLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page,
					totalPages
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Historique des signalements",
						description: "Chronologie des échanges et décisions de modération.",
						children: isHistoryLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: history.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l border-border pl-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13px] text-muted-foreground",
										children: entry.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[13.5px] font-semibold",
										children: entry.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13px] text-muted-foreground",
										children: entry.description
									})
								]
							}, entry.id))
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
			open: isRespondOpen,
			onOpenChange: (open) => {
				setIsRespondOpen(open);
				if (!open) setSelectedCase(null);
			},
			title: "Répondre au signalement",
			description: selectedCase ? `Dossier "${selectedCase.projectTitle}" — votre réponse est transmise au client et au modérateur.` : "Votre réponse est transmise au client et au modérateur.",
			confirmLabel: respondMutation.isPending ? "Envoi..." : "Envoyer la réponse",
			onConfirm: () => {
				if (!response.trim()) {
					toast("Renseignez une réponse avant d'envoyer.");
					return;
				}
				respondMutation.mutate({ message: response.trim() });
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
				label: "Votre réponse",
				rows: 5,
				value: response,
				onChange: (event) => setResponse(event.target.value)
			})
		})]
	});
}
//#endregion
export { AgencySuspensionPage as component };
