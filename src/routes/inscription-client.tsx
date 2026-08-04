import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TextField } from "@/components/common/Blocks";
import { registerClient, requestEmailCode } from "@/services/auth.service";
import { ApiError } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/inscription-client")({
  head: () => ({
    meta: [
      { title: "Inscription client | Sortlist Pro" },
      {
        name: "description",
        content: "Créez votre compte client pour déposer vos projets sur Sortlist Pro.",
      },
    ],
  }),
  component: ClientRegistrationPage,
});
const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "Champ requis").max(80),
  lastName: z.string().trim().min(1, "Champ requis").max(80),
  companyName: z.string().trim().max(120).optional(),
  country: z.string().trim().min(1, "Champ requis").max(80),
  phone: z.string().trim().min(1, "Champ requis").max(30),
  email: z.string().trim().email("E-mail invalide").max(255),
  password: z.string().trim().min(8, "Minimum 8 caractères").max(255),
  verificationCode: z.string().trim().min(4, "Code invalide").max(8),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function ClientRegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setStoreRole = useAuthStore((state) => state.setRole);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      country: "",
      phone: "",
      email: "",
      password: "",
      verificationCode: "",
    },
  });

  const email = form.watch("email");

  // Envoie le code de vérification à l'étape 2
  const handleSendCode = async () => {
    const emailValue = form.getValues("email");
    if (!emailValue) {
      toast("Renseignez votre email d'abord.");
      return;
    }
    try {
      await requestEmailCode(emailValue);
      toast("Code envoyé par email.", {
        description: "Vérifiez votre boîte de réception.",
      });
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Envoi du code impossible.");
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const { token, user, detectedRole } = await registerClient({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        country: values.country,
        companyName: values.companyName || "",
        phone: values.phone,
        verificationCode: values.verificationCode,
      });

      setToken(token);
      setUser(user);
      setStoreRole(detectedRole);

      toast("Compte client créé avec succès !");
      navigate({ to: "/client/tableau-de-bord" });
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Inscription impossible.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-[32px] font-bold tracking-tight">Inscription client</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Créez votre compte pour déposer vos projets en quelques clics.
        </p>

        <form onSubmit={onSubmit} className="mt-9 space-y-6" noValidate>
          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  label="Prénom"
                  error={form.formState.errors.firstName?.message}
                  {...form.register("firstName")}
                />
                <TextField
                  label="Nom"
                  error={form.formState.errors.lastName?.message}
                  {...form.register("lastName")}
                />
                <TextField
                  label="Raison sociale (optionnel)"
                  error={form.formState.errors.companyName?.message}
                  {...form.register("companyName")}
                />
                <TextField
                  label="Pays"
                  error={form.formState.errors.country?.message}
                  {...form.register("country")}
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
              </div>
              <TextField
                label="Mot de passe"
                type="password"
                error={form.formState.errors.password?.message}
                {...form.register("password")}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <p className="text-[14px] text-muted-foreground">
                Un code de vérification a été envoyé à votre adresse email.
              </p>
              <TextField
                label="Code de vérification"
                error={form.formState.errors.verificationCode?.message}
                {...form.register("verificationCode")}
              />
              <button
                onClick={handleSendCode}
                type="button"
                className="text-[13.5px] font-semibold underline underline-offset-2"
              >
                Renvoyer le code
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              Précédent
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => {
                  // Valider l'étape 1 avant de passer à l'étape 2
                  const fields = ["firstName", "lastName", "country", "phone", "email", "password"];
                  const isValid = fields.every(
                    (field) => !form.formState.errors[field as keyof RegistrationForm],
                  );
                  if (isValid && form.getValues("email")) {
                    handleSendCode();
                    setStep(2);
                  } else {
                    form.trigger(fields as never);
                    toast("Veuillez remplir tous les champs correctement.");
                  }
                }}
                className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Suivant
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Création..." : "Créer mon compte client"}
              </button>
            )}
          </div>
        </form>

        <p className="mt-8 text-[13.5px] text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/connexion"
            className="font-semibold text-foreground underline underline-offset-2"
          >
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}
