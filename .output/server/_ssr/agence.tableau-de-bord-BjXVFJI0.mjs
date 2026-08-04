import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getAgencyDashboardOverview, t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { I as Folder, L as FileText, at as Briefcase, d as Star, dt as ArrowRight, pt as Activity, tt as ChartColumn } from "../_libs/lucide-react.mjs";
import { a as StatCard, i as SectionCard, o as StatGrid, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton, r as StatSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { t as getAgencyProjects } from "./agency-projects.service-G52u-XRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.tableau-de-bord-BjXVFJI0.js
var import_jsx_runtime = require_jsx_runtime();
var PROJECT_COLUMNS = [
	{
		key: "project",
		header: "Projet",
		width: "minmax(0,2fr)",
		render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
				className: "mt-0.5 h-[18px] w-[18px] shrink-0",
				strokeWidth: 1.6
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13.5px] font-bold",
					children: project.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13px] text-muted-foreground",
					children: project.reference
				})]
			})]
		})
	},
	{
		key: "category",
		header: "Catégorie",
		render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-[13px]",
			children: project.category
		})
	},
	{
		key: "status",
		header: "Statut",
		render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: project.statusLabel })
	},
	{
		key: "activity",
		header: "Dernière activité",
		render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-[13px] text-muted-foreground",
			children: project.lastActivity
		})
	},
	{
		key: "action",
		header: "Action",
		render: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/agence/projets-en-cours",
			className: "rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
			children: "Voir le projet"
		})
	}
];
function AgencyDashboardPage() {
	const dashboardQuery = useQuery({
		queryKey: ["agency", "dashboard"],
		queryFn: getAgencyDashboardOverview
	});
	const projectsQuery = useQuery({
		queryKey: [
			"agency",
			"projects",
			"recent"
		],
		queryFn: () => getAgencyProjects({
			page: 1,
			pageSize: 5,
			sort: "recent"
		})
	});
	const stats = {
		pqiScore: dashboardQuery.data?.pqiScore ?? null,
		pqiLabel: dashboardQuery.data ? "Score PQI" : null,
		openOpportunities: dashboardQuery.data?.openOpportunitiesCount ?? null,
		activeProjects: dashboardQuery.data?.inProgressCount ?? null,
		averageRating: dashboardQuery.data?.averageClientRating ?? null
	};
	const isStatsLoading = dashboardQuery.isLoading;
	const recentProjects = projectsQuery.data?.items ?? [];
	const isProjectsLoading = projectsQuery.isLoading;
	const activities = dashboardQuery.data?.recentActivity ?? [];
	const isActivitiesLoading = dashboardQuery.isLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "agency",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[32px] font-bold tracking-tight",
					children: "Tableau de bord"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-[14px] text-muted-foreground",
					children: "Voici un aperçu de l'activité de votre agence."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: isStatsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatSkeleton, { count: 4 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatGrid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ChartColumn,
							label: "Score PQI",
							value: stats.pqiScore === null ? "—" : String(stats.pqiScore),
							suffix: "/100",
							footer: stats.pqiLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: stats.pqiLabel }) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Briefcase,
							label: "Opportunités ouvertes",
							value: stats.openOpportunities === null ? "—" : String(stats.openOpportunities),
							footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/agence/opportunites",
								className: "flex items-center gap-1.5 transition-opacity hover:opacity-70",
								children: ["Voir les opportunités", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-3 w-3",
									strokeWidth: 1.8
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Folder,
							label: "Projets en cours",
							value: stats.activeProjects === null ? "—" : String(stats.activeProjects),
							footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/agence/projets-en-cours",
								className: "flex items-center gap-1.5 transition-opacity hover:opacity-70",
								children: ["Voir les projets", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-3 w-3",
									strokeWidth: 1.8
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Star,
							label: "Note moyenne",
							value: stats.averageRating === null ? "—" : String(stats.averageRating),
							suffix: "/5"
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-[13.5px] font-bold tracking-wide",
							children: "PROJETS RÉCENTS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/agence/projets-en-cours",
							className: "flex shrink-0 items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70",
							children: ["Voir tous les projets", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3 w-3",
								strokeWidth: 1.8
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
							columns: PROJECT_COLUMNS,
							rows: recentProjects,
							isLoading: isProjectsLoading
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Activités récentes",
						description: "Devis envoyés, réponses clients, litiges et facturation.",
						children: isActivitiesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: activities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
									className: "mt-0.5 h-4 w-4 shrink-0",
									strokeWidth: 1.7
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[13.5px] font-semibold",
											children: activity.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-muted-foreground",
											children: activity.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[13px] text-muted-foreground",
											children: activity.date
										})
									]
								})]
							}, activity.id))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13.5px] font-bold tracking-wide",
						children: "ACCÈS RAPIDES"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAccess, {
								label: "Facturation",
								description: "Suivez vos factures émises et reçues.",
								to: "/agence/facturation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAccess, {
								label: "Analytics PQI",
								description: "Analysez vos indicateurs de performance.",
								to: "/agence/analytics"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAccess, {
								label: "Prospection IA",
								description: "Découvrez les clients suggérés par l'IA.",
								to: "/agence/prospection"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAccess, {
								label: "Workflow",
								description: "Suivez les étapes de traitement des opportunités.",
								to: "/agence/workflow"
							})
						]
					})]
				})
			]
		})
	});
}
function QuickAccess({ label, description, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
			className: "mt-0.5 h-[22px] w-[22px] shrink-0",
			strokeWidth: 1.6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13.5px] font-bold",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] leading-[1.5] text-muted-foreground",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
					className: "mt-3 h-4 w-4 transition-transform group-hover:translate-x-0.5",
					strokeWidth: 1.8
				})
			]
		})]
	});
}
//#endregion
export { AgencyDashboardPage as component };
