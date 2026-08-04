import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Ban,
  Briefcase,
  FileText,
  Shield,
  Target,
  UserRound,
  Users,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sortlist Pro — La plateforme B2B projets & agences" },
      {
        name: "description",
        content:
          "Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins. Sortlist Pro simplifie chaque étape.",
      },
      {
        property: "og:title",
        content: "Sortlist Pro — La plateforme B2B projets & agences",
      },
      {
        property: "og:description",
        content:
          "Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins.",
      },
    ],
  }),
  component: HomePage,
});

const AUDIENCES = [
  {
    icon: UserRound,
    title: "Entreprises",
    description: "Trouvez l'agence parfaite pour vos projets.",
  },
  {
    icon: Briefcase,
    title: "Agences",
    description: "Trouvez les projets qui correspondent à votre expertise.",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Une collaboration transparente et en toute confiance.",
  },
];

const ADVANTAGES = [
  {
    icon: Target,
    title: "Matching intelligent",
    slug: "matching-intelligent",
    description:
      "Notre IA analyse vos besoins et votre expertise pour vous proposer les meilleurs partenaires ou projets.",
  },
  {
    icon: FileText,
    title: "Projets ciblés",
    slug: "projets-cibles",
    description:
      "Accédez à des projets qualifiés et pertinents, adaptés à vos compétences et à vos objectifs.",
  },
  {
    icon: Users,
    title: "Collaboration simplifiée",
    slug: "collaboration-simplifiee",
    description:
      "Outils intégrés pour gérer vos échanges, vos fichiers, et vos suivis de projet efficacement.",
  },
  {
    icon: Ban,
    title: "Zéro frais de dépôt",
    slug: "zero-frais-de-depot",
    description:
      "Aucun frais d'inscription ni frais de dépôt. Vous payez uniquement pour la réussite.",
  },
];

const TRUST_LOGOS = ["DECATHLON", "alan", "Qonto", "Doctolib", "BlaBlaCar", "leboncoin"];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader variant="landing" />

      <main className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <section className="pt-16 text-center sm:pt-20">
          <h1 className="mx-auto max-w-[640px] text-[38px] font-bold leading-[1.15] tracking-tight sm:text-[46px]">
            La plateforme B2B qui connecte vos projets aux meilleures agences.
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-6 text-foreground">
            Trouvez, collaborez et réussissez avec les agences les plus adaptées à vos besoins. Que
            vous soyez une entreprise ou une agence, Sortlist Pro simplifie chaque étape.
          </p>

          <div className="mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-8 text-left sm:grid-cols-3">
            {AUDIENCES.map((item) => (
              <div key={item.title} className="flex gap-3">
                <item.icon className="mt-0.5 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
                <div className="min-w-0">
                  <h2 className="text-[14px] font-bold">{item.title}</h2>
                  <p className="mt-1 text-[13.5px] leading-[1.45] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-20">
          <h2 className="text-center text-[16px] font-bold">Pourquoi choisir Sortlist Pro ?</h2>

          <div className="mt-8 grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((item, index) => (
              <article
                key={item.title}
                className={
                  index === 0
                    ? "flex flex-col p-6"
                    : "flex flex-col p-6 lg:border-l lg:border-border"
                }
              >
                <item.icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                <h3 className="mt-6 text-[15px] font-bold">{item.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.55] text-muted-foreground">
                  {item.description}
                </p>
                <Link
                  to="/fonctionnalites/$slug"
                  params={{ slug: item.slug }}
                  className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Découvrir plus
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-center text-[15px] font-bold">Ils nous font confiance</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {TRUST_LOGOS.map((logo) => (
              <span key={logo} className="text-[16px] font-semibold tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
