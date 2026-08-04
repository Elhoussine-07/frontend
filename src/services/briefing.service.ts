import { camelizeKeys, fetchBlob, GATEWAY_URL, restCall } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/**
 * Service Smart Briefing IA — `ia-service` (microservice), pas Frappe direct
 * (sauf `confirm`, qui crée bien un `Project` côté `platform_core`).
 *
 * IMPORTANT — cette version corrige deux erreurs de la passe Phase 3
 * précédente, trouvées en lisant le code réel de `ia-service`
 * (`microservices/ia-service/app/{routes.py,models.py,nlp_service.py}`) :
 *
 * 1. Routage : le Gateway (`api-gateway/.../GatewayConfig.java`) fait du pur
 *    passthrough sans réécriture de chemin (`path("/api/ia/**")` -> forward
 *    tel quel), et `ia-service` monte son router sur le préfixe `/api/ia`
 *    lui-même (`APIRouter(prefix="/api/ia")`). Le chemin complet doit donc
 *    être exactement `${GATEWAY}/api/ia/briefing/turn` (une seule occurrence
 *    de `/api/ia`). `restCall("ia", path)` construit déjà `${GATEWAY}/api/ia`
 *    à partir du nom de service — passer un `path` qui recommençait par
 *    `/api/ia/...` doublait donc le préfixe (404 garanti). Corrigé partout
 *    dans ce fichier : `path` ne contient plus que la partie après `/api/ia`.
 *
 * 2. Contrat réel de `POST /briefing/turn` (`BriefingTurnRequest` /
 *    `BriefingTurnResponse` dans `app/models.py`) : PAS de
 *    `conversation_id`/`messages`/`suggestion`/`step` côté serveur — le
 *    service est un pur tour-par-tour sans état :
 *      requête  : { conversation_history: [{role, content}], user_message, current_brief }
 *      réponse  : { ready, question, brief, missing_fields, provider }
 *    Il n'y a ni "conversation_id" (corrélation serveur inexistante — l'état
 *    complet vit côté client, dans `briefing.store.ts`), ni "suggestion"
 *    distincte de la prochaine question, ni "step" numérique. La mise en
 *    forme précédente (calquée sur un contrat REST générique fictif) a été
 *    remplacée par un mapping fidèle à `nlp_service.SLOT_ORDER`/`SLOT_FIELDS`.
 *
 * De même pour `POST /briefing/confirm` (`ConfirmRequest` dans
 * `app/models.py`) : les champs requis sont `client` (email) et `brief`
 * (dict complet), PAS un `conversation_id` (qui n'existe pas côté serveur).
 */

export interface BriefingMessage {
  id: string;
  author: "ai" | "user";
  content: string;
  time: string;
}

export interface BriefingSuggestion {
  id: string;
  content: string;
}

export interface BriefingSummary {
  category: { value: string | null; subValue: string | null; done: boolean };
  description: { value: string | null; done: boolean };
  budget: { value: string | null; done: boolean };
  location: { value: string | null; subValue: string | null; done: boolean };
  deadline: { value: string | null; subValue: string | null; done: boolean };
}

export function emptyBriefingSummary(): BriefingSummary {
  return {
    category: { value: null, subValue: null, done: false },
    description: { value: null, done: false },
    budget: { value: null, done: false },
    location: { value: null, subValue: null, done: false },
    deadline: { value: null, subValue: null, done: false },
  };
}

function nowLabel(): string {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Traduit le `brief` (snake_case, `nlp_service.SLOT_FIELDS`) vers le
 * `BriefingSummary` des 5 étapes affichées à l'écran. `need_type` n'a pas de
 * ligne dédiée dans le stepper UI (5 étapes fixes, cf. CDC 1.3.1) : il est
 * rattaché à l'étape "Catégorie" (les deux sont demandés ensemble par
 * `ia-service`, avant la description).
 */
