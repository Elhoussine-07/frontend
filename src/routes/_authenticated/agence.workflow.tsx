import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Workflow } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, SectionCard, StatusBadge, StatusTabs } from "@/components/common/Blocks";
import { ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import type { Opportunity } from "@/lib/types";
import {
  getWorkflowItems,
  getWorkflowStages,
  type WorkflowStep,
} from "@/services/workflow.service";

/**
 * Workflow (Agence) — étapes de traitement des opportunités.
 *
 * // NOTE (ambiguïté CDC) : ce screen est probablement redondant avec
 * // `agence.opportunites.tsx`, qui porte déjà les vraies actions métier du
 * // workflow devis (Accepter -> Envoyer un devis, CDC §1.5.6/§2.3), branchées
 * // sur `opportunities.service.ts`. `workflow.service.ts` documente lui-même
 * // ce doublon (pas de doctype "Workflow" dédié côté `platform_core` — voir son
 * // en-tête) : il ré-expose `opportunity.list_opportunities` sous une
 * // nomenclature d'étapes différente (received/reviewed/quote_sent/
 * // awaiting_client/won/lost) sans action "avancer" générique fiable.
 * // Parti pris ici : cette page reste une vue de LECTURE (répartition par
 * // étape + liste), sans dupliquer les boutons Accepter/Envoyer un devis —
 * // pour ne pas risquer un double-appel divergent avec `agence.opportunites.tsx`
 * // sur la même ressource backend. La modale "Étape suivante" est retirée au
 * // profit d'un lien direct vers l'écran Opportunités, qui porte la vraie
 * // action.
 */
export const Route = createFileRoute("/_authenticated/agence/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow des opportunités — Sortlist Pro" },
      {
        name: "description",
        content:
          "Suivez chaque étape de traitement de vos opportunités : devis, négociation, signature.",
      },
      { property: "og:title", content: "Workflow des opportunités — Sortlist Pro" },
      {
        property: "og:description",
        content: "Étapes de traitement des opportunités de votre agence.",
      },
    ],
  }),
  component: AgencyWorkflowPage,
});

const STEP_TABS: { value: string; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "quote_sent", label: "Devis" },
  { value: "awaiting_client", label: "Négociation" },
  { value: "won", label: "Signature" },
];

const COLUMNS: Column<Opportunity>[] = [
  {
    key: "item",
    header: "Opportunité",
    width: "minmax(0,2.2fr)",
    render: (item) => (
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-bold">{item.projectTitle}</p>
        <p className="truncate text-[13px] text-muted-foreground">{item.companyName}</p>
      </div>
    ),
  },
  {
    key: "stage",
    header: "Étape",
    render: (item) => <StatusBadge label={item.stepLabel} />,
  },
  {
    key: "quote",
    header: "Devis",
    render: (item) => (
      <p className="truncate text-[13px]">
        {item.quoteAmount === null ? "—" : String(item.quoteAmount)}
      </p>
    ),
  },
  {
    key: "remaining",
    header: "Temps restant",
    render: (item) => (
      <p className="truncate text-[13px] text-muted-foreground">
        {item.remainingHours === null ? "—" : `${item.remainingHours} h`}
      </p>
    ),
  },
];

function AgencyWorkflowPage() {
  const stagesQuery = useQuery({
    queryKey: ["agency", "workflow", "stages"],
    queryFn: getWorkflowStages,
  });
  const stages = stagesQuery.data ?? [];
  const isStagesLoading = stagesQuery.isLoading;

  const [query, setQuery] = useState("");
  const [activeStage, setActiveStage] = useState("all");

  const itemsQuery = useQuery({
    queryKey: ["agency", "workflow", "items", activeStage],
    queryFn: () =>
      getWorkflowItems(activeStage === "all" ? {} : { step: activeStage as WorkflowStep }),
  });
  const allItems = itemsQuery.data?.items ?? [];
  const isItemsLoading = itemsQuery.isLoading;
  const counts = itemsQuery.data?.counts ?? {};
  const page = itemsQuery.data?.page ?? 1;
  const totalPages = itemsQuery.data?.totalPages ?? null;

  const items = query.trim()
    ? allItems.filter((item) =>
        `${item.projectTitle} ${item.companyName}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : allItems;

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-start gap-3">
          <Workflow className="mt-1 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Workflow</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Étapes de traitement de vos opportunités.
            </p>
          </div>
        </div>

        <section className="mt-7">
          <SectionCard
            title="Étapes du workflow"
            description="Répartition de vos opportunités par étape."
          >
            {isStagesLoading ? (
              <StackSkeleton count={4} />
            ) : stages.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stages.map((stage) => (
                  <li key={stage.id} className="rounded-lg border border-border p-4">
                    <p className="text-[13px] text-muted-foreground">{stage.label}</p>
                    <p className="mt-1 text-[26px] font-bold leading-none">{stage.count}</p>
                  </li>
                ))}
              </ol>
            )}
          </SectionCard>
        </section>

        <div className="mt-7">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Rechercher une opportunité..."
          />
        </div>

        <div className="mt-6">
          <StatusTabs
            tabs={STEP_TABS}
            value={activeStage}
            onChange={setActiveStage}
            counts={counts}
          />
        </div>

        <div className="mt-6">
          <DataTable columns={COLUMNS} rows={items} isLoading={isItemsLoading} />
        </div>

        <ListPagination page={page} totalPages={totalPages} />

        <p className="mt-6 text-[13px] text-muted-foreground">
          Pour accepter une opportunité ou envoyer un devis, rendez-vous sur l'écran{" "}
          <Link to="/agence/opportunites" className="font-semibold underline underline-offset-2">
            Opportunités
          </Link>
          .
        </p>
      </div>
    </DashboardShell>
  );
}
