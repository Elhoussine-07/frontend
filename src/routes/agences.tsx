import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, MapPin, Search, Star, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { CardGridSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import type { Agency } from "@/lib/types";
import { searchAgencies, type AgencySearchParams } from "@/services/agencies.service";
import { ApiError } from "@/services/http";
import { toast } from "sonner";

export const Route = createFileRoute("/agences")({
  head: () => ({
    meta: [
      { title: "Trouvez l'agence idéale — Sortlist Pro" },
      {
        name: "description",
        content:
          "Recherchez et comparez les agences par catégorie et sous-catégorie pour trouver le partenaire idéal de votre projet.",
      },
      { property: "og:title", content: "Trouvez l'agence idéale — Sortlist Pro" },
      {
        property: "og:description",
        content: "Recherchez et comparez les agences pour votre projet.",
      },
    ],
  }),
  component: SearchAgenciesPage,
});

const SORT_OPTIONS: Array<{ value: AgencySearchParams["sort"]; label: string }> = [
  { value: "relevance", label: "Pertinence" },
  { value: "rating", label: "Note" },
  { value: "recent", label: "Plus récentes" },
];

function SearchAgenciesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sort, setSort] = useState<AgencySearchParams["sort"]>("relevance");
  const [page, setPage] = useState(1);

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [foundCount, setFoundCount] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Débounce simple sur le texte libre : on ne relance pas la recherche à
  // chaque frappe, seulement 350ms après la dernière saisie.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      searchAgencies({
        ...(query ? { query } : {}),
        ...(category ? { category } : {}),
        ...(subCategory ? { subCategory } : {}),
        ...(sort ? { sort } : {}),
        page,
      })
        .then((result) => {
          setAgencies(result.items);
          setFoundCount(result.foundCount);
          setTotalPages(result.totalPages);
        })
        .catch((error: unknown) => {
          toast(error instanceof ApiError ? error.message : "Recherche d'agences impossible.");
          setAgencies([]);
          setFoundCount(0);
          setTotalPages(1);
        })
        .finally(() => setIsLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [query, category, subCategory, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [query, category, subCategory, sort]);

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader variant="search" active="agencies" />

      <main className="mx-auto max-w-[1080px] px-4 pb-16 sm:px-6 lg:px-8">
        <Link
          to="/postuler-un-projet"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="h-4 w-4" strokeWidth={1.8} />
          Postuler un projet
        </Link>

        <div className="mt-6 flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Décrivez le type d'agence que vous cherchez..."
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* TODO backend: aucun endpoint de taxonomie (catégories/sous-catégories)
              trouvé côté `platform_core` — filtres en texte libre en attendant. */}
          <FilterInput
            label="Catégorie"
            placeholder="Toutes les catégories"
            value={category}
            onChange={setCategory}
          />
          <FilterInput
            label="Sous-catégorie"
            placeholder="Toutes les sous-catégories"
            value={subCategory}
            onChange={setSubCategory}
          />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{foundCount ?? 0} agences trouvées</p>
          <label className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground">
            Trier par
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as AgencySearchParams["sort"])}
              className="bg-transparent text-foreground outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </label>
        </div>

        <section className="mt-6">
          {isLoading ? (
            <CardGridSkeleton count={8} />
          ) : agencies.length === 0 ? (
            <EmptyState message="Aucune agence à afficher." />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {agencies.map((agency) => (
                <article
                  key={agency.id}
                  className="flex flex-col rounded-lg border border-border p-5 transition-colors hover:bg-accent/40"
                >
                  <p className="text-[26px] font-bold tracking-tight">{agency.logoText}</p>
                  <h2 className="mt-3 text-[15px] font-bold">{agency.name}</h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                    {agency.location}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-muted-foreground">
                    {agency.description}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-[13.5px] font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    {agency.rating}
                    <span className="font-normal text-muted-foreground">
                      ({agency.reviewsCount} avis)
                    </span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Link
                      to="/agences/$id"
                      params={{ id: agency.id }}
                      className="rounded-md bg-primary px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Contacter
                    </Link>
                    <Link
                      to="/agences/$id"
                      params={{ id: agency.id }}
                      className="rounded-md border border-border px-4 py-2 text-[13.5px] font-semibold transition-colors hover:bg-accent"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </main>
    </div>
  );
}

function FilterInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-transparent text-left text-[14px] outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number | null;
  onChange: (page: number) => void;
}) {
  const pages = totalPages ?? 1;
  const visible = Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Précédent
      </button>

      {visible.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13.5px] font-semibold text-primary-foreground"
              : "flex h-7 w-7 items-center justify-center rounded-full text-[13.5px] transition-colors hover:bg-accent"
          }
        >
          {p}
        </button>
      ))}
      {pages > 5 ? (
        <>
          <span className="text-[13.5px] text-muted-foreground">...</span>
          <button
            type="button"
            onClick={() => onChange(pages)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[13.5px] transition-colors hover:bg-accent"
          >
            {pages}
          </button>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Suivant
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
      </button>
    </nav>
  );
}