function summaryFromBrief(brief: Record<string, unknown>): BriefingSummary {
  const category = brief["category"] as string | undefined;
  const needType = brief["needType"] as string | undefined;
  const subCategory = brief["subCategory"] as string | undefined;
  const description = brief["description"] as string | undefined;
  const budgetMin = brief["budgetMin"];
  const budgetMax = brief["budgetMax"];
  const location = brief["location"] as string | undefined;
  const days = brief["deliveryDelayDays"];

  const budgetValue =
    budgetMin !== undefined && budgetMin !== null
      ? budgetMax !== undefined && budgetMax !== null
        ? `${budgetMin} € - ${budgetMax} €`
        : `${budgetMin} €`
      : null;

  return {
    category: {
      value: category ?? null,
      subValue: [needType, subCategory].filter(Boolean).join(" · ") || null,
      done: Boolean(category) && Boolean(needType),
    },
    description: { value: description ?? null, done: Boolean(description) },
    budget: { value: budgetValue, done: budgetMin != null && budgetMax != null },
    location: { value: location ?? null, subValue: null, done: Boolean(location) },
    deadline: {
      value: days !== undefined && days !== null ? `${days} jour(s)` : null,
      subValue: null,
      done: days !== undefined && days !== null,
    },
  };
}

/** Étape (1-5, cf. `BriefingStepper`) courante + étapes complétées, dérivées du brief. */
function stepsFromSummary(summary: BriefingSummary): { step: number; completedSteps: number[] } {
  const order: Array<{ id: number; done: boolean }> = [
    { id: 1, done: summary.category.done },
    { id: 2, done: summary.description.done },
    { id: 3, done: summary.budget.done },
    { id: 4, done: summary.location.done },
    { id: 5, done: summary.deadline.done },
  ];
  const completedSteps = order.filter((s) => s.done).map((s) => s.id);
  const firstUnfinished = order.find((s) => !s.done);
  return { step: firstUnfinished ? firstUnfinished.id : 5, completedSteps };
}

export interface BriefingTurnResult {
  /** Message IA à ajouter à la conversation (question suivante, ou message de clôture si `ready`). */
  aiMessage: BriefingMessage;
  /** Brief structuré tel que renvoyé par le backend (camelCase), à conserver dans le store pour le tour suivant. */
  brief: Record<string, unknown>;
  summary: BriefingSummary;
  ready: boolean;
  step: number;
  completedSteps: number[];
  missingFields: string[];
}

/**
 * `POST /briefing/turn` — voir le commentaire d'en-tête du fichier pour le
 * contrat réel. Pas de pièce jointe possible : `ia-service` n'accepte que du
 * JSON, aucun champ `multipart`/fichier n'existe côté `BriefingTurnRequest` —
 * les fichiers sélectionnés dans `SmartBriefing` ne sont donc jamais envoyés
 * (documenté à l'appel, pas de faux succès).
 */
