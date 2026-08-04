import type { Notification, PaginatedResponse } from "@/lib/types";
import { camelizeKeys, frappeCall } from "@/services/http";

/** Service notifications. */

/**
 * Traduit une `Notification` Frappe (snake_case) vers `Notification` (camelCase).
 */
function mapNotification(raw: unknown): Notification {
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    id: String(data["id"] ?? data["name"] ?? ""),
    title: String(data["title"] ?? ""),
    description: String(data["body"] ?? data["description"] ?? ""),
    createdAt: String(data["creation"] ?? data["createdAt"] ?? ""),
    read: Boolean(data["isRead"] ?? data["read"] ?? false),
    recipient: (data["recipient"] as string | undefined) ?? undefined,
    category: (data["category"] as string | undefined) ?? undefined,
    link: (data["link"] as string | null | undefined) ?? undefined,
    referenceDoctype: (data["referenceDoctype"] as string | null | undefined) ?? undefined,
    referenceName: (data["referenceName"] as string | null | undefined) ?? undefined,
    agencyContext: (data["agencyContext"] as string | null | undefined) ?? undefined,
    channel: (data["channel"] as string | undefined) ?? undefined,
    actionRequired: (data["actionRequired"] as boolean | undefined) ?? undefined,
    readOn: (data["readOn"] as string | null | undefined) ?? undefined,
    isArchived: (data["isArchived"] as boolean | undefined) ?? undefined,
  };
}

/**
 * // API CALL : frappeCall("notification.list_active", { agency_context })
 * // (notifications actives ; `notification.list_history` existe côté backend
 * // pour l'historique complet mais n'est pas branché ici faute d'appelant
 * // identifié demandant explicitement l'historique — TODO backend/frontend si
 * // un écran "historique des notifications" est ajouté).
 */
export async function getNotifications(params?: {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}): Promise<PaginatedResponse<Notification>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const raw = await frappeCall<unknown>("notification.list_active", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  let items = list.map((item) => mapNotification(item));
  if (params?.unreadOnly) {
    items = items.filter((item) => !item.read);
  }

  return {
    items,
    page,
    pageSize,
    total: items.length,
    totalPages: 1,
  };
}

/**
 * Dérivé de `notification.list_active` (compte des non-lues) — pas d'endpoint
 * "unread-count" dédié confirmé.
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  const raw = await frappeCall<unknown>("notification.list_active", {});
  const list = (Array.isArray(raw) ? raw : []) as unknown[];
  const unread = list.map((item) => mapNotification(item)).filter((item) => !item.read);
  return { count: unread.length };
}

/**
 * // API CALL : frappeCall("notification.mark_read", { notification: id })
 */
export async function markAsRead(id: string): Promise<{ read: boolean }> {
  const raw = await frappeCall<unknown>("notification.mark_read", { notification: id });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { read: Boolean(data["read"] ?? data["isRead"] ?? true) };
}

/**
 * // API CALL : frappeCall("notification.mark_all_active_read", { agency_context })
 * `agency_context` est omis (undefined) côté client — pas de notion d'agence
 * active dans ce contexte (voir `profile.service.ts::getAgencyProfile` pour
 * la même approximation côté agence).
 */
export async function markAllAsRead(): Promise<void> {
  await frappeCall<unknown>("notification.mark_all_active_read", { agency_context: undefined });
}
