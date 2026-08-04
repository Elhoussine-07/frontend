import type { AgencyProfile, ClientProfile, Collaboration, Project } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";
import { mapCollaboration } from "@/services/collaborations.service";
import { mapProject } from "@/services/projects.service";
import { useAuthStore } from "@/store/auth.store";
import { useAgencyStore } from "@/store/agency.store";

/**
 * Services profil, collaborations, paramètres, tableau de bord.
 *
 * NOTE : `getCollaborations`/`submitCollaborationReview` sont un doublon
 * volontaire de `collaborations.service.ts` (voir consigne) — ils pointent vers
 * les mêmes appels réseau (`client.list_collaborations` / `review.submit_agency_review`),
 * via `mapCollaboration` partagé.
 */

function trustScoreLabelFor(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "Moyen";
  return "À améliorer";
}

/**
 * Traduit `client.get_profile` (snake_case) vers `ClientProfile` (camelCase).
 * // TODO backend: `trustScoreFactors`/`missingFields`/`identityVerifiedAt` n'ont
 * // pas de source confirmée dans `client.get_profile` — laissés vides/dérivés
 * // en best-effort (label calculé côté client à partir du score).
 */
function mapClientProfile(raw: unknown): ClientProfile {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const trustScore = Number(data["trustScore"] ?? 0);

  return {
    id: String(data["id"] ?? data["name"] ?? ""),
    contactFirstName: String(data["firstName"] ?? data["contactFirstName"] ?? ""),
    contactLastName: String(data["lastName"] ?? data["contactLastName"] ?? ""),
    companyName: String(data["companyName"] ?? ""),
    activitySector: String(data["sector"] ?? data["activitySector"] ?? ""),
    country: String(data["country"] ?? ""),
    legalIdType: String(data["legalIdLabel"] ?? data["legalIdType"] ?? ""),
    legalIdValue: String(data["legalId"] ?? data["legalIdValue"] ?? ""),
    identityVerified: Boolean(data["legalIdVerified"] ?? data["identityVerified"] ?? false),
    identityVerifiedAt: (data["identityVerifiedAt"] as string | undefined) ?? null,
    trustScore,
    trustScoreLabel: String(data["trustScoreLabel"] ?? trustScoreLabelFor(trustScore)),
    trustScoreFactors: Array.isArray(data["trustScoreFactors"])
      ? (data["trustScoreFactors"] as ClientProfile["trustScoreFactors"])
      : [],
    completionPercent: Number(data["profileCompletion"] ?? data["completionPercent"] ?? 0),
    missingFields: Array.isArray(data["missingFields"])
      ? (data["missingFields"] as ClientProfile["missingFields"])
      : [],
    updatedAt: String(data["modified"] ?? data["updatedAt"] ?? ""),
    phone: (data["phone"] as string | undefined) ?? undefined,
    phoneVerified: (data["phoneVerified"] as boolean | undefined) ?? undefined,
    logo: (data["logo"] as string | null | undefined) ?? undefined,
    projectsPublishedCount:
      data["projectsPublishedCount"] !== undefined
        ? Number(data["projectsPublishedCount"])
        : undefined,
    responseRate: data["responseRate"] !== undefined ? Number(data["responseRate"]) : undefined,
    accountSeniority: (data["accountSeniority"] as string | undefined) ?? undefined,
  };
}

/**
 * Traduit `agency.get_profile` (snake_case) vers `AgencyProfile` (camelCase).
 * // TODO backend: `phoneCountryCode`/`verificationCode`/`address` n'ont pas de
 * // champ backend confirmé — laissés vides (usage frontend uniquement pour
 * // `verificationCode`, propre au flux d'inscription).
 */
