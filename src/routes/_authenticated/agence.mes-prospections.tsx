import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Send } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, StatusTabs, StatusBadge } from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { uiAction } from "@/lib/ui-actions";
import { getLeads, type Lead } from "@/services/prospection.service";

/**
 * Mes prospections (Agence) — suivi des prospects contactés.
 *
 * // NOTE (ambiguïté CDC) : consomme les mêmes leads que `agence.prospection.tsx`
 * // (`prospection.service.ts::getLeads`) — pas de liste séparée "prospections
 * // envoyées" côté backend (le microservice `prospection-service` expose des
 * // *suggestions* de prospects, pas un journal des e-mails déjà envoyés). Les
 * // onglets "Envoyées"/"Répondues"/"Sans réponse" n'ont donc pas de champ
 * // backend correspondant pour l'instant (TODO backend : un tracking d'envoi
 * // par lead, ex. `Lead.last_contacted_at`/`Lead.responded_at`, permettrait de
 * // les distinguer réellement) — en attendant, ces onglets affichent tous la
 * // liste complète des leads suggérés.
 */
export const Route = createFileRoute("/_authenticated/agence/mes-prospections")({
  head: () => ({
    meta: [
      { title: "Mes prospections — Sortlist Pro" },
      {
        name: "description",
        content: "Recherchez et suivez vos prospections envoyées, leurs réponses et leur statut.",
      },
      { property: "og:title", content: "Mes prospections — Sortlist Pro" },
      {
        property: "og:description",
        content: "Suivi des prospections de votre agence.",
      },
    ],
  }),
  component: AgencyMyProspectionsPage,
});

const TABS = [
  { value: "all", label: "Toutes" },
  { value: "sent", label: "Envoyées" },
  { value: "answered", label: "Répondues" },
  { value: "no_answer", label: "Sans réponse" },
];

const COLUMNS: Column<Lead>[] = [
  {
    key: "prospect",
    header: "Prospect",
    width: "minmax(0,2.2fr)",
    render: (item) => (
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-[13px] font-semibold">
          {item.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold">{item.companyName}</p>
          <p className="truncate text-[13px] text-muted-foreground">{item.location}</p>
        </div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Signaux détectés",
    render: (item) => <p className="truncate text-[13px]">{item.actions.join(" · ") || "—"}</p>,
  },
  {
    key: "status",
    header: "Statut",
    render: (item) => <StatusBadge label={item.temperatureLabel} />,
  },
  {
    key: "score",
    header: "Score",
    render: (item) => (
      <p className="truncate text-[13px] text-muted-foreground">{item.score}/100</p>
    ),
  },
  {
    key: "action",
    header: "Action",
    render: () => (
      <Link
        to="/agence/prospection"
        className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
      >
        Voir le suivi
      </Link>
    ),
  },
];

function AgencyMyProspectionsPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page] = useState(1);

  const leadsQuery = useQuery({
    queryKey: ["agency", "prospection", "leads", "mine"],
    queryFn: () => getLeads({ page, pageSize: 50 }),
  });

  const allProspections = leadsQuery.data?.items ?? [];
  const isLoading = leadsQuery.isLoading;
  // Voir la note en tête de fichier : pas de distinction backend
  // sent/answered/no_answer pour l'instant, tous les onglets non-"all" restent
  // vides plutôt que d'inventer une répartition.
  const prospections = activeTab === "all" ? allProspections : [];
  const filtered = query.trim()
    ? prospections.filter((item) =>
        item.companyName.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : prospections;

  const counts: Record<string, number> = { all: allProspections.length };
  const total = filtered.length;
  const totalPages = null;

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-start gap-3">
          <Send className="mt-1 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Mes prospections</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Suivez les prospects que vous avez contactés.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Rechercher une prospection..."
          />
        </div>

        <div className="mt-6">
          <StatusTabs tabs={TABS} value={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* API CALL : GET /api/categories */}
          <FilterSelect label="Catégorie" placeholder="Toutes les catégories" />
          {/* Filtre statut côté API : { status } */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
          {/* Filtre période côté API : { period } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{total} prospections</p>
          <button
            onClick={() => uiAction("Trier par : Plus récentes")}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* API CALL : GET /api/agency/prospections?sort=recent|answered */}
            Trier par : Plus récentes
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4">
          <DataTable columns={COLUMNS} rows={filtered} isLoading={isLoading} />
        </div>

        <ListPagination page={page} totalPages={totalPages} />
      </div>
    </DashboardShell>
  );
}
