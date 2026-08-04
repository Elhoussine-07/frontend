import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Folder, Users } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, StatusTabs, StatusBadge } from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import type { Project } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import { ActionModal } from "@/components/common/ActionModal";
import { getAgencyProjects } from "@/services/agency-projects.service";

/** Projets en cours (Agence) — recherche, filtres, tri, pagination. */
export const Route = createFileRoute("/_authenticated/agence/projets-en-cours")({
  head: () => ({
    meta: [
      { title: "Projets en cours — Sortlist Pro" },
      {
        name: "description",
        content: "Suivez l'avancement de vos projets clients, leurs statuts et leurs échéances.",
      },
      { property: "og:title", content: "Projets en cours — Sortlist Pro" },
      {
        property: "og:description",
        content: "Liste des projets en cours de votre agence.",
      },
    ],
  }),
  component: AgencyProjectsPage,
});

const TABS = [
  { value: "all", label: "Tous" },
  { value: "in_progress", label: "En cours" },
  { value: "suspended", label: "Suspendus" },
  { value: "finished", label: "Terminés" },
];

function buildColumns(onViewDetails: (project: Project) => void): Column<Project>[] {
  return [
    {
      key: "project",
      header: "Projet",
      width: "minmax(0,2.2fr)",
      render: (project) => (
        <div className="flex min-w-0 items-start gap-3">
          <Folder className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold">{project.title}</p>
            <p className="truncate text-[13px] text-muted-foreground">{project.reference}</p>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (project) => (
        <p className="flex min-w-0 items-center gap-1.5 text-[13px]">
          <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          <span className="truncate">{project.partnerAgencyName ?? "—"}</span>
        </p>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (project) => <StatusBadge label={project.statusLabel} />,
    },
    {
      key: "budget",
      header: "Budget",
      render: (project) => (
        <p className="truncate text-[13px]">
          {project.budgetMin === null || project.budgetMax === null
            ? "—"
            : `${project.budgetMin} – ${project.budgetMax}`}
        </p>
      ),
    },
    {
      key: "deadline",
      header: "Échéance",
      render: (project) => (
        <p className="truncate text-[13px] text-muted-foreground">{project.deadline}</p>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (project) => (
        <button
          type="button"
          onClick={() => onViewDetails(project)}
          className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
        >
          Voir le projet
        </button>
      ),
    },
  ];
}

function AgencyProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page] = useState(1);

  const projectsQuery = useQuery({
    queryKey: ["agency", "projects", activeTab, query, page],
    queryFn: () =>
      getAgencyProjects({
        ...(query.trim() ? { query: query.trim() } : {}),
        ...(activeTab !== "all" ? { status: activeTab } : {}),
        page,
        pageSize: 20,
      }),
  });

  const projects = projectsQuery.data?.items ?? [];
  const isLoading = projectsQuery.isLoading;
  const counts = projectsQuery.data?.counts ?? {};
  const total = projectsQuery.data?.total ?? null;
  const totalPages = projectsQuery.data?.totalPages ?? null;

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="text-[24px] font-bold tracking-tight">Projets en cours</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Suivez l'avancement de vos projets et leurs échéances.
        </p>

        <div className="mt-7">
          <SearchInput value={query} onChange={setQuery} placeholder="Rechercher un projet..." />
        </div>

        <div className="mt-6">
          <StatusTabs tabs={TABS} value={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* API CALL : GET /api/agency/projects/clients */}
          <FilterSelect label="Client" placeholder="Tous les clients" />
          {/* Filtre statut côté API : { status } */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
          {/* Filtre période côté API : { period } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{total ?? 0} projets</p>
          <button
            onClick={() => uiAction("Trier par : Plus récents")}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* API CALL : GET /api/agency/projects?sort=recent|deadline|budget */}
            Trier par : Plus récents
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4">
          <DataTable
            columns={buildColumns(setSelectedProject)}
            rows={projects}
            isLoading={isLoading}
          />
        </div>

        <ListPagination page={page} totalPages={totalPages} />
      </div>

      <ActionModal
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
        title={selectedProject?.title ?? ""}
        {...(selectedProject?.reference ? { description: selectedProject.reference } : {})}
        confirmLabel="Fermer"
        onConfirm={() => setSelectedProject(null)}
      >
        {selectedProject ? (
          <div className="space-y-3 text-[13.5px]">
            <p>
              <span className="font-semibold">Statut : </span>
              {selectedProject.statusLabel}
            </p>
            <p>
              <span className="font-semibold">Client : </span>
              {selectedProject.partnerAgencyName ?? "—"}
            </p>
            <p>
              <span className="font-semibold">Budget : </span>
              {selectedProject.budgetMin === null || selectedProject.budgetMax === null
                ? "—"
                : `${selectedProject.budgetMin} – ${selectedProject.budgetMax}`}
            </p>
            <p>
              <span className="font-semibold">Échéance : </span>
              {selectedProject.deadline || "—"}
            </p>
            {selectedProject.objective ? (
              <p className="text-muted-foreground">{selectedProject.objective}</p>
            ) : null}
          </div>
        ) : null}
      </ActionModal>
    </DashboardShell>
  );
}
