import type { User, UserRole } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/**
 * Service d'authentification.
 *
 * Backend ciblé : Frappe via le Gateway
 * (`platform_core.platform_core.api.auth.*`).
 */

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
  /** Type de compte détecté côté serveur pour la redirection du tableau de bord */
  detectedRole: UserRole;
  /**
   * `true` si le backend a explicitement renvoyé un champ de rôle reconnu.
   * `false` si on a dû retomber sur une valeur par défaut (rôle demandé par
   * l'utilisateur, ou "client"). Sert à ne PAS bloquer l'utilisateur sur une
   * fausse incohérence quand le backend ne renvoie simplement pas le champ
   * attendu pour cet endpoint (cf. TODO ci-dessous).
   */
  roleKnown: boolean;
}

// La forme exacte des champs utilisateur renvoyés diffère selon l'endpoint
// (auth.login / auth.verify_otp / auth.me / auth.register_*). On tente donc
// plusieurs noms de champs plutôt que de se fier à un seul.
const ROLE_FIELD_CANDIDATES = [
  "role",
  "userType",
  "accountType",
  "type",
  "profileType",
  "userRole",
] as const;

function extractRawRole(data: Record<string, unknown>): string | undefined {
  for (const key of ROLE_FIELD_CANDIDATES) {
    const value = data[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

/**
 * Retourne le rôle normalisé si `rawRole` correspond à une valeur reconnue,
 * sinon `null` (contrairement à l'ancienne version, ne retombe JAMAIS
 * silencieusement sur "client" : c'est à l'appelant de décider du fallback).
 */
function normalizeRole(rawRole: unknown): UserRole | null {
  if (rawRole === undefined || rawRole === null) return null;
  const value = String(rawRole).trim().toLowerCase();
  if (value.length === 0) return null;
  if (value.startsWith("agenc")) return "agency";
  if (value.startsWith("client") || value.startsWith("entreprise") || value.startsWith("company")) {
    return "client";
  }
  return null;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * Traduit la réponse Frappe (snake_case, forme exacte non documentée côté API
 * publique) vers le type `User` (camelCase) consommé par le frontend.
 * `fallbackRole` est utilisé uniquement si aucun champ de rôle reconnu n'est
 * trouvé dans `raw` (voir `normalizeRole`).
 */
function mapUser(raw: unknown, fallbackRole: UserRole): User {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const role = normalizeRole(extractRawRole(data)) ?? fallbackRole;
  const displayName =
    (data["displayName"] as string | undefined) ??
    (data["fullName"] as string | undefined) ??
    (data["agencyName"] as string | undefined) ??
    (data["companyName"] as string | undefined) ??
    (data["email"] as string | undefined) ??
    "Utilisateur";

  return {
    id: String(data["id"] ?? data["name"] ?? data["user"] ?? ""),
    role,
    displayName,
    initials: initialsFromName(displayName),
    email: String(data["email"] ?? ""),
  };
}

/**
 * @param requestedRole rôle sélectionné dans l'UI (ou déjà connu côté appelant).
 * Sert de fallback si le backend ne renvoie aucun champ de rôle reconnu, pour
 * éviter de retomber à tort sur "client" (bug historique : un compte agence
 * dont la réponse ne contenait pas de champ "role" était toujours détecté
 * comme client, ce qui bloquait la connexion et polluait le store).
 */
function mapLoginResponse(raw: unknown, requestedRole: UserRole): LoginResponse {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const token = String(data["token"] ?? data["accessToken"] ?? data["jwt"] ?? "");

  const userData = (data["user"] ?? data) as Record<string, unknown>;
  // On cherche le rôle d'abord dans l'objet user imbriqué, puis au niveau racine.
  const rawRole = extractRawRole(userData) ?? extractRawRole(data);
  const normalized = normalizeRole(rawRole);
  const roleKnown = normalized !== null;
  const detectedRole = normalized ?? requestedRole;

  const user = mapUser(userData, detectedRole);

  return { token, user, detectedRole, roleKnown };
}

/**
 * // API CALL : frappeCall("auth.login", { email, password })
 * // erreurs    : 401 identifiants invalides, 422 validation
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const raw = await frappeCall<unknown>("auth.login", {
    email: payload.email,
    password: payload.password,
  });
  return mapLoginResponse(raw, payload.role);
}

/**
 * // API CALL : frappeCall("auth.request_otp", { email })
 */
export async function requestEmailCode(email: string): Promise<{
  sent: boolean;
  expiresInSeconds: number;
}> {
  const raw = await frappeCall<unknown>("auth.request_otp", { email });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    sent: Boolean(data["sent"] ?? true),
    expiresInSeconds: Number(data["expiresInSeconds"] ?? data["expiresIn"] ?? 300),
  };
}

/**
 * // API CALL : frappeCall("auth.verify_otp", { email, code }) → retourne un JWT
 * @param expectedRole rôle attendu (si connu depuis l'UI) utilisé comme
 * fallback si le backend ne renvoie pas de champ de rôle reconnu.
 */
export async function verifyEmailCode(
  email: string,
  code: string,
  expectedRole: UserRole = "client",
): Promise<LoginResponse> {
  const raw = await frappeCall<unknown>("auth.verify_otp", { email, code });
  return mapLoginResponse(raw, expectedRole);
}

/**
 * // API CALL : frappeCall("auth.request_password_reset", { email })
 */
export async function forgotPassword(email: string): Promise<{ sent: boolean }> {
  const raw = await frappeCall<unknown>("auth.request_password_reset", { email });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { sent: Boolean(data["sent"] ?? true) };
}

/**
 * Deuxième étape du flux "mot de passe oublié" : confirme le code reçu par
 * email et fixe le nouveau mot de passe.
 * // API CALL : frappeCall("auth.reset_password", { email, code, new_password })
 */
export async function confirmPasswordReset(payload: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ reset: boolean }> {
  const raw = await frappeCall<unknown>("auth.reset_password", {
    email: payload.email,
    code: payload.code,
    new_password: payload.newPassword,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { reset: Boolean(data["reset"] ?? true) };
}

/**
 * Le JWT Frappe est stateless : il n'y a pas de révocation serveur / endpoint de
 * logout à appeler. On se contente donc de vider le store d'authentification
 * local (le token expirera de lui-même côté serveur).
 */
export async function logout(): Promise<void> {
  useAuthStore.getState().reset();
}

/**
 * // API CALL : frappeCall("auth.me")
 * @param fallbackRole rôle à utiliser si aucun champ de rôle reconnu n'est
 * renvoyé (par défaut, le rôle actuellement stocké, sinon "client").
 */
export async function getCurrentUser(fallbackRole?: UserRole): Promise<User> {
  const raw = await frappeCall<unknown>("auth.me");
  const currentRole = fallbackRole ?? useAuthStore.getState().role ?? "client";
  return mapUser(raw, currentRole);
}

/**
 * // API CALL : frappeCall("auth.register_client", payload)
 * // paramètres : voir formulaire d'inscription client
 * // Cette fonction crée un compte client avec vérification OTP
 */
export async function registerClient(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  companyName?: string;
  phone?: string;
  verificationCode: string;
}): Promise<LoginResponse> {
  const raw = await frappeCall<unknown>("auth.register_client", {
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    country: payload.country,
    company_name: payload.companyName,
    phone: payload.phone,
    verification_code: payload.verificationCode,
  });
  return mapLoginResponse(raw, "client");
}

/**
 * // API CALL : frappeCall("auth.register_agency", payload)
 * // paramètres : voir écran "10. Inscription agence" (AgencyProfile partiel)
 */
export async function registerAgency(payload: unknown): Promise<LoginResponse> {
  const raw = await frappeCall<unknown>("auth.register_agency", payload as Record<string, unknown>);
  return mapLoginResponse(raw, "agency");
}

/**
 * // API CALL : frappeCall("agency.check_name_availability", { name })
 * // Branché sur le nouvel endpoint dédié (hors périmètre de cet agent, livré
 * // en parallèle sur `platform_core` par l'agent "agence"/"backend" ; câblé
 * // par avance, sera fonctionnel une fois le endpoint livré côté serveur).
 */
export async function checkAgencyNameAvailability(name: string): Promise<{
  available: boolean;
  existingAgencyId: string | null;
}> {
  const raw = await frappeCall<unknown>("agency.check_name_availability", { name });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    available: Boolean(data["available"] ?? true),
    existingAgencyId: (data["existingAgencyId"] as string | undefined) ?? null,
  };
}

/**
 * // API CALL : frappeCall("client.request_phone_otp", { phone })
 */
export async function sendPhoneOtp(phone: string): Promise<{ sent: boolean }> {
  const raw = await frappeCall<unknown>("client.request_phone_otp", { phone });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { sent: Boolean(data["sent"] ?? true) };
}

/**
 * // API CALL : frappeCall("client.verify_phone_otp", { code })
 */
export async function verifyPhoneOtp(code: string): Promise<{ verified: boolean }> {
  const raw = await frappeCall<unknown>("client.verify_phone_otp", { code });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { verified: Boolean(data["verified"] ?? true) };
}

/**
 * Bascule l'agence active pour un utilisateur membre de plusieurs agences
 * (CDC §2.1.1 : sélecteur d'agence). Le backend renvoie un nouveau JWT scoped
 * sur l'agence choisie ; on le stocke dans `auth.store.ts` en remplacement de
 * l'actuel.
 * // API CALL : frappeCall("auth.switch_agency", { agency: agencyId })
 */
export async function switchAgency(agencyId: string): Promise<LoginResponse> {
  const raw = await frappeCall<unknown>("auth.switch_agency", { agency: agencyId });
  const response = mapLoginResponse(raw, "agency");
  if (response.token && response.user) {
    useAuthStore.getState().setSession({
      token: response.token,
      user: response.user,
      role: response.detectedRole,
    });
  }
  return response;
}

/**
 * // API CALL : frappeCall("settings.change_password", { old_password, new_password })
 * // (écran Paramètres : section Sécurité, client + agence).
 */
export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  await frappeCall<unknown>("settings.change_password", {
    old_password: payload.oldPassword,
    new_password: payload.newPassword,
  });
}
