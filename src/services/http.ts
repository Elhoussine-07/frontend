/**
 * Point d'entrée unique des appels réseau.
 *
 * Deux familles d'appels, toutes routées par le Gateway (Spring Cloud Gateway,
 * une seule base URL : VITE_GATEWAY_URL) :
 *
 *  - Frappe (backend "platform_core") : `frappeCall(method, args)` -> POST
 *    `${GATEWAY}/api/method/platform_core.platform_core.api.<method>` avec les
 *    arguments en JSON body. Le préfixe `platform_core.platform_core.api.` (module
 *    doublé) est EXACT côté backend, ce n'est pas une faute de frappe.
 *    On POST systématiquement (même pour les fonctions en lecture seule) pour
 *    simplifier : Frappe accepte les arguments en POST JSON body.
 *    La réponse standard Frappe a la forme `{ message: <résultat> }` ; on
 *    retourne directement `.message`.
 *
 *  - Microservices (matching / ia / prospection) : `restCall(service, path, options)`
 *    -> REST classique vers `${GATEWAY}/api/<service><path>`.
 */

import { useAuthStore } from "@/store/auth.store";

/** Base URL du Gateway. Fallback dev local hors docker si `.env` absent. */
export const GATEWAY_URL: string =
  (import.meta.env.VITE_GATEWAY_URL as string | undefined) ?? "http://localhost:8080";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RestCallOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

/**
 * Erreur réseau normalisée exposée aux appelants (services -> stores -> composants).
 */
export class ApiError extends Error {
  statusCode: number;
  frappeExcType?: string;

  constructor(message: string, statusCode: number, frappeExcType?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    if (frappeExcType !== undefined) {
      this.frappeExcType = frappeExcType;
    }
  }
}

/** Lit le token depuis le store Zustand hors composant React (`getState`). */
function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Essaie d'extraire un message d'erreur lisible du corps de réponse, dans l'ordre :
 * 1. `_server_messages` Frappe (chaîne JSON-stringifiée d'un tableau de chaînes
 *    elles-mêmes JSON-stringifiées, chaque élément `{ message, title, indicator }`)
 * 2. `exception` / `exc_type` Frappe
 * 3. `error` / `message` (format REST générique des microservices)
 * 4. message générique
 */
async function parseErrorMessage(
  response: Response,
): Promise<{ message: string; excType?: string }> {
  let body: Record<string, unknown> | null = null;
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    // corps non-JSON ou vide — on retombe sur le message générique plus bas.
  }

  if (body) {
    const excType = typeof body["exc_type"] === "string" ? (body["exc_type"] as string) : undefined;

    const serverMessages = body["_server_messages"];
    if (typeof serverMessages === "string") {
      try {
        const outer = JSON.parse(serverMessages) as unknown[];
        const firstRaw = outer[0];
        if (typeof firstRaw === "string") {
          const first = JSON.parse(firstRaw) as { message?: string };
          if (first.message) {
            return excType !== undefined
              ? { message: first.message, excType }
              : { message: first.message };
          }
        }
      } catch {
        // _server_messages malformé — on continue avec les autres champs.
      }
    }

    const exception = body["exception"];
    if (typeof exception === "string") {
      return excType !== undefined ? { message: exception, excType } : { message: exception };
    }

    const error = body["error"];
    if (typeof error === "string") {
      return { message: error };
    }

    const message = body["message"];
    if (typeof message === "string") {
      return { message };
    }
  }

  return { message: "Une erreur est survenue" };
}

/**
 * Gestion 401 commune aux deux familles d'appels : on vide le store d'auth et on
 * redirige vers /connexion.
 *
 * Choix technique : on utilise `window.location.href` plutôt que l'instance du
 * router TanStack (`src/router.tsx`) parce que `http.ts` est importé par les
 * fichiers `*.service.ts`, eux-mêmes potentiellement importés en dehors de
 * l'arbre React (stores, hors composant) ; importer le router ici créerait un
 * risque de dépendance circulaire (router -> routeTree -> routes -> services ->
 * http -> router) et un couplage fort avec l'app React alors que `http.ts` doit
 * rester utilisable de façon isolée. Un rechargement complet vers /connexion est
 * un peu plus coûteux qu'une navigation SPA mais reste correct et simple.
 */
function handleUnauthorized(): void {
  useAuthStore.getState().reset();
  if (typeof window !== "undefined") {
    window.location.href = "/connexion";
  }
}

async function throwForErrorResponse(response: Response): Promise<never> {
  if (response.status === 401) {
    handleUnauthorized();
  }
  const { message, excType } = await parseErrorMessage(response);
  throw new ApiError(message, response.status, excType);
}

function buildQueryString(query?: Record<string, string | number | boolean | undefined>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const key of Object.keys(query)) {
    const value = query[key];
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Appel Frappe via le Gateway. POST systématique, arguments en JSON body,
 * déballe `{ message: T }` -> `T`.
 */
export async function frappeCall<T>(
  method: string,
  args: Record<string, unknown> = {},
  options?: { signal?: AbortSignal },
): Promise<T> {
  const init: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(args),
  };
  if (options?.signal) {
    init.signal = options.signal;
  }

  const response = await fetch(
    `${GATEWAY_URL}/api/method/platform_core.platform_core.api.${method}`,
    init,
  );

  if (!response.ok) {
    await throwForErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json()) as { message?: T };
  return json.message as T;
}

/** Appel REST classique vers un microservice (matching / ia / prospection) via le Gateway. */
export async function restCall<T>(
  service: "matching" | "ia" | "prospection",
  path: string,
  options: RestCallOptions = {},
): Promise<T> {
  const { method = "GET", body, query, signal } = options;
  const queryString = method === "GET" ? buildQueryString(query) : "";

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  };
  if (method !== "GET" && body !== undefined) {
    init.body = JSON.stringify(body);
  }
  if (signal) {
    init.signal = signal;
  }

  const response = await fetch(`${GATEWAY_URL}/api/${service}${path}${queryString}`, init);

  if (!response.ok) {
    await throwForErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

/**
 * Récupère un fichier binaire (PDF, etc.) sur une URL déjà construite (Frappe ou
 * microservice), en réutilisant l'auth + la gestion d'erreurs communes.
 * Utile pour `downloadInvoice` / `generateCdcPdf` qui doivent renvoyer un `Blob`.
 */
export async function fetchBlob(url: string, signal?: AbortSignal): Promise<Blob> {
  const init: RequestInit = { headers: { ...authHeaders() } };
  if (signal) {
    init.signal = signal;
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    await throwForErrorResponse(response);
  }
  return response.blob();
}

/**
 * Convertit récursivement les clés d'un objet/tableau de snake_case (Frappe) vers
 * camelCase (conventions du frontend). Utilisé à l'intérieur des services pour
 * traduire les réponses backend avant de les exposer aux composants — les
 * interfaces de `lib/types.ts` restent en camelCase, la traduction se fait ici,
 * pas dans les types.
 *
 * Typé `any` en sortie volontairement : Frappe n'expose pas de schéma, la forme
 * précise est ensuite reconstruite "à la main" (et typée) dans chaque service.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function camelizeKeys(input: unknown): any {
  if (Array.isArray(input)) {
    return input.map((item) => camelizeKeys(item));
  }
  if (input !== null && typeof input === "object" && !(input instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const camelKey = key.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
      result[camelKey] = camelizeKeys(value);
    }
    return result;
  }
  return input;
}
