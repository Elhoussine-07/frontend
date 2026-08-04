import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BriefingMessage,
  BriefingSuggestion,
  BriefingSummary,
} from "@/services/briefing.service";
import { emptyBriefingSummary } from "@/services/briefing.service";

/**
 * État persistant du Smart Briefing (CDC §1.3).
 *
 * Deux rôles :
 *  1. Porter le contexte conversationnel (`conversationHistory`/`currentBrief`)
 *     que `ia-service` attend à chaque tour (`POST /api/ia/briefing/turn`),
 *     puisque ce microservice est lui-même sans état côté serveur — voir le
 *     TODO laissé dans `briefing.service.ts` par l'agent Phase 3.
 *  2. Survivre à une navigation vers `/connexion` puis un retour (parcours
 *     "sans authentification", CDC §4.3) : persisté en localStorage sous la
 *     clé "briefing-draft".
 */

export interface BriefingState {
  /** Identifiant de conversation renvoyé par `ia-service` (corrélation serveur). */
  conversationId: string | null;
  /** Historique complet envoyé à chaque tour (le microservice ne le conserve pas). */
  conversationHistory: BriefingMessage[];
  /** Brief structuré courant (forme libre — dépend de ce que `ia-service` renvoie). */
  currentBrief: Record<string, unknown>;
  /** Résumé affiché dans la colonne de droite / vue récapitulative. */
  summary: BriefingSummary;
  suggestion: BriefingSuggestion | null;
  step: number;
  completedSteps: number[];
  /** `true` quand les 5 étapes sont complètes -> vue récapitulative (04b). */
  ready: boolean;
  /**
   * Identifiant du `Project` déjà créé côté backend par un appel précédent à
   * `generateCdcPdf` (voir le commentaire dans `briefing.service.ts` :
   * `create_project_from_briefing` poste réellement le projet, il n'existe
   * pas de brouillon intermédiaire pour ce chemin-là). `null` tant qu'aucun
   * appel n'a réussi.
   */
  projectId: string | null;
  /**
   * Statut connu du `Project` référencé par `projectId` :
   *  - "draft" : créé via `saveProjectDraft`/`createProject` (statut Frappe
   *    réel `Draft`) — `projects.service.ts::publishProject` est alors
   *    l'action correcte pour le publier.
   *  - "posted" : créé via `briefing.service.ts::generateCdcPdf`, qui poste
   *    le projet immédiatement côté backend (voir le commentaire détaillé
   *    dans ce fichier) — republier lèverait une erreur backend
   *    ("Ce projet est déjà publié"), donc `handlePublish` ne le fait pas.
   */
  projectStatus: "draft" | "posted" | null;
  /** Dernière URL de CDC PDF générée (blob object URL), pour affichage/téléchargement. */
  cdcFileUrl: string | null;
  /**
   * Positionné par `connexion.tsx` juste avant de naviguer vers le Smart
   * Briefing authentifié, quand un brief persistant existe et que
   * `?redirect=postuler-un-projet` est présent dans l'URL de connexion.
   * `SmartBriefing` consomme ce flag une fois (déclenche `handlePublish`
   * automatiquement) puis le remet à `false`.
   */
  autoPublishRequested: boolean;

  addMessage: (message: BriefingMessage) => void;
  setConversationId: (id: string | null) => void;
  setBrief: (brief: Record<string, unknown>) => void;
  setSummary: (summary: BriefingSummary) => void;
  setSuggestion: (suggestion: BriefingSuggestion | null) => void;
  setStep: (step: number) => void;
  setCompletedSteps: (steps: number[]) => void;
  setReady: (ready: boolean) => void;
  setProjectId: (id: string | null) => void;
  setProjectStatus: (status: "draft" | "posted" | null) => void;
  setCdcFileUrl: (url: string | null) => void;
  setAutoPublishRequested: (value: boolean) => void;
  /** `true` s'il existe un brief en cours (utilisé par `connexion.tsx` pour décider de rediriger). */
  hasDraft: () => boolean;
  reset: () => void;
}

const initialState = {
  conversationId: null as string | null,
  conversationHistory: [] as BriefingMessage[],
  currentBrief: {} as Record<string, unknown>,
  summary: emptyBriefingSummary(),
  suggestion: null as BriefingSuggestion | null,
  step: 1,
  completedSteps: [] as number[],
  ready: false,
  projectId: null as string | null,
  projectStatus: null as "draft" | "posted" | null,
  cdcFileUrl: null as string | null,
  autoPublishRequested: false,
};

export const useBriefingStore = create<BriefingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addMessage: (message) =>
        set((state) => ({ conversationHistory: [...state.conversationHistory, message] })),
      setConversationId: (id) => set({ conversationId: id }),
      setBrief: (brief) => set({ currentBrief: brief }),
      setSummary: (summary) => set({ summary }),
      setSuggestion: (suggestion) => set({ suggestion }),
      setStep: (step) => set({ step }),
      setCompletedSteps: (steps) => set({ completedSteps: steps }),
      setReady: (ready) => set({ ready }),
      setProjectId: (id) => set({ projectId: id }),
      setProjectStatus: (status) => set({ projectStatus: status }),
      setCdcFileUrl: (url) => set({ cdcFileUrl: url }),
      setAutoPublishRequested: (value) => set({ autoPublishRequested: value }),
      hasDraft: () => {
        const state = get();
        return (
          state.conversationId !== null ||
          state.conversationHistory.length > 0 ||
          Object.keys(state.currentBrief).length > 0
        );
      },
      reset: () => set({ ...initialState, summary: emptyBriefingSummary() }),
    }),
    {
      name: "briefing-draft",
      partialize: (state) => ({
        conversationId: state.conversationId,
        conversationHistory: state.conversationHistory,
        currentBrief: state.currentBrief,
        summary: state.summary,
        step: state.step,
        completedSteps: state.completedSteps,
        ready: state.ready,
        projectId: state.projectId,
        projectStatus: state.projectStatus,
        cdcFileUrl: state.cdcFileUrl,
        autoPublishRequested: state.autoPublishRequested,
      }),
    },
  ),
);
