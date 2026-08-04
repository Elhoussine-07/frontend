import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as requestEmailCode, s as registerAgency } from "./auth.service-DwH5fz0r.mjs";
import { Y as CircleCheck, dt as ArrowRight, ft as ArrowLeft } from "../_libs/lucide-react.mjs";
import { l as TextAreaField, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as MarketingHeader } from "./MarketingHeader-DqeWYIZf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inscription-agence-DHIO5XqO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Inscription agence — formulaire multi-étapes (mockups 10/11). */
var STEPS = [
	{
		id: 1,
		label: "Présentation"
	},
	{
		id: 2,
		label: "Compétences"
	},
	{
		id: 3,
		label: "Coordonnées"
	},
	{
		id: 4,
		label: "Vérification"
	}
];
var registrationSchema = objectType({
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
function AgencyRegistrationPage() {
	const [step, setStep] = (0, import_react.useState)(1);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [pendingApproval, setPendingApproval] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);
	const setUser = useAuthStore((state) => state.setUser);
	const setStoreRole = useAuthStore((state) => state.setRole);
	const form = useForm({
		resolver: u(registrationSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			description: "",
			foundedYear: "",
			teamSize: "",
			website: "",
			skills: "",
			techStack: "",
			languages: "",
			location: "",
			address: "",
			phoneCountryCode: "",
			phone: "",
			email: "",
			legalIdValue: "",
			verificationCode: ""
		}
	});
	const email = form.watch("email");
	(0, import_react.useEffect)(() => {
		if (step !== 4 || !email) return;
		requestEmailCode(email).catch((error) => {
			toast(error instanceof ApiError ? error.message : "Envoi du code impossible.");
		});
	}, [step]);
	async function handleResendCode() {
		if (!email) {
			toast("Renseignez votre e-mail professionnel (étape 3) avant de renvoyer un code.");
			return;
		}
		try {
			await requestEmailCode(email);
			toast("Code renvoyé.", { description: "Vérifiez votre boîte de réception." });
		} catch (error) {
			toast(error instanceof ApiError ? error.message : "Envoi du code impossible.");
		}
	}
	const onSubmit = form.handleSubmit(async (values) => {
		setIsSubmitting(true);
		try {
			const skills = values.skills.split(",").map((item) => item.trim()).filter(Boolean);
			const techStack = values.techStack.split(",").map((item) => item.trim()).filter(Boolean);
			const languages = values.languages.split(",").map((item) => item.trim()).filter(Boolean);
			const { token, user, detectedRole } = await registerAgency({
				name: values.name,
				description: values.description,
				founded_year: values.foundedYear,
				team_size: values.teamSize,
				website: values.website,
				skills,
				tech_stack: techStack,
				languages,
				location: values.location,
				address: values.address,
				phone_country_code: values.phoneCountryCode,
				phone: values.phone,
				email: values.email,
				legal_id_value: values.legalIdValue,
				verification_code: values.verificationCode
			});
			if (!token) {
				setPendingApproval(true);
				return;
			}
			setToken(token);
			setUser(user);
			setStoreRole(detectedRole);
			toast("Compte agence créé.");
			navigate({ to: "/agence/tableau-de-bord" });
		} catch (error) {
			toast(error instanceof ApiError ? error.message : "Inscription impossible.");
		} finally {
			setIsSubmitting(false);
		}
	});
	if (pendingApproval) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-[560px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
					className: "h-10 w-10",
					strokeWidth: 1.5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-[24px] font-bold tracking-tight",
					children: "Demande envoyée"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[14px] leading-[1.6] text-muted-foreground",
					children: "Une agence portant un nom proche existe déjà sur Sortlist Pro. Votre demande de rattachement a été transmise au propriétaire de cette agence — vous recevrez un e-mail dès qu'elle sera validée."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/connexion",
					className: "mt-8 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
					children: "Retour à la connexion"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[32px] font-bold tracking-tight",
					children: "Inscription agence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-[14px] text-muted-foreground",
					children: "Complétez les 4 étapes pour publier votre profil."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: STEPS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: item.id <= step ? "h-[3px] w-full rounded-full bg-primary" : "h-[3px] w-full rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 truncate text-[13px] font-semibold",
							children: [
								item.id,
								". ",
								item.label
							]
						})]
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-9 space-y-6",
					noValidate: true,
					children: [
						step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
								label: "Description de l'agence",
								rows: 5,
								error: form.formState.errors.description?.message,
								...form.register("description")
							})]
						}) : null,
						step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
									label: "Compétences (séparées par des virgules)",
									rows: 3,
									error: form.formState.errors.skills?.message,
									...form.register("skills")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
									label: "Technologies (séparées par des virgules)",
									rows: 3,
									error: form.formState.errors.techStack?.message,
									...form.register("techStack")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Langues de travail",
									error: form.formState.errors.languages?.message,
									...form.register("languages")
								})
							]
						}) : null,
						step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Localisation",
									error: form.formState.errors.location?.message,
									...form.register("location")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Adresse",
									error: form.formState.errors.address?.message,
									...form.register("address")
								}),
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
									label: "E-mail professionnel",
									error: form.formState.errors.email?.message,
									...form.register("email")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Identifiant légal",
									error: form.formState.errors.legalIdValue?.message,
									...form.register("legalIdValue")
								})
							]
						}) : null,
						step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[14px] text-muted-foreground",
									children: "Un code de vérification a été envoyé à l'adresse renseignée."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Code de vérification",
									error: form.formState.errors.verificationCode?.message,
									...form.register("verificationCode")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleResendCode,
									type: "button",
									className: "text-[13.5px] font-semibold underline underline-offset-2",
									children: "Renvoyer le code"
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep((current) => Math.max(1, current - 1)),
								disabled: step === 1,
								className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
									className: "h-3.5 w-3.5",
									strokeWidth: 1.8
								}), "Précédent"]
							}), step < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep((current) => Math.min(4, current + 1)),
								className: "flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: ["Suivant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-3.5 w-3.5",
									strokeWidth: 1.8
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
								children: isSubmitting ? "Création..." : "Créer mon compte agence"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 text-[13.5px] text-muted-foreground",
					children: [
						"Vous avez déjà un compte ?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/connexion",
							className: "font-semibold text-foreground underline underline-offset-2",
							children: "Se connecter"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { AgencyRegistrationPage as component };
