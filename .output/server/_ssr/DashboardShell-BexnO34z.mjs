import { r as __toESM } from "../_runtime.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { a as frappeCall, n as GATEWAY_URL, o as restCall, r as camelizeKeys, t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as getMyAgencies, g as requestToJoinAgency, t as EmptyState, v as searchAgencies } from "./EmptyState-tYTEkNIz.mjs";
import { l as switchAgency, o as logout } from "./auth.service-DwH5fz0r.mjs";
import { $ as Check, I as Folder, J as CirclePlay, L as FileText, M as LayoutGrid, Q as ChevronDown, T as MessageCircle, U as Compass, X as ChevronRight, Z as ChevronLeft, _ as Send, a as User, at as Briefcase, ct as Bell, g as Settings, h as ShieldAlert, i as Users, it as Building2, j as LoaderCircle, k as LogOut, n as Workflow, ot as Bot, q as CircleQuestionMark, t as X, tt as ChartColumn, x as Plus, z as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CHGFKbne.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-BexnO34z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Store de l'agence active pour les comptes multi-agences (CDC §2.1.1 —
* sélecteur d'agence / bascule).
*
* Persisté en localStorage (clé "agency-storage") comme `auth.store.ts`, pour
* que l'agence active survive à un rafraîchissement de page. `agencies`
* (liste des agences accessibles) est aussi persisté pour un premier rendu
* sans latence, mais reste rafraîchi à chaque `getMyAgencies()`.
*/
var useAgencyStore = create()(persist((set) => ({
	activeAgencyId: null,
	agencies: [],
	setActiveAgency: (agencyId) => set({ activeAgencyId: agencyId }),
	setAgencies: (agencies) => set({ agencies })
}), {
	name: "agency-storage",
	partialize: (state) => ({
		activeAgencyId: state.activeAgencyId,
		agencies: state.agencies
	})
}));
var useNotificationsStore = create((set) => ({
	notifications: [],
	unreadCount: 0,
	isLoading: false,
	setNotifications: (notifications) => set({ notifications }),
	setUnreadCount: (unreadCount) => set({ unreadCount }),
	setLoading: (isLoading) => set({ isLoading })
}));
/**
* // API CALL : restCall('ia', token ? '/chatbot' : '/chatbot/public', { method: 'POST', body: { message, context } })
*/
async function sendChatbotMessage(message, context = {}) {
	const isAuthenticated = Boolean(useAuthStore.getState().token);
	const raw = await restCall("ia", isAuthenticated ? "/chatbot" : "/chatbot/public", {
		method: "POST",
		body: {
			message,
			context
		}
	});
	const data = camelizeKeys(raw);
	return {
		reply: String(data["reply"] ?? ""),
		escalate: Boolean(data["escalate"] ?? false),
		matchedTopic: data["matchedTopic"] ?? null
	};
}
function Chatbot() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	async function handleSubmit(event) {
		event.preventDefault();
		const content = draft.trim();
		if (!content || isSending) return;
		const userEntry = {
			id: `u-${Date.now()}`,
			author: "user",
			content
		};
		setEntries((prev) => [...prev, userEntry]);
		setDraft("");
		setIsSending(true);
		try {
			const result = await sendChatbotMessage(content);
			setEntries((prev) => [...prev, {
				id: `b-${Date.now()}`,
				author: "bot",
				content: result.reply,
				escalate: result.escalate
			}]);
		} catch (error) {
			setEntries((prev) => [...prev, {
				id: `b-${Date.now()}`,
				author: "bot",
				content: error instanceof ApiError ? error.message : "Le chatbot est momentanément indisponible, réessayez plus tard."
			}]);
		} finally {
			setIsSending(false);
			inputRef.current?.focus();
		}
	}
	if (!isOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setIsOpen(true),
		"aria-label": "Ouvrir l'assistant",
		className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
			className: "h-6 w-6",
			strokeWidth: 1.8
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-50 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-[13.5px] font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
						className: "h-4 w-4",
						strokeWidth: 1.8
					}), "Assistant Sortlist Pro"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIsOpen(false),
					"aria-label": "Fermer l'assistant",
					className: "text-muted-foreground transition-colors hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-4 w-4",
						strokeWidth: 1.8
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-4",
				children: [entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-muted-foreground",
					children: "Posez une question — sur votre projet, votre facturation ou le fonctionnement de la plateforme."
				}) : entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: entry.author === "user" ? "ml-6 rounded-lg border border-border px-3 py-2" : "mr-6 rounded-lg bg-accent px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line text-[13px] leading-[1.5]",
						children: entry.content
					}), entry.escalate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-[11.5px] font-semibold text-muted-foreground",
						children: "Transmis à un conseiller humain"
					}) : null]
				}, entry.id)), isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mr-6 flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-3.5 w-3.5 animate-spin",
						strokeWidth: 1.8
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px]",
						children: "L'assistant écrit..."
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "text",
					value: draft,
					onChange: (event) => setDraft(event.target.value),
					placeholder: "Votre question...",
					className: "min-w-0 flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-muted-foreground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: isSending || !draft.trim(),
					"aria-label": "Envoyer",
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
						className: "h-3.5 w-3.5",
						strokeWidth: 1.8
					})
				})]
			})
		]
	});
}
/**
* // API CALL : frappeCall("demo.get_guide", { account_type })
* // `account_type` attendu par le backend : "client" | "agency" (voir
* // `GUIDE_STEPS` dans `platform_core/platform_core/api/demo.py`), identique
* // à `UserRole` côté frontend.
*/
async function getDemoGuide(accountType) {
	const raw = await frappeCall("demo.get_guide", { account_type: accountType });
	const data = camelizeKeys(raw);
	return {
		steps: (Array.isArray(data["steps"]) ? data["steps"] : []).map((item) => {
			const s = camelizeKeys(item);
			const rawUrl = String(s["videoUrl"] ?? "");
			return {
				step: Number(s["step"] ?? 0),
				title: String(s["title"] ?? ""),
				videoUrl: rawUrl.startsWith("http") ? rawUrl : `${GATEWAY_URL}${rawUrl}`
			};
		}),
		currentStep: Number(data["currentStep"] ?? 0),
		completed: Boolean(data["completed"] ?? false)
	};
}
/**
* // API CALL : frappeCall("demo.set_progress", { step, completed })
*/
async function setDemoProgress(step, completed) {
	const raw = await frappeCall("demo.set_progress", {
		step,
		completed: completed ? 1 : 0
	});
	const data = camelizeKeys(raw);
	return {
		step: Number(data["step"] ?? step),
		completed: Boolean(data["completed"] ?? completed)
	};
}
/**
* Placeholders vidéo — à REMPLACER par de vraies URLs Vimeo/Mux quand elles
* seront disponibles. Utilisés uniquement en repli si `demo.get_guide` ne
* renvoie pas d'étapes (ou avant que la réponse backend soit arrivée) : le
* backend (`platform_core/platform_core/api/demo.py::GUIDE_STEPS`) renvoie
* déjà de vraies étapes avec des `video_url` relatives (`/files/demo/...`),
* elles-mêmes des placeholders côté backend (fichiers `.mp4` qui n'existent
* probablement pas encore sur le serveur Frappe).
*/
var FALLBACK_VIDEO_URL = "https://player.vimeo.com/video/000000000";
var FALLBACK_STEPS = {
	client: [
		{
			step: 0,
			title: "Bienvenue",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 1,
			title: "Postuler un projet (Smart Briefing IA)",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 2,
			title: "Suivre Mes Projets",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 3,
			title: "Actions rapides : Unicast & Multicast",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 4,
			title: "Collaborations & avis",
			videoUrl: FALLBACK_VIDEO_URL
		}
	],
	agency: [
		{
			step: 0,
			title: "Bienvenue",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 1,
			title: "Compléter votre profil (PQI)",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 2,
			title: "Gérer vos Opportunités",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 3,
			title: "Analytics & Prospection",
			videoUrl: FALLBACK_VIDEO_URL
		},
		{
			step: 4,
			title: "Facturation",
			videoUrl: FALLBACK_VIDEO_URL
		}
	]
};
/**
* Guide vidéo étape par étape (module 5 du CDC) — composant AUTONOME,
* volontairement non monté (voir la même consigne que `Chatbot.tsx`).
*
* Utilisation prévue : `<DemoGuide accountType="client" open={open} onOpenChange={setOpen} />`
* depuis un bouton "Démo"/"Guide" à ajouter dans `DashboardShell.tsx` (hors
* portée de cette passe, un autre agent y travaille en parallèle).
*/
function DemoGuide({ accountType, open, onOpenChange }) {
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [hasError, setHasError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setIsLoading(true);
		setHasError(false);
		getDemoGuide(accountType).then((guide) => {
			setSteps(guide.steps.length > 0 ? guide.steps : FALLBACK_STEPS[accountType]);
			setCurrentStep(guide.currentStep);
		}).catch(() => {
			setHasError(true);
			setSteps(FALLBACK_STEPS[accountType]);
		}).finally(() => setIsLoading(false));
	}, [open, accountType]);
	function goTo(step) {
		if (step < 0 || step >= steps.length) return;
		setCurrentStep(step);
		setDemoProgress(step, step === steps.length - 1).catch(() => {});
	}
	if (!open) return null;
	const activeStep = steps[currentStep];
	const progressPercent = steps.length > 0 ? Math.round((currentStep + 1) / steps.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[640px] rounded-lg border border-border bg-background shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[15px] font-bold",
					children: ["Guide de démarrage — ", accountType === "agency" ? "Agence" : "Client"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenChange(false),
					"aria-label": "Fermer le guide",
					className: "text-muted-foreground transition-colors hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-4 w-4",
						strokeWidth: 1.8
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-6",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : steps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune étape de démonstration disponible." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					hasError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-[12.5px] text-muted-foreground",
						children: "Guide affiché en mode hors-ligne (impossible de contacter le serveur)."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-video w-full overflow-hidden rounded-md border border-border bg-accent/40",
						children: activeStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: activeStep.videoUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, {
								className: "h-10 w-10",
								strokeWidth: 1.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12.5px]",
								children: "Regarder la vidéo"
							})]
						}) : null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[14px] font-bold",
						children: activeStep?.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-1.5 w-full overflow-hidden rounded-full bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${progressPercent}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1.5 text-[12px] text-muted-foreground",
						children: [
							"Étape ",
							currentStep + 1,
							" sur ",
							steps.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => goTo(currentStep - 1),
							disabled: currentStep === 0,
							className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.8
							}), "Précédent"]
						}), currentStep === steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							className: "rounded-md bg-primary px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
							children: "Terminer"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => goTo(currentStep + 1),
							className: "flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
							children: ["Suivant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.8
							})]
						})]
					})
				] })
			})]
		})
	});
}
var CLIENT_NAV = [
	{
		label: "Tableau de bord",
		to: "/client/tableau-de-bord",
		icon: LayoutGrid
	},
	{
		label: "Mon profil",
		to: "/client/mon-profil",
		icon: User
	},
	{
		label: "Postuler un projet",
		to: "/client/postuler-un-projet",
		icon: Send
	},
	{
		label: "Mes projets",
		to: "/client/mes-projets",
		icon: Folder
	},
	{
		label: "Collaborations",
		to: "/client/collaborations",
		icon: Users
	},
	{
		label: "Historique des notifications",
		to: "/client/notifications",
		icon: Bell
	},
	{
		label: "Paramètres",
		to: "/client/parametres",
		icon: Settings
	}
];
var AGENCY_NAV = [
	{
		label: "Tableau de bord",
		to: "/agence/tableau-de-bord",
		icon: LayoutGrid
	},
	{
		label: "Opportunités",
		to: "/agence/opportunites",
		icon: Briefcase
	},
	{
		label: "Mes prospections",
		to: "/agence/mes-prospections",
		icon: Compass
	},
	{
		label: "Workflow",
		to: "/agence/workflow",
		icon: Workflow
	},
	{
		label: "Projets en cours",
		to: "/agence/projets-en-cours",
		icon: Folder
	},
	{
		label: "Suspension",
		to: "/agence/suspension",
		icon: ShieldAlert
	},
	{
		label: "Prospection",
		to: "/agence/prospection",
		icon: Users
	},
	{
		label: "Analytics",
		to: "/agence/analytics",
		icon: ChartColumn
	},
	{
		label: "Facturation",
		to: "/agence/facturation",
		icon: FileText
	},
	{
		label: "Profil agence",
		to: "/agence/profil",
		icon: Building2
	},
	{
		label: "Historique des notifications",
		to: "/agence/notifications",
		icon: Bell
	},
	{
		label: "Paramètres",
		to: "/agence/parametres",
		icon: Settings
	}
];
function DashboardShell({ role, children }) {
	const items = role === "client" ? CLIENT_NAV : AGENCY_NAV;
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const user = useAuthStore((state) => state.user);
	const unreadCount = useNotificationsStore((state) => state.unreadCount);
	const [isDemoOpen, setIsDemoOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "truncate text-[24px] font-bold tracking-tight",
						children: "Sortlist Pro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsDemoOpen(true),
								type: "button",
								"aria-label": "Découvrir la plateforme",
								title: "Découvrir la plateforme",
								className: "text-foreground transition-opacity hover:opacity-70",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, {
									className: "h-[21px] w-[21px]",
									strokeWidth: 1.6
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void navigate({ to: role === "client" ? "/client/notifications" : "/agence/notifications" }),
								type: "button",
								"aria-label": "Notifications",
								className: "relative text-foreground transition-opacity hover:opacity-70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
									className: "h-[21px] w-[21px]",
									strokeWidth: 1.6
								}), unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[13px] font-semibold text-primary-foreground",
									children: unreadCount
								}) : null]
							}),
							role === "agency" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-6 w-px bg-border",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgencySwitcher, {})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-6 w-px bg-border",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex items-center gap-2 text-left transition-opacity hover:opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-[13px] font-semibold",
											children: user?.initials ?? ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "hidden min-w-0 leading-tight sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-[15px] font-semibold",
												children: user?.displayName ?? ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-[13px] text-muted-foreground",
												children: role === "client" ? "Client (Entreprise)" : "Agence"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
											className: "h-4 w-4 shrink-0",
											strokeWidth: 1.6
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: user?.displayName ?? "Mon compte" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										className: "gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: role === "client" ? "/client/parametres" : "/agence/parametres",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
												className: "h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), "Paramètres"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										className: "gap-2",
										onClick: () => {
											logout().finally(() => {
												navigate({ to: "/connexion" });
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
											className: "h-4 w-4 shrink-0",
											strokeWidth: 1.7
										}), "Se déconnecter"]
									})
								]
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-[69px] hidden h-[calc(100vh-69px)] w-[248px] shrink-0 flex-col justify-between px-4 py-6 lg:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "space-y-1",
						children: items.map((item) => {
							const isActive = pathname === item.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: isActive ? "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-semibold text-foreground before:absolute before:-left-4 before:top-1 before:h-[calc(100%-8px)] before:w-[3px] before:rounded-full before:bg-primary" : "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "h-[18px] w-[18px] shrink-0",
									strokeWidth: 1.7
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}, item.to);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-[15px] font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, {
								className: "h-4 w-4",
								strokeWidth: 1.7
							}), "Besoin d'aide ?"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/centre-aide",
							className: "flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground",
							children: ["Consulter notre centre d'aide", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								className: "h-3 w-3",
								strokeWidth: 1.7
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chatbot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoGuide, {
				accountType: role,
				open: isDemoOpen,
				onOpenChange: setIsDemoOpen
			})
		]
	});
}
/**
* Sélecteur d'agence (bascule multi-agences) + bouton "+" pour rejoindre une
* agence — CDC §2.1.1. Visible uniquement pour les comptes Agence (rendu
* conditionnel dans `DashboardShell`), affiché discrètement à côté du
* nom/avatar dans le header. Réutilise les primitives shadcn déjà utilisées
* ailleurs dans le repo (`DropdownMenu`, `ActionModal`).
*
* Branché sur `agencies.service.ts::getMyAgencies` (liste), `auth.service.ts::switchAgency`
* (bascule — récupère et stocke un nouveau JWT scoped) et
* `agencies.service.ts::requestToJoinAgency` (bouton "+"). L'agence active est
* conservée dans `agency.store.ts` (`activeAgencyId`), consommée ensuite par
* `profile.service.ts::getAgencyProfile`/`getAgencyDashboard`.
*/
function AgencySwitcher() {
	const queryClient = useQueryClient();
	const activeAgencyId = useAgencyStore((state) => state.activeAgencyId);
	const setActiveAgency = useAgencyStore((state) => state.setActiveAgency);
	const setAgencies = useAgencyStore((state) => state.setAgencies);
	const [isJoinOpen, setIsJoinOpen] = (0, import_react.useState)(false);
	const [joinQuery, setJoinQuery] = (0, import_react.useState)("");
	const { data: agencies } = useQuery({
		queryKey: ["agencies", "mine"],
		queryFn: getMyAgencies
	});
	(0, import_react.useEffect)(() => {
		if (!agencies) return;
		setAgencies(agencies);
		if (activeAgencyId === null && agencies.length > 0) setActiveAgency(agencies[0]?.id ?? null);
	}, [
		agencies,
		activeAgencyId,
		setAgencies,
		setActiveAgency
	]);
	const switchMutation = useMutation({
		mutationFn: switchAgency,
		onSuccess: (_result, agencyId) => {
			setActiveAgency(agencyId);
			queryClient.invalidateQueries();
			toast("Agence changée", { description: agencies?.find((agency) => agency.id === agencyId)?.name });
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Impossible de changer d'agence.");
		}
	});
	const joinMutation = useMutation({
		mutationFn: async (query) => {
			const trimmed = query.trim();
			const targetId = (await searchAgencies({
				query: trimmed,
				pageSize: 5
			})).items[0]?.id ?? trimmed;
			return requestToJoinAgency(targetId);
		},
		onSuccess: () => {
			toast("Demande envoyée", { description: "Le propriétaire de l'agence doit approuver votre demande." });
			setIsJoinOpen(false);
			setJoinQuery("");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Envoi de la demande impossible.");
		}
	});
	const activeAgency = agencies?.find((agency) => agency.id === activeAgencyId) ?? agencies?.[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
					className: "h-4 w-4 shrink-0",
					strokeWidth: 1.7
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden max-w-[140px] truncate sm:block",
					children: activeAgency?.name ?? "Mes agences"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: "h-3.5 w-3.5 shrink-0",
					strokeWidth: 1.8
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-64",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Vos agences" }),
			agencies === void 0 || agencies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-1.5 text-[13px] text-muted-foreground",
				children: "Aucune agence trouvée."
			}) : agencies.map((agency) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => {
					if (agency.id !== activeAgencyId) switchMutation.mutate(agency.id);
				},
				className: "justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-semibold",
						children: agency.initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate",
						children: agency.name
					})]
				}), agency.id === activeAgencyId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-3.5 w-3.5 shrink-0",
					strokeWidth: 2
				}) : null]
			}, agency.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => setIsJoinOpen(true),
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "h-3.5 w-3.5 shrink-0",
					strokeWidth: 1.8
				}), "Rejoindre une agence"]
			})
		]
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
		open: isJoinOpen,
		onOpenChange: setIsJoinOpen,
		title: "Rejoindre une agence",
		description: "Envoyez une demande de rattachement au propriétaire de l'agence.",
		confirmLabel: joinMutation.isPending ? "Envoi..." : "Envoyer la demande",
		onConfirm: () => {
			if (joinQuery.trim()) joinMutation.mutate(joinQuery);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Nom ou identifiant de l'agence",
			value: joinQuery,
			onChange: (event) => setJoinQuery(event.target.value)
		})
	})] });
}
//#endregion
export { useAgencyStore as n, useNotificationsStore as r, DashboardShell as t };
