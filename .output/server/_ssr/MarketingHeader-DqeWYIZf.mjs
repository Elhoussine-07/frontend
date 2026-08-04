import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as Menu, K as CircleUserRound } from "../_libs/lucide-react.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CHGFKbne.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingHeader-DqeWYIZf.js
var import_jsx_runtime = require_jsx_runtime();
function MarketingHeader({ variant = "landing", active = null, applyDisabled = false }) {
	const token = useAuthStore((state) => state.token);
	const dashboardPath = useAuthStore((state) => state.role) === "agency" ? "/agence/tableau-de-bord" : "/client/tableau-de-bord";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "w-full border-b border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-[22px] font-bold tracking-tight shrink-0",
				children: "Sortlist Pro"
			}), variant === "landing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "ml-8 hidden items-center gap-6 lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/fonctionnalites/$slug",
						params: { slug: "matching-intelligent" },
						className: "text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground",
						children: "Fonctionnalités"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => uiAction("Comment ça marche"),
						type: "button",
						className: "text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground",
						children: "Comment ça marche"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => uiAction("À propos"),
						type: "button",
						className: "text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground",
						children: "À propos"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/agences",
						className: "hidden rounded-md border border-border px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-accent sm:inline-flex",
						children: "Trouvez l'agence idéale"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/projets",
						className: "hidden rounded-md border border-border px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-accent sm:inline-flex",
						children: "Trouvez le projet idéal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/postuler-un-projet",
						className: "rounded-md bg-primary px-3 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
						children: "Postuler un projet"
					})
				]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "ml-6 hidden items-center gap-2 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/agences",
					className: active === "agencies" ? "rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground" : "rounded-md px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-accent",
					children: "Trouvez l'agence idéale"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/projets",
					className: active === "projects" ? "rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground" : "rounded-md px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-accent",
					children: "Trouvez le projet idéal"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-4",
				children: [
					applyDisabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden cursor-not-allowed items-center rounded-md px-4 py-2 text-[14px] font-semibold text-muted-foreground/50 sm:inline-flex",
						children: "Postuler un projet"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/postuler-un-projet",
						className: "hidden rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex",
						children: "Postuler un projet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: token ? dashboardPath : "/connexion",
						"aria-label": "Mon compte",
						className: "text-foreground transition-opacity hover:opacity-70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, {
							className: "h-[22px] w-[22px]",
							strokeWidth: 1.5
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Menu",
							className: "text-foreground transition-opacity hover:opacity-70 md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								className: "h-[22px] w-[22px]",
								strokeWidth: 1.5
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/agences",
									children: "Trouvez l'agence idéale"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/projets",
									children: "Trouvez le projet idéal"
								})
							}),
							!applyDisabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/postuler-un-projet",
									children: "Postuler un projet"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: token ? dashboardPath : "/connexion",
									children: token ? "Mon tableau de bord" : "Se connecter"
								})
							})
						]
					})] })
				]
			})] })]
		})
	});
}
//#endregion
export { MarketingHeader as t };
