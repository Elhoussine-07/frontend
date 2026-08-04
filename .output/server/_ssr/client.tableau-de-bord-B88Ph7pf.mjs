import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as getMyProjects, t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { B as EllipsisVertical, L as FileText, T as MessageCircle, dt as ArrowRight, f as Sparkles, i as Users, m as ShieldCheck, q as CircleQuestionMark, s as TrendingUp, x as Plus } from "../_libs/lucide-react.mjs";
import { i as TableSkeleton, r as StatSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { n as getClientDashboard } from "./profile.service-qQctcsIK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.tableau-de-bord-B88Ph7pf.js
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_STATS = {
	trustScore: null,
	trustScoreLabel: null,
	publishedProjects: null,
	publishedProjectsDelta: null,
	responseRate: null,
	responseRateDelta: null,
	activeCollaborations: null
};
function ClientDashboardPage() {
	const user = useAuthStore((state) => state.user);
	const dashboardQuery = useQuery({
		queryKey: ["client", "dashboard"],
		queryFn: getClientDashboard
	});
	const isStatsLoading = dashboardQuery.isPending;
	const stats = dashboardQuery.data ? {
		trustScore: dashboardQuery.data.trustScore.value,
		trustScoreLabel: dashboardQuery.data.trustScore.label,
		publishedProjects: dashboardQuery.data.publishedProjects.value,
		publishedProjectsDelta: dashboardQuery.data.publishedProjects.delta,
		responseRate: dashboardQuery.data.responseRate.value,
		responseRateDelta: dashboardQuery.data.responseRate.delta,
		activeCollaborations: dashboardQuery.data.activeCollaborations.value
	} : EMPTY_STATS;
	const recentProjectsQuery = useQuery({
		queryKey: [
			"client",
			"projects",
			"recent"
		],
		queryFn: () => getMyProjects({
			pageSize: 5,
			sort: "recent"
		})
	});
	const recentProjects = recentProjectsQuery.data?.items ?? [];
	const isProjectsLoading = recentProjectsQuery.isPending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "client",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-[32px] font-bold tracking-tight",
					children: ["Bonjour", user ? `, ${user.displayName}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-[14px] text-muted-foreground",
					children: "Voici un aperçu de votre activité sur Sortlist Pro."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: isStatsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatSkeleton, { count: 4 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 divide-y divide-border rounded-lg border border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: ShieldCheck,
								label: "Score de confiance",
								value: stats.trustScore === null ? "—" : String(stats.trustScore),
								suffix: "/100",
								footer: stats.trustScoreLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), stats.trustScoreLabel]
								}) : null
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: FileText,
								label: "Projets publiés",
								value: stats.publishedProjects === null ? "—" : String(stats.publishedProjects),
								footer: stats.publishedProjectsDelta
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: TrendingUp,
								label: "Taux de réponse",
								value: stats.responseRate === null ? "—" : `${stats.responseRate}%`,
								footer: stats.responseRateDelta
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: Users,
								label: "Collaborations en cours",
								value: stats.activeCollaborations === null ? "—" : String(stats.activeCollaborations),
								footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/client/collaborations",
									className: "flex items-center gap-1.5 transition-opacity hover:opacity-70",
									children: ["Voir le détail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "h-3 w-3",
										strokeWidth: 1.8
									})]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-[13.5px] font-bold tracking-wide",
							children: "MES PROJETS RÉCENTS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/client/mes-projets",
							className: "flex shrink-0 items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70",
							children: ["Voir tous mes projets", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3 w-3",
								strokeWidth: 1.8
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-border px-5 py-3 lg:grid",
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
									children: "Dernière activité"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] font-semibold",
									children: "Action"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4" })
							]
						}), isProjectsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {
								rows: 5,
								columns: 5
							})
						}) : recentProjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucun projet récent à afficher." })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: recentProjects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectRow, { project }) }, project.id))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13.5px] font-bold tracking-wide",
						children: "ACTIONS RAPIDES"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								icon: Plus,
								title: "Postuler un projet",
								description: "Déposez un nouveau projet et trouvez les meilleures agences.",
								to: "/client/postuler-un-projet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								icon: Sparkles,
								title: "Générer un CDC avec IA",
								description: "Créez un cahier des charges complet et optimisé avec l'intelligence artificielle.",
								to: "/client/postuler-un-projet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								icon: MessageCircle,
								title: "Contacter une agence",
								description: "Recherchez et contactez l'agence idéale pour votre projet.",
								to: "/agences"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								icon: Users,
								title: "Voir mes collaborations",
								description: "Suivez l'avancement de vos collaborations en cours.",
								to: "/client/collaborations"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 border-t border-border pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-[13.5px] font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.8
						}), "Besoin d'aide ?"]
					})
				})
			]
		})
	});
}
function StatCard({ icon: Icon, label, value, suffix, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-4 p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "mt-1 h-[21px] w-[21px] shrink-0",
			strokeWidth: 1.6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[28px] font-bold leading-none",
					children: [value, suffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[14px] font-normal text-muted-foreground",
						children: suffix
					}) : null]
				}),
				footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2.5 text-[13px] text-muted-foreground",
					children: footer
				}) : null
			]
		})]
	});
}
function ProjectRow({ project }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] lg:items-center lg:gap-4",
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 truncate text-[13px] text-muted-foreground",
						children: ["ID : ", project.reference]
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
function QuickAction({ icon: Icon, title, description, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "mt-0.5 h-[22px] w-[22px] shrink-0",
			strokeWidth: 1.6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13.5px] font-bold",
					children: title
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
export { ClientDashboardPage as component };
