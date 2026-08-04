import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, BarChart3, Briefcase, FileText, Folder, Star } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard, StatGrid, StatusBadge, SectionCard } from "@/components/common/Blocks";
import { StatSkeleton, StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable, type Column } from "@/components/common/DataTable";
import type { Project } from "@/lib/types";
import { getAgencyDashboardOverview } from "@/services/agencies.service";
import { getAgencyProjects } from "@/services/agency-projects.service";

/** Tableau de bord Agence — statistiques, projets récents, activités. */
export const Route = createFileRoute("/_authenticated/agence/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord Agence — Sortlist Pro" },
      {
        name: "description",
        content:
          "Suivez vos opportunités, vos projets en cours, votre score PQI et votre activité récente.",
      },
      { property: "og:title", content: "Tableau de bord Agence — Sortlist Pro" },
      {
        property: "og:description",
        content: "Aperçu de l'activité de votre agence sur Sortlist Pro.",
      },
    ],
  }),
  component: AgencyDashboardPage,
});

interface AgencyStats {
  pqiScore: number | null;
  pqiLabel: string | null;
  openOpportunities: number | null;
  activeProjects: number | null;
  averageRating: number | null;
}

const PROJECT_COLUMNS: Column<Project>[] = [
  {
    key: "project",
    header: "Projet",
    width: "minmax(0,2fr)",
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
    key: "category",
    header: "Catégorie",
    render: (project) => <p className="truncate text-[13px]">{project.category}</p>,
  },
  {
    key: "status",
    header: "Statut",
    render: (project) => <StatusBadge label={project.statusLabel} />,
  },
  {
    key: "activity",
    header: "Dernière activité",
    render: (project) => (
      <p className="truncate text-[13px] text-muted-foreground">{project.lastActivity}</p>
    ),
  },
  {
    key: "action",
    header: "Action",
    render: () => (
      <Link
        to="/agence/projets-en-cours"
        className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
      >
        Voir le projet
      </Link>
    ),
  },
];

function AgencyDashboardPage() {
  // `agencies.service.ts::getAgencyDashboardOverview` (`agency.get_dashboard`)
  // fournit en un seul appel les stats (pqiScore/openOpportunitiesCount/
  // inProgressCount/averageClientRating) et l'activité récente. La liste
  // "Projets récents" reste une requête séparée (`getAgencyProjects`) : le
  // dashboard n'expose que des opportunités allégées (pas l'objet Project
  // complet attendu par `PROJECT_COLUMNS`).
  const dashboardQuery = useQuery({
    queryKey: ["agency", "dashboard"],
    queryFn: getAgencyDashboardOverview,
  });

  const projectsQuery = useQuery({
    queryKey: ["agency", "projects", "recent"],
    queryFn: () => getAgencyProjects({ page: 1, pageSize: 5, sort: "recent" }),
  });

  const stats: AgencyStats = {
    pqiScore: dashboardQuery.data?.pqiScore ?? null,
    pqiLabel: dashboardQuery.data ? "Score PQI" : null,
    openOpportunities: dashboardQuery.data?.openOpportunitiesCount ?? null,
    activeProjects: dashboardQuery.data?.inProgressCount ?? null,
    averageRating: dashboardQuery.data?.averageClientRating ?? null,
  };
  const isStatsLoading = dashboardQuery.isLoading;

  const recentProjects = projectsQuery.data?.items ?? [];
  const isProjectsLoading = projectsQuery.isLoading;

  const activities = dashboardQuery.data?.recentActivity ?? [];
  const isActivitiesLoading = dashboardQuery.isLoading;

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="text-[32px] font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Voici un aperçu de l'activité de votre agence.
        </p>

        <section className="mt-7">
          {isStatsLoading ? (
            <StatSkeleton count={4} />
          ) : (
            <StatGrid>
              <StatCard
                icon={BarChart3}
                label="Score PQI"
                value={stats.pqiScore === null ? "—" : String(stats.pqiScore)}
                suffix="/100"
                footer={stats.pqiLabel ? <StatusBadge label={stats.pqiLabel} /> : null}
              />
              <StatCard
                icon={Briefcase}
                label="Opportunités ouvertes"
                value={stats.openOpportunities === null ? "—" : String(stats.openOpportunities)}
                footer={
                  <Link
                    to="/agence/opportunites"
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  >
                    Voir les opportunités
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </Link>
                }
              />
              <StatCard
                icon={Folder}
                label="Projets en cours"
                value={stats.activeProjects === null ? "—" : String(stats.activeProjects)}
                footer={
                  <Link
                    to="/agence/projets-en-cours"
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  >
                    Voir les projets
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </Link>
                }
              />
              <StatCard
                icon={Star}
                label="Note moyenne"
                value={stats.averageRating === null ? "—" : String(stats.averageRating)}
                suffix="/5"
              />
            </StatGrid>
          )}
        </section>

        <section className="mt-9">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="truncate text-[13.5px] font-bold tracking-wide">PROJETS RÉCENTS</h2>
            <Link
              to="/agence/projets-en-cours"
              className="flex shrink-0 items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
            >
              Voir tous les projets
              <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
            </Link>
          </div>
          <div className="mt-4">
            <DataTable
              columns={PROJECT_COLUMNS}
              rows={recentProjects}
              isLoading={isProjectsLoading}
            />
          </div>
        </section>

        <section className="mt-9">
          <SectionCard
            title="Activités récentes"
            description="Devis envoyés, réponses clients, litiges et facturation."
          >
            {isActivitiesLoading ? (
              <StackSkeleton count={3} />
            ) : activities.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="flex gap-3">
                    <Activity className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold">{activity.title}</p>
                      <p className="text-[13px] text-muted-foreground">{activity.description}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{activity.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </section>

        <section className="mt-9">
          <h2 className="text-[13.5px] font-bold tracking-wide">ACCÈS RAPIDES</h2>
          <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAccess
              label="Facturation"
              description="Suivez vos factures émises et reçues."
              to="/agence/facturation"
            />
            <QuickAccess
              label="Analytics PQI"
              description="Analysez vos indicateurs de performance."
              to="/agence/analytics"
            />
            <QuickAccess
              label="Prospection IA"
              description="Découvrez les clients suggérés par l'IA."
              to="/agence/prospection"
            />
            <QuickAccess
              label="Workflow"
              description="Suivez les étapes de traitement des opportunités."
              to="/agence/workflow"
            />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function QuickAccess({
  label,
  description,
  to,
}: {
  label: string;
  description: string;
  to: "/agence/facturation" | "/agence/analytics" | "/agence/prospection" | "/agence/workflow";
}) {
  return (
    <Link to={to} className="group flex gap-4">
      <FileText className="mt-0.5 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-bold">{label}</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">{description}</p>
        <ArrowRight
          className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.8}
        />
      </div>
    </Link>
  );
}
