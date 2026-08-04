import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as listAgencyReviews, o as getAgencyProfile, r as contactAgencyUnicast, t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { C as Phone, D as MapPin, F as Globe, O as Mail, P as Image, _ as Send, d as Star, ft as ArrowLeft, i as Users, it as Building2, rt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { i as SectionCard, s as StatusBadge } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as MarketingHeader } from "./MarketingHeader-DqeWYIZf.mjs";
import { r as Route$21 } from "./router-CpMmIrBM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agences._id-d_QlWCPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Profil public d'une agence — accessible sans connexion (bouton « Voir le profil »). */
function PublicAgencyProfilePage() {
	const { id } = Route$21.useParams();
	const token = useAuthStore((state) => state.token);
	const [agency, setAgency] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [isReviewsLoading, setIsReviewsLoading] = (0, import_react.useState)(true);
	const [isContactOpen, setIsContactOpen] = (0, import_react.useState)(false);
	const [isSubmittingContact, setIsSubmittingContact] = (0, import_react.useState)(false);
	const [contactForm, setContactForm] = (0, import_react.useState)({
		needType: "Projet",
		description: ""
	});
	(0, import_react.useEffect)(() => {
		setIsLoading(true);
		getAgencyProfile(id).then(setAgency).catch((error) => {
			toast(error instanceof ApiError ? error.message : "Impossible de charger cette agence.");
			setAgency(null);
		}).finally(() => setIsLoading(false));
		setIsReviewsLoading(true);
		listAgencyReviews(id).then(setReviews).catch(() => setReviews([])).finally(() => setIsReviewsLoading(false));
	}, [id]);
	const portfolio = (agency?.portfolio ?? []).map((item) => ({
		id: item.id,
		title: item.title,
		category: item.category
	}));
	function openContactModal() {
		if (!token) {
			window.location.href = "/connexion";
			return;
		}
		setIsContactOpen(true);
	}
	async function handleSubmitContact() {
		if (!contactForm.description.trim()) {
			toast("Décrivez votre besoin avant d'envoyer.");
			return;
		}
		setIsSubmittingContact(true);
		try {
			await contactAgencyUnicast(id, {
				needType: contactForm.needType,
				description: contactForm.description
			});
			toast("Votre demande a été envoyée à l'agence.");
			setIsContactOpen(false);
			setContactForm({
				needType: "Projet",
				description: ""
			});
		} catch (error) {
			toast(error instanceof ApiError ? error.message : "Envoi impossible.");
		} finally {
			setIsSubmittingContact(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHeader, {
				variant: "search",
				active: "agencies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-[1080px] px-4 pb-20 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/agences",
						className: "mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "h-4 w-4",
							strokeWidth: 1.8
						}), "Retour aux agences"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mt-5 rounded-lg border border-border p-6",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : agency === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible pour cette agence." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-[68px] w-[68px] items-center justify-center rounded-lg border border-border text-[24px] font-bold",
									children: agency.logoText
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-[26px] font-bold leading-tight tracking-tight",
											children: agency.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
														className: "h-4 w-4 shrink-0",
														strokeWidth: 1.7
													}), agency.location]
												}),
												agency.foundedYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
															className: "h-4 w-4 shrink-0",
															strokeWidth: 1.7
														}),
														"Depuis ",
														agency.foundedYear
													]
												}) : null,
												agency.teamSize ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
														className: "h-4 w-4 shrink-0",
														strokeWidth: 1.7
													}), agency.teamSize]
												}) : null
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-3 flex items-center gap-2 text-[14px] font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
													className: "h-4 w-4 fill-current",
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
												}),
												agency.legalIdValid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: "Identifiant légal vérifié" }) : null
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-muted-foreground",
											children: agency.description
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 sm:w-[190px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: openContactModal,
										className: "rounded-md bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
										children: "Contacter l'agence"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/postuler-un-projet",
										className: "inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-[14px] font-semibold transition-colors hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
											className: "h-4 w-4",
											strokeWidth: 1.8
										}), "Postuler un projet"]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
									title: "Compétences et technologies",
									description: "Domaines d'expertise déclarés par l'agence.",
									children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : agency === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[13px] text-muted-foreground",
												children: "Compétences"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: (agency.skills ?? []).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: skill }, skill))
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[13px] text-muted-foreground",
												children: "Technologies"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: (agency.techStack ?? []).map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: tech }, tech))
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[13px] text-muted-foreground",
												children: "Langues"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: (agency.languages ?? []).map((language) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: language }, language))
											})] })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
									title: "Portfolio",
									description: "Réalisations publiées par l'agence.",
									children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : portfolio.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune réalisation à afficher." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
										children: portfolio.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "rounded-lg border border-border p-4 transition-colors hover:bg-accent",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
													className: "h-[18px] w-[18px]",
													strokeWidth: 1.6
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-3 text-[14px] font-bold",
													children: item.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[13px] text-muted-foreground",
													children: item.category
												})
											]
										}, item.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
									title: "Avis clients",
									description: "Retours des clients ayant collaboré avec l'agence.",
									children: isReviewsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucun avis à afficher." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y divide-border",
										children: reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "py-4 first:pt-0 last:pb-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-[13px] font-bold",
													children: review.authorInitials
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[14px] font-bold",
															children: review.authorName
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
																	className: "h-3.5 w-3.5 fill-current",
																	strokeWidth: 0
																}),
																review.rating,
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "font-normal text-muted-foreground",
																	children: ["· ", review.publishedAt]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "mt-2 text-[14px] leading-[1.6] text-muted-foreground",
															children: review.comment
														})
													]
												})]
											})
										}, review.id))
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "lg:sticky lg:top-6 lg:self-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
								title: "Coordonnées",
								description: "Informations de contact publiques.",
								children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : agency === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-3 text-[14px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
												className: "mt-0.5 h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 break-words",
												children: agency.address
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
												className: "mt-0.5 h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 break-words",
												children: [
													agency.phoneCountryCode,
													" ",
													agency.phone
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
												className: "mt-0.5 h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 break-words",
												children: agency.email
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
												className: "mt-0.5 h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 break-words",
												children: agency.website
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
												className: "mt-0.5 h-4 w-4 shrink-0",
												strokeWidth: 1.7
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0",
												children: ["Travail à distance : ", agency.remoteWork ? "Oui" : "Non"]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-[13px] text-muted-foreground",
									children: ["Référence agence : ", id]
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
				open: isContactOpen,
				onOpenChange: setIsContactOpen,
				title: "Contacter l'agence",
				description: "Flux Unicast : votre demande sera envoyée uniquement à cette agence.",
				confirmLabel: isSubmittingContact ? "Envoi..." : "Envoyer",
				onConfirm: handleSubmitContact,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[13px] font-semibold",
						htmlFor: "contact-need-type",
						children: "Type de besoin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "contact-need-type",
						value: contactForm.needType,
						onChange: (event) => setContactForm((prev) => ({
							...prev,
							needType: event.target.value
						})),
						className: "mt-1.5 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Projet",
								children: "Projet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Stage",
								children: "Stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Job",
								children: "Job"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[13px] font-semibold",
						htmlFor: "contact-description",
						children: "Décrivez votre besoin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "contact-description",
						value: contactForm.description,
						onChange: (event) => setContactForm((prev) => ({
							...prev,
							description: event.target.value
						})),
						rows: 4,
						className: "mt-1.5 w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
						placeholder: "Contexte, objectifs, contraintes..."
					})] })]
				})
			})
		]
	});
}
//#endregion
export { PublicAgencyProfilePage as component };
