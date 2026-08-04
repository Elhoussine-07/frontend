import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, FileText, MoreVertical, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/Skeletons";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import type { Project, ProjectStatus } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import { getMyProjects } from "@/services/projects.service";

/** Écran 15 — MES PROJETS (espace Client). */
export const Route = createFileRoute("/_authenticated/client/mes-projets")({
  head: () => ({
    meta: [
      { title: "Mes projets — Sortlist Pro" },
      {
        name: "description",
        content:
          "Recherchez, filtrez et suivez l'ensemble de vos projets : brouillons, publiés, en cours et terminés.",
      },
      { property: "og:title", content: "Mes projets — Sortlist Pro" },
      {
        property: "og:description",
        content: "Suivez l'ensemble de vos projets sur Sortlist Pro.",
      },
    ],
  }),
  component: ClientProjectsPage,
});

const STATUS_TABS: { value: "all" | ProjectStatus; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillons" },
  { value: "published", label: "Publiés" },
  { value: "in_progress", label: "En cours" },
  { value: "finished", label: "Terminés" },
  { value: "suspended", label: "Suspendus" },
];

const PAGE_SIZE = 20;

function ClientProjectsPage() {
  // Le backend (`project.my_projects`) ne filtre/trie/pagine que par statut —
  // on récupère la liste complète une fois, puis recherche/tri/pagination sont
  // appliqués côté client (voir `projects.service.ts::getMyProjects`).
  const projectsQuery = useQuery({
    queryKey: ["client", "projects"],
    queryFn: () => getMyProjects(),
  });
  const isLoading = projectsQuery.isPending;
  const allProjects = useMemo(() => projectsQuery.data?.items ?? [], [projectsQuery.data]);

  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<"all" | ProjectStatus>("all");
  const [sortDirection, setSortDirection] = useState<"recent" | "old">("recent");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const result: Partial<Record<"all" | ProjectStatus, number>> = { all: allProjects.length };
    for (const project of allProjects) {
      result[project.status] = (result[project.status] ?? 0) + 1;
    }
    return result;
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let items = allProjects.filter((project) => {
      const matchesStatus = activeStatus === "all" || project.status === activeStatus;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.reference.toLowerCase().includes(normalizedQuery) ||
        project.category.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
    items = [...items].sort((a, b) =>
      sortDirection === "recent"
        ? b.lastActivity.localeCompare(a.lastActivity)
        : a.lastActivity.localeCompare(b.lastActivity),
    );
    return items;
  }, [allProjects, activeStatus, query, sortDirection]);

  const total = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const projects = filteredProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <DashboardShell role="client">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Mes projets</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Suivez l'ensemble de vos projets.
            </p>
          </div>
          <Link
            to="/client/postuler-un-projet"
            className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:justify-self-end"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Postuler un projet
          </Link>
        </div>

        {/* Recherche */}
        <div className="mt-7 flex items-center gap-3 rounded-md border border-border px-4 py-3">
          <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un projet..."
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Onglets de statut */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveStatus(tab.value);
                setPage(1);
              }}
              aria-pressed={activeStatus === tab.value}
              className={
                activeStatus === tab.value
                  ? "rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-primary-foreground"
                  : "rounded-full border border-border px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-accent"
              }
            >
              {tab.label}
              <span className="ml-1.5 font-normal text-[13px] opacity-70">
                {counts[tab.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Filtres */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* API CALL : GET /api/taxonomy/categories */}
          <FilterSelect label="Catégorie" placeholder="Toutes les catégories" />
          {/* API CALL : GET /api/taxonomy/project-statuses */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
          {/* Filtre période appliqué côté API : { period: "7d" | "30d" | "90d" | "all" } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
        </div>

        {/* Compteur + tri */}
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{total} projets</p>
          <button
            onClick={() => setSortDirection((current) => (current === "recent" ? "old" : "recent"))}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Trier par : {sortDirection === "recent" ? "Plus récents" : "Plus anciens"}
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Tableau */}
        <div className="mt-4 rounded-lg border border-border">
          <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-border px-5 py-3 lg:grid">
            <p className="text-[13px] font-semibold">Projet</p>
            <p className="text-[13px] font-semibold">Catégorie</p>
            <p className="text-[13px] font-semibold">Statut</p>
            <p className="text-[13px] font-semibold">Budget</p>
            <p className="text-[13px] font-semibold">Dernière activité</p>
            <p className="text-[13px] font-semibold">Action</p>
            <span className="w-4" />
          </div>

          {isLoading ? (
            <div className="px-5">
              <TableSkeleton rows={8} columns={6} />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-5">
              <EmptyState message="Aucun projet à afficher." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectRow project={project} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* TODO frontend : `ListPagination` (composant partagé `ListControls.tsx`,
            hors périmètre de cette page) n'expose pas de prop `onPageChange` —
            ses boutons restent des `uiAction` internes. La pagination
            client-side (`page`/`totalPages` ci-dessus) est calculée mais ne
            peut pas être pilotée par ce composant en l'état. */}
        <ListPagination page={currentPage} totalPages={totalPages} />
      </div>
    </DashboardShell>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] lg:items-center lg:gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <FileText className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold">{project.title}</p>
          <p className="truncate text-[13px] text-muted-foreground">{project.reference}</p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold">{project.category}</p>
        <p className="truncate text-[13px] text-muted-foreground">{project.subCategory}</p>
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[13px] font-semibold">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {project.statusLabel}
        </span>
      </div>

      <p className="truncate text-[13px]">
        {project.budgetMin} € - {project.budgetMax} €
      </p>

      <p className="truncate text-[13px] text-muted-foreground">{project.lastActivity}</p>

      <div className="min-w-0">
        <Link
          to="/client/mes-projets/$id"
          params={{ id: project.id }}
          className="block w-full rounded-md border border-border px-3 py-2 text-center text-[13px] font-semibold transition-colors hover:bg-accent lg:w-auto"
        >
          {project.status === "draft" ? "Reprendre le brouillon" : "Voir le projet"}
        </Link>
      </div>

      <button
        onClick={() => uiAction("Plus d'actions")}
        type="button"
        aria-label="Plus d'actions"
        className="justify-self-start text-muted-foreground transition-colors hover:text-foreground lg:justify-self-center"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}
