import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState, v as searchAgencies } from "./EmptyState-tYTEkNIz.mjs";
import { D as MapPin, Q as ChevronDown, _ as Send, d as Star, dt as ArrowRight, ft as ArrowLeft, v as Search } from "../_libs/lucide-react.mjs";
import { t as CardGridSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as MarketingHeader } from "./MarketingHeader-DqeWYIZf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agences-CaMJabT6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SORT_OPTIONS = [
	{
		value: "relevance",
		label: "Pertinence"
	},
	{
		value: "rating",
		label: "Note"
	},
	{
		value: "recent",
		label: "Plus récentes"
	}
];
function SearchAgenciesPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [subCategory, setSubCategory] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const [page, setPage] = (0, import_react.useState)(1);
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [foundCount, setFoundCount] = (0, import_react.useState)(null);
	const [totalPages, setTotalPages] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			searchAgencies({
				...query ? { query } : {},
				...category ? { category } : {},
				...subCategory ? { subCategory } : {},
				...sort ? { sort } : {},
				page
			}).then((result) => {
				setAgencies(result.items);
				setFoundCount(result.foundCount);
				setTotalPages(result.totalPages);
			}).catch((error) => {
				toast(error instanceof ApiError ? error.message : "Recherche d'agences impossible.");
				setAgencies([]);
				setFoundCount(0);
				setTotalPages(1);
			}).finally(() => setIsLoading(false));
		}, 350);
		return () => clearTimeout(timer);
	}, [
		query,
		category,
		subCategory,
		sort,
		page
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		query,
		category,
		subCategory,
		sort
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHeader, {
			variant: "search",
			active: "agencies"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-[1080px] px-4 pb-16 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/postuler-un-projet",
					className: "mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
						className: "h-4 w-4",
						strokeWidth: 1.8
					}), "Postuler un projet"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-3 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "h-[18px] w-[18px] shrink-0 text-muted-foreground",
						strokeWidth: 1.7
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "search",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Décrivez le type d'agence que vous cherchez...",
						className: "min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground focus:outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterInput, {
						label: "Catégorie",
						placeholder: "Toutes les catégories",
						value: category,
						onChange: setCategory
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterInput, {
						label: "Sous-catégorie",
						placeholder: "Toutes les sous-catégories",
						value: subCategory,
						onChange: setSubCategory
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-[14px] font-semibold",
						children: [foundCount ?? 0, " agences trouvées"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground",
						children: [
							"Trier par",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: sort,
								onChange: (event) => setSort(event.target.value),
								className: "bg-transparent text-foreground outline-none",
								children: SORT_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: option.value,
									children: option.label
								}, option.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.8
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-6",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardGridSkeleton, { count: 8 }) : agencies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune agence à afficher." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4",
						children: agencies.map((agency) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex flex-col rounded-lg border border-border p-5 transition-colors hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[26px] font-bold tracking-tight",
									children: agency.logoText
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 text-[15px] font-bold",
									children: agency.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										className: "h-3.5 w-3.5 shrink-0",
										strokeWidth: 1.8
									}), agency.location]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[13.5px] leading-[1.55] text-muted-foreground",
									children: agency.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex items-center gap-1.5 text-[13.5px] font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											className: "h-3.5 w-3.5 fill-current",
											strokeWidth: 0
										}),
										agency.rating,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-normal text-muted-foreground",
											children: [
												"(",
												agency.reviewsCount,
												" avis)"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex flex-wrap gap-2 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/agences/$id",
										params: { id: agency.id },
										className: "rounded-md bg-primary px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
										children: "Contacter"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/agences/$id",
										params: { id: agency.id },
										className: "rounded-md border border-border px-4 py-2 text-[13.5px] font-semibold transition-colors hover:bg-accent",
										children: "Voir le profil"
									})]
								})
							]
						}, agency.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
					page,
					totalPages,
					onChange: setPage
				})
			]
		})]
	});
}
function FilterInput({ label, placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "text",
			value,
			onChange: (event) => onChange(event.target.value),
			placeholder,
			className: "mt-1 w-full bg-transparent text-left text-[14px] outline-none placeholder:text-muted-foreground"
		})]
	});
}
function Pagination({ page, totalPages, onChange }) {
	const pages = totalPages ?? 1;
	const visible = Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Pagination",
		className: "mt-12 flex flex-wrap items-center justify-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(Math.max(1, page - 1)),
				disabled: page === 1,
				className: "flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-3.5 w-3.5",
					strokeWidth: 1.8
				}), "Précédent"]
			}),
			visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(p),
				"aria-current": p === page ? "page" : void 0,
				className: p === page ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13.5px] font-semibold text-primary-foreground" : "flex h-7 w-7 items-center justify-center rounded-full text-[13.5px] transition-colors hover:bg-accent",
				children: p
			}, p)),
			pages > 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[13.5px] text-muted-foreground",
				children: "..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(pages),
				className: "flex h-7 w-7 items-center justify-center rounded-full text-[13.5px] transition-colors hover:bg-accent",
				children: pages
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(Math.min(pages, page + 1)),
				disabled: page === pages,
				className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
				children: ["Suivant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
					className: "h-3.5 w-3.5",
					strokeWidth: 1.8
				})]
			})
		]
	});
}
//#endregion
export { SearchAgenciesPage as component };
