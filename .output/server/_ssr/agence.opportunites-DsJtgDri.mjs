import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as MapPin, Q as ChevronDown, at as Briefcase } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { c as StatusTabs, r as SearchInput, s as StatusBadge, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { n as ListPagination, t as FilterSelect } from "./ListControls-CdCTDF4c.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { i as sendQuote, n as getOpportunities, r as refuseOpportunity, t as acceptOpportunity } from "./opportunities.service-B9jqmObh.mjs";
import { i as signalReady } from "./disputes.service-D9SkhJt1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.opportunites-DsJtgDri.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Opportunités (Agence) — offres disponibles, filtres, tri, pagination. */
var TABS = [
	{
		value: "all",
		label: "Toutes"
	},
	{
		value: "available",
		label: "Disponibles"
	},
	{
		value: "won",
		label: "Gagnées"
	},
	{
		value: "paused",
		label: "En pause"
	},
	{
		value: "finished",
		label: "Terminées"
	},
	{
		value: "archived",
		label: "Archivées"
	}
];
/** L'onglet "Toutes" n'a pas d'équivalent backend dédié : il pointe vers le
* tab "Offres" (`OpportunityTab.offers`), qui est la file d'attente
* principale (nouvelles offres + offres déjà acceptées en attente de devis). */
function tabToOpportunityTab(uiTab) {
	if (uiTab === "all") return "offers";
	return uiTab;
}
/**
* Une opportunité est considérée "Acceptée" (étape 1/2 du workflow devis,
* CDC §1.5.6/§2.3) si elle porte une date d'acceptation mais pas encore de
* devis. Il n'existe pas de champ `step` dédié "accepted" côté mapping
* (`opportunities.service.ts::mapOpportunity`) — approximation basée sur les
* champs disponibles.
*/
function isAcceptedAwaitingQuote(opportunity) {
	return Boolean(opportunity.acceptedOn) && opportunity.quoteAmount === null;
}
function AgencyOpportunitiesPage() {
	const queryClient = useQueryClient();
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [page] = (0, import_react.useState)(1);
	const [quoteTarget, setQuoteTarget] = (0, import_react.useState)(null);
	const [quoteAmount, setQuoteAmount] = (0, import_react.useState)("");
	const opportunityTab = tabToOpportunityTab(activeTab);
	const opportunitiesQuery = useQuery({
		queryKey: [
			"agency",
			"opportunities",
			opportunityTab,
			page
		],
		queryFn: () => getOpportunities({
			tab: opportunityTab,
			page,
			pageSize: 20
		})
	});
	const opportunities = opportunitiesQuery.data?.items ?? [];
	const isLoading = opportunitiesQuery.isLoading;
	const counts = opportunitiesQuery.data?.counts ?? {};
	const total = opportunitiesQuery.data?.total ?? null;
	const totalPages = opportunitiesQuery.data?.totalPages ?? null;
	const filteredOpportunities = query.trim() ? opportunities.filter((opportunity) => `${opportunity.projectTitle} ${opportunity.companyName}`.toLowerCase().includes(query.trim().toLowerCase())) : opportunities;
	function invalidateOpportunities() {
		queryClient.invalidateQueries({ queryKey: ["agency", "opportunities"] });
	}
	const acceptMutation = useMutation({
		mutationFn: acceptOpportunity,
		onSuccess: () => {
			toast("Opportunité acceptée", { description: "Envoyez votre devis pour passer à l'étape suivante." });
			invalidateOpportunities();
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Impossible d'accepter l'opportunité.");
		}
	});
	const refuseMutation = useMutation({
		mutationFn: refuseOpportunity,
		onSuccess: () => {
			toast("Opportunité refusée");
			invalidateOpportunities();
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Impossible de refuser l'opportunité.");
		}
	});
	const sendQuoteMutation = useMutation({
		mutationFn: ({ id, amount }) => sendQuote(id, amount),
		onSuccess: () => {
			toast("Devis envoyé", { description: "Le client a été notifié de votre proposition." });
			invalidateOpportunities();
			setQuoteTarget(null);
			setQuoteAmount("");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Envoi du devis impossible.");
		}
	});
	const signalReadyMutation = useMutation({
		mutationFn: signalReady,
		onSuccess: () => {
			toast("Signalement envoyé", { description: "Le client a été notifié." });
			invalidateOpportunities();
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
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {
						className: "mt-1 h-[22px] w-[22px] shrink-0",
						strokeWidth: 1.6
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[24px] font-bold tracking-tight",
							children: "Opportunités"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Répondez aux projets qui correspondent à vos compétences."
						})]
					})]
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
							label: "Catégorie",
							placeholder: "Toutes les catégories"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Budget",
							placeholder: "Tous les budgets"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Localisation",
							placeholder: "Toutes les villes"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-[14px] font-semibold",
						children: [total ?? 0, " opportunités"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => uiAction("Trier par : Plus récentes"),
						type: "button",
						className: "flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground",
						children: ["Trier par : Plus récentes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.8
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: [
							{
								key: "opportunity",
								header: "Opportunité",
								width: "minmax(0,2.2fr)",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-[13px] font-semibold",
										children: opportunity.companyInitials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[13.5px] font-bold",
											children: opportunity.projectTitle
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[13px] text-muted-foreground",
											children: opportunity.companyName
										})]
									})]
								})
							},
							{
								key: "category",
								header: "Catégorie",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[13px]",
									children: opportunity.category
								})
							},
							{
								key: "budget",
								header: "Budget",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[13px]",
									children: opportunity.budgetMin === null || opportunity.budgetMax === null ? "—" : `${opportunity.budgetMin} – ${opportunity.budgetMax}`
								})
							},
							{
								key: "location",
								header: "Localisation",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										className: "h-3.5 w-3.5 shrink-0",
										strokeWidth: 1.7
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: opportunity.location
									})]
								})
							},
							{
								key: "step",
								header: "Étape",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: opportunity.stepLabel })
							},
							{
								key: "action",
								header: "Action",
								render: (opportunity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										activeTab === "all" && !isAcceptedAwaitingQuote(opportunity) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => acceptMutation.mutate(opportunity.id),
											disabled: acceptMutation.isPending,
											className: "rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
											children: "Accepter"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => refuseMutation.mutate(opportunity.id),
											disabled: refuseMutation.isPending,
											className: "rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent disabled:opacity-60",
											children: "Refuser"
										})] }) : null,
										activeTab === "all" && isAcceptedAwaitingQuote(opportunity) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setQuoteTarget(opportunity);
												setQuoteAmount("");
											},
											className: "rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
											children: "Envoyer un devis"
										}) : null,
										activeTab === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => signalReadyMutation.mutate(opportunity.id),
											disabled: signalReadyMutation.isPending,
											className: "rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
											children: "Signaler que je suis prêt"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => uiAction("Détails"),
											type: "button",
											className: "rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
											children: "Détails"
										})
									]
								})
							}
						],
						rows: filteredOpportunities,
						isLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page,
					totalPages
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
			open: quoteTarget !== null,
			onOpenChange: (open) => {
				if (!open) {
					setQuoteTarget(null);
					setQuoteAmount("");
				}
			},
			title: "Envoyer un devis",
			...quoteTarget ? { description: `Proposez un montant pour "${quoteTarget.projectTitle}" — ${quoteTarget.companyName}.` } : {},
			confirmLabel: sendQuoteMutation.isPending ? "Envoi..." : "Envoyer le devis",
			onConfirm: () => {
				const amount = Number(quoteAmount);
				if (!quoteTarget || !quoteAmount.trim() || Number.isNaN(amount) || amount <= 0) {
					toast("Renseignez un montant valide.");
					return;
				}
				sendQuoteMutation.mutate({
					id: quoteTarget.id,
					amount
				});
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Montant du devis (€)",
				type: "number",
				min: 0,
				value: quoteAmount,
				onChange: (event) => setQuoteAmount(event.target.value)
			})
		})]
	});
}
//#endregion
export { AgencyOpportunitiesPage as component };
