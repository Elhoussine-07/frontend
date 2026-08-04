import { camelizeKeys, restCall } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/**
 * Service Chatbot IA (CDC §3.4) — `ia-service`, `POST /api/ia/chatbot`
 * (authentifié) ou `POST /api/ia/chatbot/public` (accès anonyme, seule route
 * publique sous `/api/ia/**`, cf. `AuthenticationFilter` côté api-gateway).
 *
 * `restCall("ia", path)` préfixe déjà `/api/ia` (voir la note de routage
 * détaillée dans `briefing.service.ts`) — `path` ne doit donc contenir que la
 * partie après `/api/ia`.
 */

export interface ChatbotReply {
  reply: string;
  /** `true` si le bot n'a pas de réponse fiable et transmet à un conseiller humain (CDC "Escalade humaine"). */
  escalate: boolean;
  matchedTopic: string | null;
}

/**
 * // API CALL : restCall('ia', token ? '/chatbot' : '/chatbot/public', { method: 'POST', body: { message, context } })
 */
export async function sendChatbotMessage(
  message: string,
  context: Record<string, unknown> = {},
): Promise<ChatbotReply> {
  const isAuthenticated = Boolean(useAuthStore.getState().token);
  const raw = await restCall<unknown>("ia", isAuthenticated ? "/chatbot" : "/chatbot/public", {
    method: "POST",
    body: { message, context },
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return {
    reply: String(data["reply"] ?? ""),
    escalate: Boolean(data["escalate"] ?? false),
    matchedTopic: (data["matchedTopic"] as string | null | undefined) ?? null,
  };
}
