import { a as frappeCall, r as camelizeKeys } from "./http-DhyEQgDt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunities.service-B9jqmObh.js
var TAB_TO_BACKEND = {
	offers: "Offres",
	won: "Gagnées",
	paused: "En pause",
	finished: "Terminées",
	archived: "Archivées",
	available: "Disponibles"
};
var STEP_LABELS = {
	offers: "Nouvelle offre",
	won: "Gagné",
	paused: "En pause",
	finished: "Terminé",
	archived: "Archivé",
	available: "Disponible"
};
function mapStepFromStatus(rawStatus) {
	const value = String(rawStatus ?? "").trim().toLowerCase();
	const entry = Object.entries(TAB_TO_BACKEND).find(([, backendValue]) => backendValue.toLowerCase() === value);
	return entry ? entry[0] : value || "offers";
}
/**
* Traduit une `Opportunity` Frappe (snake_case) vers le type `Opportunity`
* (camelCase) du frontend.
* // TODO backend: forme exacte des champs "d'affichage" (companyInitials,
* // companyName, projectTitle, category, quoteAmount, remainingHours) non
* // confirmée — best-effort à partir des champs probables / du projet lié.
*/
function mapOpportunity(raw) {
	const data = camelizeKeys(raw);
	const step = mapStepFromStatus(data["status"]);
	const companyName = String(data["companyName"] ?? data["clientName"] ?? "");
	return {
		id: String(data["id"] ?? data["name"] ?? data["opportunity"] ?? ""),
		step,
		stepLabel: String(data["stepLabel"] ?? STEP_LABELS[step] ?? step),
		companyInitials: String(data["companyInitials"] ?? companyName.slice(0, 2).toUpperCase()),
		companyName,
		projectTitle: String(data["projectTitle"] ?? data["title"] ?? ""),
		budgetMin: data["budgetMin"] !== void 0 ? Number(data["budgetMin"]) : null,
		budgetMax: data["budgetMax"] !== void 0 ? Number(data["budgetMax"]) : null,
		location: String(data["location"] ?? ""),
		category: String(data["category"] ?? ""),
		relevance: Number(data["matchingScore"] ?? data["relevance"] ?? 0),
		publishedAt: String(data["publishedAt"] ?? data["creation"] ?? ""),
		quoteAmount: data["quoteAmount"] !== void 0 && data["quoteAmount"] !== null ? Number(data["quoteAmount"]) : null,
		remainingHours: data["remainingHours"] !== void 0 && data["remainingHours"] !== null ? Number(data["remainingHours"]) : null,
		project: data["project"] ?? void 0,
		agency: data["agency"] ?? void 0,
		successPrediction: data["successPrediction"] !== void 0 ? Number(data["successPrediction"]) : void 0,
		source: data["source"] ?? void 0,
		acceptedOn: data["acceptedOn"] ?? void 0,
		archivedOn: data["archivedOn"] ?? void 0,
		archiveReason: data["archiveReason"] ?? void 0
	};
}
/**
* // API CALL : frappeCall("opportunity.list_opportunities", { tab, budget_min, budget_max, location, sub_category, need_type })
*/
async function getOpportunities(filters) {
	const page = filters.page ?? 1;
	const pageSize = filters.pageSize ?? 20;
	const [budgetMin, budgetMax] = (filters.budget ?? "").split("-");
	const raw = await frappeCall("opportunity.list_opportunities", {
		tab: TAB_TO_BACKEND[filters.tab],
		budget_min: budgetMin || void 0,
		budget_max: budgetMax || void 0,
		location: filters.location,
		sub_category: filters.subCategory,
		need_type: filters.needType,
		page,
		page_size: pageSize
	});
	const data = camelizeKeys(raw);
	const items = (Array.isArray(raw) ? raw : data["results"] ?? data["items"] ?? []).map((item) => mapOpportunity(item));
	const counts = data["counts"] ?? {};
	return {
		items,
		page,
		pageSize,
		total: Number(data["total"] ?? items.length),
		totalPages: 1,
		counts
	};
}
/**
* // API CALL : frappeCall("opportunity.accept", { opportunity: id })   (étape 1/2)
*/
async function acceptOpportunity(id) {
	const raw = await frappeCall("opportunity.accept", { opportunity: id });
	const data = camelizeKeys(raw);
	return { status: String(data["status"] ?? "accepted_awaiting_quote") };
}
/**
* // API CALL : frappeCall("opportunity.decline", { opportunity: id })
*/
async function refuseOpportunity(id) {
	const raw = await frappeCall("opportunity.decline", { opportunity: id });
	const data = camelizeKeys(raw);
	return { status: String(data["status"] ?? "refused") };
}
/**
* // API CALL : frappeCall("opportunity.send_quote", { opportunity: id, amount })   (étape 2/2)
*/
async function sendQuote(id, amount) {
	const raw = await frappeCall("opportunity.send_quote", {
		opportunity: id,
		amount
	});
	const data = camelizeKeys(raw);
	return {
		status: String(data["status"] ?? "quote_sent"),
		clientResponseDeadlineHours: Number(data["clientResponseDeadlineHours"] ?? 48)
	};
}
//#endregion
export { sendQuote as i, getOpportunities as n, refuseOpportunity as r, acceptOpportunity as t };
