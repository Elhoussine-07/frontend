import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, StatusTabs, StatusBadge } from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { ActionModal } from "@/components/common/ActionModal";
import { TextField } from "@/components/common/Blocks";
import type { Opportunity } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import {
  acceptOpportunity,
  getOpportunities,
  refuseOpportunity,
  sendQuote,
  type OpportunityTab,
} from "@/services/opportunities.service";
import { signalReady } from "@/services/disputes.service";
import { ApiError } from "@/services/http";

/** Opportunités (Agence) — offres disponibles, filtres, tri, pagination. */
export const Route = createFileRoute("/_authenticated/agence/opportunites")({
  head: () => ({
    meta: [
      { title: "Opportunités — Sortlist Pro" },
      {
        name: "description",
        content:
          "Offres disponibles, projets gagnés, en pause, terminés et archivés pour votre agence.",
      },
      { property: "og:title", content: "Opportunités — Sortlist Pro" },
      {
        property: "og:description",
        content: "Parcourez et filtrez les opportunités adressées à votre agence.",
      },
    ],
  }),
  component: AgencyOpportunitiesPage,
});

const TABS = [
  { value: "all", label: "Toutes" },
  { value: "available", label: "Disponibles" },
  { value: "won", label: "Gagnées" },
  { value: "paused", label: "En pause" },
  { value: "finished", label: "Terminées" },
  { value: "archived", label: "Archivées" },
];

/** L'onglet "Toutes" n'a pas d'équivalent backend dédié : il pointe vers le
 * tab "Offres" (`OpportunityTab.offers`), qui est la file d'attente
 * principale (nouvelles offres + offres déjà acceptées en attente de devis). */
function tabToOpportunityTab(uiTab: string): OpportunityTab {
  if (uiTab === "all") return "offers";
  return uiTab as OpportunityTab;
}

/**
 * Une opportunité est considérée "Acceptée" (étape 1/2 du workflow devis,
 * CDC §1.5.6/§2.3) si elle porte une date d'acceptation mais pas encore de
 * devis. Il n'existe pas de champ `step` dédié "accepted" côté mapping
 * (`opportunities.service.ts::mapOpportunity`) — approximation basée sur les
 * champs disponibles.
 */
function isAcceptedAwaitingQuote(opportunity: Opportunity): boolean {
  return Boolean(opportunity.acceptedOn) && opportunity.quoteAmount === null;
}

function AgencyOpportunitiesPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page] = useState(1);

  const [quoteTarget, setQuoteTarget] = useState<Opportunity | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");

  const opportunityTab = tabToOpportunityTab(activeTab);

  const opportunitiesQuery = useQuery({
    queryKey: ["agency", "opportunities", opportunityTab, page],
    queryFn: () => getOpportunities({ tab: opportunityTab, page, pageSize: 20 }),
  });

  const opportunities = opportunitiesQuery.data?.items ?? [];
  const isLoading = opportunitiesQuery.isLoading;
  const counts = opportunitiesQuery.data?.counts ?? {};
  const total = opportunitiesQuery.data?.total ?? null;
  const totalPages = opportunitiesQuery.data?.totalPages ?? null;

  const filteredOpportunities = query.trim()
    ? opportunities.filter((opportunity) =>
        `${opportunity.projectTitle} ${opportunity.companyName}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : opportunities;

  function invalidateOpportunities() {
    void queryClient.invalidateQueries({ queryKey: ["agency", "opportunities"] });
  }

  const acceptMutation = useMutation({
    mutationFn: acceptOpportunity,
    onSuccess: () => {
      toast("Opportunité acceptée", {
        description: "Envoyez votre devis pour passer à l'étape suivante.",
      });
      invalidateOpportunities();
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Impossible d'accepter l'opportunité.");
    },
  });

  const refuseMutation = useMutation({
    mutationFn: refuseOpportunity,
    onSuccess: () => {
      toast("Opportunité refusée");
      invalidateOpportunities();
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Impossible de refuser l'opportunité.");
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => sendQuote(id, amount),
    onSuccess: () => {
      toast("Devis envoyé", { description: "Le client a été notifié de votre proposition." });
      invalidateOpportunities();
      setQuoteTarget(null);
      setQuoteAmount("");
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Envoi du devis impossible.");
    },
  });

  const signalReadyMutation = useMutation({
    mutationFn: signalReady,
    onSuccess: () => {
      toast("Signalement envoyé", { description: "Le client a été notifié." });
      invalidateOpportunities();
    },
    onError: (error) => {
      // signalReady n'a pas d'endpoint backend confirmé (voir disputes.service.ts)
      // — on laisse remonter l'erreur au lieu de simuler un succès.
      toast(error instanceof ApiError ? error.message : "Endpoint indisponible pour le moment.");
    },
  });

  const columns: Column<Opportunity>[] = [
    {
      key: "opportunity",
      header: "Opportunité",
      width: "minmax(0,2.2fr)",
      render: (opportunity) => (
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-[13px] font-semibold">
            {opportunity.companyInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold">{opportunity.projectTitle}</p>
            <p className="truncate text-[13px] text-muted-foreground">{opportunity.companyName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      render: (opportunity) => <p className="truncate text-[13px]">{opportunity.category}</p>,
    },
    {
      key: "budget",
      header: "Budget",
      render: (opportunity) => (
        <p className="truncate text-[13px]">
          {opportunity.budgetMin === null || opportunity.budgetMax === null
            ? "—"
            : `${opportunity.budgetMin} – ${opportunity.budgetMax}`}
        </p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      render: (opportunity) => (
        <p className="flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          <span className="truncate">{opportunity.location}</span>
        </p>
      ),
    },
    {
      key: "step",
      header: "Étape",
      render: (opportunity) => <StatusBadge label={opportunity.stepLabel} />,
    },
    {
      key: "action",
      header: "Action",
      render: (opportunity) => (
        <div className="flex flex-wrap gap-2">
          {activeTab === "all" && !isAcceptedAwaitingQuote(opportunity) ? (
            <>
              <button
                type="button"
                onClick={() => acceptMutation.mutate(opportunity.id)}
                disabled={acceptMutation.isPending}
                className="rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Accepter
              </button>
              <button
                type="button"
                onClick={() => refuseMutation.mutate(opportunity.id)}
                disabled={refuseMutation.isPending}
                className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent disabled:opacity-60"
              >
                Refuser
              </button>
            </>
          ) : null}

          {activeTab === "all" && isAcceptedAwaitingQuote(opportunity) ? (
            <button
              type="button"
              onClick={() => {
                setQuoteTarget(opportunity);
                setQuoteAmount("");
              }}
              className="rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Envoyer un devis
            </button>
          ) : null}

          {activeTab === "paused" ? (
            <button
              type="button"
              onClick={() => signalReadyMutation.mutate(opportunity.id)}
              disabled={signalReadyMutation.isPending}
              className="rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              Signaler que je suis prêt
            </button>
          ) : null}

          <button
            onClick={() => uiAction("Détails")}
            type="button"
            className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
          >
            Détails
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-start gap-3">
          <Briefcase className="mt-1 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Opportunités</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Répondez aux projets qui correspondent à vos compétences.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Rechercher une opportunité..."
          />
        </div>

        <div className="mt-6">
          <StatusTabs tabs={TABS} value={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* API CALL : GET /api/categories */}
          <FilterSelect label="Catégorie" placeholder="Toutes les catégories" />
          {/* Filtre budget côté API : { budgetMin, budgetMax } */}
          <FilterSelect label="Budget" placeholder="Tous les budgets" />
          {/* Filtre localisation côté API : { location } */}
          <FilterSelect label="Localisation" placeholder="Toutes les villes" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{total ?? 0} opportunités</p>
          <button
            onClick={() => uiAction("Trier par : Plus récentes")}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* API CALL : GET /api/opportunities?sort=recent|relevance|budget */}
            Trier par : Plus récentes
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4">
          <DataTable columns={columns} rows={filteredOpportunities} isLoading={isLoading} />
        </div>

        <ListPagination page={page} totalPages={totalPages} />
      </div>

      <ActionModal
        open={quoteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setQuoteTarget(null);
            setQuoteAmount("");
          }
        }}
        title="Envoyer un devis"
        {...(quoteTarget
          ? {
              description: `Proposez un montant pour "${quoteTarget.projectTitle}" — ${quoteTarget.companyName}.`,
            }
          : {})}
        confirmLabel={sendQuoteMutation.isPending ? "Envoi..." : "Envoyer le devis"}
        onConfirm={() => {
          const amount = Number(quoteAmount);
          if (!quoteTarget || !quoteAmount.trim() || Number.isNaN(amount) || amount <= 0) {
            toast("Renseignez un montant valide.");
            return;
          }
          sendQuoteMutation.mutate({ id: quoteTarget.id, amount });
        }}
      >
        <TextField
          label="Montant du devis (€)"
          type="number"
          min={0}
          value={quoteAmount}
          onChange={(event) => setQuoteAmount(event.target.value)}
        />
      </ActionModal>
    </DashboardShell>
  );
}
