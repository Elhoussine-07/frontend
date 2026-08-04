import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as Folder, Q as ChevronDown, i as Users } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { c as StatusTabs, r as SearchInput, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { n as ListPagination, t as FilterSelect } from "./ListControls-CdCTDF4c.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { t as getAgencyProjects } from "./agency-projects.service-G52u-XRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.projets-en-cours-kXAqQBpU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Projets en cours (Agence) — recherche, filtres, tri, pagination. */
var TABS = [
	{
		value: "all",
		label: "Tous"
	},
	{
		value: "in_progress",
		label: "En cours"
	},
	{
		value: "suspended",
		label: "Suspendus"
	},
	{
		value: "finished",
		label: "Terminés"
	}
];
function buildColumns(onViewDetails) {
	return [
		{
			key: "project",
			header: "Projet",
			width: "minmax(0,2.2fr)",
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
			key: "client",
			header: "Client",
			render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex min-w-0 items-center gap-1.5 text-[13px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "h-3.5 w-3.5 shrink-0",
					strokeWidth: 1.7
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: project.partnerAgencyName ?? "—"
				})]
			})
		},
		{
			key: "status",
			header: "Statut",
			render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: project.statusLabel })
		},
		{
			key: "budget",
			header: "Budget",
			render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px]",
				children: project.budgetMin === null || project.budgetMax === null ? "—" : `${project.budgetMin} – ${project.budgetMax}`
			})
		},
		{
			key: "deadline",
			header: "Échéance",
			render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: project.deadline
			})
		},
		{
			key: "action",
			header: "Action",
			render: (project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onViewDetails(project),
				className: "rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
				children: "Voir le projet"
			})
		}
	];
}
function AgencyProjectsPage() {
	const [selectedProject, setSelectedProject] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [page] = (0, import_react.useState)(1);
	const projectsQuery = useQuery({
		queryKey: [
			"agency",
			"projects",
			activeTab,
			query,
			page
		],
		queryFn: () => getAgencyProjects({
			...query.trim() ? { query: query.trim() } : {},
			...activeTab !== "all" ? { status: activeTab } : {},
			page,
			pageSize: 20
		})
	});
	const projects = projectsQuery.data?.items ?? [];
	const isLoading = projectsQuery.isLoading;
	const counts = projectsQuery.data?.counts ?? {};
	const total = projectsQuery.data?.total ?? null;
	const totalPages = projectsQuery.data?.totalPages ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		role: "agency",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] font-bold tracking-tight",
					children: "Projets en cours"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: "Suivez l'avancement de vos projets et leurs échéances."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						placeholder: "Rechercher un projet..."
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
							label: "Client",
							placeholder: "Tous les clients"
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
						children: [total ?? 0, " projets"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => uiAction("Trier par : Plus récents"),
						type: "button",
						className: "flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground",
						children: ["Trier par : Plus récents", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.8
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: buildColumns(setSelectedProject),
						rows: projects,
						isLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page,
					totalPages
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
			open: selectedProject !== null,
			onOpenChange: (open) => {
				if (!open) setSelectedProject(null);
			},
			title: selectedProject?.title ?? "",
			...selectedProject?.reference ? { description: selectedProject.reference } : {},
			confirmLabel: "Fermer",
			onConfirm: () => setSelectedProject(null),
			children: selectedProject ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-[13.5px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Statut : "
					}), selectedProject.statusLabel] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Client : "
					}), selectedProject.partnerAgencyName ?? "—"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Budget : "
					}), selectedProject.budgetMin === null || selectedProject.budgetMax === null ? "—" : `${selectedProject.budgetMin} – ${selectedProject.budgetMax}`] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Échéance : "
					}), selectedProject.deadline || "—"] }),
					selectedProject.objective ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: selectedProject.objective
					}) : null
				]
			}) : null
		})]
	});
}
//#endregion
export { AgencyProjectsPage as component };
