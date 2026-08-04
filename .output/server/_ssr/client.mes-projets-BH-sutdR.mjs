import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as getMyProjects, t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { B as EllipsisVertical, L as FileText, Q as ChevronDown, v as Search, x as Plus } from "../_libs/lucide-react.mjs";
import { i as TableSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { n as ListPagination, t as FilterSelect } from "./ListControls-CdCTDF4c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.mes-projets-BH-sutdR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Écran 15 — MES PROJETS (espace Client). */
var STATUS_TABS = [
	{
		value: "all",
		label: "Tous"
	},
	{
		value: "draft",
		label: "Brouillons"
	},
	{
		value: "published",
		label: "Publiés"
	},
	{
		value: "in_progress",
		label: "En cours"
	},
	{
		value: "finished",
		label: "Terminés"
	},
	{
		value: "suspended",
		label: "Suspendus"
	}
];
var PAGE_SIZE = 20;
function ClientProjectsPage() {
	const projectsQuery = useQuery({
		queryKey: ["client", "projects"],
		queryFn: () => getMyProjects()
	});
	const isLoading = projectsQuery.isPending;
	const allProjects = (0, import_react.useMemo)(() => projectsQuery.data?.items ?? [], [projectsQuery.data]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeStatus, setActiveStatus] = (0, import_react.useState)("all");
	const [sortDirection, setSortDirection] = (0, import_react.useState)("recent");
	const [page, setPage] = (0, import_react.useState)(1);
	const counts = (0, import_react.useMemo)(() => {
		const result = { all: allProjects.length };
		for (const project of allProjects) result[project.status] = (result[project.status] ?? 0) + 1;
		return result;
	}, [allProjects]);
	const filteredProjects = (0, import_react.useMemo)(() => {
		const normalizedQuery = query.trim().toLowerCase();
		let items = allProjects.filter((project) => {
			const matchesStatus = activeStatus === "all" || project.status === activeStatus;
			const matchesQuery = normalizedQuery.length === 0 || project.title.toLowerCase().includes(normalizedQuery) || project.reference.toLowerCase().includes(normalizedQuery) || project.category.toLowerCase().includes(normalizedQuery);
			return matchesStatus && matchesQuery;
		});
		items = [...items].sort((a, b) => sortDirection === "recent" ? b.lastActivity.localeCompare(a.lastActivity) : a.lastActivity.localeCompare(b.lastActivity));
		return items;
	}, [
		allProjects,
		activeStatus,
		query,
		sortDirection
	]);
	const total = filteredProjects.length;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const projects = filteredProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "client",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[24px] font-bold tracking-tight",
							children: "Mes projets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Suivez l'ensemble de vos projets."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/client/postuler-un-projet",
						className: "flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:justify-self-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-3.5 w-3.5",
							strokeWidth: 2
						}), "Postuler un projet"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 flex items-center gap-3 rounded-md border border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "h-[18px] w-[18px] shrink-0 text-muted-foreground",
						strokeWidth: 1.7
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "search",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Rechercher un projet...",
						className: "min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground focus:outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3",
					children: STATUS_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setActiveStatus(tab.value);
							setPage(1);
						},
						"aria-pressed": activeStatus === tab.value,
						className: activeStatus === tab.value ? "rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-primary-foreground" : "rounded-full border border-border px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-accent",
						children: [tab.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 font-normal text-[13px] opacity-70",
							children: counts[tab.value] ?? 0
						})]
					}, tab.value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Catégorie",
							placeholder: "Toutes les catégories"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Statut",
							placeholder: "Tous les statuts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							label: "Période",
							placeholder: "Toutes les périodes"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-[14px] font-semibold",
						children: [total, " projets"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSortDirection((current) => current === "recent" ? "old" : "recent"),
						type: "button",
						className: "flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground",
						children: [
							"Trier par : ",
							sortDirection === "recent" ? "Plus récents" : "Plus anciens",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.8
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-lg border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-border px-5 py-3 lg:grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Projet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Catégorie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Statut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Budget"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Dernière activité"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4" })
						]
					}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {
							rows: 8,
							columns: 6
						})
					}) : projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucun projet à afficher." })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectRow, { project }) }, project.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page: currentPage,
					totalPages
				})
			]
		})
	});
}
function ProjectRow({ project }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] lg:items-center lg:gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13px] font-semibold",
					children: project.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13px] text-muted-foreground",
					children: project.subCategory
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[13px] font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }), project.statusLabel]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-[13px]",
				children: [
					project.budgetMin,
					" € - ",
					project.budgetMax,
					" €"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: project.lastActivity
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/client/mes-projets/$id",
					params: { id: project.id },
					className: "block w-full rounded-md border border-border px-3 py-2 text-center text-[13px] font-semibold transition-colors hover:bg-accent lg:w-auto",
					children: project.status === "draft" ? "Reprendre le brouillon" : "Voir le projet"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => uiAction("Plus d'actions"),
				type: "button",
				"aria-label": "Plus d'actions",
				className: "justify-self-start text-muted-foreground transition-colors hover:text-foreground lg:justify-self-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, {
					className: "h-4 w-4",
					strokeWidth: 1.8
				})
			})
		]
	});
}
//#endregion
export { ClientProjectsPage as component };
