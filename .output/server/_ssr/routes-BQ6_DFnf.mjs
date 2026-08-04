import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as FileText, at as Briefcase, dt as ArrowRight, i as Users, l as Target, lt as Ban, o as UserRound, p as Shield } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as MarketingHeader } from "./MarketingHeader-DqeWYIZf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BQ6_DFnf.js
var import_jsx_runtime = require_jsx_runtime();
var AUDIENCES = [
	{
		icon: UserRound,
		title: "Entreprises",
		description: "Trouvez l'agence parfaite pour vos projets."
	},
	{
		icon: Briefcase,
		title: "Agences",
		description: "Trouvez les projets qui correspondent à votre expertise."
	},
	{
		icon: Shield,
		title: "Sécurité",
		description: "Une collaboration transparente et en toute confiance."
	}
];
var ADVANTAGES = [
	{
		icon: Target,
		title: "Matching intelligent",
		slug: "matching-intelligent",
		description: "Notre IA analyse vos besoins et votre expertise pour vous proposer les meilleurs partenaires ou projets."
	},
	{
		icon: FileText,
		title: "Projets ciblés",
		slug: "projets-cibles",
		description: "Accédez à des projets qualifiés et pertinents, adaptés à vos compétences et à vos objectifs."
	},
	{
		icon: Users,
		title: "Collaboration simplifiée",
		slug: "collaboration-simplifiee",
		description: "Outils intégrés pour gérer vos échanges, vos fichiers, et vos suivis de projet efficacement."
	},
	{
		icon: Ban,
		title: "Zéro frais de dépôt",
		slug: "zero-frais-de-depot",
		description: "Aucun frais d'inscription ni frais de dépôt. Vous payez uniquement pour la réussite."
	}
];
var TRUST_LOGOS = [
	"DECATHLON",
	"alan",
	"Qonto",
	"Doctolib",
	"BlaBlaCar",
	"leboncoin"
];
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHeader, { variant: "landing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "pt-16 text-center sm:pt-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mx-auto max-w-[640px] text-[38px] font-bold leading-[1.15] tracking-tight sm:text-[46px]",
							children: "La plateforme B2B qui connecte vos projets aux meilleures agences."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-5 max-w-[520px] text-[15px] leading-6 text-foreground",
							children: "Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins. Que vous soyez une entreprise ou une agence, Sortlist Pro simplifie chaque étape."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-8 text-left sm:grid-cols-3",
							children: AUDIENCES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "mt-0.5 h-[22px] w-[22px] shrink-0",
									strokeWidth: 1.6
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-[14px] font-bold",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[13.5px] leading-[1.45] text-muted-foreground",
										children: item.description
									})]
								})]
							}, item.title))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "pt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-[16px] font-bold",
						children: "Pourquoi choisir Sortlist Pro ?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4",
						children: ADVANTAGES.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: index === 0 ? "flex flex-col p-6" : "flex flex-col p-6 lg:border-l lg:border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "h-[22px] w-[22px]",
									strokeWidth: 1.6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-6 text-[15px] font-bold",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[13.5px] leading-[1.55] text-muted-foreground",
									children: item.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/fonctionnalites/$slug",
									params: { slug: item.slug },
									className: "mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70",
									children: ["Découvrir plus", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "h-3.5 w-3.5",
										strokeWidth: 2
									})]
								})
							]
						}, item.title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-[15px] font-bold",
						children: "Ils nous font confiance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6",
						children: TRUST_LOGOS.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[16px] font-semibold tracking-tight",
							children: logo
						}, logo))
					})]
				})
			]
		})]
	});
}
//#endregion
export { HomePage as component };
