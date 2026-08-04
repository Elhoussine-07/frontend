import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TextAreaField, TextField } from "@/components/common/Blocks";
import { registerAgency, requestEmailCode } from "@/services/auth.service";
import { ApiError } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/** Inscription agence — formulaire multi-étapes (mockups 10/11). */
export const Route = createFileRoute("/inscription-agence")({
  head: () => ({
    meta: [
      { title: "Inscription agence — Sortlist Pro" },
      {
        name: "description",
        content:
          "Créez le compte de votre agence : présentation, compétences, coordonnées et vérification.",
      },
      { property: "og:title", content: "Inscription agence — Sortlist Pro" },
      {
        property: "og:description",
        content: "Rejoignez Sortlist Pro et recevez des opportunités qualifiées.",
      },
    ],
  }),
  component: AgencyRegistrationPage,
});

const STEPS = [
  { id: 1, label: "Présentation" },
  { id: 2, label: "Compétences" },
  { id: 3, label: "Coordonnées" },
  { id: 4, label: "Vérification" },
];

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Champ requis").max(120),
  description: z.string().trim().min(1, "Champ requis").max(2000),
  foundedYear: z.string().trim().min(4, "Année invalide").max(4),
  teamSize: z.string().trim().min(1, "Champ requis").max(40),
  website: z.string().trim().url("URL invalide").max(255),
  skills: z.string().trim().min(1, "Champ requis").max(500),
  techStack: z.string().trim().min(1, "Champ requis").max(500),
  languages: z.string().trim().min(1, "Champ requis").max(200),
  location: z.string().trim().min(1, "Champ requis").max(120),
  address: z.string().trim().min(1, "Champ requis").max(255),
  phoneCountryCode: z.string().trim().min(1, "Champ requis").max(6),
  phone: z.string().trim().min(1, "Champ requis").max(30),
  email: z.string().trim().email("E-mail invalide").max(255),
  legalIdValue: z.string().trim().min(1, "Champ requis").max(80),
  verificationCode: z.string().trim().min(4, "Code invalide").max(8),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function AgencyRegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Distingue les deux issues possibles de `auth.register_agency` : une
  // nouvelle agence est créée (token renvoyé, on redirige direct) ou une
  // agence homonyme existe déjà et la demande est transformée en
  // `AgencyJoinRequest` en attente de validation (pas de token).
  const [pendingApproval, setPendingApproval] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setStoreRole = useAuthStore((state) => state.setRole);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      foundedYear: "",
      teamSize: "",
      website: "",
      skills: "",
      techStack: "",
      languages: "",
      location: "",
      address: "",
      phoneCountryCode: "",
      phone: "",
      email: "",
      legalIdValue: "",
      verificationCode: "",
    },
  });

  const email = form.watch("email");

  // Envoie le code de vérification dès l'arrivée sur l'étape 4 (une seule
  // fois par email saisi).
  useEffect(() => {
    if (step !== 4 || !email) return;
    requestEmailCode(email).catch((error) => {
      toast(error instanceof ApiError ? error.message : "Envoi du code impossible.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handleResendCode() {
    if (!email) {
      toast("Renseignez votre e-mail professionnel (étape 3) avant de renvoyer un code.");
      return;
    }
    try {
      await requestEmailCode(email);
      toast("Code renvoyé.", { description: "Vérifiez votre boîte de réception." });
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Envoi du code impossible.");
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const skills = values.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const techStack = values.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const languages = values.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const { token, user, detectedRole } = await registerAgency({
        name: values.name,
        description: values.description,
        founded_year: values.foundedYear,
        team_size: values.teamSize,
        website: values.website,
        skills,
        tech_stack: techStack,
        languages,
        location: values.location,
        address: values.address,
        phone_country_code: values.phoneCountryCode,
        phone: values.phone,
        email: values.email,
        legal_id_value: values.legalIdValue,
        verification_code: values.verificationCode,
      });

      if (!token) {
        // Pas de token -> une `AgencyJoinRequest` a été créée en attente de
        // validation plutôt qu'un nouveau compte agence.
        setPendingApproval(true);
        return;
      }

      setToken(token);
      setUser(user);
      setStoreRole(detectedRole);
      toast("Compte agence créé.");
      navigate({ to: "/agence/tableau-de-bord" });
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Inscription impossible.");
    } finally {
      setIsSubmitting(false);
    }
  });

  if (pendingApproval) {
    return (
      <div className="min-h-screen bg-background">
        <MarketingHeader />
        <main className="mx-auto flex max-w-[560px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <CheckCircle2 className="h-10 w-10" strokeWidth={1.5} />
          <h1 className="mt-6 text-[24px] font-bold tracking-tight">Demande envoyée</h1>
          <p className="mt-3 text-[14px] leading-[1.6] text-muted-foreground">
            Une agence portant un nom proche existe déjà sur Sortlist Pro. Votre demande de
            rattachement a été transmise au propriétaire de cette agence — vous recevrez un e-mail
            dès qu'elle sera validée.
          </p>
          <Link
            to="/connexion"
            className="mt-8 rounded-md bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Retour à la connexion
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-[32px] font-bold tracking-tight">Inscription agence</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Complétez les 4 étapes pour publier votre profil.
        </p>

        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STEPS.map((item) => (
            <li key={item.id} className="min-w-0">
              <div
                className={
                  item.id <= step
                    ? "h-[3px] w-full rounded-full bg-primary"
                    : "h-[3px] w-full rounded-full bg-accent"
                }
              />
              <p className="mt-2 truncate text-[13px] font-semibold">
                {item.id}. {item.label}
              </p>
            </li>
          ))}
        </ol>

        <form onSubmit={onSubmit} className="mt-9 space-y-6" noValidate>
          {step === 1 ? (
            <div className="space-y-5">
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
              </div>
              <TextAreaField
                label="Description de l'agence"
                rows={5}
                error={form.formState.errors.description?.message}
                {...form.register("description")}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <TextAreaField
                label="Compétences (séparées par des virgules)"
                rows={3}
                error={form.formState.errors.skills?.message}
                {...form.register("skills")}
              />
              <TextAreaField
                label="Technologies (séparées par des virgules)"
                rows={3}
                error={form.formState.errors.techStack?.message}
                {...form.register("techStack")}
              />
              <TextField
                label="Langues de travail"
                error={form.formState.errors.languages?.message}
                {...form.register("languages")}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                label="Localisation"
                error={form.formState.errors.location?.message}
                {...form.register("location")}
              />
              <TextField
                label="Adresse"
                error={form.formState.errors.address?.message}
                {...form.register("address")}
              />
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
                label="E-mail professionnel"
                error={form.formState.errors.email?.message}
                {...form.register("email")}
              />
              <TextField
                label="Identifiant légal"
                error={form.formState.errors.legalIdValue?.message}
                {...form.register("legalIdValue")}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <p className="text-[14px] text-muted-foreground">
                {/* API CALL : POST /api/auth/register/agency/send-code — paramètres : { email } */}
                Un code de vérification a été envoyé à l'adresse renseignée.
              </p>
              <TextField
                label="Code de vérification"
                error={form.formState.errors.verificationCode?.message}
                {...form.register("verificationCode")}
              />
              <button
                onClick={handleResendCode}
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

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(4, current + 1))}
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
                {isSubmitting ? "Création..." : "Créer mon compte agence"}
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