function mapAgencyProfile(raw: unknown): AgencyProfile {
  const data = camelizeKeys(raw) as Record<string, unknown>;

  return {
    id: String(data["id"] ?? data["name"] ?? ""),
    name: String(data["agencyName"] ?? data["name"] ?? ""),
    description: String(data["description"] ?? ""),
    foundedYear: String(data["yearFounded"] ?? data["foundedYear"] ?? ""),
    teamSize: String(data["teamSize"] ?? ""),
    website: String(data["website"] ?? ""),
    languages: Array.isArray(data["languages"]) ? (data["languages"] as string[]) : [],
    remoteWork: Boolean(data["remoteWork"] ?? false),
    location: String(data["location"] ?? ""),
    legalIdValue: String(data["legalId"] ?? data["legalIdValue"] ?? ""),
    legalIdValid: Boolean(data["legalIdVerified"] ?? data["legalIdValid"] ?? false),
    techStack: Array.isArray(data["techStack"]) ? (data["techStack"] as string[]) : [],
    skills: Array.isArray(data["skills"]) ? (data["skills"] as string[]) : [],
    phoneCountryCode: String(data["phoneCountryCode"] ?? ""),
    phone: String(data["phone"] ?? ""),
    email: String(data["email"] ?? ""),
    verificationCode: String(data["verificationCode"] ?? ""),
    address: String(data["address"] ?? data["location"] ?? ""),
    logo: (data["logo"] as string | null | undefined) ?? undefined,
    slogan: (data["slogan"] as string | undefined) ?? undefined,
    coverImage: (data["coverImage"] as string | null | undefined) ?? undefined,
    coverage: Array.isArray(data["coverage"]) ? (data["coverage"] as string[]) : undefined,
    annualRevenue: data["annualRevenue"] !== undefined ? Number(data["annualRevenue"]) : undefined,
    country: (data["country"] as string | undefined) ?? undefined,
    emailVerified: (data["emailVerified"] as boolean | undefined) ?? undefined,
    socialLinks: (data["socialLinks"] as Record<string, string> | undefined) ?? undefined,
    rating: data["rating"] !== undefined ? Number(data["rating"]) : undefined,
    pqiScore: data["pqiScore"] !== undefined ? Number(data["pqiScore"]) : undefined,
    profileCompletion:
      data["profileCompletion"] !== undefined ? Number(data["profileCompletion"]) : undefined,
    reviewsCount: data["reviewsCount"] !== undefined ? Number(data["reviewsCount"]) : undefined,
    services: Array.isArray(data["services"]) ? (data["services"] as string[]) : undefined,
    portfolio: Array.isArray(data["portfolio"])
      ? (data["portfolio"] as AgencyProfile["portfolio"])
      : undefined,
    team: Array.isArray(data["team"]) ? (data["team"] as AgencyProfile["team"]) : undefined,
    certifications: Array.isArray(data["certifications"])
      ? (data["certifications"] as string[])
      : undefined,
  };
}

/**
 * // API CALL : frappeCall("client.get_profile")
 */
export async function getClientProfile(): Promise<ClientProfile> {
  const raw = await frappeCall<unknown>("client.get_profile", {});
  return mapClientProfile(raw);
}

/**
 * // API CALL : frappeCall("client.update_profile", payload)
 */
export async function updateClientProfile(payload: Partial<ClientProfile>): Promise<ClientProfile> {
  const raw = await frappeCall<unknown>(
    "client.update_profile",
    payload as Record<string, unknown>,
  );
  return mapClientProfile(raw);
}

/**
 * // API CALL : frappeCall("agency.get_profile", { agency: <agence active> })
 * L'agence active est portée par `agency.store.ts` (`activeAgencyId`, alimenté
 * par le sélecteur d'agence de `DashboardShell.tsx` via `agencies.service.ts::getMyAgencies`).
 * Repli sur l'id utilisateur si aucune agence active n'est encore connue
 * (premier chargement avant que le sélecteur n'ait résolu la liste des agences).
 */
