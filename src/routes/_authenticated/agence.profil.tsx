import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Image, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  FormSkeleton,
  SectionCard,
  StatusBadge,
  TextAreaField,
  TextField,
} from "@/components/common/Blocks";
import { StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { uiAction } from "@/lib/ui-actions";
import { getAgencyProfile, updateAgencyProfile } from "@/services/profile.service";
import { ApiError } from "@/services/http";

/** Profil agence — présentation, compétences, portfolio, coordonnées. */
export const Route = createFileRoute("/_authenticated/agence/profil")({
  head: () => ({
    meta: [
      { title: "Profil agence — Sortlist Pro" },
      {
        name: "description",
        content:
          "Gérez la présentation de votre agence, vos compétences, votre portfolio et vos coordonnées.",
      },
      { property: "og:title", content: "Profil agence — Sortlist Pro" },
      {
        property: "og:description",
        content: "Profil public de votre agence sur Sortlist Pro.",
      },
    ],
  }),
  component: AgencyProfilePage,
});

const profileSchema = z.object({
  name: z.string().trim().min(1, "Champ requis").max(120),
  description: z.string().trim().min(1, "Champ requis").max(2000),
  foundedYear: z.string().trim().min(4, "Année invalide").max(4),
  teamSize: z.string().trim().min(1, "Champ requis").max(40),
  website: z.string().trim().url("URL invalide").max(255),
  location: z.string().trim().min(1, "Champ requis").max(120),
  legalIdValue: z.string().trim().min(1, "Champ requis").max(80),
  phoneCountryCode: z.string().trim().min(1, "Champ requis").max(6),
  phone: z.string().trim().min(1, "Champ requis").max(30),
  email: z.string().trim().email("E-mail invalide").max(255),
  address: z.string().trim().min(1, "Champ requis").max(255),
});

type ProfileForm = z.infer<typeof profileSchema>;

function AgencyProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["agency", "profile"],
    queryFn: getAgencyProfile,
  });
  const profile = profileQuery.data ?? null;
  const isLoading = profileQuery.isLoading;

  // Le portfolio est une sous-table du profil agence (`AgencyProfile.portfolio`)
  // — pas d'endpoint dédié séparé confirmé, voir `profile.service.ts`.
  const portfolio = profile?.portfolio ?? [];
  const isPortfolioLoading = isLoading;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      description: "",
      foundedYear: "",
      teamSize: "",
      website: "",
      location: "",
      legalIdValue: "",
      phoneCountryCode: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      name: profile.name,
      description: profile.description,
      foundedYear: profile.foundedYear,
      teamSize: profile.teamSize,
      website: profile.website,
      location: profile.location,
      legalIdValue: profile.legalIdValue,
      phoneCountryCode: profile.phoneCountryCode,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateAgencyProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency", "profile"], updated);
      toast("Profil mis à jour");
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Mise à jour impossible.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(values);
  });

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px] space-y-6">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Profil agence</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Ces informations composent votre profil public.
          </p>
        </div>

        <SectionCard
          title="Présentation"
          description="Nom, description, année de création et taille de l'équipe."
          action={profile?.legalIdValid ? <StatusBadge label="Identifiant légal vérifié" /> : null}
        >
          {isLoading ? (
            <FormSkeleton fields={6} />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  label="Nom de l'agence"
                  error={form.formState.errors.name?.message}
                  {...form.register("name")}
                />
                <TextField
                  label="Année de création"
                  error={form.formState.errors.foundedYear?.message}
                  {...form.register("foundedYear")}
                />
                <TextField
                  label="Taille de l'équipe"
                  error={form.formState.errors.teamSize?.message}
                  {...form.register("teamSize")}
                />
                <TextField
                  label="Site web"
                  error={form.formState.errors.website?.message}
                  {...form.register("website")}
                />
                <TextField
                  label="Localisation"
                  error={form.formState.errors.location?.message}
                  {...form.register("location")}
                />
                <TextField
                  label="Identifiant légal"
                  error={form.formState.errors.legalIdValue?.message}
                  {...form.register("legalIdValue")}
                />
              </div>

              <TextAreaField
                label="Description de l'agence"
                rows={5}
                error={form.formState.errors.description?.message}
                {...form.register("description")}
              />

              <h3 className="pt-2 text-[13.5px] font-bold tracking-wide">COORDONNÉES</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  label="Indicatif pays"
                  error={form.formState.errors.phoneCountryCode?.message}
                  {...form.register("phoneCountryCode")}
                />
                <TextField
                  label="Téléphone"
                  error={form.formState.errors.phone?.message}
                  {...form.register("phone")}
                />
                <TextField
                  label="E-mail"
                  error={form.formState.errors.email?.message}
                  {...form.register("email")}
                />
                <TextField
                  label="Adresse"
                  error={form.formState.errors.address?.message}
                  {...form.register("address")}
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          )}
        </SectionCard>

        <SectionCard
          title="Compétences et technologies"
          description="Utilisées pour le matching avec les projets clients."
        >
          {isLoading ? (
            <StackSkeleton count={2} />
          ) : profile === null ? (
            <EmptyState message="Aucune donnée disponible" />
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-[13px] text-muted-foreground">Compétences</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <StatusBadge key={skill} label={skill} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">Technologies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.techStack.map((tech) => (
                    <StatusBadge key={tech} label={tech} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">Langues</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.languages.map((language) => (
                    <StatusBadge key={language} label={language} />
                  ))}
                </div>
              </div>
              <p className="flex items-center gap-2 text-[13px]">
                <Globe className="h-4 w-4" strokeWidth={1.7} />
                Travail à distance : {profile.remoteWork ? "Oui" : "Non"}
              </p>
            </div>
          )}
          <button
            onClick={() => uiAction("{/* API CALL : PUT /api/profile/agency — paramètres : */} Mo")}
            type="button"
            className="mt-5 flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent"
          >
            {/* API CALL : PUT /api/profile/agency — paramètres : { skills, techStack, languages, remoteWork } */}
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            Modifier les compétences
          </button>
        </SectionCard>

        <SectionCard
          title="Portfolio"
          description="Réalisations présentées aux clients."
          action={
            <button
              onClick={() =>
                uiAction("{/* API CALL : POST /api/profile/agency/portfolio — paramètr")
              }
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent"
            >
              {/* API CALL : POST /api/profile/agency/portfolio — paramètres : { title, category, media } */}
              <Plus className="h-3 w-3" strokeWidth={1.8} />
              Ajouter
            </button>
          }
        >
          {isPortfolioLoading ? (
            <StackSkeleton count={3} />
          ) : portfolio.length === 0 ? (
            <EmptyState message="Aucune donnée disponible" />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((item) => (
                <li key={item.id} className="rounded-lg border border-border p-4">
                  <Image className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  <p className="mt-3 text-[13.5px] font-bold">{item.title}</p>
                  <p className="text-[13px] text-muted-foreground">{item.category}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Aperçu public"
          description="Ce que voient les clients sur votre fiche agence."
        >
          {profile === null ? (
            <EmptyState message="Aucune donnée disponible" />
          ) : (
            <div className="flex items-start gap-4">
              <Building2 className="h-[22px] w-[22px]" strokeWidth={1.6} />
              <div className="min-w-0">
                <p className="text-[15px] font-bold">{profile.name}</p>
                <p className="text-[13px] text-muted-foreground">{profile.location}</p>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
