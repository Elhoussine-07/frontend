import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CircleHelp,
  FileText,
  MessageCircle,
  MoreVertical,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/EmptyState";
import { StatSkeleton, TableSkeleton } from "@/components/common/Skeletons";
import { useAuthStore } from "@/store/auth.store";
import type { Project } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import { getClientDashboard } from "@/services/profile.service";
import { getMyProjects } from "@/services/projects.service";

/** Écran 12 — TABLEAU DE BORD CLIENT. */
export const Route = createFileRoute("/_authenticated/client/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord Client — Sortlist Pro" },
      {
        name: "description",
        content:
          "Suivez votre score de confiance, vos projets publiés, votre taux de réponse et vos collaborations en cours.",
      },
      { property: "og:title", content: "Tableau de bord Client — Sortlist Pro" },
      {
        property: "og:description",
        content: "Aperçu de votre activité sur Sortlist Pro.",
      },
    ],
  }),
  component: ClientDashboardPage,
});

interface ClientDashboardStats {
  trustScore: number | null;
  trustScoreLabel: string | null;
  publishedProjects: number | null;
  publishedProjectsDelta: string | null;
  responseRate: number | null;
  responseRateDelta: string | null;
  activeCollaborations: number | null;
}

const EMPTY_STATS: ClientDashboardStats = {
  trustScore: null,
  trustScoreLabel: null,
  publishedProjects: null,
  publishedProjectsDelta: null,
  responseRate: null,
  responseRateDelta: null,
  activeCollaborations: null,
};

function ClientDashboardPage() {
  const user = useAuthStore((state) => state.user);

  const dashboardQuery = useQuery({
    queryKey: ["client", "dashboard"],
    queryFn: getClientDashboard,
  });
  const isStatsLoading = dashboardQuery.isPending;
  const stats: ClientDashboardStats = dashboardQuery.data
    ? {
        trustScore: dashboardQuery.data.trustScore.value,
        trustScoreLabel: dashboardQuery.data.trustScore.label,
        publishedProjects: dashboardQuery.data.publishedProjects.value,
        publishedProjectsDelta: dashboardQuery.data.publishedProjects.delta,
        responseRate: dashboardQuery.data.responseRate.value,
        responseRateDelta: dashboardQuery.data.responseRate.delta,
        activeCollaborations: dashboardQuery.data.activeCollaborations.value,
      }
    : EMPTY_STATS;

  const recentProjectsQuery = useQuery({
    queryKey: ["client", "projects", "recent"],
    queryFn: () => getMyProjects({ pageSize: 5, sort: "recent" }),
  });
  const recentProjects = recentProjectsQuery.data?.items ?? [];
  const isProjectsLoading = recentProjectsQuery.isPending;

  return (
    <DashboardShell role="client">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="text-[32px] font-bold tracking-tight">
          Bonjour{user ? `, ${user.displayName}` : ""}
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Voici un aperçu de votre activité sur Sortlist Pro.
        </p>

        {/* Cartes de statistiques */}
        <section className="mt-7">
          {isStatsLoading ? (
            <StatSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 divide-y divide-border rounded-lg border border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              <StatCard
                icon={ShieldCheck}
                label="Score de confiance"
                value={stats.trustScore === null ? "—" : String(stats.trustScore)}
                suffix="/100"
                footer={
                  stats.trustScoreLabel ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {stats.trustScoreLabel}
                    </span>
                  ) : null
                }
              />
              <StatCard
                icon={FileText}
                label="Projets publiés"
                value={stats.publishedProjects === null ? "—" : String(stats.publishedProjects)}
                footer={stats.publishedProjectsDelta}
              />
              <StatCard
                icon={TrendingUp}
                label="Taux de réponse"
                value={stats.responseRate === null ? "—" : `${stats.responseRate}%`}
                footer={stats.responseRateDelta}
              />
              <StatCard
                icon={Users}
                label="Collaborations en cours"
                value={
                  stats.activeCollaborations === null ? "—" : String(stats.activeCollaborations)
                }
                footer={
                  <Link
                    to="/client/collaborations"
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  >
                    Voir le détail
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </Link>
                }
              />
            </div>
          )}
        </section>

        {/* Mes projets récents */}
        <section className="mt-9">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="truncate text-[13.5px] font-bold tracking-wide">MES PROJETS RÉCENTS</h2>
            <Link
              to="/client/mes-projets"
              className="flex shrink-0 items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
            >
              Voir tous mes projets
              <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="mt-4 rounded-lg border border-border">
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-border px-5 py-3 lg:grid">
              <p className="text-[13px] font-semibold">Projet</p>
              <p className="text-[13px] font-semibold">Catégorie</p>
              <p className="text-[13px] font-semibold">Statut</p>
              <p className="text-[13px] font-semibold">Dernière activité</p>
              <p className="text-[13px] font-semibold">Action</p>
              <span className="w-4" />
            </div>

            {isProjectsLoading ? (
              <div className="px-5">
                <TableSkeleton rows={5} columns={5} />
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-5">
                <EmptyState message="Aucun projet récent à afficher." />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentProjects.map((project) => (
                  <li key={project.id}>
                    <ProjectRow project={project} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Actions rapides */}
        <section className="mt-10">
          <h2 className="text-[13.5px] font-bold tracking-wide">ACTIONS RAPIDES</h2>
          <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              icon={Plus}
              title="Postuler un projet"
              description="Déposez un nouveau projet et trouvez les meilleures agences."
              to="/client/postuler-un-projet"
            />
            <QuickAction
              icon={Sparkles}
              title="Générer un CDC avec IA"
              description="Créez un cahier des charges complet et optimisé avec l'intelligence artificielle."
              to="/client/postuler-un-projet"
            />
            <QuickAction
              icon={MessageCircle}
              title="Contacter une agence"
              description="Recherchez et contactez l'agence idéale pour votre projet."
              to="/agences"
            />
            <QuickAction
              icon={Users}
              title="Voir mes collaborations"
              description="Suivez l'avancement de vos collaborations en cours."
              to="/client/collaborations"
            />
          </div>
        </section>

        <div className="mt-14 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold">
            <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.8} />
            Besoin d'aide ?
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  footer,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-5">
      <Icon className="mt-1 h-[21px] w-[21px] shrink-0" strokeWidth={1.6} />
      <div className="min-w-0">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        <p className="mt-1 text-[28px] font-bold leading-none">
          {value}
          {suffix ? (
            <span className="text-[14px] font-normal text-muted-foreground">{suffix}</span>
          ) : null}
        </p>
        {footer ? <div className="mt-2.5 text-[13px] text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_auto] lg:items-center lg:gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <FileText className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold">{project.title}</p>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            ID : {project.reference}
          </p>
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

function QuickAction({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link to={to} className="group flex gap-4">
      <Icon className="mt-0.5 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-bold">{title}</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">{description}</p>
        <ArrowRight
          className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.8}
        />
      </div>
    </Link>
  );
}
