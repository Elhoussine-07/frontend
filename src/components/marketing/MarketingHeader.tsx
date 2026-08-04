import { Link } from "@tanstack/react-router";
import { CircleUserRound, Menu } from "lucide-react";
import { uiAction } from "@/lib/ui-actions";
import { useAuthStore } from "@/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Variant = "landing" | "search";

interface MarketingHeaderProps {
  variant?: Variant;
  /** Onglet actif de la barre de recherche (variant "search") */
  active?: "agencies" | "projects" | null;
  /** Le CTA "Postuler un projet" est estompé sur l'écran 01d (côté Agence) */
  applyDisabled?: boolean;
}

export function MarketingHeader({
  variant = "landing",
  active = null,
  applyDisabled = false,
}: MarketingHeaderProps) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const dashboardPath = role === "agency" ? "/agence/tableau-de-bord" : "/client/tableau-de-bord";

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-[22px] font-bold tracking-tight shrink-0">
          Sortlist Pro
        </Link>

        {variant === "landing" ? (
          <>
            <nav className="ml-8 hidden items-center gap-6 lg:flex">
              <Link
                to="/fonctionnalites/$slug"
                params={{ slug: "matching-intelligent" }}
                className="text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                Fonctionnalités
              </Link>
              {/* Maquette non fournie pour "Comment ça marche" et "À propos" :
                  les libellés sont conservés, la cible reste à définir. */}
              <button
                onClick={() => uiAction("Comment ça marche")}
                type="button"
                className="text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                Comment ça marche
              </button>
              <button
                onClick={() => uiAction("À propos")}
                type="button"
                className="text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                À propos
              </button>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/agences"
                className="hidden rounded-md border border-border px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-accent sm:inline-flex"
              >
                Trouvez l'agence idéale
              </Link>
              <Link
                to="/projets"
                className="hidden rounded-md border border-border px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-accent sm:inline-flex"
              >
                Trouvez le projet idéal
              </Link>
              <Link
                to="/postuler-un-projet"
                className="rounded-md bg-primary px-3 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Postuler un projet
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav className="ml-6 hidden items-center gap-2 md:flex">
              <Link
                to="/agences"
                className={
                  active === "agencies"
                    ? "rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground"
                    : "rounded-md px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-accent"
                }
              >
                Trouvez l'agence idéale
              </Link>
              <Link
                to="/projets"
                className={
                  active === "projects"
                    ? "rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground"
                    : "rounded-md px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-accent"
                }
              >
                Trouvez le projet idéal
              </Link>
            </nav>

            <div className="ml-auto flex items-center gap-4">
              {applyDisabled ? (
                <span className="hidden cursor-not-allowed items-center rounded-md px-4 py-2 text-[14px] font-semibold text-muted-foreground/50 sm:inline-flex">
                  Postuler un projet
                </span>
              ) : (
                <Link
                  to="/postuler-un-projet"
                  className="hidden rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
                >
                  Postuler un projet
                </Link>
              )}
              <Link
                to={token ? dashboardPath : "/connexion"}
                aria-label="Mon compte"
                className="text-foreground transition-opacity hover:opacity-70"
              >
                <CircleUserRound className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </Link>
              {/* Menu mobile : les liens "Trouvez l'agence/le projet idéal" sont
                  masqués sous md (nav ci-dessus, `hidden md:flex`) — ce bouton
                  les rend accessibles sur petit écran plutôt que de rester un
                  mock, cf. correctif "Menu" signalé en test réel. */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Menu"
                    className="text-foreground transition-opacity hover:opacity-70 md:hidden"
                  >
                    <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/agences">Trouvez l'agence idéale</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/projets">Trouvez le projet idéal</Link>
                  </DropdownMenuItem>
                  {!applyDisabled ? (
                    <DropdownMenuItem asChild>
                      <Link to="/postuler-un-projet">Postuler un projet</Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem asChild>
                    <Link to={token ? dashboardPath : "/connexion"}>
                      {token ? "Mon tableau de bord" : "Se connecter"}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
