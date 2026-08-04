import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Eye, Star, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionCard, StatCard, StatGrid, StatusBadge } from "@/components/common/Blocks";
import { StackSkeleton, StatSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { FilterSelect } from "@/components/common/ListControls";
import {
  getAnalyticsMetrics,
  getPqi,
  getProactiveAlerts,
  getRecommendations,
} from "@/services/analytics.service";

/** Analytics PQI (Agence) — indicateurs de performance, graphiques, statistiques. */
export const Route = createFileRoute("/_authenticated/agence/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics PQI — Sortlist Pro" },
      {
        name: "description",
        content:
          "Analysez votre score PQI, vos vues de profil, votre position moyenne et vos notes clients.",
      },
      { property: "og:title", content: "Analytics PQI — Sortlist Pro" },
      {
        property: "og:description",
        content: "Indicateurs de performance de votre agence.",
      },
    ],
  }),
  component: AgencyAnalyticsPage,
});

function AgencyAnalyticsPage() {
  const pqiQuery = useQuery({
    queryKey: ["agency", "analytics", "pqi"],
    queryFn: getPqi,
  });
  const pqiScore = pqiQuery.data?.score ?? null;
  const pqiLabel = pqiQuery.data?.label ?? null;
  const pqiFactors = pqiQuery.data?.factors ?? [];
  const penaltyNote = pqiQuery.data?.penaltyNote ?? null;
  const isPqiLoading = pqiQuery.isLoading;

  const metricsQuery = useQuery({
    queryKey: ["agency", "analytics", "metrics"],
    queryFn: () => getAnalyticsMetrics("30d"),
  });
  const emptyMetric = {
    value: 0,
    variation: "0%",
    series: [] as { date: string; value: number }[],
  };
  const profileViews = metricsQuery.data?.profileViews ?? emptyMetric;
  const averagePosition = metricsQuery.data?.averagePosition ?? emptyMetric;
  const averageRating = metricsQuery.data?.averageRating ?? emptyMetric;
  const externalVisits = metricsQuery.data?.externalVisits ?? emptyMetric;
  const isMetricsLoading = metricsQuery.isLoading;

  const alertsQuery = useQuery({
    queryKey: ["agency", "analytics", "alerts"],
    queryFn: getProactiveAlerts,
  });
  const alerts = alertsQuery.data ?? [];
  const isAlertsLoading = alertsQuery.isLoading;

  const recommendationsQuery = useQuery({
    queryKey: ["agency", "analytics", "recommendations"],
    queryFn: getRecommendations,
  });
  const recommendations = recommendationsQuery.data ?? [];
  const isRecommendationsLoading = recommendationsQuery.isLoading;

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Analytics PQI</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Suivez vos performances et améliorez votre visibilité.
            </p>
          </div>
          <div className="w-full sm:w-[200px]">
            {/* API CALL : GET /api/analytics/metrics?range=7d|30d|90d */}
            <FilterSelect label="Période" placeholder="30 derniers jours" />
          </div>
        </div>

        <section className="mt-7">
          <SectionCard
            title="Score PQI"
            description="Indice de performance et de qualité de votre agence."
            action={pqiLabel ? <StatusBadge label={pqiLabel} /> : null}
          >
            {isPqiLoading ? (
              <StackSkeleton count={4} />
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-[22px] w-[22px]" strokeWidth={1.6} />
                  <p className="text-[34px] font-bold leading-none">
                    {pqiScore === null ? "—" : pqiScore}
                    <span className="text-[14px] font-normal text-muted-foreground">/100</span>
                  </p>
                </div>

                {pqiFactors.length === 0 ? (
                  <EmptyState message="Aucune donnée disponible" />
                ) : (
                  <ul className="space-y-3">
                    {pqiFactors.map((factor) => (
                      <li key={factor.id}>
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-[13px]">
                          <span className="truncate">{factor.label}</span>
                          <span className="font-semibold">
                            {factor.value}/{factor.max}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-accent">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{
                              width: `${(factor.value / factor.max) * 100}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {penaltyNote ? (
                  <p className="text-[13px] text-muted-foreground">{penaltyNote}</p>
                ) : null}
              </div>
            )}
          </SectionCard>
        </section>

        <section className="mt-7">
          {isMetricsLoading ? (
            <StatSkeleton count={4} />
          ) : (
            <StatGrid>
              <StatCard
                icon={Eye}
                label="Vues du profil"
                value={profileViews.value === null ? "—" : String(profileViews.value)}
                footer={profileViews.variation}
              />
              <StatCard
                icon={TrendingUp}
                label="Position moyenne"
                value={averagePosition.value === null ? "—" : String(averagePosition.value)}
                footer={averagePosition.variation}
              />
              <StatCard
                icon={Star}
                label="Note moyenne"
                value={averageRating.value === null ? "—" : String(averageRating.value)}
                suffix="/5"
                footer={averageRating.variation}
              />
              <StatCard
                icon={BarChart3}
                label="Visites externes"
                value={externalVisits.value === null ? "—" : String(externalVisits.value)}
                footer={externalVisits.variation}
              />
            </StatGrid>
          )}
        </section>

        <section className="mt-7">
          <SectionCard
            title="Évolution"
            description="Courbes des indicateurs sur la période sélectionnée."
          >
            {isMetricsLoading ? (
              <StackSkeleton count={2} />
            ) : profileViews.series.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ul className="grid grid-cols-1 gap-2">
                {profileViews.series.map((point) => (
                  <li
                    key={point.date}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                  >
                    <span className="truncate text-[13px] text-muted-foreground">{point.date}</span>
                    <span className="text-[13px] font-semibold">{point.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </section>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard
            title="Alertes proactives"
            description="Variations détectées sur vos indicateurs."
          >
            {isAlertsLoading ? (
              <StackSkeleton count={2} />
            ) : alerts.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ul className="space-y-4">
                {alerts.map((alert) => (
                  <li key={alert.title}>
                    <p className="text-[13.5px] font-semibold">{alert.title}</p>
                    <p className="text-[13px] text-muted-foreground">{alert.description}</p>
                    <p className="mt-0.5 text-[13px] font-semibold">{alert.variationPercent}%</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recommandations"
            description="Actions suggérées pour améliorer votre score."
          >
            {isRecommendationsLoading ? (
              <StackSkeleton count={2} />
            ) : recommendations.length === 0 ? (
              <EmptyState message="Aucune donnée disponible" />
            ) : (
              <ul className="space-y-4">
                {recommendations.map((recommendation) => (
                  <li key={recommendation.id}>
                    <p className="text-[13.5px] font-semibold">{recommendation.title}</p>
                    <p className="text-[13px] text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