export async function sendBriefingMessage(payload: {
  content: string;
  conversationHistory: BriefingMessage[];
  currentBrief: Record<string, unknown>;
}): Promise<BriefingTurnResult> {
  const raw = await restCall<unknown>("ia", "/briefing/turn", {
    method: "POST",
    body: {
      conversation_history: payload.conversationHistory.map((message) => ({
        role: message.author === "ai" ? "assistant" : "user",
        content: message.content,
      })),
      user_message: payload.content,
      current_brief: payload.currentBrief,
    },
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;

  const brief = (data["brief"] ?? {}) as Record<string, unknown>;
  const ready = Boolean(data["ready"]);
  const question = data["question"] as string | null | undefined;
  const missingFields = Array.isArray(data["missingFields"])
    ? (data["missingFields"] as string[])
    : [];

  const summary = summaryFromBrief(brief);
  const { step, completedSteps } = stepsFromSummary(summary);

  const aiMessage: BriefingMessage = {
    id: `ai-${Date.now()}`,
    author: "ai",
    content:
      question ??
      "Merci, votre brief est complet ! Vous pouvez le consulter dans le récapitulatif ci-contre.",
    time: nowLabel(),
  };

  return { aiMessage, brief, summary, ready, step, completedSteps, missingFields };
}

/**
 * TODO backend : pas d'endpoint dédié accept/ignore suggestion côté
 * `ia-service` — le flux réel est un unique endpoint conversationnel
 * `/briefing/turn` qui ne renvoie pas de "suggestion" séparée de la
 * prochaine question (voir le commentaire d'en-tête). Ces deux fonctions
 * restent des no-op documentés, conservées uniquement pour compatibilité
 * si un futur backend ajoute cette granularité.
 */
export async function acceptSuggestion(
  _conversationId: string,
  _suggestionId: string,
): Promise<{ summary: BriefingSummary }> {
  return { summary: emptyBriefingSummary() };
}

export async function ignoreSuggestion(
  _conversationId: string,
  _suggestionId: string,
): Promise<void> {
  return;
}

export interface ConfirmResponse {
  project: string;
  cdcFile: string;
}

/**
 * CONCLUSION VÉRIFIÉE (lecture de `microservices/ia-service/app/routes.py`
 * `briefing_confirm()` + `frappe_client.create_project_from_briefing()` +
 * `platform_core/platform_core/api/ia.py::create_project_from_briefing`) :
 *
 *     doc = create_draft(...)
 *     doc.status = "Posted"     # <-- PAS "Draft"
 *     doc.save(...)
 *     doc = generate_cdc_if_project(doc)
 *
 * Le projet est créé puis IMMÉDIATEMENT publié (statut `Posted`, visible des
 * agences) dans le même appel qui génère le CDC. Il n'existe pas d'endpoint
 * de génération de CDC "preview" qui ne persiste rien : le mapping vers
 * `/briefing/confirm` a un effet de bord réel et définitif dès le premier
 * clic sur "Générer le CDC (PDF)" — CE N'EST PAS un aperçu réutilisable
 * comme le texte de `RecapView` le sous-entendait (CDC §1.3.2 attend
 * pourtant un CDC générable "plusieurs fois sans publier"). `SmartBriefing`
 * compose avec ce fait réel : le `projectId` retourné ici est réutilisé tel
 * quel par `handlePublish` (pas de second appel `publishProject`, qui ferait
 * doublon / échouerait sur un projet déjà `Posted`), et le texte d'aide de
 * `RecapView` a été corrigé en conséquence.
 *
 * Gap gateway associé : `AuthenticationFilter` (api-gateway) n'autorise en
 * accès anonyme que `/api/ia/chatbot/public` sous `/api/ia/**` — cet appel
 * exige donc un JWT valide (cohérent avec le garde d'auth ajouté côté
 * `SmartBriefing.tsx::handlePublish`).
 *
 * `ConfirmRequest` (`app/models.py`) requiert `client` (email) + `brief`
 * (dict complet) — pas de `conversation_id` (concept inexistant côté
 * serveur, cf. commentaire d'en-tête). Le backend privilégie de toute façon
 * l'en-tête `X-User-Email` injecté par le Gateway sur le `client` du body
 * quand les deux sont fournis ; on envoie l'email de l'utilisateur connecté
 * en best-effort pour rester valide même si ce header venait à manquer.
 */
export async function generateCdcPdf(
  brief: Record<string, unknown>,
): Promise<{ blob: Blob; projectId: string }> {
  const clientEmail = useAuthStore.getState().user?.email ?? "";
  const raw = await restCall<unknown>("ia", "/briefing/confirm", {
    method: "POST",
    body: { client: clientEmail, brief },
  });
  const data = camelizeKeys(raw) as unknown as ConfirmResponse;
  const fileUrl = data.cdcFile.startsWith("http") ? data.cdcFile : `${GATEWAY_URL}${data.cdcFile}`;
  const blob = await fetchBlob(fileUrl);
  return { blob, projectId: data.project };
}
