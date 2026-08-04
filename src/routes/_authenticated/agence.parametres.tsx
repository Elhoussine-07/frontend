import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormSkeleton, PreferenceRow, SectionCard, TextField } from "@/components/common/Blocks";
import { Switch } from "@/components/ui/switch";
import {
  getSettings,
  registerAgencyPaymentMethod,
  updateSettings,
} from "@/services/profile.service";
import { changePassword } from "@/services/auth.service";
import { ApiError } from "@/services/http";

/** Paramètres (Agence) — configuration du compte et préférences. */
export const Route = createFileRoute("/_authenticated/agence/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres agence — Sortlist Pro" },
      {
        name: "description",
        content:
          "Configurez votre compte agence : préférences d'affichage, notifications, sécurité et facturation.",
      },
      { property: "og:title", content: "Paramètres agence — Sortlist Pro" },
      {
        property: "og:description",
        content: "Configuration du compte de votre agence.",
      },
    ],
  }),
  component: AgencySettingsPage,
});

interface AgencySettingsState {
  theme: string;
  language: string;
  font: string;
  textSize: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  opportunityAlerts: boolean;
  autoQuoteReminders: boolean;
  twoFactorEnabled: boolean;
}

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

const billingSchema = z.object({
  billingEmail: z.string().trim().email("E-mail invalide").max(255),
  vatNumber: z.string().trim().min(1, "Champ requis").max(40),
  billingAddress: z.string().trim().min(1, "Champ requis").max(255),
});

type BillingForm = z.infer<typeof billingSchema>;

const NOTIFICATION_PREFS_KEYS: (keyof AgencySettingsState)[] = [
  "emailNotifications",
  "pushNotifications",
  "opportunityAlerts",
  "autoQuoteReminders",
];

