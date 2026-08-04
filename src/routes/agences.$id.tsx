import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Send,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { SectionCard, StatusBadge } from "@/components/common/Blocks";
import { StackSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { ActionModal } from "@/components/common/ActionModal";
import type { Agency, AgencyProfile } from "@/lib/types";
import {
  contactAgencyUnicast,
  getAgencyProfile,
  listAgencyReviews,
  type AgencyReview,
} from "@/services/agencies.service";
import { ApiError } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

/** Profil public d'une agence — accessible sans connexion (bouton « Voir le profil »). */
export const Route = createFileRoute("/agences/$id")({
  head: () => ({
    meta: [
      { title: "Profil de l'agence — Sortlist Pro" },
      {
        name: "description",
        content:
          "Consultez la présentation, les compétences, le portfolio et les avis d'une agence avant de la contacter.",
      },
      { property: "og:title", content: "Profil de l'agence — Sortlist Pro" },
      {
        property: "og:description",
        content: "Présentation, compétences, réalisations et avis clients de l'agence.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicAgencyProfilePage,
});

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
}

function PublicAgencyProfilePage() {
  const { id } = Route.useParams();
  const token = useAuthStore((state) => state.token);

  const [agency, setAgency] = useState<(Agency & Partial<AgencyProfile>) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    needType: "Projet" as "Projet" | "Stage" | "Job",
    description: "",
  });

  useEffect(() => {
    setIsLoading(true);
    getAgencyProfile(id)
      .then(setAgency)
      .catch((error: unknown) => {
        toast(error instanceof ApiError ? error.message : "Impossible de charger cette agence.");
        setAgency(null);
      })
      .finally(() => setIsLoading(false));

    setIsReviewsLoading(true);
    listAgencyReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setIsReviewsLoading(false));
  }, [id]);

  const portfolio: PortfolioItem[] = (agency?.portfolio ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
  }));

  function openContactModal() {
    if (!token) {
      window.location.href = "/connexion";
      return;
    }
    setIsContactOpen(true);
  }

  async function handleSubmitContact() {
    if (!contactForm.description.trim()) {
      toast("Décrivez votre besoin avant d'envoyer.");
      return;
    }
    setIsSubmittingContact(true);
    try {
      await contactAgencyUnicast(id, {
        needType: contactForm.needType,
        description: contactForm.description,
      });
      toast("Votre demande a été envoyée à l'agence.");
      setIsContactOpen(false);
      setContactForm({ needType: "Projet", description: "" });
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Envoi impossible.");
    } finally {
      setIsSubmittingContact(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader variant="search" active="agencies" />

      <main className="mx-auto max-w-[1080px] px-4 pb-20 sm:px-6 lg:px-8">
        <Link
          to="/agences"
          className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Retour aux agences
        </Link>

        {/* En-tête du profil */}
        <section className="mt-5 rounded-lg border border-border p-6">
          {isLoading ? (
            <StackSkeleton count={2} />
          ) : agency === null ? (
            <EmptyState message="Aucune donnée disponible pour cette agence." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-lg border border-border text-[24px] font-bold">
                {agency.logoText}
              </div>
              <div className="min-w-0">
                <h1 className="text-[26px] font-bold leading-tight tracking-tight">
                  {agency.name}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                    {agency.location}
                  </span>
                  {agency.foundedYear ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                      Depuis {agency.foundedYear}
                    </span>
                  ) : null}
                  {agency.teamSize ? (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                      {agency.teamSize}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold">
                  <Star className="h-4 w-4 fill-current" strokeWidth={0} />
                  {agency.rating}
                  <span className="font-normal text-muted-foreground">
                    ({agency.reviewsCount} avis)
                  </span>
                  {agency.legalIdValid ? <StatusBadge label="Identifiant légal vérifié" /> : null}
                </p>
                <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-muted-foreground">
                  {agency.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:w-[190px]">
                <button
                  type="button"
                  onClick={openContactModal}
                  className="rounded-md bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Contacter l'agence
                </button>
                <Link
                  to="/postuler-un-projet"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-[14px] font-semibold transition-colors hover:bg-accent"
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  Postuler un projet
                </Link>
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <SectionCard
              title="Compétences et technologies"
              description="Domaines d'expertise déclarés par l'agence."
            >
              {isLoading ? (
                <StackSkeleton count={2} />
              ) : agency === null ? (
                <EmptyState message="Aucune donnée disponible" />
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-[13px] text-muted-foreground">Compétences</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(agency.skills ?? []).map((skill) => (
                        <StatusBadge key={skill} label={skill} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground">Technologies</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(agency.techStack ?? []).map((tech) => (
                        <StatusBadge key={tech} label={tech} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground">Langues</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(agency.languages ?? []).map((language) => (
                        <StatusBadge key={language} label={language} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Portfolio" description="Réalisations publiées par l'agence.">
              {isLoading ? (
                <StackSkeleton count={3} />
              ) : portfolio.length === 0 ? (
                <EmptyState message="Aucune réalisation à afficher." />
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {portfolio.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                    >
                      <ImageIcon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                      <p className="mt-3 text-[14px] font-bold">{item.title}</p>
                      <p className="text-[13px] text-muted-foreground">{item.category}</p>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard
              title="Avis clients"
              description="Retours des clients ayant collaboré avec l'agence."
            >
              {isReviewsLoading ? (
                <StackSkeleton count={3} />
              ) : reviews.length === 0 ? (
                <EmptyState message="Aucun avis à afficher." />
              ) : (
                <ul className="divide-y divide-border">
                  {reviews.map((review) => (
                    <li key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-[13px] font-bold">
                          {review.authorInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold">{review.authorName}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold">
                            <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                            {review.rating}
                            <span className="font-normal text-muted-foreground">
                              · {review.publishedAt}
                            </span>
                          </p>
                          <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>

          {/* Coordonnées — colonne latérale */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <SectionCard title="Coordonnées" description="Informations de contact publiques.">
              {isLoading ? (
                <StackSkeleton count={2} />
              ) : agency === null ? (
                <EmptyState message="Aucune donnée disponible" />
              ) : (
                <ul className="space-y-3 text-[14px]">
                  <li className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span className="min-w-0 break-words">{agency.address}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span className="min-w-0 break-words">
                      {agency.phoneCountryCode} {agency.phone}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span className="min-w-0 break-words">{agency.email}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span className="min-w-0 break-words">{agency.website}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span className="min-w-0">
                      Travail à distance : {agency.remoteWork ? "Oui" : "Non"}
                    </span>
                  </li>
                </ul>
              )}
              <p className="mt-4 text-[13px] text-muted-foreground">Référence agence : {id}</p>
            </SectionCard>
          </aside>
        </div>
      </main>

      <ActionModal
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        title="Contacter l'agence"
        description="Flux Unicast : votre demande sera envoyée uniquement à cette agence."
        confirmLabel={isSubmittingContact ? "Envoi..." : "Envoyer"}
        onConfirm={handleSubmitContact}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold" htmlFor="contact-need-type">
              Type de besoin
            </label>
            <select
              id="contact-need-type"
              value={contactForm.needType}
              onChange={(event) =>
                setContactForm((prev) => ({
                  ...prev,
                  needType: event.target.value as "Projet" | "Stage" | "Job",
                }))
              }
              className="mt-1.5 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
            >
              <option value="Projet">Projet</option>
              <option value="Stage">Stage</option>
              <option value="Job">Job</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold" htmlFor="contact-description">
              Décrivez votre besoin
            </label>
            <textarea
              id="contact-description"
              value={contactForm.description}
              onChange={(event) =>
                setContactForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
              className="mt-1.5 w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-[13.5px] outline-none"
              placeholder="Contexte, objectifs, contraintes..."
            />
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
