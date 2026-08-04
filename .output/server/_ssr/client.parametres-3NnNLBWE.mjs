import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as changePassword } from "./auth.service-DwH5fz0r.mjs";
import { i as SectionCard, n as PreferenceRow, t as FormSkeleton, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { c as updateSettings, i as getSettings } from "./profile.service-qQctcsIK.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.parametres-3NnNLBWE.js
var import_jsx_runtime = require_jsx_runtime();
/** Écran 14 — PARAMÈTRES (Client) : préférences + sécurité (mot de passe). */
var passwordSchema = objectType({
	currentPassword: stringType().min(1, "Champ requis").max(128),
	newPassword: stringType().min(8, "8 caractères minimum").max(128),
	confirmPassword: stringType().min(8, "8 caractères minimum").max(128)
}).refine((values) => values.newPassword === values.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"]
});
function ClientSettingsPage() {
	const queryClient = useQueryClient();
	const settingsQuery = useQuery({
		queryKey: ["client", "settings"],
		queryFn: getSettings
	});
	const settings = settingsQuery.data ?? null;
	const isLoading = settingsQuery.isPending;
	const form = useForm({
		resolver: u(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: ""
		}
	});
	const passwordMutation = useMutation({
		mutationFn: (values) => changePassword({
			oldPassword: values.currentPassword,
			newPassword: values.newPassword
		}),
		onSuccess: () => {
			toast.success("Mot de passe mis à jour");
			form.reset();
		},
		onError: (error) => {
			toast.error(error instanceof ApiError ? error.message : "Impossible de mettre à jour le mot de passe.");
		}
	});
	const onSubmitPassword = form.handleSubmit((values) => {
		passwordMutation.mutate(values);
	});
	const settingsMutation = useMutation({
		mutationFn: (payload) => updateSettings(payload),
		onSuccess: (updated) => {
			queryClient.setQueryData(["client", "settings"], updated);
			toast.success("Préférences mises à jour");
		},
		onError: (error) => {
			toast.error(error instanceof ApiError ? error.message : "Impossible d'enregistrer les préférences.");
		}
	});
	const updateSetting = (key, value) => {
		settingsMutation.mutate({ [key]: value });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		role: "client",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px] space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] font-bold tracking-tight",
					children: "Paramètres"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: "Préférences d'affichage, notifications et sécurité."
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
								onChange: (event) => updateSetting("theme", event.target.value),
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: settings?.language ?? "",
								onChange: (event) => updateSetting("language", event.target.value),
								className: "rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), settings?.language ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: settings.language,
									children: settings.language
								}) : null]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
							label: "Police",
							description: "Police d'affichage",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: settings?.font ?? "",
								onChange: (event) => updateSetting("font", event.target.value),
								className: "rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), settings?.font ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: settings.font,
									children: settings.font
								}) : null]
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
								onChange: (event) => updateSetting("textSize", Number(event.target.value)),
								className: "w-40"
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Notifications",
					description: "Choisissez comment vous souhaitez être informé.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
						label: "Notifications par e-mail",
						description: "Nouvelles propositions, litiges, factures",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings?.emailNotifications ?? false,
							onCheckedChange: (value) => updateSetting("emailNotifications", value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferenceRow, {
						label: "Notifications push",
						description: "Alertes en temps réel dans le navigateur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings?.pushNotifications ?? false,
							onCheckedChange: (value) => updateSetting("pushNotifications", value)
						})
					})] })
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
									error: form.formState.errors.currentPassword?.message,
									...form.register("currentPassword")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Nouveau mot de passe",
									type: "password",
									error: form.formState.errors.newPassword?.message,
									...form.register("newPassword")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Confirmer le mot de passe",
									type: "password",
									error: form.formState.errors.confirmPassword?.message,
									...form.register("confirmPassword")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: passwordMutation.isPending,
							className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
							children: passwordMutation.isPending ? "Mise à jour…" : "Mettre à jour le mot de passe"
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
export { ClientSettingsPage as component };
