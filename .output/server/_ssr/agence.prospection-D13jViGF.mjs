import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ApiError } from "./http-DhyEQgDt.mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { U as Compass, c as ThermometerSun, f as Sparkles } from "../_libs/lucide-react.mjs";
import { t as ActionModal } from "./ActionModal-bG2-G2VU.mjs";
import { a as StatCard, c as StatusTabs, i as SectionCard, l as TextAreaField, o as StatGrid, r as SearchInput, s as StatusBadge, u as TextField } from "./Blocks-BPzJNs1k.mjs";
import { r as StatSkeleton } from "./Skeletons-BmbDCxzK.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DashboardShell } from "./DashboardShell-BexnO34z.mjs";
import { n as ListPagination } from "./ListControls-CdCTDF4c.mjs";
import { t as DataTable } from "./DataTable-Dz2k6f1R.mjs";
import { i as sendProspectionEmail, n as getLeads, r as getProspectionSettings, t as generateProspectionEmail } from "./prospection.service-CYBhF9LF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agence.prospection-D13jViGF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Prospection IA (Agence) — suggestions intelligentes de clients. */
function buildColumns(onGenerateEmail, generatingId) {
	return [
		{
			key: "lead",
			header: "Prospect",
			width: "minmax(0,2.2fr)",
			render: (lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-[13px] font-semibold",
					children: lead.initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[13.5px] font-bold",
						children: lead.companyName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[13px] text-muted-foreground",
						children: lead.location
					})]
				})]
			})
		},
		{
			key: "actions",
			header: "Signaux détectés",
			width: "minmax(0,1.6fr)",
			render: (lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[13px] text-muted-foreground",
				children: lead.actions.join(" · ")
			})
		},
		{
			key: "temperature",
			header: "Température",
			render: (lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { label: lead.temperatureLabel })
		},
		{
			key: "score",
			header: "Score",
			render: (lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-[13px] font-semibold",
				children: [lead.score, "/100"]
			})
		},
		{
			key: "action",
			header: "Action",
			render: (lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onGenerateEmail(lead),
				disabled: generatingId === lead.id,
				className: "flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "h-3 w-3",
					strokeWidth: 1.8
				}), generatingId === lead.id ? "Génération..." : "Générer l'e-mail"]
			})
		}
	];
}
function AgencyProspectionPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [temperature, setTemperature] = (0, import_react.useState)("all");
	const [isEmailOpen, setIsEmailOpen] = (0, import_react.useState)(false);
	const [emailSubject, setEmailSubject] = (0, import_react.useState)("");
	const [emailBody, setEmailBody] = (0, import_react.useState)("");
	const [emailTarget, setEmailTarget] = (0, import_react.useState)(null);
	const [page] = (0, import_react.useState)(1);
	const leadsQuery = useQuery({
		queryKey: [
			"agency",
			"prospection",
			"leads",
			temperature
		],
		queryFn: () => getLeads(temperature === "all" ? {
			page,
			pageSize: 50
		} : {
			page,
			pageSize: 50,
			temperature
		})
	});
	const allLeads = leadsQuery.data?.items ?? [];
	const isLoading = leadsQuery.isLoading;
	const counters = leadsQuery.data?.counters ?? {
		hot: null,
		warm: null,
		cold: null
	};
	const isCountersLoading = leadsQuery.isLoading;
	const totalPages = null;
	const settingsQuery = useQuery({
		queryKey: [
			"agency",
			"prospection",
			"settings"
		],
		queryFn: getProspectionSettings
	});
	const leads = query.trim() ? allLeads.filter((lead) => lead.companyName.toLowerCase().includes(query.trim().toLowerCase())) : allLeads;
	const counts = {
		all: allLeads.length,
		hot: counters.hot ?? 0,
		warm: counters.warm ?? 0,
		cold: counters.cold ?? 0
	};
	const generateEmailMutation = useMutation({
		mutationFn: generateProspectionEmail,
		onSuccess: (result) => {
			setEmailSubject(result.subject);
			setEmailBody(result.body);
			setIsEmailOpen(true);
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Génération de l'e-mail impossible.");
		}
	});
	const sendEmailMutation = useMutation({
		mutationFn: () => {
			if (!emailTarget) throw new Error("Aucun prospect sélectionné.");
			return sendProspectionEmail(emailTarget.id, {
				subject: emailSubject,
				body: emailBody
			});
		},
		onSuccess: () => {
			toast("E-mail envoyé", { description: emailTarget?.companyName });
			setIsEmailOpen(false);
			setEmailTarget(null);
		},
		onError: (error) => {
			toast(error instanceof ApiError ? error.message : "Envoi de l'e-mail impossible.");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		role: "agency",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1080px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
						className: "mt-1 h-[22px] w-[22px] shrink-0",
						strokeWidth: 1.6
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[24px] font-bold tracking-tight",
							children: "Prospection IA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Prospects suggérés par l'IA à partir des signaux d'intérêt."
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-7",
					children: isCountersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatSkeleton, { count: 3 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatGrid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ThermometerSun,
							label: "Prospects chauds",
							value: counters.hot === null ? "—" : String(counters.hot)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ThermometerSun,
							label: "Prospects tièdes",
							value: counters.warm === null ? "—" : String(counters.warm)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ThermometerSun,
							label: "Prospects froids",
							value: counters.cold === null ? "—" : String(counters.cold)
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						placeholder: "Rechercher un prospect..."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
						tabs: [
							{
								value: "all",
								label: "Tous"
							},
							{
								value: "hot",
								label: "Chauds"
							},
							{
								value: "warm",
								label: "Tièdes"
							},
							{
								value: "cold",
								label: "Froids"
							}
						],
						value: temperature,
						onChange: setTemperature,
						counts
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: buildColumns((lead) => {
							setEmailTarget(lead);
							generateEmailMutation.mutate(lead.id);
						}, generateEmailMutation.isPending ? generateEmailMutation.variables ?? null : null),
						rows: leads,
						isLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPagination, {
					page,
					totalPages
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Paramètres de scoring",
						description: "Seuils utilisés par l'IA pour qualifier les prospects.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Seuil « chaud » (score minimum)",
								value: settingsQuery.data ? String(settingsQuery.data.scoring.hotMin) : "",
								readOnly: true,
								onChange: () => {}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Seuil « tiède » (score minimum)",
								value: settingsQuery.data ? String(settingsQuery.data.scoring.warmMin) : "",
								readOnly: true,
								onChange: () => {}
							})]
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, {
			open: isEmailOpen,
			onOpenChange: (open) => {
				setIsEmailOpen(open);
				if (!open) setEmailTarget(null);
			},
			title: "E-mail de prospection",
			description: "Généré par l'IA à partir des signaux du prospect.",
			confirmLabel: sendEmailMutation.isPending ? "Envoi..." : "Envoyer",
			onConfirm: () => sendEmailMutation.mutate(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Objet",
					value: emailSubject,
					onChange: (event) => setEmailSubject(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAreaField, {
					label: "Message",
					rows: 6,
					value: emailBody,
					onChange: (event) => setEmailBody(event.target.value)
				})]
			})
		})]
	});
}
//#endregion
export { AgencyProspectionPage as component };
