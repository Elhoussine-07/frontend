import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as changePassword } from "./auth.service-DwH5fz0r.mjs";
import { i as SectionCard, n as PreferenceRow, t as FormSkeleton, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as registerAgencyPaymentMethod, c as updateSettings, i as getSettings } from "./profile.service-qQctcsIK.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.parametres-CFWyFFji.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var passwordSchema = objectType({
	currentPassword: stringType().min(1, "Champ requis").max(128),
	newPassword: stringType().min(8, "8 caractères minimum").max(128),
	confirmPassword: stringType().min(8, "8 caractères minimum").max(128)
}).refine((values) => values.newPassword === values.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"]
});
var billingSchema = objectType({
	billingEmail: stringType().trim().email("E-mail invalide").max(255),
	vatNumber: stringType().trim().min(1, "Champ requis").max(40),
	billingAddress: stringType().trim().min(1, "Champ requis").max(255)
});
var NOTIFICATION_PREFS_KEYS = [
	"emailNotifications",
	"pushNotifications",
	"opportunityAlerts",
	"autoQuoteReminders"
];
function AgencySettingsPage() {
	const queryClient = useQueryClient();
	const settingsQuery = useQuery({
		queryKey: ["agency", "settings"],
		queryFn: getSettings
	});
	const isLoading = settingsQuery.isLoading;
	const [notificationPrefs, setNotificationPrefs] = (0, import_react.useState)({
		emailNotifications: true,
		pushNotifications: true,
		opportunityAlerts: true,
		autoQuoteReminders: true
	});
	const settings = settingsQuery.data ? {
		...settingsQuery.data,
		...notificationPrefs
	} : null;
	const updateSettingsMutation = useMutation({
		mutationFn: updateSettings,
		onSuccess: (updated) => {
			queryClient.setQueryData(["agency", "settings"], updated);
			toast("Paramètres mis à jour");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Mise à jour impossible.");
		}
	});
	const changePasswordMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			toast("Mot de passe mis à jour");
			passwordForm.reset();
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Mise à jour du mot de passe impossible.");
		}
	});
	const passwordForm = useForm({
		resolver: u(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: ""
		}
	});
	const billingForm = useForm({
		resolver: u(billingSchema),
		defaultValues: {
			billingEmail: "",
			vatNumber: "",
			billingAddress: ""
		}
	});
	const onSubmitPassword = passwordForm.handleSubmit((values) => {
		changePasswordMutation.mutate({
			oldPassword: values.currentPassword,
			newPassword: values.newPassword
		});
	});
	const registerBillingMutation = useMutation({
		mutationFn: registerAgencyPaymentMethod,
		onSuccess: () => {
			toast("Informations de facturation enregistrées");
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Enregistrement des informations de facturation impossible.");
		}
	});
	const onSubmitBilling = billingForm.handleSubmit((values) => {
		registerBillingMutation.mutate({
			billingEmail: values.billingEmail,
			vatNumber: values.vatNumber,
			billingAddress: values.billingAddress
		});
	});
	function updateSetting(key, value) {
		if (NOTIFICATION_PREFS_KEYS.includes(key)) {
			setNotificationPrefs((prev) => ({
				...prev,
				[key]: value
			}));
			return;
		}
		if (key === "twoFactorEnabled") updateSettingsMutation.mutate({ twoFactorEnabled: value });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "agency",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px] space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] font-bold tracking-tight",
					children: "Paramètres"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: "Gérez les paramètres de votre compte et de votre agence."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Préférences d'affichage",
					description: "Thème, langue, police et taille du texte.",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSkeleton, { fields: 4 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Thème",
							description: "Clair, sombre ou système",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: settings?.theme ?? "",
								onChange: (event) => updateSettingsMutation.mutate({ theme: event.target.value }),
								className: "rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "light",
										children: "Clair"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "dark",
										children: "Sombre"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "system",
										children: "Système"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Langue",
							description: "Langue de l'interface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: settings?.language ?? "",
								onChange: () => {},
								className: "rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Police",
							description: "Police d'affichage",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: settings?.font ?? "",
								onChange: () => {},
								className: "rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Taille du texte",
							description: "Ajustez la lisibilité de l'interface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 80,
								max: 130,
								value: settings?.textSize ?? 100,
								onChange: (event) => updateSettingsMutation.mutate({ textSize: Number(event.target.value) }),
								className: "w-40"
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Notifications",
					description: "Alertes opportunités, rappels de devis et notifications générales.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Notifications par e-mail",
							description: "Opportunités, litiges, factures",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings?.emailNotifications ?? false,
								onCheckedChange: (value) => updateSetting("emailNotifications", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Notifications push",
							description: "Alertes en temps réel dans le navigateur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings?.pushNotifications ?? false,
								onCheckedChange: (value) => updateSetting("pushNotifications", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Alertes nouvelles opportunités",
							description: "Recevez un e-mail dès qu'un projet correspond à vos compétences",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings?.opportunityAlerts ?? false,
								onCheckedChange: (value) => updateSetting("opportunityAlerts", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Rappels de devis",
							description: "Relance automatique avant expiration d'une opportunité",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings?.autoQuoteReminders ?? false,
								onCheckedChange: (value) => updateSetting("autoQuoteReminders", value)
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Informations de facturation",
					description: "Utilisées sur les factures émises par votre agence.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSubmitBilling,
						className: "space-y-5",
						noValidate: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-5 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "E-mail de facturation",
									error: billingForm.formState.errors.billingEmail?.message,
									...billingForm.register("billingEmail")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Numéro de TVA",
									error: billingForm.formState.errors.vatNumber?.message,
									...billingForm.register("vatNumber")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Adresse de facturation",
									error: billingForm.formState.errors.billingAddress?.message,
									...billingForm.register("billingAddress")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: registerBillingMutation.isPending,
							className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
							children: registerBillingMutation.isPending ? "Enregistrement..." : "Enregistrer"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
					title: "Sécurité",
					description: "Mot de passe et double authentification.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSubmitPassword,
						className: "space-y-5",
						noValidate: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-5 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Mot de passe actuel",
									type: "password",
									error: passwordForm.formState.errors.currentPassword?.message,
									...passwordForm.register("currentPassword")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Nouveau mot de passe",
									type: "password",
									error: passwordForm.formState.errors.newPassword?.message,
									...passwordForm.register("newPassword")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Confirmer le mot de passe",
									type: "password",
									error: passwordForm.formState.errors.confirmPassword?.message,
									...passwordForm.register("confirmPassword")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: changePasswordMutation.isPending,
							className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
							children: changePasswordMutation.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Double authentification",
							description: "Code de vérification envoyé par e-mail à chaque connexion",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings?.twoFactorEnabled ?? false,
								onCheckedChange: (value) => updateSetting("twoFactorEnabled", value)
							})
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { AgencySettingsPage as component };
