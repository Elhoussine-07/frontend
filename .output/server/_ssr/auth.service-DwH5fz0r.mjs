import { t as useAuthStore } from "./auth.store-ntL1qCiT.mjs";
import { a as frappeCall, r as camelizeKeys } from "./http-DhyEQgDt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.service-DwH5fz0r.js
function normalizeRole(rawRole) {
	return String(rawRole ?? "").toLowerCase().startsWith("agenc") ? "agency" : "client";
}
function initialsFromName(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "")).toUpperCase();
}
/**
* Traduit la réponse Frappe (snake_case, forme exacte non documentée côté API
* publique) vers le type `User` (camelCase) consommé par le frontend.
* // TODO backend: confirmer la forme exacte des champs utilisateur renvoyés par
* // auth.login / auth.verify_otp / auth.me (ici : id/name, email, role ou
* // user_type, full_name / display_name / agency_name / company_name).
*/
function mapUser(raw) {
	const data = camelizeKeys(raw);
	const role = normalizeRole(data["role"] ?? data["userType"]);
	const displayName = data["displayName"] ?? data["fullName"] ?? data["agencyName"] ?? data["companyName"] ?? data["email"] ?? "Utilisateur";
	return {
		id: String(data["id"] ?? data["name"] ?? data["user"] ?? ""),
		role,
		displayName,
		initials: initialsFromName(displayName),
		email: String(data["email"] ?? "")
	};
}
function mapLoginResponse(raw) {
	const data = camelizeKeys(raw);
	const token = String(data["token"] ?? data["accessToken"] ?? data["jwt"] ?? "");
	const user = mapUser(data["user"] ?? data);
	return {
		token,
		user,
		detectedRole: normalizeRole(data["role"] ?? user.role)
	};
}
/**
* // API CALL : frappeCall("auth.login", { email, password })
* // erreurs    : 401 identifiants invalides, 422 validation
*/
async function login(payload) {
	return mapLoginResponse(await frappeCall("auth.login", {
		email: payload.email,
		password: payload.password
	}));
}
/**
* // API CALL : frappeCall("auth.request_otp", { email })
*/
async function requestEmailCode(email) {
	const raw = await frappeCall("auth.request_otp", { email });
	const data = camelizeKeys(raw);
	return {
		sent: Boolean(data["sent"] ?? true),
		expiresInSeconds: Number(data["expiresInSeconds"] ?? data["expiresIn"] ?? 300)
	};
}
/**
* // API CALL : frappeCall("auth.request_password_reset", { email })
*/
async function forgotPassword(email) {
	const raw = await frappeCall("auth.request_password_reset", { email });
	const data = camelizeKeys(raw);
	return { sent: Boolean(data["sent"] ?? true) };
}
/**
* Deuxième étape du flux "mot de passe oublié" : confirme le code reçu par
* email et fixe le nouveau mot de passe.
* // API CALL : frappeCall("auth.reset_password", { email, code, new_password })
*/
async function confirmPasswordReset(payload) {
	const raw = await frappeCall("auth.reset_password", {
		email: payload.email,
		code: payload.code,
		new_password: payload.newPassword
	});
	const data = camelizeKeys(raw);
	return { reset: Boolean(data["reset"] ?? true) };
}
/**
* Le JWT Frappe est stateless : il n'y a pas de révocation serveur / endpoint de
* logout à appeler. On se contente donc de vider le store d'authentification
* local (le token expirera de lui-même côté serveur).
*/
async function logout() {
	useAuthStore.getState().reset();
}
/**
* // API CALL : frappeCall("auth.me")
*/
async function getCurrentUser() {
	return mapUser(await frappeCall("auth.me"));
}
/**
* // API CALL : frappeCall("auth.register_agency", payload)
* // paramètres : voir écran "10. Inscription agence" (AgencyProfile partiel)
*/
async function registerAgency(payload) {
	return mapLoginResponse(await frappeCall("auth.register_agency", payload));
}
/**
* Bascule l'agence active pour un utilisateur membre de plusieurs agences
* (CDC §2.1.1 — sélecteur d'agence). Le backend renvoie un nouveau JWT scoped
* sur l'agence choisie ; on le stocke dans `auth.store.ts` en remplacement de
* l'actuel.
* // API CALL : frappeCall("auth.switch_agency", { agency: agencyId })
*/
async function switchAgency(agencyId) {
	const response = mapLoginResponse(await frappeCall("auth.switch_agency", { agency: agencyId }));
	if (response.token) useAuthStore.getState().setToken(response.token);
	if (response.user) useAuthStore.getState().setUser(response.user);
	return response;
}
/**
* // API CALL : frappeCall("settings.change_password", { old_password, new_password })
* (écran Paramètres — section Sécurité, client + agence).
*/
async function changePassword(payload) {
	await frappeCall("settings.change_password", {
		old_password: payload.oldPassword,
		new_password: payload.newPassword
	});
}
//#endregion
export { login as a, requestEmailCode as c, getCurrentUser as i, switchAgency as l, confirmPasswordReset as n, logout as o, forgotPassword as r, registerAgency as s, changePassword as t };
