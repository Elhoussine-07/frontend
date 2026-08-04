import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormSkeleton, SectionCard, StatusBadge, TextField } from "@/components/common/Blocks";
import { EmptyState } from "@/components/common/EmptyState";
import { uiAction } from "@/lib/ui-actions";
import { getClientProfile, updateClientProfile } from "@/services/profile.service";
import { ApiError } from "@/services/http";

/** Écran 13 — MON PROFIL (Client) : informations entreprise + score de confiance. */
export const Route = createFileRoute("/_authenticated/client/mon-profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Sortlist Pro" },
      {
        name: "description",
        content:
          "Complétez les informations de votre entreprise et suivez votre score de confiance.",
      },
      { property: "og:title", content: "Mon profil — Sortlist Pro" },
      {
        property: "og:description",
        content: "Informations entreprise et score de confiance.",
      },
    ],
  }),
  component: ClientProfilePage,
});

/** Validation uniquement (aucune logique métier). */
const companySchema = z.object({
  contactLastName: z.string().trim().min(1, "Champ requis").max(80),
  contactFirstName: z.string().trim().min(1, "Champ requis").max(80),
  companyName: z.string().trim().min(1, "Champ requis").max(120),
  activitySector: z.string().trim().min(1, "Champ requis").max(120),
  country: z.string().trim().min(1, "Champ requis").max(80),
  legalIdType: z.string().trim().min(1, "Champ requis").max(80),
  legalIdValue: z.string().trim().min(1, "Champ requis").max(80),
});

type CompanyForm = z.infer<typeof companySchema>;

function ClientProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["client", "profile"],
    queryFn: getClientProfile,
  });
  const profile = profileQuery.data ?? null;
  const isLoading = profileQuery.isPending;

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      contactLastName: "",
      contactFirstName: "",
      companyName: "",
      activitySector: "",
      country: "",
      legalIdType: "",
      legalIdValue: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        contactLastName: profile.contactLastName,
        contactFirstName: profile.contactFirstName,
        companyName: profile.companyName,
        activitySector: profile.activitySector,
        country: profile.country,
        legalIdType: profile.legalIdType,
        legalIdValue: profile.legalIdValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (values: CompanyForm) => updateClientProfile(values),
    onSuccess: (updated) => {
      queryClient.setQueryData(["client", "profile"], updated);
      toast.success("Profil mis à jour");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Impossible d'enregistrer le profil.",
      );
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(values);
  });

  return (
    <DashboardShell role="client">
      <div className="mx-auto max-w-[1080px] space-y-6">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Mon profil</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Informations de votre entreprise et niveau de confiance.
          </p>
        </div>

        <SectionCard
          title="Informations entreprise"
          description="Ces informations sont visibles par les agences que vous contactez."
          action={profile?.identityVerified ? <StatusBadge label="Identité vérifiée" /> : null}
        >
          {isLoading ? (
            <FormSkeleton fields={7} />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  label="Nom du contact"
                  error={form.formState.errors.contactLastName?.message}
                  {...form.register("contactLastName")}
                />
                <TextField
                  label="Prénom du contact"
                  error={form.formState.errors.contactFirstName?.message}
                  {...form.register("contactFirstName")}
                />
                <TextField
                  label="Raison sociale"
                  error={form.formState.errors.companyName?.message}
                  {...form.register("companyName")}
                />
                <TextField
                  label="Secteur d'activité"
                  error={form.formState.errors.activitySector?.message}
                  {...form.register("activitySector")}
                />
                <TextField
                  label="Pays"
                  error={form.formState.errors.country?.message}
                  {...form.register("country")}
                />
                <TextField
                  label="Type d'identifiant légal"
                  error={form.formState.errors.legalIdType?.message}
                  {...form.register("legalIdType")}
                />
                <TextField
                  label="Identifiant légal"
                  error={form.formState.errors.legalIdValue?.message}
                  {...form.register("legalIdValue")}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Enregistrer les modifications
                </button>
                <button
                  onClick={() => uiAction("Vérifier mon identité")}
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent"
                >
                  {/* API CALL : POST /api/profile/client/verify-identity */}
                  <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Vérifier mon identité
                </button>
              </div>
            </form>
          )}
        </SectionCard>

        <SectionCard
          title="Score de confiance"
          description="Calculé à partir de la complétion du profil et de votre activité."
        >
          {isLoading ? (
            <FormSkeleton fields={2} />
          ) : profile === null ? (
            <EmptyState message="Aucune donnée disponible" />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-[22px] w-[22px]" strokeWidth={1.6} />
                <p className="text-[28px] font-bold leading-none">
                  {profile.trustScore}
                  <span className="text-[14px] font-normal text-muted-foreground">/100</span>
                </p>
                <StatusBadge label={profile.trustScoreLabel} />
              </div>

              <ul className="space-y-3">
                {profile.trustScoreFactors.map((factor) => (
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
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Complétion du profil"
          description="Renseignez les champs manquants pour améliorer votre visibilité."
        >
          {profile === null ? (
            <EmptyState message="Aucune donnée disponible" />
          ) : (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <Building2 className="h-4 w-4" strokeWidth={1.7} />
                {profile.completionPercent}% complété
              </p>
              <ul className="space-y-2">
                {profile.missingFields.map((field) => (
                  <li key={field.id} className="text-[13px] text-muted-foreground">
                    {field.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
