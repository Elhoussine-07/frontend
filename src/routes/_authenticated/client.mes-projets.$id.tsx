import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Lock,
  MapPin,
  RefreshCcw,
  ShieldAlert,
  Star,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionCard, StatusBadge, TextAreaField } from "@/components/common/Blocks";
import { StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { ActionModal } from "@/components/common/ActionModal";
import type { Agency } from "@/lib/types";
import { getProject } from "@/services/projects.service";
import {
  getDispute,
  requestSuspension,
  relaunchAgencySearch,
  type SuspensionCategory,
} from "@/services/disputes.service";
import { contactAgencies, getProjectShortlist } from "@/services/agencies.service";
import { ApiError, fetchBlob, GATEWAY_URL } from "@/services/http";

/**
 * Écran 15bis — DÉTAIL D'UN PROJET (CDC §1.5.8, MUST).
 * Route manquante identifiée dans la passe précédente : `client.tableau-de-bord.tsx`
 * et `client.mes-projets.tsx` laissaient "Voir le projet" en `uiAction` faute
 * de cible. Structure de fichier calquée sur `agences.$id.tsx`.
 */
export const Route = createFileRoute("/_authenticated/client/mes-projets/$id")({
  head: () => ({
    meta: [
      { title: "Détail du projet — Sortlist Pro" },
      {
        name: "description",
        content:
          "Consultez le détail de votre projet : cahier des charges, shortlist d'agences recommandées et suivi des litiges.",
      },
      { property: "og:title", content: "Détail du projet — Sortlist Pro" },
      {
        property: "og:description",
        content: "Suivi complet d'un projet publié sur Sortlist Pro.",
      },
    ],
  }),
  component: ClientProjectDetailPage,
});

function formatBudget(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Non renseigné";
  if (min !== null && max !== null) return `${min} € - ${max} €`;
  return `${min ?? max} €`;
}

function ClientProjectDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const projectQuery = useQuery({
    queryKey: ["client", "project", id],
    queryFn: () => getProject(id),
  });
  const project = projectQuery.data ?? null;
  const isLoading = projectQuery.isPending;

  const [isOpeningCdc, setIsOpeningCdc] = useState(false);

  async function handleOpenCdc() {
    if (!project?.cdcFile) return;
    setIsOpeningCdc(true);
    try {
      const url = project.cdcFile.startsWith("http")
        ? project.cdcFile
        : `${GATEWAY_URL}${project.cdcFile}`;
      const blob = await fetchBlob(url);
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Impossible d'ouvrir le CDC.");
    } finally {
      setIsOpeningCdc(false);
    }
  }

  // Shortlist IA — visible une fois le projet publié ("Postulé"), affichée en
  // lecture seule (mêmes cartes agence que `SmartBriefing.tsx::ShortlistSection`).
  const shortlistQuery = useQuery({
    queryKey: ["client", "project", id, "shortlist"],
    queryFn: () => getProjectShortlist(id),
    enabled: project !== null && project.status === "published",
  });
  const shortlist: Agency[] = shortlistQuery.data ?? [];

  const [contactingAgencyId, setContactingAgencyId] = useState<string | null>(null);
  const [contactedAgencyIds, setContactedAgencyIds] = useState<string[]>([]);

  async function handleContactAgency(agencyId: string) {
    setContactingAgencyId(agencyId);
    try {
      await contactAgencies(id, [agencyId], undefined);
      setContactedAgencyIds((current) => [...current, agencyId]);
      toast("Demande envoyée à l'agence.");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Envoi impossible.");
    } finally {
      setContactingAgencyId(null);
    }
  }

  // Litige / suspension — un litige existant prime sur le bouton de demande.
  // `project.get_dispute` : pas de garantie qu'un 404/erreur signifie
  // "aucun litige" plutôt qu'un vrai problème réseau — on traite les deux de
  // la même façon (pas de section litige affichée) plutôt que de bloquer le
  // reste de la page sur une erreur non bloquante.
  const disputeQuery = useQuery({
    queryKey: ["client", "project", id, "dispute"],
    queryFn: () => getDispute(id),
    enabled: project !== null,
    retry: false,
  });
  const dispute =
    disputeQuery.data &&
    disputeQuery.data.status &&
    disputeQuery.data.status.toLowerCase() !== "none"
      ? disputeQuery.data
      : null;

  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionCategory, setSuspensionCategory] = useState<SuspensionCategory>("amicable");

  const suspensionMutation = useMutation({
    mutationFn: () =>
      requestSuspension({ projectId: id, reason: suspensionReason, category: suspensionCategory }),
    onSuccess: () => {
      toast("Demande de suspension envoyée.");
      setIsSuspensionModalOpen(false);
      setSuspensionReason("");
      void queryClient.invalidateQueries({ queryKey: ["client", "project", id] });
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Envoi impossible.");
    },
  });

  const relaunchMutation = useMutation({
    mutationFn: () => relaunchAgencySearch(id),
    onSuccess: () => {
      toast("Recherche d'agence relancée.");
      void queryClient.invalidateQueries({ queryKey: ["client", "project", id] });
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Impossible de relancer la recherche.");
    },
  });

  return (
    <DashboardShell role="client">
      <div className="mx-auto max-w-[1080px]">
        <Link
          to="/client/mes-projets"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Retour à mes projets
        </Link>

        {/* En-tête */}
        <section className="mt-5 rounded-lg border border-border p-6">
          {isLoading ? (
            <StackSkeleton count={2} />
          ) : project === null ? (
            <EmptyState message="Projet introuvable." />
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[24px] font-bold tracking-tight">{project.title}</h1>
                <StatusBadge label={project.statusLabel} />
              </div>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                {project.category}
                {project.subCategory ? ` · ${project.subCategory}` : ""} — ID {project.reference}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  {formatBudget(project.budgetMin, project.budgetMax)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  {project.location || "Non renseignée"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  {project.deadline || "Délai non renseigné"}
                </span>
              </div>
            </div>
          )}
        </section>

        {project ? (
          <div className="mt-6 space-y-6">
            {/* Cahier des charges */}
            <SectionCard
              title="Cahier des charges"
              description="Document généré à partir de votre brief."
            >
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCdc}
                  disabled={!project.cdcFile || isOpeningCdc}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" strokeWidth={1.8} />
                  {isOpeningCdc ? "Ouverture..." : "Ouvrir le CDC (PDF)"}
                </button>
                {project.locked ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                    Verrouillé
                  </span>
                ) : null}
                {!project.cdcFile ? (
                  <span className="text-[13px] text-muted-foreground">
                    Aucun CDC disponible pour ce projet.
                  </span>
                ) : null}
              </div>
            </SectionCard>

            {/* Shortlist IA */}
            {project.status === "published" ? (
              <SectionCard
                title="Shortlist d'agences recommandées"
                description="Sélection générée par le matching IA pour ce projet."
              >
                {shortlistQuery.isPending ? (
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
                              onClick={() => handleContactAgency(agency.id)}
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
              </SectionCard>
            ) : null}

            {/* Suspension / Litige */}
            <SectionCard
              title="Suspension et litiges"
              description="Suivi des suspensions ou litiges éventuels sur ce projet."
            >
              {disputeQuery.isPending ? (
                <StackSkeleton count={2} />
              ) : dispute ? (
                <div>
                  <StatusBadge label={dispute.statusLabel} />
                  {dispute.history.length === 0 ? (
                    <p className="mt-4 text-[13.5px] text-muted-foreground">
                      Aucun historique disponible.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-4">
                      {dispute.history.map((entry) => (
                        <li key={entry.id} className="border-l border-border pl-4">
                          <p className="text-[13px] text-muted-foreground">{entry.date}</p>
                          <p className="mt-0.5 text-[13.5px] font-semibold">{entry.title}</p>
                          <p className="text-[13px] text-muted-foreground">{entry.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  {project.status === "in_progress" ? (
                    <button
                      type="button"
                      onClick={() => setIsSuspensionModalOpen(true)}
                      className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent"
                    >
                      <ShieldAlert className="h-4 w-4" strokeWidth={1.8} />
                      Demander une suspension
                    </button>
                  ) : null}
                  {project.status === "rejected" &&
                  project.rejectionSubstatus === "Agence défaillante" ? (
                    <button
                      type="button"
                      onClick={() => relaunchMutation.mutate()}
                      disabled={relaunchMutation.isPending}
                      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCcw className="h-4 w-4" strokeWidth={1.8} />
                      {relaunchMutation.isPending ? "Relance..." : "Relancer la recherche"}
                    </button>
                  ) : null}
                  {project.status !== "in_progress" &&
                  !(
                    project.status === "rejected" &&
                    project.rejectionSubstatus === "Agence défaillante"
                  ) ? (
                    <p className="text-[13.5px] text-muted-foreground">
                      Aucun litige ni suspension en cours sur ce projet.
                    </p>
                  ) : null}
                </div>
              )}
            </SectionCard>
          </div>
        ) : null}
      </div>

      <ActionModal
        open={isSuspensionModalOpen}
        onOpenChange={setIsSuspensionModalOpen}
        title="Demander une suspension"
        description="Décrivez le motif de votre demande. Une suspension amiable est privilégiée avant l'ouverture d'un litige."
        confirmLabel={suspensionMutation.isPending ? "Envoi..." : "Envoyer la demande"}
        onConfirm={() => {
          if (!suspensionReason.trim()) {
            toast("Renseignez un motif avant d'envoyer.");
            return;
          }
          suspensionMutation.mutate();
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold" htmlFor="suspension-category">
              Type de demande
            </label>
            <select
              id="suspension-category"
              value={suspensionCategory}
              onChange={(event) => setSuspensionCategory(event.target.value as SuspensionCategory)}
              className="mt-1.5 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
            >
              <option value="amicable">Suspension amiable</option>
              <option value="dispute">Litige</option>
            </select>
          </div>
          <TextAreaField
            label="Motif"
            rows={4}
            value={suspensionReason}
            onChange={(event) => setSuspensionReason(event.target.value)}
            placeholder="Expliquez la raison de cette demande..."
          />
        </div>
      </ActionModal>
    </DashboardShell>
  );
}
