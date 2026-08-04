import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, SectionCard, StatusBadge, StatusTabs } from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { ActionModal } from "@/components/common/ActionModal";
import { TextAreaField } from "@/components/common/Blocks";
import {
  getSuspensionCases,
  getSuspensionHistory,
  respondToSuspension,
  type SuspensionCase,
} from "@/services/agency-projects.service";
import { ApiError } from "@/services/http";

/** Suspension (Agence) — litiges, signalements, historique. */
export const Route = createFileRoute("/_authenticated/agence/suspension")({
  head: () => ({
    meta: [
      { title: "Suspensions et litiges — Sortlist Pro" },
      {
        name: "description",
        content:
          "Gérez les suspensions de projet, répondez aux signalements et consultez l'historique des litiges.",
      },
      { property: "og:title", content: "Suspensions et litiges — Sortlist Pro" },
      {
        property: "og:description",
        content: "Suivi des litiges et signalements côté agence.",
      },
    ],
  }),
  component: AgencySuspensionPage,
});

const TABS = [
  { value: "all", label: "Tous" },
  { value: "amicable", label: "Résolution amiable" },
  { value: "dispute", label: "Litige" },
  { value: "closed", label: "Clôturés" },
];

function buildColumns(onSelect: (item: SuspensionCase) => void): Column<SuspensionCase>[] {
  return [
    {
      key: "case",
      header: "Dossier",
      width: "minmax(0,2.2fr)",
      render: (item) => (
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold">{item.projectTitle}</p>
          <p className="truncate text-[13px] text-muted-foreground">{item.clientName}</p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Motif",
      render: (item) => <p className="truncate text-[13px]">{item.reason}</p>,
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => <StatusBadge label={item.statusLabel} />,
    },
    {
      key: "openedAt",
      header: "Ouvert le",
      render: (item) => (
        <p className="truncate text-[13px] text-muted-foreground">{item.openedAt}</p>
      ),
    },
    {
      key: "moderator",
      header: "Modérateur",
      render: (item) => (
        <p className="truncate text-[13px] text-muted-foreground">{item.moderator ?? "—"}</p>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (item) => (
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
        >
          Répondre
        </button>
      ),
    },
  ];
}

function AgencySuspensionPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedCase, setSelectedCase] = useState<SuspensionCase | null>(null);
  const [page] = useState(1);

  const casesQuery = useQuery({
    queryKey: ["agency", "suspensions", activeTab, query, page],
    queryFn: () =>
      getSuspensionCases({
        ...(query.trim() ? { query: query.trim() } : {}),
        ...(activeTab !== "all" ? { status: activeTab } : {}),
        page,
        pageSize: 20,
      }),
  });
  const cases = casesQuery.data?.items ?? [];
  const isLoading = casesQuery.isLoading;
  const counts = casesQuery.data?.counts ?? {};
  const totalPages = casesQuery.data?.totalPages ?? null;

  const historyQuery = useQuery({
    queryKey: ["agency", "suspensions", "history", selectedCase?.id],
    queryFn: () => getSuspensionHistory(selectedCase?.id ?? ""),
    enabled: selectedCase !== null,
  });
  const history = historyQuery.data ?? [];
  const isHistoryLoading = historyQuery.isLoading;

  const respondMutation = useMutation({
    mutationFn: (payload: { message: string }) => {
      if (!selectedCase) throw new Error("Sélectionnez d'abord un dossier dans la liste.");
      return respondToSuspension(selectedCase.id, payload);
    },
    onSuccess: () => {
      toast("Réponse envoyée");
      void queryClient.invalidateQueries({ queryKey: ["agency", "suspensions"] });
      setIsRespondOpen(false);
      setResponse("");
    },
    onError: (error) => {
      // `respondToSuspension` n'a pas d'endpoint backend confirmé (voir
      // agency-projects.service.ts) — l'erreur remonte telle quelle plutôt que
      // de simuler un succès.
      toast(error instanceof ApiError ? error.message : "Endpoint indisponible pour le moment.");
    },
  });

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <ShieldAlert className="mt-1 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
            <div className="min-w-0">
              <h1 className="text-[24px] font-bold tracking-tight">Suspension</h1>
              <p className="mt-1 text-[14px] text-muted-foreground">
                Litiges, signalements et suivi de leur résolution.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!selectedCase) {
                toast("Sélectionnez d'abord un dossier dans la liste ci-dessous.");
                return;
              }
              setIsRespondOpen(true);
            }}
            className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:justify-self-end"
          >
            Répondre à un signalement
          </button>
        </div>

        <div className="mt-7">
          <SearchInput value={query} onChange={setQuery} placeholder="Rechercher un dossier..." />
        </div>

        <div className="mt-6">
          <StatusTabs tabs={TABS} value={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Filtre statut côté API : { status } */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
          {/* Filtre période côté API : { period } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
          {/* Filtre motif côté API : { reason } */}
          <FilterSelect label="Motif" placeholder="Tous les motifs" />
        </div>

        <div className="mt-6">
          <DataTable
            columns={buildColumns((item) => {
              setSelectedCase(item);
              setIsRespondOpen(true);
            })}
            rows={cases}
            isLoading={isLoading}
          />
        </div>

        <ListPagination page={page} totalPages={totalPages} />

        <section className="mt-9">
          <SectionCard
            title="Historique des signalements"
            description="Chronologie des échanges et décisions de modération."
          >
            {isHistoryLoading ? (
              <StackSkeleton count={3} />
            ) : history.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ul className="space-y-4">
                {history.map((entry) => (
                  <li key={entry.id} className="border-l border-border pl-4">
                    <p className="text-[13px] text-muted-foreground">{entry.date}</p>
                    <p className="mt-0.5 text-[13.5px] font-semibold">{entry.title}</p>
                    <p className="text-[13px] text-muted-foreground">{entry.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </section>
      </div>

      <ActionModal
        open={isRespondOpen}
        onOpenChange={(open) => {
          setIsRespondOpen(open);
          if (!open) setSelectedCase(null);
        }}
        title="Répondre au signalement"
        description={
          selectedCase
            ? `Dossier "${selectedCase.projectTitle}" — votre réponse est transmise au client et au modérateur.`
            : "Votre réponse est transmise au client et au modérateur."
        }
        confirmLabel={respondMutation.isPending ? "Envoi..." : "Envoyer la réponse"}
        onConfirm={() => {
          if (!response.trim()) {
            toast("Renseignez une réponse avant d'envoyer.");
            return;
          }
          respondMutation.mutate({ message: response.trim() });
        }}
      >
        <TextAreaField
          label="Votre réponse"
          rows={5}
          value={response}
          onChange={(event) => setResponse(event.target.value)}
        />
      </ActionModal>
    </DashboardShell>
  );
}
