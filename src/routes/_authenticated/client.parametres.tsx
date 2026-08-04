import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormSkeleton, PreferenceRow, SectionCard, TextField } from "@/components/common/Blocks";
import { Switch } from "@/components/ui/switch";
import { getSettings, updateSettings, type Settings } from "@/services/profile.service";
import { changePassword } from "@/services/auth.service";
import { ApiError } from "@/services/http";

/** Écran 14 — PARAMÈTRES (Client) : préférences + sécurité (mot de passe). */
export const Route = createFileRoute("/_authenticated/client/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Sortlist Pro" },
      {
        name: "description",
        content: "Gérez vos préférences d'affichage, vos notifications et votre mot de passe.",
      },
      { property: "og:title", content: "Paramètres — Sortlist Pro" },
      {
        property: "og:description",
        content: "Préférences et sécurité de votre compte client.",
      },
    ],
  }),
  component: ClientSettingsPage,
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Champ requis").max(128),
    newPassword: z.string().min(8, "8 caractères minimum").max(128),
    confirmPassword: z.string().min(8, "8 caractères minimum").max(128),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

function ClientSettingsPage() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ["client", "settings"],
    queryFn: getSettings,
  });
  const settings = settingsQuery.data ?? null;
  const isLoading = settingsQuery.isPending;

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordForm) =>
      changePassword({ oldPassword: values.currentPassword, newPassword: values.newPassword }),
    onSuccess: () => {
      toast.success("Mot de passe mis à jour");
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Impossible de mettre à jour le mot de passe.",
      );
    },
  });

  const onSubmitPassword = form.handleSubmit((values) => {
    passwordMutation.mutate(values);
  });

  const settingsMutation = useMutation({
    mutationFn: (payload: Partial<Settings>) => updateSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["client", "settings"], updated);
      toast.success("Préférences mises à jour");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Impossible d'enregistrer les préférences.",
      );
    },
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settingsMutation.mutate({ [key]: value } as Partial<Settings>);
  };

  return (
    <DashboardShell role="client">
      <div className="mx-auto max-w-[1080px] space-y-6">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Paramètres</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Préférences d'affichage, notifications et sécurité.
          </p>
        </div>

        <SectionCard
          title="Préférences d'affichage"
          description="Thème, langue, police et taille du texte."
        >
          {isLoading ? (
            <FormSkeleton fields={4} />
          ) : (
            <div>
              <PreferenceRow label="Thème" description="Clair, sombre ou système">
                <select
                  value={settings?.theme ?? ""}
                  onChange={(event) =>
                    updateSetting("theme", event.target.value as Settings["theme"])
                  }
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
                >
                  <option value="">—</option>
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </PreferenceRow>
              <PreferenceRow label="Langue" description="Langue de l'interface">
                {/* TODO backend : pas de taxonomie de langues disponibles exposée
                    (`api/taxonomy/languages` ou équivalent) — une seule option
                    (la langue actuelle du profil) est proposée en attendant. */}
                <select
                  value={settings?.language ?? ""}
                  onChange={(event) => updateSetting("language", event.target.value)}
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
                >
                  <option value="">—</option>
                  {settings?.language ? (
                    <option value={settings.language}>{settings.language}</option>
                  ) : null}
                </select>
              </PreferenceRow>
              <PreferenceRow label="Police" description="Police d'affichage">
                {/* TODO backend : pas de taxonomie de polices disponibles exposée
                    — une seule option (la police actuelle du profil) est
                    proposée en attendant. */}
                <select
                  value={settings?.font ?? ""}
                  onChange={(event) => updateSetting("font", event.target.value)}
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
                >
                  <option value="">—</option>
                  {settings?.font ? <option value={settings.font}>{settings.font}</option> : null}
                </select>
              </PreferenceRow>
              <PreferenceRow
                label="Taille du texte"
                description="Ajustez la lisibilité de l'interface"
              >
                <input
                  type="range"
                  min={80}
                  max={130}
                  value={settings?.textSize ?? 100}
                  onChange={(event) => updateSetting("textSize", Number(event.target.value))}
                  className="w-40"
                />
              </PreferenceRow>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Choisissez comment vous souhaitez être informé."
        >
          <div>
            <PreferenceRow
              label="Notifications par e-mail"
              description="Nouvelles propositions, litiges, factures"
            >
              <Switch
                checked={settings?.emailNotifications ?? false}
                onCheckedChange={(value) => updateSetting("emailNotifications", value)}
              />
            </PreferenceRow>
            <PreferenceRow
              label="Notifications push"
              description="Alertes en temps réel dans le navigateur"
            >
              <Switch
                checked={settings?.pushNotifications ?? false}
                onCheckedChange={(value) => updateSetting("pushNotifications", value)}
              />
            </PreferenceRow>
          </div>
        </SectionCard>

        <SectionCard title="Sécurité" description="Mot de passe et double authentification.">
          <form onSubmit={onSubmitPassword} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                label="Mot de passe actuel"
                type="password"
                error={form.formState.errors.currentPassword?.message}
                {...form.register("currentPassword")}
              />
              <TextField
                label="Nouveau mot de passe"
                type="password"
                error={form.formState.errors.newPassword?.message}
                {...form.register("newPassword")}
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                error={form.formState.errors.confirmPassword?.message}
                {...form.register("confirmPassword")}
              />
            </div>

            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordMutation.isPending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </button>
          </form>

          <div className="mt-2">
            <PreferenceRow
              label="Double authentification"
              description="Code de vérification envoyé par e-mail à chaque connexion"
            >
              <Switch
                checked={settings?.twoFactorEnabled ?? false}
                onCheckedChange={(value) => updateSetting("twoFactorEnabled", value)}
              />
            </PreferenceRow>
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
