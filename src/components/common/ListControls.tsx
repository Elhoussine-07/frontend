import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { uiAction } from "@/lib/ui-actions";

/**
 * Contrôles de liste réutilisables (filtres / pagination) —
 * mêmes styles que les écrans de recherche des maquettes.
 */

export function FilterSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <button
        onClick={() => uiAction("Ouvrir le filtre")}
        type="button"
        className="mt-1 flex w-full items-center justify-between gap-2 text-left text-[14px] transition-colors hover:text-muted-foreground"
      >
        {placeholder}
        <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      </button>
    </div>
  );
}

export function ListPagination({ page, totalPages }: { page: number; totalPages: number | null }) {
  const pages = totalPages ?? 1;
  const visible = Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => uiAction("Précédent")}
        type="button"
        disabled={page === 1}
        className="flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Précédent
      </button>

      {visible.map((p) => (
        <button
          onClick={() => uiAction("Changer de page")}
          key={p}
          type="button"
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
            onClick={() => uiAction("Page suivante")}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[13.5px] transition-colors hover:bg-accent"
          >
            {pages}
          </button>
        </>
      ) : null}

      <button
        onClick={() => uiAction("= pages} className=flex items-center gap-1.5 text-[13.5px] ")}
        type="button"
        disabled={totalPages === null || page >= pages}
        className="flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        Suivant
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
      </button>
    </nav>
  );
}
