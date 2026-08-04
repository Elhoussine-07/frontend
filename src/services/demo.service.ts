import { camelizeKeys, frappeCall, GATEWAY_URL } from "@/services/http";
import type { UserRole } from "@/lib/types";

/**
 * Service Guide vidéo / Démo (CDC module 5) — Frappe
 * (`platform_core.platform_core.api.demo.*`, vérifié en lisant
 * `platform_core/platform_core/api/demo.py`). Authentifié (`@frappe.whitelist()`,
 * pas `allow_guest`) : utilisable uniquement depuis un tableau de bord connecté.
 */

export interface DemoGuideStep {
  step: number;
  title: string;
  /** Chemin Frappe relatif (`/files/demo/...`) — préfixé par `GATEWAY_URL` pour l'affichage. */
  videoUrl: string;
}

export interface DemoGuide {
  steps: DemoGuideStep[];
  currentStep: number;
  completed: boolean;
}

/**
 * // API CALL : frappeCall("demo.get_guide", { account_type })
 * // `account_type` attendu par le backend : "client" | "agency" (voir
 * // `GUIDE_STEPS` dans `platform_core/platform_core/api/demo.py`), identique
 * // à `UserRole` côté frontend.
 */
export async function getDemoGuide(accountType: UserRole): Promise<DemoGuide> {
  const raw = await frappeCall<unknown>("demo.get_guide", { account_type: accountType });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  const steps = (Array.isArray(data["steps"]) ? data["steps"] : []) as unknown[];

  return {
    steps: steps.map((item) => {
      const s = camelizeKeys(item) as Record<string, unknown>;
      const rawUrl = String(s["videoUrl"] ?? "");
      return {
        step: Number(s["step"] ?? 0),
        title: String(s["title"] ?? ""),
        videoUrl: rawUrl.startsWith("http") ? rawUrl : `${GATEWAY_URL}${rawUrl}`,
      };
    }),
    currentStep: Number(data["currentStep"] ?? 0),
    completed: Boolean(data["completed"] ?? false),
  };
}

/**
 * // API CALL : frappeCall("demo.set_progress", { step, completed })
 */
export async function setDemoProgress(
  step: number,
  completed: boolean,
): Promise<{ step: number; completed: boolean }> {
  const raw = await frappeCall<unknown>("demo.set_progress", {
    step,
    completed: completed ? 1 : 0,
  });
  const data = camelizeKeys(raw) as Record<string, unknown>;
  return { step: Number(data["step"] ?? step), completed: Boolean(data["completed"] ?? completed) };
}