export async function getAgencyProfile(): Promise<AgencyProfile> {
  const agencyId = useAgencyStore.getState().activeAgencyId ?? useAuthStore.getState().user?.id;
  const raw = await frappeCall<unknown>("agency.get_profile", { agency: agencyId });
  return mapAgencyProfile(raw);
}

/**
 * // API CALL : frappeCall("agency.update_profile", payload)
 */
export async function updateAgencyProfile(payload: Partial<AgencyProfile>): Promise<AgencyProfile> {
  const raw = await frappeCall<unknown>(
    "agency.update_profile",
    payload as Record<string, unknown>,
  );
  return mapAgencyProfile(raw);
}

/**
 * // API CALL : frappeCall("client.list_collaborations")
 * // (doublon volontaire de `collaborations.service.ts::getCollaborations`)
 */
export async function getCollaborations(): Promise<{ items: Collaboration[] }> {
  const raw = await frappeCall<unknown>("client.list_collaborations", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  return { items: list.map((item) => mapCollaboration(item)) };
}

/**
 * // API CALL : frappeCall("review.submit_agency_review", { project: id, rating, comment })
 * // (doublon volontaire de `collaborations.service.ts::submitCollaborationReview`)
 */
export async function submitCollaborationReview(
  id: string,
  payload: { rating: number; comment: string },
): Promise<Collaboration> {
  const raw = await frappeCall<unknown>("review.submit_agency_review", {
    project: id,
    rating: payload.rating,
    comment: payload.comment,
  });
  return mapCollaboration(raw);
}

export interface ClientDashboard {
  trustScore: { value: number; label: string };
  publishedProjects: { value: number; delta: string };
  responseRate: { value: number; delta: string };
  activeCollaborations: { value: number };
  recentProjects: Project[];
}

/**
 * // API CALL : frappeCall("client.get_dashboard")
 * // Réponse : { trustScore, projectsPublishedCount, responseRate,
 * // activeProjectsCount, collaborationsCount, recentProjects }.
 * // TODO backend: pas de "delta" (variation) exposé par ce endpoint — laissés
 * // à "0%" (aucune source connue).
 */
export async function getClientDashboard(): Promise<ClientDashboard> {
  const raw = await frappeCall<unknown>("client.get_dashboard", {});
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const trustScore = Number(data["trustScore"] ?? 0);
  const recentProjectsList = Array.isArray(data["recentProjects"])
    ? (data["recentProjects"] as unknown[])
    : [];

  return {
    trustScore: { value: trustScore, label: trustScoreLabelFor(trustScore) },
    publishedProjects: { value: Number(data["projectsPublishedCount"] ?? 0), delta: "0%" },
    responseRate: { value: Number(data["responseRate"] ?? 0), delta: "0%" },
    activeCollaborations: {
      value: Number(data["collaborationsCount"] ?? data["activeProjectsCount"] ?? 0),
    },
    recentProjects: recentProjectsList.map((item) => mapProject(item)),
  };
}

export interface AgencyDashboard {
  profile: AgencyProfile;
  pqiScore: number;
  recentOpportunitiesCount: number;
}

/**
 * // API CALL : frappeCall("agency.get_dashboard", { agency: agencyId })
 * // TODO backend: forme exacte de la réponse `agency.get_dashboard` non
 * // documentée dans le contrat fourni (seul `client.get_dashboard` y est
 * // détaillé) — endpoint dans le périmètre de l'agent "agence"/"backend",
 * // câblé par avance avec un mapping best-effort (`pqiScore`,
 * // `recentOpportunitiesCount`/`opportunitiesCount`). Le profil complet reste
 * // chargé séparément via `agency.get_profile` (pas de raison que le
 * // endpoint dashboard duplique tout le profil).
 */
export async function getAgencyDashboard(): Promise<AgencyDashboard> {
  const agencyId = useAgencyStore.getState().activeAgencyId ?? useAuthStore.getState().user?.id;
  const [profileRaw, dashboardRaw] = await Promise.all([
    frappeCall<unknown>("agency.get_profile", { agency: agencyId }),
    frappeCall<unknown>("agency.get_dashboard", { agency: agencyId }),
  ]);

  const dashboard = camelizeKeys(dashboardRaw) as Record<string, unknown>;

  return {
    profile: mapAgencyProfile(profileRaw),
    pqiScore: Number(dashboard["pqiScore"] ?? 0),
    recentOpportunitiesCount: Number(
      dashboard["recentOpportunitiesCount"] ?? dashboard["opportunitiesCount"] ?? 0,
    ),
  };
}

export interface Settings {
  theme: "light" | "dark" | "system";
  language: string;
  font: string;
  textSize: number;
  twoFactorEnabled: boolean;
  /**
   * // TODO backend: pas de champ confirmé sur `settings.get_settings` /
   * // `settings.update_settings` pour les préférences de canal de notification
   * // (email/push) — approximation best-effort (défaut `true`), à corriger le
   * // jour où le backend expose ces deux champs explicitement.
   */
  emailNotifications: boolean;
  pushNotifications: boolean;
}

/**
 * // API CALL : frappeCall("settings.get_settings")
 */
export async function getSettings(): Promise<Settings> {
  const raw = await frappeCall<unknown>("settings.get_settings", {});
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const theme = String(data["theme"] ?? "system");
  return {
    theme: theme === "light" || theme === "dark" ? theme : "system",
    language: String(data["language"] ?? "fr"),
    font: String(data["font"] ?? "default"),
    textSize: Number(data["textSize"] ?? 14),
    twoFactorEnabled: Boolean(data["twoFactorEnabled"] ?? false),
    emailNotifications: Boolean(data["emailNotifications"] ?? true),
    pushNotifications: Boolean(data["pushNotifications"] ?? true),
  };
}

/**
 * // API CALL : frappeCall("settings.update_settings", payload)
 */
export async function updateSettings(payload: Partial<Settings>): Promise<Settings> {
  const raw = await frappeCall<unknown>(
    "settings.update_settings",
    payload as Record<string, unknown>,
  );
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const theme = String(data["theme"] ?? payload.theme ?? "system");
  return {
    theme: theme === "light" || theme === "dark" ? theme : "system",
    language: String(data["language"] ?? payload.language ?? "fr"),
    font: String(data["font"] ?? payload.font ?? "default"),
    textSize: Number(data["textSize"] ?? payload.textSize ?? 14),
    twoFactorEnabled: Boolean(data["twoFactorEnabled"] ?? payload.twoFactorEnabled ?? false),
    emailNotifications: Boolean(data["emailNotifications"] ?? payload.emailNotifications ?? true),
    pushNotifications: Boolean(data["pushNotifications"] ?? payload.pushNotifications ?? true),
  };
}

/**
 * Enregistre un moyen de paiement agence (formulaire de facturation, écran
 * "Facturation" côté agence — `agence.facturation.tsx`, hors périmètre de cet
 * agent, qui n'a qu'à importer cette fonction).
 *
 * // API CALL : frappeCall("payment.register_payment_method", payload)
 * // Endpoint déjà existant côté backend (pas un TODO backend), simplement
 * // jamais exposé côté service avant cette passe. `payload` est transmis tel
 * // quel (forme exacte laissée à l'appelant / au formulaire agence — voir
 * // CDC §2.3.x facturation pour les champs attendus, ex. type de moyen de
 * // paiement, IBAN/carte, titulaire...).
 *
 * Signature :
 *   registerAgencyPaymentMethod(payload: Record<string, unknown>): Promise<{ registered: boolean }>
 */
export async function registerAgencyPaymentMethod(
  payload: Record<string, unknown>,
): Promise<{ registered: boolean }> {
  const raw = await frappeCall<unknown>("payment.register_payment_method", payload);
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { registered: Boolean(data["registered"] ?? true) };
}
