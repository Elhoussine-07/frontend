import { a as frappeCall, r as camelizeKeys } from "./http-DhyEQgDt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/disputes.service-D9SkhJt1.js
var CATEGORY_MAP = {
	amicable: "Suspension amiable",
	dispute: "Litige"
};
/**
* // API CALL : frappeCall("project.request_suspension", { project, category, justification })
*/
async function requestSuspension(payload) {
	const raw = await frappeCall("project.request_suspension", {
		project: payload.projectId,
		category: CATEGORY_MAP[payload.category] ?? "Suspension amiable",
		justification: payload.reason
	});
	const data = camelizeKeys(raw);
	return {
		requestId: String(data["requestId"] ?? data["name"] ?? ""),
		status: "under_review"
	};
}
/**
* // API CALL : frappeCall("project.get_dispute", { project: projectId })
*/
async function getDispute(projectId) {
	const raw = await frappeCall("project.get_dispute", { project: projectId });
	const data = camelizeKeys(raw);
	return {
		status: String(data["status"] ?? ""),
		statusLabel: String(data["statusLabel"] ?? data["status"] ?? ""),
		history: Array.isArray(data["history"]) ? data["history"] : []
	};
}
/**
* // API CALL : frappeCall("project.relaunch_search", { project: projectId })
*/
async function relaunchAgencySearch(projectId) {
	const raw = await frappeCall("project.relaunch_search", { project: projectId });
	const data = camelizeKeys(raw);
	return { projectId: String(data["project"] ?? projectId) };
}
/**
* // API CALL : frappeCall("project.signal_ready", { project: projectId })
* (bouton "Signaler que je suis prêt" affiché côté page agence, hors périmètre
* de cet agent — cette fonction est appelée depuis là-bas.)
*/
async function signalReady(projectId) {
	const raw = await frappeCall("project.signal_ready", { project: projectId });
	const data = camelizeKeys(raw);
	return { notified: Boolean(data["notified"] ?? true) };
}
//#endregion
export { signalReady as i, relaunchAgencySearch as n, requestSuspension as r, getDispute as t };
