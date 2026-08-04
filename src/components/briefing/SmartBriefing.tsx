import {
  Calendar,
  Check,
  CreditCard,
  FileText,
  Info,
  LayoutGrid,
  Loader2,
  Lock,
  MapPin,
  Paperclip,
  Save,
  Send,
  Sparkles,
  CircleUserRound,
  Menu,
  Bot,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BriefingStepper } from "./BriefingStepper";
import { uiAction } from "@/lib/ui-actions";
import { EmptyState } from "@/components/common/EmptyState";
import { StackSkeleton } from "@/components/common/Skeletons";
import type { Agency } from "@/lib/types";
import {
  acceptSuggestion,
  generateCdcPdf,
  ignoreSuggestion,
  sendBriefingMessage,
  type BriefingMessage,
  type BriefingSummary,
} from "@/services/briefing.service";
import { contactAgencies, getProjectShortlist } from "@/services/agencies.service";
import { createProject, publishProject, saveProjectDraft } from "@/services/projects.service";
import { ApiError } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";
import { useBriefingStore } from "@/store/briefing.store";

type SummaryKey = keyof BriefingSummary;

const SUMMARY_ROWS: Array<{
  key: SummaryKey;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  { key: "category", label: "Catégorie du besoin", icon: LayoutGrid },
  { key: "description", label: "Description du besoin", icon: FileText },
  { key: "budget", label: "Budget", icon: CreditCard },
  { key: "location", label: "Localisation", icon: MapPin },
  { key: "deadline", label: "Délai de réalisation", icon: Calendar },
];