function AgencySettingsPage() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ["agency", "settings"],
    queryFn: getSettings,
  });
  const isLoading = settingsQuery.isLoading;

  // `settings.get_settings`/`update_settings` ne couvrent que
  // theme/language/font/textSize/twoFactorEnabled (voir `profile.service.ts::Settings`).
  // Les préférences de notifications n'ont pas de champ backend confirmé —
  // conservées en état local uniquement (TODO backend : étendre `Settings`
  // ou brancher `settings.update_notification_prefs` si l'endpoint existe).
  const [notificationPrefs, setNotificationPrefs] = useState<
    Pick<
      AgencySettingsState,
      "emailNotifications" | "pushNotifications" | "opportunityAlerts" | "autoQuoteReminders"
    >
  >({
    emailNotifications: true,
    pushNotifications: true,
    opportunityAlerts: true,
    autoQuoteReminders: true,
  });

  const settings: AgencySettingsState | null = settingsQuery.data
    ? { ...settingsQuery.data, ...notificationPrefs }
    : null;

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency", "settings"], updated);
      toast("Paramètres mis à jour");
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Mise à jour impossible.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast("Mot de passe mis à jour");
      passwordForm.reset();
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Mise à jour du mot de passe impossible.");
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const billingForm = useForm<BillingForm>({
    resolver: zodResolver(billingSchema),
    defaultValues: { billingEmail: "", vatNumber: "", billingAddress: "" },
  });

  const onSubmitPassword = passwordForm.handleSubmit((values) => {
    changePasswordMutation.mutate({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  });

  // `registerAgencyPaymentMethod` (`profile.service.ts`, géré par un autre
  // agent en parallèle) : branché ici selon le contrat convenu — devient
  // fonctionnel une fois son export livré côté service.
  const registerBillingMutation = useMutation({
    mutationFn: registerAgencyPaymentMethod,
    onSuccess: () => {
      toast("Informations de facturation enregistrées");
    },
    onError: (error) => {
      toast(
        error instanceof ApiError
          ? error.message
          : "Enregistrement des informations de facturation impossible.",
      );
    },
  });

  const onSubmitBilling = billingForm.handleSubmit((values) => {
    registerBillingMutation.mutate({
      billingEmail: values.billingEmail,
      vatNumber: values.vatNumber,
      billingAddress: values.billingAddress,
    });
  });

  function updateSetting(key: keyof AgencySettingsState, value: boolean) {
    if (NOTIFICATION_PREFS_KEYS.includes(key)) {
      setNotificationPrefs((prev) => ({ ...prev, [key]: value }));
      return;
    }
    if (key === "twoFactorEnabled") {
      updateSettingsMutation.mutate({ twoFactorEnabled: value });
    }
  }

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px] space-y-6">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Paramètres</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Gérez les paramètres de votre compte et de votre agence.
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
                    updateSettingsMutation.mutate({
                      theme: event.target.value as "light" | "dark" | "system",
                    })
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
                {/* API CALL : PUT /api/settings { language } */}
                <select
                  value={settings?.language ?? ""}
                  onChange={() => {}}
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
                >
                  <option value="">—</option>
                </select>
              </PreferenceRow>
              <PreferenceRow label="Police" description="Police d'affichage">
                {/* Aucune option de police définie dans l'UI (liste vide) — rien à
                    envoyer côté backend tant qu'un choix n'est pas ajouté. */}
                <select
                  value={settings?.font ?? ""}
                  onChange={() => {}}
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
                >
                  <option value="">—</option>
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
                  onChange={(event) =>
                    updateSettingsMutation.mutate({ textSize: Number(event.target.value) })
                  }
                  className="w-40"
                />
              </PreferenceRow>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Alertes opportunités, rappels de devis et notifications générales."
        >
          <div>
            <PreferenceRow
              label="Notifications par e-mail"
              description="Opportunités, litiges, factures"
            >
              {/* API CALL : PUT /api/settings { emailNotifications } */}
              <Switch
                checked={settings?.emailNotifications ?? false}
                onCheckedChange={(value) => updateSetting("emailNotifications", value)}
              />
            </PreferenceRow>
            <PreferenceRow
              label="Notifications push"
              description="Alertes en temps réel dans le navigateur"
            >
              {/* API CALL : PUT /api/settings { pushNotifications } */}
              <Switch
                checked={settings?.pushNotifications ?? false}
                onCheckedChange={(value) => updateSetting("pushNotifications", value)}
              />
            </PreferenceRow>
            <PreferenceRow
              label="Alertes nouvelles opportunités"
              description="Recevez un e-mail dès qu'un projet correspond à vos compétences"
            >
              {/* API CALL : PUT /api/settings { opportunityAlerts } */}
              <Switch
                checked={settings?.opportunityAlerts ?? false}
                onCheckedChange={(value) => updateSetting("opportunityAlerts", value)}
              />
            </PreferenceRow>
            <PreferenceRow
              label="Rappels de devis"
              description="Relance automatique avant expiration d'une opportunité"
            >
              {/* API CALL : PUT /api/settings { autoQuoteReminders } */}
              <Switch
                checked={settings?.autoQuoteReminders ?? false}
                onCheckedChange={(value) => updateSetting("autoQuoteReminders", value)}
              />
            </PreferenceRow>
          </div>
        </SectionCard>

        <SectionCard
          title="Informations de facturation"
          description="Utilisées sur les factures émises par votre agence."
        >
          <form onSubmit={onSubmitBilling} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                label="E-mail de facturation"
                error={billingForm.formState.errors.billingEmail?.message}
                {...billingForm.register("billingEmail")}
              />
              <TextField
                label="Numéro de TVA"
                error={billingForm.formState.errors.vatNumber?.message}
                {...billingForm.register("vatNumber")}
              />
              <TextField
                label="Adresse de facturation"
                error={billingForm.formState.errors.billingAddress?.message}
                {...billingForm.register("billingAddress")}
              />
            </div>
            <button
              type="submit"
              disabled={registerBillingMutation.isPending}
              className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {registerBillingMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Sécurité" description="Mot de passe et double authentification.">
          <form onSubmit={onSubmitPassword} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                label="Mot de passe actuel"
                type="password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register("currentPassword")}
              />
              <TextField
                label="Nouveau mot de passe"
                type="password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register("newPassword")}
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register("confirmPassword")}
              />
            </div>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {changePasswordMutation.isPending
                ? "Mise à jour..."
                : "Mettre à jour le mot de passe"}
            </button>
          </form>

          <div className="mt-2">
            <PreferenceRow
              label="Double authentification"
              description="Code de vérification envoyé par e-mail à chaque connexion"
            >
              {/* API CALL : PUT /api/settings { twoFactorEnabled } */}
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
