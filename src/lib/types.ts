/**
 * Types partagés de l'application.
 * Aucune donnée réelle ici : uniquement les contrats attendus du backend
 * (Frappe + Spring Boot + Node.js).
 */

export type UserRole = "client" | "agency";

export interface User {
  id: string;
  role: UserRole;
  /** Nom affiché dans la barre supérieure (ex. raison sociale ou nom d'agence) */
  displayName: string;
  /** Initiales affichées dans l'avatar de la barre supérieure */
  initials: string;
  email: string;
}

export interface ClientProfile {
  id: string;
  contactLastName: string;
  contactFirstName: string;
  companyName: string;
  activitySector: string;
  country: string;
  legalIdType: string;
  legalIdValue: string;
  identityVerified: boolean;
  identityVerifiedAt: string | null;
  trustScore: number;
  trustScoreLabel: string;
  trustScoreFactors: Array<{
    id: string;
    label: string;
    value: number;
    max: number;
  }>;
  completionPercent: number;
  missingFields: Array<{ id: string; label: string }>;
  updatedAt: string;
  /**
   * Champs additionnels renvoyés par le backend Frappe (`client.get_profile`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `profile.service.ts::getClientProfile` pour le mapping complet.
   */
  phone?: string | undefined;
  phoneVerified?: boolean | undefined;
  logo?: string | null | undefined;
  projectsPublishedCount?: number | undefined;
  responseRate?: number | undefined;
  accountSeniority?: string | undefined;
}

export interface AgencyProfile {
  id: string;
  name: string;
  description: string;
  foundedYear: string;
  teamSize: string;
  website: string;
  languages: string[];
  remoteWork: boolean;
  location: string;
  legalIdValue: string;
  legalIdValid: boolean;
  techStack: string[];
  skills: string[];
  phoneCountryCode: string;
  phone: string;
  email: string;
  verificationCode: string;
  address: string;
  /**
   * Champs additionnels renvoyés par le backend Frappe (`agency.get_profile`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `profile.service.ts::getAgencyProfile` pour le mapping complet.
   */
  logo?: string | null | undefined;
  slogan?: string | undefined;
  coverImage?: string | null | undefined;
  coverage?: string[] | undefined;
  annualRevenue?: number | null | undefined;
  country?: string | undefined;
  emailVerified?: boolean | undefined;
  socialLinks?: Record<string, string> | undefined;
  rating?: number | undefined;
  pqiScore?: number | undefined;
  profileCompletion?: number | undefined;
  reviewsCount?: number | undefined;
  services?: string[] | undefined;
  portfolio?: Array<{ id: string; title: string; category: string }> | undefined;
  team?: Array<{ id: string; name: string; role: string }> | undefined;
  certifications?: string[] | undefined;
}

export type ProjectStatus =
  "draft" | "published" | "in_progress" | "suspended" | "finished" | "rejected";

export interface Project {
  id: string;
  reference: string;
  title: string;
  category: string;
  subCategory: string;
  status: ProjectStatus;
  statusLabel: string;
  lastActivity: string;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string;
  startedAt: string | null;
  partnerAgencyName: string | null;
  objective: string;
  features: string[];
  constraints: string[];
  deadline: string;
  locked: boolean;
  /**
   * Champs additionnels renvoyés par le backend Frappe (doctype `Project`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `projects.service.ts` / `opportunities.service.ts` pour le mapping complet.
   */
  client?: string | undefined;
  description?: string | undefined;
  needType?: string | undefined;
  channel?: string | undefined;
  deliveryDelayDays?: number | null | undefined;
  rejectionSubstatus?: string | null | undefined;
  cdcFile?: string | null | undefined;
  shortlistIa?: string[] | undefined;
  acceptanceDate?: string | null | undefined;
  expectedEndDate?: string | null | undefined;
  totalSuspensionDays?: number | undefined;
  completionConfirmedByClient?: boolean | undefined;
  repostCount?: number | undefined;
}

export interface Agency {
  id: string;
  name: string;
  logoText: string;
  location: string;
  description: string;
  rating: number;
  reviewsCount: number;
  matchingScore: number | null;
}

export interface Opportunity {
  id: string;
  step: string;
  stepLabel: string;
  companyInitials: string;
  companyName: string;
  projectTitle: string;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string;
  category: string;
  relevance: number;
  publishedAt: string;
  quoteAmount: number | null;
  remainingHours: number | null;
  /**
   * Champs additionnels renvoyés par le backend Frappe (doctype `Opportunity`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `opportunities.service.ts` pour le mapping complet.
   */
  project?: string | undefined;
  agency?: string | undefined;
  successPrediction?: number | null | undefined;
  source?: string | undefined;
  acceptedOn?: string | null | undefined;
  archivedOn?: string | null | undefined;
  archiveReason?: string | null | undefined;
}

export interface Invoice {
  id: string;
  projectTitle: string;
  companyName: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: "paid" | "to_pay" | "late";
  statusLabel: string;
  downloadUrl: string;
  /**
   * Champs additionnels renvoyés par le backend Frappe (doctype `Invoice`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `invoices.service.ts` pour le mapping complet.
   */
  agency?: string | undefined;
  project?: string | undefined;
  proposal?: string | undefined;
  tax?: number | undefined;
  total?: number | undefined;
  commissionRate?: number | undefined;
  commissionAmount?: number | undefined;
  amountDue?: number | undefined;
  paymentDate?: string | null | undefined;
  invoiceNumber?: string | undefined;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  /**
   * Champs additionnels renvoyés par le backend Frappe (doctype `Notification`)
   * sans équivalent conceptuel dans les champs historiques ci-dessus.
   * Voir `notifications.service.ts` pour le mapping complet.
   */
  recipient?: string | undefined;
  category?: string | undefined;
  link?: string | null | undefined;
  referenceDoctype?: string | null | undefined;
  referenceName?: string | null | undefined;
  agencyContext?: string | null | undefined;
  channel?: string | undefined;
  actionRequired?: boolean | undefined;
  readOn?: string | null | undefined;
  isArchived?: boolean | undefined;
}

export interface Collaboration {
  id: string;
  agencyInitials: string;
  agencyName: string;
  agencyTagline: string;
  ratingReceived: number;
  finishedProjects: string;
  period: string;
  budget: string;
  publicReview: string;
  reviewLength: number;
  yourRating: number;
}

export interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
