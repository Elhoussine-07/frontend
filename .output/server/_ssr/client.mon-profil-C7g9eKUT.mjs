import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./EmptyState-tYTEkNIz.mjs";
import { it as Building2, m as ShieldCheck, ut as BadgeCheck } from "../_libs/lucide-react.mjs";
import { i as SectionCard, s as StatusBadge, t as FormSkeleton, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as uiAction } from "./ui-actions-Crijx9Um.mjs";
import { r as getClientProfile, s as updateClientProfile } from "./profile.service-qQctcsIK.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.mon-profil-C7g9eKUT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Écran 13 — MON PROFIL (Client) : informations entreprise + score de confiance. */
/** Validation uniquement (aucune logique métier). */
var companySchema = objectType({
	contactLastName: stringType().trim().min(1, "Champ requis").max(80),
	contactFirstName: stringType().trim().min(1, "Champ requis").max(80),
	companyName: stringType().trim().min(1, "Champ requis").max(120),
	activitySector: stringType().trim().min(1, "Champ requis").max(120),
	country: stringType().trim().min(1, "Champ requis").max(80),
	legalIdType: stringType().trim().min(1, "Champ requis").max(80),
	legalIdValue: stringType().trim().min(1, "Champ requis").max(80)
});
function ClientProfilePage() {
	const queryClient = useQueryClient();
	const profileQuery = useQuery({
		queryKey: ["client", "profile"],
		queryFn: getClientProfile
	});
	const profile = profileQuery.data ?? null;
	const isLoading = profileQuery.isPending;
	const form = useForm({
		resolver: u(companySchema),
		defaultValues: {
			contactLastName: "",
			contactFirstName: "",
			companyName: "",
			activitySector: "",
			country: "",
			legalIdType: "",
			legalIdValue: ""
		}
	});
	(0, import_react.useEffect)(() => {
		if (profile) form.reset({
			contactLastName: profile.contactLastName,
			contactFirstName: profile.contactFirstName,
			companyName: profile.companyName,
			activitySector: profile.activitySector,
			country: profile.country,
			legalIdType: profile.legalIdType,
			legalIdValue: profile.legalIdValue
		});
	}, [profile]);
	const updateMutation = useMutation({
		mutationFn: (values) => updateClientProfile(values),
		onSuccess: (updated) => {
			queryClient.setQueryData(["client", "profile"], updated);
			toast.success("Profil mis à jour");
		},
		onError: (error) => {
			toast.error(error instanceof ApiError ? error.message : "Impossible d'enregistrer le profil.");
		}
	});
	const onSubmit = form.handleSubmit((values) => {
		updateMutation.mutate(values);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "client",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px] space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] font-bold tracking-tight",
					children: "Mon profil"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: "Informations de votre entreprise et niveau de confiance."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Informations entreprise",
					description: "Ces informations sont visibles par les agences que vous contactez.",
					action: profile?.identityVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: "Identité vérifiée" }) : null,
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSkeleton, { fields: 7 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-5",
						noValidate: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Nom du contact",
									error: form.formState.errors.contactLastName?.message,
									...form.register("contactLastName")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Prénom du contact",
									error: form.formState.errors.contactFirstName?.message,
									...form.register("contactFirstName")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Raison sociale",
									error: form.formState.errors.companyName?.message,
									...form.register("companyName")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Secteur d'activité",
									error: form.formState.errors.activitySector?.message,
									...form.register("activitySector")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Pays",
									error: form.formState.errors.country?.message,
									...form.register("country")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Type d'identifiant légal",
									error: form.formState.errors.legalIdType?.message,
									...form.register("legalIdType")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Identifiant légal",
									error: form.formState.errors.legalIdValue?.message,
									...form.register("legalIdValue")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: "Enregistrer les modifications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => uiAction("Vérifier mon identité"),
								type: "button",
								className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
									className: "h-3.5 w-3.5",
									strokeWidth: 1.8
								}), "Vérifier mon identité"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Score de confiance",
					description: "Calculé à partir de la complétion du profil et de votre activité.",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSkeleton, { fields: 2 }) : profile === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									className: "h-[22px] w-[22px]",
									strokeWidth: 1.6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[28px] font-bold leading-none",
									children: [profile.trustScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[14px] font-normal text-muted-foreground",
										children: "/100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: profile.trustScoreLabel })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: profile.trustScoreFactors.map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-[13px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: factor.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: [
										factor.value,
										"/",
										factor.max
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 h-1.5 w-full rounded-full bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 rounded-full bg-primary",
									style: { width: `${factor.value / factor.max * 100}%` }
								})
							})] }, factor.id))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Complétion du profil",
					description: "Renseignez les champs manquants pour améliorer votre visibilité.",
					children: profile === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Aucune donnée disponible" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-[14px] font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
									className: "h-4 w-4",
									strokeWidth: 1.7
								}),
								profile.completionPercent,
								"% complété"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: profile.missingFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-[13px] text-muted-foreground",
								children: field.label
							}, field.id))
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { ClientProfilePage as component };