function nowLabel(): string {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Redirige vers la connexion en conservant le brief (déjà persisté en
 * localStorage par `useBriefingStore`, clé "briefing-draft") — parcours "sans
 * authentification" (CDC §4.3). `window.location.href` plutôt que le router
 * SPA : cohérent avec le choix déjà fait dans `services/http.ts`
 * (`handleUnauthorized`) pour la même raison (pas de dépendance circulaire,
 * rechargement complet acceptable ici).
 */
function redirectToLoginPreservingDraft() {
  window.location.href = "/connexion?redirect=postuler-un-projet";
}

/**
 * SMART BRIEFING IA — écrans 04a (en cours de saisie) et 04b (récapitulatif final).
 * Utilisable en public (`/postuler-un-projet`, sans connexion) ou connecté
 * (`/client/postuler-un-projet`) : le composant est identique, seul l'état
 * d'authentification (`useAuthStore`) change le comportement de publication.
 */
export function SmartBriefing() {
  const token = useAuthStore((state) => state.token);

  const conversationHistory = useBriefingStore((state) => state.conversationHistory);
  const currentBrief = useBriefingStore((state) => state.currentBrief);
  const summary = useBriefingStore((state) => state.summary);
  const suggestion = useBriefingStore((state) => state.suggestion);
  const step = useBriefingStore((state) => state.step);
  const completedSteps = useBriefingStore((state) => state.completedSteps);
  const ready = useBriefingStore((state) => state.ready);
  const projectId = useBriefingStore((state) => state.projectId);
  const projectStatus = useBriefingStore((state) => state.projectStatus);
  const autoPublishRequested = useBriefingStore((state) => state.autoPublishRequested);
  const addMessage = useBriefingStore((state) => state.addMessage);
  const setBrief = useBriefingStore((state) => state.setBrief);
  const setSummary = useBriefingStore((state) => state.setSummary);
  const setSuggestion = useBriefingStore((state) => state.setSuggestion);
  const setStep = useBriefingStore((state) => state.setStep);
  const setCompletedSteps = useBriefingStore((state) => state.setCompletedSteps);
  const setReady = useBriefingStore((state) => state.setReady);
  const setProjectId = useBriefingStore((state) => state.setProjectId);
  const setProjectStatus = useBriefingStore((state) => state.setProjectStatus);
  const setCdcFileUrl = useBriefingStore((state) => state.setCdcFileUrl);
  const setAutoPublishRequested = useBriefingStore((state) => state.setAutoPublishRequested);
  const resetBriefing = useBriefingStore((state) => state.reset);

  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGeneratingCdc, setIsGeneratingCdc] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shortlist affichée dans la vue récapitulative APRÈS un `handlePublish`
  // réussi (CDC §1.3.3/§1.5.8) — pas d'écran dédié ailleurs, cf. cartographie.
  const [publishedProjectId, setPublishedProjectId] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<Agency[]>([]);
  const [isLoadingShortlist, setIsLoadingShortlist] = useState(false);
  const [contactedAgencyIds, setContactedAgencyIds] = useState<string[]>([]);
  const [contactingAgencyId, setContactingAgencyId] = useState<string | null>(null);

  async function loadShortlist(id: string) {
    setIsLoadingShortlist(true);
    try {
      const items = await getProjectShortlist(id);
      setShortlist(items);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Impossible de charger la shortlist.");
    } finally {
      setIsLoadingShortlist(false);
    }
  }

  async function runPublish() {
    setIsPublishing(true);
    try {
      let finalProjectId = projectId;

      if (finalProjectId && projectStatus === "draft") {
        // Brouillon réel (créé par "Enregistrer brouillon") -> publication classique.
        const project = await publishProject(finalProjectId);
        finalProjectId = project.id;
        setProjectStatus("posted");
      } else if (!finalProjectId || projectStatus !== "posted") {
        // Aucun projet encore créé (ou statut inconnu) : le seul chemin de
        // création depuis le Smart Briefing IA passe par `generateCdcPdf`,
        // qui poste le projet immédiatement (voir le commentaire détaillé
        // dans `briefing.service.ts`) — pas de second appel `publishProject`
        // ensuite, il échouerait ("Ce projet est déjà publié").
        const { blob, projectId: newId } = await generateCdcPdf(currentBrief);
        finalProjectId = newId;
        setProjectId(newId);
        setProjectStatus("posted");
        setCdcFileUrl(URL.createObjectURL(blob));
      }
      // Sinon (`projectStatus === "posted"` déjà) : rien à republier, le
      // projet créé par un `handleGenerateCdc` précédent est déjà visible
      // des agences.

      setPublishedProjectId(finalProjectId);
      toast("Votre projet est publié — il est maintenant visible par les agences.");
      await loadShortlist(finalProjectId);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Impossible de publier le projet.");
    } finally {
      setIsPublishing(false);
    }
  }

  // Retour depuis /connexion après le parcours "sans authentification"
  // (CDC §4.3) : `connexion.tsx` positionne ce flag puis navigue ici.
  useEffect(() => {
    if (!autoPublishRequested) return;
    setAutoPublishRequested(false);
    if (ready) {
      void runPublish();
    } else {
      // Le brief anonyme n'a pas pu être traité par l'IA avant connexion
      // (`/api/ia/briefing/turn` exige un JWT côté Gateway, cf. commentaire
      // dans `handleSend` ci-dessous) : rien à publier automatiquement, on
      // informe juste l'utilisateur que sa conversation a été restaurée.
      toast("Vous êtes connecté(e) : reprenez votre conversation, l'assistant IA va continuer.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPublishRequested]);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim() && attachments.length === 0) return;

    const content = draft.trim();
    const userMessage: BriefingMessage = {
      id: `user-${Date.now()}`,
      author: "user",
      content,
      time: nowLabel(),
    };
    addMessage(userMessage);
    setDraft("");

    if (attachments.length > 0) {
      // TODO backend: `POST /api/ia/briefing/turn` n'accepte que du JSON
      // (`BriefingTurnRequest`) — aucun champ fichier/multipart. Les pièces
      // jointes ne sont donc jamais envoyées : on le dit explicitement
      // plutôt que de fabriquer un faux succès d'envoi.
      toast("Les pièces jointes ne sont pas encore prises en charge par l'assistant IA.");
      setAttachments([]);
    }

    if (!useAuthStore.getState().token) {
      // Gap gateway documenté (voir `AuthenticationFilter`, api-gateway) :
      // seul `/api/ia/chatbot/public` est accessible sans JWT sous
      // `/api/ia/**` — appeler `/briefing/turn` ici échouerait en 401 et
      // déclencherait la redirection globale de `services/http.ts` (perte du
      // paramètre `?redirect=`, sortie brutale du formulaire). On reste donc
      // local tant que l'utilisateur n'est pas connecté ; son message est
      // déjà persisté (store `briefing-draft`) et sera repris après connexion.
      addMessage({
        id: `ai-${Date.now()}`,
        author: "ai",
        content:
          "Merci ! Pour que l'assistant IA analyse votre besoin, connectez-vous ou créez un compte — votre message est conservé, vous n'aurez rien à retaper.",
        time: nowLabel(),
      });
      return;
    }

    setIsSending(true);
    sendBriefingMessage({
      content,
      conversationHistory: [...conversationHistory, userMessage],
      currentBrief,
    })
      .then((result) => {
        addMessage(result.aiMessage);
        setBrief(result.brief);
        setSummary(result.summary);
        setStep(result.step);
        setCompletedSteps(result.completedSteps);
        setReady(result.ready);
      })
      .catch((error: unknown) => {
        toast(
          error instanceof ApiError ? error.message : "Impossible de contacter l'assistant IA.",
        );
      })
      .finally(() => setIsSending(false));
  }

  function handleAcceptSuggestion() {
    if (!suggestion) return;
    // Pas de granularité "accepter une suggestion" côté `ia-service` (voir
    // `briefing.service.ts`) : on envoie son contenu comme prochain message
    // utilisateur, ce qui est la seule façon d'influencer le brief.
    void acceptSuggestion(projectId ?? "", suggestion.id);
    setDraft(suggestion.content);
    setSuggestion(null);
  }

  function handleIgnoreSuggestion() {
    if (!suggestion) return;
    void ignoreSuggestion(projectId ?? "", suggestion.id);
    setSuggestion(null);
  }

  async function handleSaveDraft() {
    if (!token) {
      redirectToLoginPreservingDraft();
      return;
    }
    setIsSavingDraft(true);
    try {
      const project =
        projectId && projectStatus === "draft"
          ? await saveProjectDraft(projectId, currentBrief)
          : await createProject(currentBrief);
      setProjectId(project.id);
      setProjectStatus("draft");
      toast("Brouillon enregistré.");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Impossible d'enregistrer le brouillon.");
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleGenerateCdc() {
    if (!token) {
      redirectToLoginPreservingDraft();
      return;
    }
    setIsGeneratingCdc(true);
    try {
      const { blob, projectId: newProjectId } = await generateCdcPdf(currentBrief);
      setProjectId(newProjectId);
      setProjectStatus("posted");
      const url = URL.createObjectURL(blob);
      setCdcFileUrl(url);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cdc-${newProjectId}.pdf`;
      link.click();
      // Voir le commentaire détaillé dans `briefing.service.ts::generateCdcPdf` :
      // cet appel poste réellement le projet côté backend, ce n'est pas un
      // aperçu sans effet de bord.
      toast(
        "CDC généré — votre projet a été publié et est déjà visible des agences (le backend actuel ne permet pas de générer un aperçu sans publier).",
      );
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Impossible de générer le CDC.");
    } finally {
      setIsGeneratingCdc(false);
    }
  }

  function handlePublish() {
    if (!token) {
      redirectToLoginPreservingDraft();
      return;
    }
    void runPublish();
  }

  async function handleContactAgency(agencyId: string) {
    if (!publishedProjectId) return;
    setContactingAgencyId(agencyId);
    try {
      await contactAgencies(publishedProjectId, [agencyId], undefined);
      setContactedAgencyIds((ids) => [...ids, agencyId]);
      toast("Message envoyé à l'agence.");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Envoi impossible.");
    } finally {
      setContactingAgencyId(null);
    }
  }

  function handleEdit(targetStep?: number) {
    setReady(false);
    if (targetStep) {
      setStep(targetStep);
      toast(
        "Décrivez ce que vous souhaitez modifier dans le message ci-dessous — l'assistant ne peut pas revenir en arrière automatiquement sur un champ déjà validé.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="truncate text-[22px] font-bold tracking-tight">
            Sortlist Pro
          </Link>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingDraft ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
              ) : (
                <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
              Enregistrer brouillon
            </button>
            <button
              onClick={() => uiAction("Mon compte")}
              type="button"
              aria-label="Mon compte"
              className="transition-opacity hover:opacity-70"
            >
              <CircleUserRound className="h-[22px] w-[22px]" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => uiAction("Menu")}
              type="button"
              aria-label="Menu"
              className="transition-opacity hover:opacity-70"
            >
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <BriefingStepper
          currentStep={ready ? 5 : step}
          completedSteps={ready ? [1, 2, 3, 4, 5] : completedSteps}
          onStepClick={ready ? (id) => handleEdit(id) : undefined}
        />

        {ready ? (
          <RecapView
            summary={summary}
            isGeneratingCdc={isGeneratingCdc}
            isPublishing={isPublishing}
            onEdit={() => handleEdit()}
            onGenerateCdc={handleGenerateCdc}
            onPublish={handlePublish}
            publishedProjectId={publishedProjectId}
            shortlist={shortlist}
            isLoadingShortlist={isLoadingShortlist}
            contactedAgencyIds={contactedAgencyIds}
            contactingAgencyId={contactingAgencyId}
            onContactAgency={handleContactAgency}
            onResetBriefing={() => {
              resetBriefing();
              setPublishedProjectId(null);
              setShortlist([]);
            }}
          />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* Colonne gauche — conversation avec l'IA */}
            <section>
              <h2 className="flex items-center gap-2 text-[13.5px] font-semibold">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                Conversation avec l'IA
              </h2>

              <div className="mt-5 space-y-5">
                {conversationHistory.length === 0 ? (
                  <div className="flex gap-3">
                    <Bot className="mt-0.5 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
                    <div className="min-w-0">
                      <p className="whitespace-pre-line text-[13.5px] leading-[1.55]">
                        Bonjour ! Décrivez-moi en quelques mots le besoin que vous souhaitez confier
                        à un prestataire.
                      </p>
                    </div>
                  </div>
                ) : (
                  conversationHistory.map((message) =>
                    message.author === "ai" ? (
                      <div key={message.id} className="flex gap-3">
                        <Bot className="mt-0.5 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
                        <div className="min-w-0">
                          <p className="whitespace-pre-line text-[13.5px] leading-[1.55]">
                            {message.content}
                          </p>
                          <p className="mt-1.5 text-right text-[13px] text-muted-foreground">
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div key={message.id} className="pl-8">
                        <div className="rounded-lg border border-border px-4 py-3">
                          <p className="whitespace-pre-line text-[13.5px] leading-[1.55]">
                            {message.content}
                          </p>
                          <p className="mt-1.5 text-right text-[13px] text-muted-foreground">
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ),
                  )
                )}

                {isSending ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                    <p className="text-[13px]">L'assistant réfléchit...</p>
                  </div>
                ) : null}

                {suggestion ? (
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold">Suggestion de l'IA :</p>
                      <p className="mt-1 whitespace-pre-line text-[13.5px] leading-[1.55]">
                        {suggestion.content}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={handleAcceptSuggestion}
                          className="rounded-md bg-primary px-4 py-1.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={handleIgnoreSuggestion}
                          className="rounded-md border border-border px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-accent"
                        >
                          Ignorer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleSend} className="mt-7">
                <div className="rounded-lg border border-border p-4">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    placeholder="Décrivez plus en détail votre besoin..."
                    className="w-full resize-none bg-transparent text-[13.5px] leading-[1.55] outline-none placeholder:text-muted-foreground"
                  />
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <button
                        type="button"
                        aria-label="Joindre un fichier"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Paperclip className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
                      />
                      {attachments.length > 0 ? (
                        <p className="mt-1 truncate text-[13px] text-muted-foreground">
                          {attachments.length} fichier(s) joint(s)
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      aria-label="Envoyer"
                      disabled={isSending}
                      className="shrink-0 transition-opacity hover:opacity-70 disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  Soyez le plus précis possible, l'IA vous aidera à structurer votre demande.
                </p>
              </form>
            </section>

            {/* Colonne droite — résumé du CDC en temps réel */}
            <section>
              <h2 className="text-[13.5px] font-semibold">
                Résumé de votre CDC{" "}
                <span className="font-normal text-muted-foreground">(en temps réel)</span>
              </h2>

              <div className="mt-5 space-y-6">
                {SUMMARY_ROWS.map((row) => {
                  const entry = summary[row.key];
                  const subValue = "subValue" in entry ? entry.subValue : null;

                  return (
                    <div key={row.key} className="flex items-start gap-3">
                      <row.icon className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-bold">{row.label}</p>
                        {entry.value ? (
                          <p className="mt-0.5 whitespace-pre-line text-[13px] leading-[1.5]">
                            {entry.value}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[13px] text-muted-foreground">À compléter</p>
                        )}
                        {subValue ? (
                          <p className="text-[13px] text-muted-foreground">{subValue}</p>
                        ) : null}
                      </div>
                      {entry.done ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" strokeWidth={2.6} />
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <p className="mt-7 flex items-start gap-2 text-[13px] leading-[1.5] text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                Les informations se complètent au fur et à mesure de vos réponses.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function RecapView({
  summary,
  isGeneratingCdc,
  isPublishing,
  onEdit,
  onGenerateCdc,
  onPublish,
  publishedProjectId,
  shortlist,
  isLoadingShortlist,
  contactedAgencyIds,
  contactingAgencyId,
  onContactAgency,
  onResetBriefing,
}: {
  summary: BriefingSummary;
  isGeneratingCdc: boolean;
  isPublishing: boolean;
  onEdit: () => void;
  onGenerateCdc: () => void;
  onPublish: () => void;
  publishedProjectId: string | null;
  shortlist: Agency[];
  isLoadingShortlist: boolean;
  contactedAgencyIds: string[];
  contactingAgencyId: string | null;
  onContactAgency: (agencyId: string) => void;
  onResetBriefing: () => void;
}) {
  return (
    <div className="mx-auto mt-12 max-w-[720px]">
      <h1 className="text-center text-[30px] font-bold tracking-tight">Votre brief est prêt !</h1>
      <p className="mt-2 text-center text-[14px] text-muted-foreground">
        Voici le récapitulatif de votre cahier des charges.
      </p>

      <dl className="mt-10 space-y-7">
        {SUMMARY_ROWS.map((row) => {
          const entry = summary[row.key];
          const subValue = "subValue" in entry ? entry.subValue : null;

          return (
            <div
              key={row.key}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[auto_200px_minmax(0,1fr)]"
            >
              <row.icon className="mt-0.5 h-[19px] w-[19px] shrink-0" strokeWidth={1.6} />
              <dt className="min-w-0 text-[13.5px] font-bold">{row.label}</dt>
              <dd className="col-span-2 min-w-0 sm:col-span-1">
                <p className="whitespace-pre-line text-[13.5px] font-bold leading-[1.55]">
                  {entry.value ?? "À compléter"}
                </p>
                {subValue ? (
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{subValue}</p>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>

      {!publishedProjectId ? (
        <>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md border border-border py-3.5 text-[14px] font-semibold transition-colors hover:bg-accent"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={onGenerateCdc}
              disabled={isGeneratingCdc}
              className="flex items-center justify-center gap-2 rounded-md border border-border py-3.5 text-[14px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingCdc ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
              ) : null}
              Générer le CDC (PDF)
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing}
              className="flex items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} /> : null}
              Postuler le projet
            </button>
          </div>

          <p className="mt-5 flex items-start gap-2 text-[13px] leading-[1.5] text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
            En l'état du backend, "Générer le CDC" publie déjà votre projet aux agences (pas
            d'aperçu sans effet de bord disponible) — "Postuler le projet" reste le point d'entrée
            normal.
          </p>
        </>
      ) : (
        <ShortlistSection
          projectId={publishedProjectId}
          shortlist={shortlist}
          isLoading={isLoadingShortlist}
          contactedAgencyIds={contactedAgencyIds}
          contactingAgencyId={contactingAgencyId}
          onContactAgency={onContactAgency}
          onResetBriefing={onResetBriefing}
        />
      )}
    </div>
  );
}

/**
 * Shortlist matching (CDC §1.3.3, §1.5.8) : différenciateur MUST absent de
 * l'UI existante (aucun autre écran ne l'affichait, cf. cartographie §2) —
 * ajout de composant strictement nécessaire, alimenté par
 * `agencies.service.ts::getProjectShortlist`.
 */
function ShortlistSection({
  projectId,
  shortlist,
  isLoading,
  contactedAgencyIds,
  contactingAgencyId,
  onContactAgency,
  onResetBriefing,
}: {
  projectId: string;
  shortlist: Agency[];
  isLoading: boolean;
  contactedAgencyIds: string[];
  contactingAgencyId: string | null;
  onContactAgency: (agencyId: string) => void;
  onResetBriefing: () => void;
}) {
  return (
    <div className="mt-10 border-t border-border pt-10">
      <h2 className="text-[18px] font-bold tracking-tight">Shortlist d'agences recommandées</h2>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        Sélection générée par le matching IA pour votre projet{" "}
        <span className="font-semibold">{projectId}</span>.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <StackSkeleton count={3} />
        ) : shortlist.length === 0 ? (
          <EmptyState message="Aucune agence recommandée pour le moment." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shortlist.map((agency) => {
              const isContacted = contactedAgencyIds.includes(agency.id);
              return (
                <article key={agency.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold">{agency.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                        {agency.location}
                      </p>
                    </div>
                    {agency.matchingScore !== null ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12.5px] font-semibold">
                        <Star className="h-3 w-3 fill-current" strokeWidth={0} />
                        {agency.matchingScore}%
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] text-muted-foreground">
                    {agency.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onContactAgency(agency.id)}
                      disabled={isContacted || contactingAgencyId === agency.id}
                      className="rounded-md bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {contactingAgencyId === agency.id
                        ? "Envoi..."
                        : isContacted
                          ? "Envoyé"
                          : "Envoyer"}
                    </button>
                    <Link
                      to="/agences/$id"
                      params={{ id: agency.id }}
                      className="rounded-md border border-border px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
                    >
                      Voir profil
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/client/mes-projets"
          className="rounded-md bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Voir mes projets
        </Link>
        <button
          type="button"
          onClick={onResetBriefing}
          className="rounded-md border border-border px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-accent"
        >
          Publier un nouveau projet
        </button>
      </div>
    </div>
  );
}
