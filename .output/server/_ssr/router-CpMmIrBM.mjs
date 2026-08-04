import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CpMmIrBM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-BZS8ybA7.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$29 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Plateforme agences & projets digitaux" },
			{
				name: "description",
				content: "Mettez en relation clients et agences digitales : briefing IA, opportunités, collaborations et facturation."
			},
			{
				property: "og:title",
				content: "Plateforme agences & projets digitaux"
			},
			{
				property: "og:description",
				content: "Briefing IA, recherche d'agences, suivi des projets et facturation dans un seul espace."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$29.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-right" })]
	});
}
var $$splitComponentImporter$28 = () => import("./routes-BQ6_DFnf.mjs");
var Route$28 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sortlist Pro — La plateforme B2B projets & agences" },
		{
			name: "description",
			content: "Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins. Sortlist Pro simplifie chaque étape."
		},
		{
			property: "og:title",
			content: "Sortlist Pro — La plateforme B2B projets & agences"
		},
		{
			property: "og:description",
			content: "Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./route-CaQZpIEO.mjs");
/**
* Middleware de protection des routes.
*
* Toute route sous /client/* et /agence/* passe par ce layout.
* // API CALL : auth.service.ts::getCurrentUser() -> frappeCall("auth.me")
* // en-têtes  : Authorization: Bearer <token>
* // réponse   : User -> si 401 (ou toute erreur), redirection vers /connexion
*
* La gestion du 401 elle-même (reset du store + redirection) est déjà faite de
* façon centralisée dans `services/http.ts` (voir `handleUnauthorized`) ; ce
* garde couvre en plus les cas "pas de token du tout" et "backend injoignable".
*/
var Route$27 = createFileRoute("/_authenticated")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./agences-CaMJabT6.mjs");
var Route$26 = createFileRoute("/agences")({
	head: () => ({ meta: [
		{ title: "Trouvez l'agence idéale — Sortlist Pro" },
		{
			name: "description",
			content: "Recherchez et comparez les agences par catégorie et sous-catégorie pour trouver le partenaire idéal de votre projet."
		},
		{
			property: "og:title",
			content: "Trouvez l'agence idéale — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Recherchez et comparez les agences pour votre projet."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./connexion-BDsmO2Je.mjs");
var Route$25 = createFileRoute("/connexion")({
	head: () => ({ meta: [
		{ title: "Connexion — Sortlist Pro" },
		{
			name: "description",
			content: "Connectez-vous à votre espace Sortlist Pro : détection automatique du type de compte après connexion."
		},
		{
			property: "og:title",
			content: "Connexion — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Connectez-vous pour accéder à votre espace Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./inscription-agence-DHIO5XqO.mjs");
/** Inscription agence — formulaire multi-étapes (mockups 10/11). */
var Route$24 = createFileRoute("/inscription-agence")({
	head: () => ({ meta: [
		{ title: "Inscription agence — Sortlist Pro" },
		{
			name: "description",
			content: "Créez le compte de votre agence : présentation, compétences, coordonnées et vérification."
		},
		{
			property: "og:title",
			content: "Inscription agence — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Rejoignez Sortlist Pro et recevez des opportunités qualifiées."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
objectType({
	name: stringType().trim().min(1, "Champ requis").max(120),
	description: stringType().trim().min(1, "Champ requis").max(2e3),
	foundedYear: stringType().trim().min(4, "Année invalide").max(4),
	teamSize: stringType().trim().min(1, "Champ requis").max(40),
	website: stringType().trim().url("URL invalide").max(255),
	skills: stringType().trim().min(1, "Champ requis").max(500),
	techStack: stringType().trim().min(1, "Champ requis").max(500),
	languages: stringType().trim().min(1, "Champ requis").max(200),
	location: stringType().trim().min(1, "Champ requis").max(120),
	address: stringType().trim().min(1, "Champ requis").max(255),
	phoneCountryCode: stringType().trim().min(1, "Champ requis").max(6),
	phone: stringType().trim().min(1, "Champ requis").max(30),
	email: stringType().trim().email("E-mail invalide").max(255),
	legalIdValue: stringType().trim().min(1, "Champ requis").max(80),
	verificationCode: stringType().trim().min(4, "Code invalide").max(8)
});
var $$splitComponentImporter$23 = () => import("./postuler-un-projet-DqJVxSGB.mjs");
/** Écrans 04a / 04b — SMART BRIEFING IA (parcours public : "Postuler un projet"). */
var Route$23 = createFileRoute("/postuler-un-projet")({
	head: () => ({ meta: [
		{ title: "Postuler un projet — Sortlist Pro" },
		{
			name: "description",
			content: "Décrivez votre besoin avec le Smart Briefing IA et générez votre cahier des charges en cinq étapes."
		},
		{
			property: "og:title",
			content: "Postuler un projet — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Décrivez votre besoin avec le Smart Briefing IA."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./projets-QwBjlM3h.mjs");
var Route$22 = createFileRoute("/projets")({
	head: () => ({ meta: [
		{ title: "Trouvez le projet idéal — Sortlist Pro" },
		{
			name: "description",
			content: "Parcourez les projets publiés par les entreprises et filtrez par catégorie, sous-catégorie et budget."
		},
		{
			property: "og:title",
			content: "Trouvez le projet idéal — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Parcourez les projets publiés par les entreprises."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
/**
* Filtre catégorie/sous-catégorie sous forme de menu déroulant réel,
* alimenté par `agencies.service.ts::getCategories` (`utils.get_categories`).
*/
var $$splitComponentImporter$21 = () => import("./agences._id-d_QlWCPp.mjs");
/** Profil public d'une agence — accessible sans connexion (bouton « Voir le profil »). */
var Route$21 = createFileRoute("/agences/$id")({
	head: () => ({ meta: [
		{ title: "Profil de l'agence — Sortlist Pro" },
		{
			name: "description",
			content: "Consultez la présentation, les compétences, le portfolio et les avis d'une agence avant de la contacter."
		},
		{
			property: "og:title",
			content: "Profil de l'agence — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Présentation, compétences, réalisations et avis clients de l'agence."
		},
		{
			property: "og:type",
			content: "profile"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./fonctionnalites._slug-wGGh2blm.mjs");
var Route$20 = createFileRoute("/fonctionnalites/$slug")({
	head: () => ({ meta: [
		{ title: "Fonctionnalités — Sortlist Pro" },
		{
			name: "description",
			content: "Découvrez en détail les fonctionnalités de Sortlist Pro : matching intelligent, projets ciblés, collaboration simplifiée."
		},
		{
			property: "og:title",
			content: "Fonctionnalités — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Découvrez en détail les fonctionnalités de Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./agence.analytics-BeA7jtYn.mjs");
/** Analytics PQI (Agence) — indicateurs de performance, graphiques, statistiques. */
var Route$19 = createFileRoute("/_authenticated/agence/analytics")({
	head: () => ({ meta: [
		{ title: "Analytics PQI — Sortlist Pro" },
		{
			name: "description",
			content: "Analysez votre score PQI, vos vues de profil, votre position moyenne et vos notes clients."
		},
		{
			property: "og:title",
			content: "Analytics PQI — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Indicateurs de performance de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./agence.facturation-GJn4wuLt.mjs");
/** Facturation (Agence) — factures émises / reçues, filtres, téléchargement. */
var Route$18 = createFileRoute("/_authenticated/agence/facturation")({
	head: () => ({ meta: [
		{ title: "Facturation — Sortlist Pro" },
		{
			name: "description",
			content: "Suivez vos factures émises et reçues, filtrez par statut et téléchargez vos documents."
		},
		{
			property: "og:title",
			content: "Facturation — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Factures et paiements de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
/**
* Le backend (`payment.list_invoices`) ne distingue pas "émises" vs "reçues"
* (pas de champ de direction confirmé sur `Invoice`) — seul le statut
* (paid/to_pay/late) est fiable. Les onglets "Émises"/"Reçues" affichent donc
* la même liste complète, faute de mieux ; "Payées"/"En retard" filtrent
* réellement par statut.
*/
var $$splitComponentImporter$17 = () => import("./agence.mes-prospections-DV5SVIT9.mjs");
/**
* Mes prospections (Agence) — suivi des prospects contactés.
*
* // NOTE (ambiguïté CDC) : consomme les mêmes leads que `agence.prospection.tsx`
* // (`prospection.service.ts::getLeads`) — pas de liste séparée "prospections
* // envoyées" côté backend (le microservice `prospection-service` expose des
* // *suggestions* de prospects, pas un journal des e-mails déjà envoyés). Les
* // onglets "Envoyées"/"Répondues"/"Sans réponse" n'ont donc pas de champ
* // backend correspondant pour l'instant (TODO backend : un tracking d'envoi
* // par lead, ex. `Lead.last_contacted_at`/`Lead.responded_at`, permettrait de
* // les distinguer réellement) — en attendant, ces onglets affichent tous la
* // liste complète des leads suggérés.
*/
var Route$17 = createFileRoute("/_authenticated/agence/mes-prospections")({
	head: () => ({ meta: [
		{ title: "Mes prospections — Sortlist Pro" },
		{
			name: "description",
			content: "Recherchez et suivez vos prospections envoyées, leurs réponses et leur statut."
		},
		{
			property: "og:title",
			content: "Mes prospections — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Suivi des prospections de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./agence.notifications-Gh1SOjwL.mjs");
/**
* Centre de notifications (Agence) — historique, filtres, statuts.
* Copie structurelle exacte de `client.notifications.tsx` (CDC §7.3 : le
* bouton "Historique des notifications" doit exister aussi bien côté
* dashboard Entreprise que côté dashboard Agence) — seuls le rôle passé à
* `DashboardShell` et les libellés changent.
* // API CALL : notifications.service.ts::getNotifications — pas de
* // paramètre `agencyContext` exposé aujourd'hui par ce service (propriété
* // d'un autre agent, hors périmètre de cette page) : identique au
* // comportement de `client.notifications.tsx`, alimenté par le même store
* // partagé (`notifications.store.ts`), déjà cohérent avec la cloche du
* // header quel que soit le rôle actif.
*/
var Route$16 = createFileRoute("/_authenticated/agence/notifications")({
	head: () => ({ meta: [
		{ title: "Historique des notifications — Sortlist Pro" },
		{
			name: "description",
			content: "Consultez l'historique complet des notifications de votre agence, filtrez par type et par statut."
		},
		{
			property: "og:title",
			content: "Historique des notifications — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Centre de notifications de votre espace agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./agence.opportunites-DsJtgDri.mjs");
/** Opportunités (Agence) — offres disponibles, filtres, tri, pagination. */
var Route$15 = createFileRoute("/_authenticated/agence/opportunites")({
	head: () => ({ meta: [
		{ title: "Opportunités — Sortlist Pro" },
		{
			name: "description",
			content: "Offres disponibles, projets gagnés, en pause, terminés et archivés pour votre agence."
		},
		{
			property: "og:title",
			content: "Opportunités — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Parcourez et filtrez les opportunités adressées à votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
/** L'onglet "Toutes" n'a pas d'équivalent backend dédié : il pointe vers le
* tab "Offres" (`OpportunityTab.offers`), qui est la file d'attente
* principale (nouvelles offres + offres déjà acceptées en attente de devis). */
/**
* Une opportunité est considérée "Acceptée" (étape 1/2 du workflow devis,
* CDC §1.5.6/§2.3) si elle porte une date d'acceptation mais pas encore de
* devis. Il n'existe pas de champ `step` dédié "accepted" côté mapping
* (`opportunities.service.ts::mapOpportunity`) — approximation basée sur les
* champs disponibles.
*/
var $$splitComponentImporter$14 = () => import("./agence.parametres-CFWyFFji.mjs");
/** Paramètres (Agence) — configuration du compte et préférences. */
var Route$14 = createFileRoute("/_authenticated/agence/parametres")({
	head: () => ({ meta: [
		{ title: "Paramètres agence — Sortlist Pro" },
		{
			name: "description",
			content: "Configurez votre compte agence : préférences d'affichage, notifications, sécurité et facturation."
		},
		{
			property: "og:title",
			content: "Paramètres agence — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Configuration du compte de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
objectType({
	currentPassword: stringType().min(1, "Champ requis").max(128),
	newPassword: stringType().min(8, "8 caractères minimum").max(128),
	confirmPassword: stringType().min(8, "8 caractères minimum").max(128)
}).refine((values) => values.newPassword === values.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"]
});
objectType({
	billingEmail: stringType().trim().email("E-mail invalide").max(255),
	vatNumber: stringType().trim().min(1, "Champ requis").max(40),
	billingAddress: stringType().trim().min(1, "Champ requis").max(255)
});
var $$splitComponentImporter$13 = () => import("./agence.profil-W1FIuBAP.mjs");
/** Profil agence — présentation, compétences, portfolio, coordonnées. */
var Route$13 = createFileRoute("/_authenticated/agence/profil")({
	head: () => ({ meta: [
		{ title: "Profil agence — Sortlist Pro" },
		{
			name: "description",
			content: "Gérez la présentation de votre agence, vos compétences, votre portfolio et vos coordonnées."
		},
		{
			property: "og:title",
			content: "Profil agence — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Profil public de votre agence sur Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
objectType({
	name: stringType().trim().min(1, "Champ requis").max(120),
	description: stringType().trim().min(1, "Champ requis").max(2e3),
	foundedYear: stringType().trim().min(4, "Année invalide").max(4),
	teamSize: stringType().trim().min(1, "Champ requis").max(40),
	website: stringType().trim().url("URL invalide").max(255),
	location: stringType().trim().min(1, "Champ requis").max(120),
	legalIdValue: stringType().trim().min(1, "Champ requis").max(80),
	phoneCountryCode: stringType().trim().min(1, "Champ requis").max(6),
	phone: stringType().trim().min(1, "Champ requis").max(30),
	email: stringType().trim().email("E-mail invalide").max(255),
	address: stringType().trim().min(1, "Champ requis").max(255)
});
var $$splitComponentImporter$12 = () => import("./agence.projets-en-cours-kXAqQBpU.mjs");
/** Projets en cours (Agence) — recherche, filtres, tri, pagination. */
var Route$12 = createFileRoute("/_authenticated/agence/projets-en-cours")({
	head: () => ({ meta: [
		{ title: "Projets en cours — Sortlist Pro" },
		{
			name: "description",
			content: "Suivez l'avancement de vos projets clients, leurs statuts et leurs échéances."
		},
		{
			property: "og:title",
			content: "Projets en cours — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Liste des projets en cours de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./agence.prospection-D13jViGF.mjs");
/** Prospection IA (Agence) — suggestions intelligentes de clients. */
var Route$11 = createFileRoute("/_authenticated/agence/prospection")({
	head: () => ({ meta: [
		{ title: "Prospection IA — Sortlist Pro" },
		{
			name: "description",
			content: "Découvrez les prospects suggérés par l'IA, leur score d'intérêt et générez vos e-mails de contact."
		},
		{
			property: "og:title",
			content: "Prospection IA — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Suggestions intelligentes de clients pour votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./agence.suspension-DCZwbSgv.mjs");
/** Suspension (Agence) — litiges, signalements, historique. */
var Route$10 = createFileRoute("/_authenticated/agence/suspension")({
	head: () => ({ meta: [
		{ title: "Suspensions et litiges — Sortlist Pro" },
		{
			name: "description",
			content: "Gérez les suspensions de projet, répondez aux signalements et consultez l'historique des litiges."
		},
		{
			property: "og:title",
			content: "Suspensions et litiges — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Suivi des litiges et signalements côté agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./agence.tableau-de-bord-BjXVFJI0.mjs");
/** Tableau de bord Agence — statistiques, projets récents, activités. */
var Route$9 = createFileRoute("/_authenticated/agence/tableau-de-bord")({
	head: () => ({ meta: [
		{ title: "Tableau de bord Agence — Sortlist Pro" },
		{
			name: "description",
			content: "Suivez vos opportunités, vos projets en cours, votre score PQI et votre activité récente."
		},
		{
			property: "og:title",
			content: "Tableau de bord Agence — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Aperçu de l'activité de votre agence sur Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./agence.workflow-lz3uIR49.mjs");
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
var Route$8 = createFileRoute("/_authenticated/agence/workflow")({
	head: () => ({ meta: [
		{ title: "Workflow des opportunités — Sortlist Pro" },
		{
			name: "description",
			content: "Suivez chaque étape de traitement de vos opportunités : devis, négociation, signature."
		},
		{
			property: "og:title",
			content: "Workflow des opportunités — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Étapes de traitement des opportunités de votre agence."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./client.collaborations-TZvmTqto.mjs");
/** Écran Collaborations (espace Client) — agences avec projets terminés. */
var Route$7 = createFileRoute("/_authenticated/client/collaborations")({
	head: () => ({ meta: [
		{ title: "Collaborations — Sortlist Pro" },
		{
			name: "description",
			content: "Retrouvez les agences avec lesquelles vous avez des projets terminés, filtrez par période, note et budget."
		},
		{
			property: "og:title",
			content: "Collaborations — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Agences avec lesquelles vous avez des projets terminés."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./client.mes-projets-BH-sutdR.mjs");
/** Écran 15 — MES PROJETS (espace Client). */
var Route$6 = createFileRoute("/_authenticated/client/mes-projets")({
	head: () => ({ meta: [
		{ title: "Mes projets — Sortlist Pro" },
		{
			name: "description",
			content: "Recherchez, filtrez et suivez l'ensemble de vos projets : brouillons, publiés, en cours et terminés."
		},
		{
			property: "og:title",
			content: "Mes projets — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Suivez l'ensemble de vos projets sur Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./client.mon-profil-C7g9eKUT.mjs");
/** Écran 13 — MON PROFIL (Client) : informations entreprise + score de confiance. */
var Route$5 = createFileRoute("/_authenticated/client/mon-profil")({
	head: () => ({ meta: [
		{ title: "Mon profil — Sortlist Pro" },
		{
			name: "description",
			content: "Complétez les informations de votre entreprise et suivez votre score de confiance."
		},
		{
			property: "og:title",
			content: "Mon profil — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Informations entreprise et score de confiance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
objectType({
	contactLastName: stringType().trim().min(1, "Champ requis").max(80),
	contactFirstName: stringType().trim().min(1, "Champ requis").max(80),
	companyName: stringType().trim().min(1, "Champ requis").max(120),
	activitySector: stringType().trim().min(1, "Champ requis").max(120),
	country: stringType().trim().min(1, "Champ requis").max(80),
	legalIdType: stringType().trim().min(1, "Champ requis").max(80),
	legalIdValue: stringType().trim().min(1, "Champ requis").max(80)
});
var $$splitComponentImporter$4 = () => import("./client.notifications-B2szTjR3.mjs");
/** Centre de notifications (Client) — historique, filtres, statuts. */
var Route$4 = createFileRoute("/_authenticated/client/notifications")({
	head: () => ({ meta: [
		{ title: "Historique des notifications — Sortlist Pro" },
		{
			name: "description",
			content: "Consultez l'historique complet de vos notifications, filtrez par type et par statut."
		},
		{
			property: "og:title",
			content: "Historique des notifications — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Centre de notifications de votre espace client."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./client.parametres-3NnNLBWE.mjs");
/** Écran 14 — PARAMÈTRES (Client) : préférences + sécurité (mot de passe). */
var Route$3 = createFileRoute("/_authenticated/client/parametres")({
	head: () => ({ meta: [
		{ title: "Paramètres — Sortlist Pro" },
		{
			name: "description",
			content: "Gérez vos préférences d'affichage, vos notifications et votre mot de passe."
		},
		{
			property: "og:title",
			content: "Paramètres — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Préférences et sécurité de votre compte client."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
objectType({
	currentPassword: stringType().min(1, "Champ requis").max(128),
	newPassword: stringType().min(8, "8 caractères minimum").max(128),
	confirmPassword: stringType().min(8, "8 caractères minimum").max(128)
}).refine((values) => values.newPassword === values.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"]
});
var $$splitComponentImporter$2 = () => import("./client.postuler-un-projet-Dp_J2E8A.mjs");
/** Écrans 04a / 04b — SMART BRIEFING IA depuis l'espace Client connecté. */
var Route$2 = createFileRoute("/_authenticated/client/postuler-un-projet")({
	head: () => ({ meta: [
		{ title: "Postuler un projet — Sortlist Pro" },
		{
			name: "description",
			content: "Déposez un nouveau projet : le Smart Briefing IA structure votre cahier des charges en cinq étapes."
		},
		{
			property: "og:title",
			content: "Postuler un projet — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Déposez un nouveau projet et trouvez les meilleures agences."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./client.tableau-de-bord-B88Ph7pf.mjs");
/** Écran 12 — TABLEAU DE BORD CLIENT. */
var Route$1 = createFileRoute("/_authenticated/client/tableau-de-bord")({
	head: () => ({ meta: [
		{ title: "Tableau de bord Client — Sortlist Pro" },
		{
			name: "description",
			content: "Suivez votre score de confiance, vos projets publiés, votre taux de réponse et vos collaborations en cours."
		},
		{
			property: "og:title",
			content: "Tableau de bord Client — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Aperçu de votre activité sur Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./client.mes-projets._id-DD1FDQKj.mjs");
/**
* Écran 15bis — DÉTAIL D'UN PROJET (CDC §1.5.8, MUST).
* Route manquante identifiée dans la passe précédente : `client.tableau-de-bord.tsx`
* et `client.mes-projets.tsx` laissaient "Voir le projet" en `uiAction` faute
* de cible. Structure de fichier calquée sur `agences.$id.tsx`.
*/
var Route = createFileRoute("/_authenticated/client/mes-projets/$id")({
	head: () => ({ meta: [
		{ title: "Détail du projet — Sortlist Pro" },
		{
			name: "description",
			content: "Consultez le détail de votre projet : cahier des charges, shortlist d'agences recommandées et suivi des litiges."
		},
		{
			property: "og:title",
			content: "Détail du projet — Sortlist Pro"
		},
		{
			property: "og:description",
			content: "Suivi complet d'un projet publié sur Sortlist Pro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$28.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$29
});
var AuthenticatedRouteRoute = Route$27.update({
	id: "/_authenticated",
	getParentRoute: () => Route$29
});
var AgencesRoute = Route$26.update({
	id: "/agences",
	path: "/agences",
	getParentRoute: () => Route$29
});
var ConnexionRoute = Route$25.update({
	id: "/connexion",
	path: "/connexion",
	getParentRoute: () => Route$29
});
var InscriptionAgenceRoute = Route$24.update({
	id: "/inscription-agence",
	path: "/inscription-agence",
	getParentRoute: () => Route$29
});
var PostulerUnProjetRoute = Route$23.update({
	id: "/postuler-un-projet",
	path: "/postuler-un-projet",
	getParentRoute: () => Route$29
});
var ProjetsRoute = Route$22.update({
	id: "/projets",
	path: "/projets",
	getParentRoute: () => Route$29
});
var AgencesIdRoute = Route$21.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AgencesRoute
});
var FonctionnalitesSlugRoute = Route$20.update({
	id: "/fonctionnalites/$slug",
	path: "/fonctionnalites/$slug",
	getParentRoute: () => Route$29
});
var AuthenticatedAgenceAnalyticsRoute = Route$19.update({
	id: "/agence/analytics",
	path: "/agence/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceFacturationRoute = Route$18.update({
	id: "/agence/facturation",
	path: "/agence/facturation",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceMesProspectionsRoute = Route$17.update({
	id: "/agence/mes-prospections",
	path: "/agence/mes-prospections",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceNotificationsRoute = Route$16.update({
	id: "/agence/notifications",
	path: "/agence/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceOpportunitesRoute = Route$15.update({
	id: "/agence/opportunites",
	path: "/agence/opportunites",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceParametresRoute = Route$14.update({
	id: "/agence/parametres",
	path: "/agence/parametres",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceProfilRoute = Route$13.update({
	id: "/agence/profil",
	path: "/agence/profil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceProjetsEnCoursRoute = Route$12.update({
	id: "/agence/projets-en-cours",
	path: "/agence/projets-en-cours",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceProspectionRoute = Route$11.update({
	id: "/agence/prospection",
	path: "/agence/prospection",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceSuspensionRoute = Route$10.update({
	id: "/agence/suspension",
	path: "/agence/suspension",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceTableauDeBordRoute = Route$9.update({
	id: "/agence/tableau-de-bord",
	path: "/agence/tableau-de-bord",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgenceWorkflowRoute = Route$8.update({
	id: "/agence/workflow",
	path: "/agence/workflow",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientCollaborationsRoute = Route$7.update({
	id: "/client/collaborations",
	path: "/client/collaborations",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientMesProjetsRoute = Route$6.update({
	id: "/client/mes-projets",
	path: "/client/mes-projets",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientMonProfilRoute = Route$5.update({
	id: "/client/mon-profil",
	path: "/client/mon-profil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientNotificationsRoute = Route$4.update({
	id: "/client/notifications",
	path: "/client/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientParametresRoute = Route$3.update({
	id: "/client/parametres",
	path: "/client/parametres",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientPostulerUnProjetRoute = Route$2.update({
	id: "/client/postuler-un-projet",
	path: "/client/postuler-un-projet",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientTableauDeBordRoute = Route$1.update({
	id: "/client/tableau-de-bord",
	path: "/client/tableau-de-bord",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientMesProjetsRouteChildren = { AuthenticatedClientMesProjetsIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedClientMesProjetsRoute
}) };
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAgenceAnalyticsRoute,
	AuthenticatedAgenceFacturationRoute,
	AuthenticatedAgenceMesProspectionsRoute,
	AuthenticatedAgenceNotificationsRoute,
	AuthenticatedAgenceOpportunitesRoute,
	AuthenticatedAgenceParametresRoute,
	AuthenticatedAgenceProfilRoute,
	AuthenticatedAgenceProjetsEnCoursRoute,
	AuthenticatedAgenceProspectionRoute,
	AuthenticatedAgenceSuspensionRoute,
	AuthenticatedAgenceTableauDeBordRoute,
	AuthenticatedAgenceWorkflowRoute,
	AuthenticatedClientCollaborationsRoute,
	AuthenticatedClientMesProjetsRoute: AuthenticatedClientMesProjetsRoute._addFileChildren(AuthenticatedClientMesProjetsRouteChildren),
	AuthenticatedClientMonProfilRoute,
	AuthenticatedClientNotificationsRoute,
	AuthenticatedClientParametresRoute,
	AuthenticatedClientPostulerUnProjetRoute,
	AuthenticatedClientTableauDeBordRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AgencesRouteChildren = { AgencesIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AgencesRoute: AgencesRoute._addFileChildren(AgencesRouteChildren),
	ConnexionRoute,
	InscriptionAgenceRoute,
	PostulerUnProjetRoute,
	ProjetsRoute,
	FonctionnalitesSlugRoute
};
var routeTree = Route$29._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route as n, Route$21 as r, router_exports as t };
