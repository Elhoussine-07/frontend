import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { F as Globe, P as Image, it as Building2, x as Plus } from "../_libs/lucide-react.mjs";
import { i as SectionCard, l as TextAreaField, s as StatusBadge, t as FormSkeleton, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { n as StackSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { o as updateAgencyProfile, t as getAgencyProfile } from "./profile.service-qQctcsIK.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.profil-W1FIuBAP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Profil agence — présentation, compétences, portfolio, coordonnées. */
var profileSchema = objectType({
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
function AgencyProfilePage() {
	const queryClient = useQueryClient();
	const profileQuery = useQuery({
		queryKey: ["agency", "profile"],
		queryFn: getAgencyProfile
	});
	const profile = profileQuery.data ?? null;
	const isLoading = profileQuery.isLoading;
	const portfolio = profile?.portfolio ?? [];
	const isPortfolioLoading = isLoading;
	const form = useForm({
		resolver: u(profileSchema),
		defaultValues: {
			name: "",
			description: "",
			foundedYear: "",
			teamSize: "",
			website: "",
			location: "",
			legalIdValue: "",
			phoneCountryCode: "",
			phone: "",
			email: "",
			address: ""
		}
	});
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		form.reset({
			name: profile.name,
			description: profile.description,
			foundedYear: profile.foundedYear,
			teamSize: profile.teamSize,
			website: profile.website,
			location: profile.location,
			legalIdValue: profile.legalIdValue,
			phoneCountryCode: profile.phoneCountryCode,
			phone: profile.phone,
			email: profile.email,
			address: profile.address
		});
	}, [profile]);
	const updateMutation = useMutation({
		mutationFn: updateAgencyProfile,
		onSuccess: (updated) => {
			queryClient.setQueryData(["agency", "profile"], updated);
			toast("Profil mis à jour");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Mise à jour impossible.");
		}
	});
	const onSubmit = form.handleSubmit((values) => {
		updateMutation.mutate(values);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "agency",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px] space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] font-bold tracking-tight",
					children: "Profil agence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: "Ces informations composent votre profil public."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Présentation",
					description: "Nom, description, année de création et taille de l'équipe.",
					action: profile?.legalIdValid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: "Identifiant légal vérifié" }) : null,
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSkeleton, { fields: 6 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-5",
						noValidate: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Nom de l'agence",
										error: form.formState.errors.name?.message,
										...form.register("name")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Année de création",
										error: form.formState.errors.foundedYear?.message,
										...form.register("foundedYear")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Taille de l'équipe",
										error: form.formState.errors.teamSize?.message,
										...form.register("teamSize")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Site web",
										error: form.formState.errors.website?.message,
										...form.register("website")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Localisation",
										error: form.formState.errors.location?.message,
										...form.register("location")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Identifiant légal",
										error: form.formState.errors.legalIdValue?.message,
										...form.register("legalIdValue")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
								label: "Description de l'agence",
								rows: 5,
								error: form.formState.errors.description?.message,
								...form.register("description")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "pt-2 text-[13.5px] font-bold tracking-wide",
								children: "COORDONNÉES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Indicatif pays",
										error: form.formState.errors.phoneCountryCode?.message,
										...form.register("phoneCountryCode")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Téléphone",
										error: form.formState.errors.phone?.message,
										...form.register("phone")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "E-mail",
										error: form.formState.errors.email?.message,
										...form.register("email")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
										label: "Adresse",
										error: form.formState.errors.address?.message,
										...form.register("address")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: updateMutation.isPending,
								className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
								children: updateMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
					title: "Compétences et technologies",
					description: "Utilisées pour le matching avec les projets clients.",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 2 }) : profile === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: "Compétences"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: profile.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: skill }, skill))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: "Technologies"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: profile.techStack.map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: tech }, tech))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: "Langues"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: profile.languages.map((language) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: language }, language))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-[13px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
										className: "h-4 w-4",
										strokeWidth: 1.7
									}),
									"Travail à distance : ",
									profile.remoteWork ? "Oui" : "Non"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => uiAction("{/* API CALL : PUT /api/profile/agency — paramètres : */} Mo"),
						type: "button",
						className: "mt-5 flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.8
						}), "Modifier les compétences"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Portfolio",
					description: "Réalisations présentées aux clients.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => uiAction("{/* API CALL : POST /api/profile/agency/portfolio — paramètr"),
						type: "button",
						className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-3 w-3",
							strokeWidth: 1.8
						}), "Ajouter"]
					}),
					children: isPortfolioLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackSkeleton, { count: 3 }) : portfolio.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: portfolio.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
									className: "h-[18px] w-[18px]",
									strokeWidth: 1.6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[13.5px] font-bold",
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
					title: "Aperçu public",
					description: "Ce que voient les clients sur votre fiche agence.",
					children: profile === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
							className: "h-[22px] w-[22px]",
							strokeWidth: 1.6
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[15px] font-bold",
								children: profile.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: profile.location
							})]
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { AgencyProfilePage as component };
