import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as fetchBlob, n as GATEWAY_URL, t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as getProjectShortlist, n as contactAgencies, t as EmptyState, u as getProject } from "./EmptyState-tYTEkNIz.mjs";
import { A as Lock, D as MapPin, L as FileText, b as RefreshCcw, d as Star, ft as ArrowLeft, h as ShieldAlert, r as Wallet, rt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { i as SectionCard, l as TextAreaField, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { n as relaunchAgencySearch, r as requestSuspension, t as getDispute } from "./disputes.service-D9SkhJt1.mjs";
import { n as Route } from "./router-CpMmIrBM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.mes-projets._id-DD1FDQKj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Écran 15bis — DÉTAIL D'UN PROJET (CDC §1.5.8, MUST).
* Route manquante identifiée dans la passe précédente : `client.tableau-de-bord.tsx`
* et `client.mes-projets.tsx` laissaient "Voir le projet" en `uiAction` faute
* de cible. Structure de fichier calquée sur `agences.$id.tsx`.
*/
function formatBudget(min, max) {
	if (min === null && max === null) return "Non renseigné";
	if (min !== null && max !== null) return `${min} € - ${max} €`;
	return `${min ?? max} €`;
}
function ClientProjectDetailPage() {
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const projectQuery = useQuery({
		queryKey: [
			"client",
			"project",
			id
		],
		queryFn: () => getProject(id)
	});
	const project = projectQuery.data ?? null;
	const isLoading = projectQuery.isPending;
	const [isOpeningCdc, setIsOpeningCdc] = (0, import_react.useState)(false);
	async function handleOpenCdc() {
		if (!project?.cdcFile) return;
		setIsOpeningCdc(true);
		try {
			const url = project.cdcFile.startsWith("http") ? project.cdcFile : `${GATEWAY_URL}${project.cdcFile}`;
			const blob = await fetchBlob(url);
			const objectUrl = URL.createObjectURL(blob);
			window.open(objectUrl, "_blank");
		} catch (error) {
			toast(error instanceof ApiError ? error.message : "Impossible d'ouvrir le CDC.");
		} finally {
			setIsOpeningCdc(false);
		}
	}
	const shortlistQuery = useQuery({
		queryKey: [
			"client",
			"project",
			id,
			"shortlist"
		],
		queryFn: () => getProjectShortlist(id),
		enabled: project !== null && project.status === "published"
	});
	const shortlist = shortlistQuery.data ?? [];
	const [contactingAgencyId, setContactingAgencyId] = (0, import_react.useState)(null);
	const [contactedAgencyIds, setContactedAgencyIds] = (0, import_react.useState)([]);
	async function handleContactAgency(agencyId) {
		setContactingAgencyId(agencyId);
		try {
			await contactAgencies(id, [agencyId], void 0);
			setContactedAgencyIds((current) => [...current, agencyId]);
			toast("Demande envoyée à l'agence.");
		} catch (error) {
			toast(error instanceof ApiError ? error.message : "Envoi impossible.");
		} finally {
			setContactingAgencyId(null);
		}
	}
	const disputeQuery = useQuery({
		queryKey: [
			"client",
			"project",
			id,
			"dispute"
		],
		queryFn: () => getDispute(id),
		enabled: project !== null,
		retry: false
	});
	const dispute = disputeQuery.data && disputeQuery.data.status && disputeQuery.data.status.toLowerCase() !== "none" ? disputeQuery.data : null;
	const [isSuspensionModalOpen, setIsSuspensionModalOpen] = (0, import_react.useState)(false);
	const [suspensionReason, setSuspensionReason] = (0, import_react.useState)("");
	const [suspensionCategory, setSuspensionCategory] = (0, import_react.useState)("amicable");
	const suspensionMutation = useMutation({
		mutationFn: () => requestSuspension({
			projectId: id,
			reason: suspensionReason,
			category: suspensionCategory
		}),
		onSuccess: () => {
			toast("Demande de suspension envoyée.");
			setIsSuspensionModalOpen(false);
			setSuspensionReason("");
			queryClient.invalidateQueries({ queryKey: [
				"client",
				"project",
				id
			] });
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Envoi impossible.");
		}
	});
	const relaunchMutation = useMutation({
		mutationFn: () => relaunchAgencySearch(id),
		onSuccess: () => {
			toast("Recherche d'agence relancée.");
			queryClient.invalidateQueries({ queryKey: [
				"client",
				"project",
				id
			] });
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Impossible de relancer la recherche.");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		role: "client",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/client/mes-projets",
					className: "inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-4 w-4",
						strokeWidth: 1.8
					}), "Retour à mes projets"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-5 rounded-lg border border-border p-6",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : project === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Projet introuvable." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[24px] font-bold tracking-tight",
								children: project.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: project.statusLabel })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[13.5px] text-muted-foreground",
							children: [
								project.category,
								project.subCategory ? ` · ${project.subCategory}` : "",
								" — ID ",
								project.reference
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
										className: "h-4 w-4 shrink-0",
										strokeWidth: 1.7
									}), formatBudget(project.budgetMin, project.budgetMax)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										className: "h-4 w-4 shrink-0",
										strokeWidth: 1.7
									}), project.location || "Non renseignée"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
										className: "h-4 w-4 shrink-0",
										strokeWidth: 1.7
									}), project.deadline || "Délai non renseigné"]
								})
							]
						})
					] })
				}),
				project ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							title: "Cahier des charges",
							description: "Document généré à partir de votre brief.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleOpenCdc,
										disabled: !project.cdcFile || isOpeningCdc,
										className: "flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											className: "h-4 w-4",
											strokeWidth: 1.8
										}), isOpeningCdc ? "Ouverture..." : "Ouvrir le CDC (PDF)"]
									}),
									project.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
											className: "h-3.5 w-3.5 shrink-0",
											strokeWidth: 1.8
										}), "Verrouillé"]
									}) : null,
									!project.cdcFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] text-muted-foreground",
										children: "Aucun CDC disponible pour ce projet."
									}) : null
								]
							})
						}),
						project.status === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							title: "Shortlist d'agences recommandées",
							description: "Sélection générée par le matching IA pour ce projet.",
							children: shortlistQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : shortlist.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune agence recommandée pour le moment." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: shortlist.map((agency) => {
									const isContacted = contactedAgencyIds.includes(agency.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "rounded-lg border border-border p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[15px] font-bold",
														children: agency.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
															className: "h-3.5 w-3.5 shrink-0",
															strokeWidth: 1.8
														}), agency.location]
													})]
												}), agency.matchingScore !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12.5px] font-semibold",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
															className: "h-3 w-3 fill-current",
															strokeWidth: 0
														}),
														agency.matchingScore,
														"%"
													]
												}) : null]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 line-clamp-2 text-[13px] text-muted-foreground",
												children: agency.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleContactAgency(agency.id),
													disabled: isContacted || contactingAgencyId === agency.id,
													className: "rounded-md bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
													children: contactingAgencyId === agency.id ? "Envoi..." : isContacted ? "Envoyé" : "Envoyer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/agences/$id",
													params: { id: agency.id },
													className: "rounded-md border border-border px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
													children: "Voir profil"
												})]
											})
										]
									}, agency.id);
								})
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							title: "Suspension et litiges",
							description: "Suivi des suspensions ou litiges éventuels sur ce projet.",
							children: disputeQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : dispute ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: dispute.statusLabel }), dispute.history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-[13.5px] text-muted-foreground",
								children: "Aucun historique disponible."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-4",
								children: dispute.history.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-l border-border pl-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-muted-foreground",
											children: entry.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[13.5px] font-semibold",
											children: entry.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-muted-foreground",
											children: entry.description
										})
									]
								}, entry.id))
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									project.status === "in_progress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setIsSuspensionModalOpen(true),
										className: "flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
											className: "h-4 w-4",
											strokeWidth: 1.8
										}), "Demander une suspension"]
									}) : null,
									project.status === "rejected" && project.rejectionSubstatus === "Agence défaillante" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => relaunchMutation.mutate(),
										disabled: relaunchMutation.isPending,
										className: "flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, {
											className: "h-4 w-4",
											strokeWidth: 1.8
										}), relaunchMutation.isPending ? "Relance..." : "Relancer la recherche"]
									}) : null,
									project.status !== "in_progress" && !(project.status === "rejected" && project.rejectionSubstatus === "Agence défaillante") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13.5px] text-muted-foreground",
										children: "Aucun litige ni suspension en cours sur ce projet."
									}) : null
								]
							})
						})
					]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
			open: isSuspensionModalOpen,
			onOpenChange: setIsSuspensionModalOpen,
			title: "Demander une suspension",
			description: "Décrivez le motif de votre demande. Une suspension amiable est privilégiée avant l'ouverture d'un litige.",
			confirmLabel: suspensionMutation.isPending ? "Envoi..." : "Envoyer la demande",
			onConfirm: () => {
				if (!suspensionReason.trim()) {
					toast("Renseignez un motif avant d'envoyer.");
					return;
				}
				suspensionMutation.mutate();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[13px] font-semibold",
					htmlFor: "suspension-category",
					children: "Type de demande"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "suspension-category",
					value: suspensionCategory,
					onChange: (event) => setSuspensionCategory(event.target.value),
					className: "mt-1.5 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "amicable",
						children: "Suspension amiable"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "dispute",
						children: "Litige"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
					label: "Motif",
					rows: 4,
					value: suspensionReason,
					onChange: (event) => setSuspensionReason(event.target.value),
					placeholder: "Expliquez la raison de cette demande..."
				})]
			})
		})]
	});
}
//#endregion
export { ClientProjectDetailPage as component };
