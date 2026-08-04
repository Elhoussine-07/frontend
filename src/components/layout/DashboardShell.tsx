import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  Briefcase,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  ExternalLink,
  FileText,
  Folder,
  LayoutGrid,
  LogOut,
  Plus,
  PlayCircle,
  Send,
  Settings,
  Building2,
  User,
  Users,
  ShieldAlert,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { useAgencyStore } from "@/store/agency.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { getMyAgencies, requestToJoinAgency, searchAgencies } from "@/services/agencies.service";
import { switchAgency, logout } from "@/services/auth.service";
import { ApiError } from "@/services/http";
import { ActionModal } from "@/components/common/ActionModal";
import { TextField } from "@/components/common/Blocks";
import { Chatbot } from "@/components/common/Chatbot";
import { DemoGuide } from "@/components/common/DemoGuide";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const CLIENT_NAV: NavItem[] = [
  { label: "Tableau de bord", to: "/client/tableau-de-bord", icon: LayoutGrid },
  { label: "Mon profil", to: "/client/mon-profil", icon: User },
  { label: "Postuler un projet", to: "/client/postuler-un-projet", icon: Send },
  { label: "Mes projets", to: "/client/mes-projets", icon: Folder },
  { label: "Collaborations", to: "/client/collaborations", icon: Users },
  {
    label: "Historique des notifications",
    to: "/client/notifications",
    icon: Bell,
  },
  { label: "Paramètres", to: "/client/parametres", icon: Settings },
];

const AGENCY_NAV: NavItem[] = [
  { label: "Tableau de bord", to: "/agence/tableau-de-bord", icon: LayoutGrid },
  { label: "Opportunités", to: "/agence/opportunites", icon: Briefcase },
  { label: "Mes prospections", to: "/agence/mes-prospections", icon: Compass },
  { label: "Workflow", to: "/agence/workflow", icon: Workflow },
  { label: "Projets en cours", to: "/agence/projets-en-cours", icon: Folder },
  { label: "Suspension", to: "/agence/suspension", icon: ShieldAlert },
  { label: "Prospection", to: "/agence/prospection", icon: Users },
  { label: "Analytics", to: "/agence/analytics", icon: BarChart3 },
  { label: "Facturation", to: "/agence/facturation", icon: FileText },
  { label: "Profil agence", to: "/agence/profil", icon: Building2 },
  {
    label: "Historique des notifications",
    to: "/agence/notifications",
    icon: Bell,
  },
  { label: "Paramètres", to: "/agence/parametres", icon: Settings },
];

export function DashboardShell({ role, children }: { role: UserRole; children: ReactNode }) {
  const items = role === "client" ? CLIENT_NAV : AGENCY_NAV;
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // API CALL : GET /api/auth/me -> alimente le store utilisateur (aucune donnée en dur)
  const user = useAuthStore((state) => state.user);
  // API CALL : GET /api/notifications/unread-count -> { count: number }
  const unreadCount = useNotificationsStore((state) => state.unreadCount);

  // CDC module 5 : bouton "Démo / Découvrir la plateforme" accessible depuis
  // le dashboard, quel que soit le contexte d'agence actif.
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="truncate text-[24px] font-bold tracking-tight">
            Sortlist Pro
          </Link>

          <div className="flex shrink-0 items-center gap-4">
            <button
              onClick={() => setIsDemoOpen(true)}
              type="button"
              aria-label="Découvrir la plateforme"
              title="Découvrir la plateforme"
              className="text-foreground transition-opacity hover:opacity-70"
            >
              <PlayCircle className="h-[21px] w-[21px]" strokeWidth={1.6} />
            </button>

            <button
              onClick={() =>
                void navigate({
                  to: role === "client" ? "/client/notifications" : "/agence/notifications",
                })
              }
              type="button"
              aria-label="Notifications"
              className="relative text-foreground transition-opacity hover:opacity-70"
            >
              <Bell className="h-[21px] w-[21px]" strokeWidth={1.6} />
              {unreadCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[13px] font-semibold text-primary-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {role === "agency" ? (
              <>
                <span className="h-6 w-px bg-border" aria-hidden />
                <AgencySwitcher />
              </>
            ) : null}

            <span className="h-6 w-px bg-border" aria-hidden />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 text-left transition-opacity hover:opacity-80"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-[13px] font-semibold">
                    {user?.initials ?? ""}
                  </span>
                  <span className="hidden min-w-0 leading-tight sm:block">
                    <span className="block truncate text-[15px] font-semibold">
                      {user?.displayName ?? ""}
                    </span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {role === "client" ? "Client (Entreprise)" : "Agence"}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.displayName ?? "Mon compte"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2">
                  <Link to={role === "client" ? "/client/parametres" : "/agence/parametres"}>
                    <Settings className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    // Le JWT Frappe est sans état (pas de révocation serveur) :
                    // `logout()` vide juste le store local, cf. auth.service.ts.
                    void logout().finally(() => {
                      void navigate({ to: "/connexion" });
                    });
                  }}
                >
                  <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-[248px] shrink-0 flex-col justify-between px-4 py-6 lg:flex">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    isActive
                      ? "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-semibold text-foreground before:absolute before:-left-4 before:top-1 before:h-[calc(100%-8px)] before:w-[3px] before:rounded-full before:bg-primary"
                      : "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent"
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 px-3">
            <p className="flex items-center gap-2 text-[15px] font-semibold">
              <CircleHelp className="h-4 w-4" strokeWidth={1.7} />
              Besoin d'aide ?
            </p>
            <a
              href="/centre-aide"
              className="flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Consulter notre centre d'aide
              <ExternalLink className="h-3 w-3" strokeWidth={1.7} />
            </a>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <Chatbot />
      <DemoGuide accountType={role} open={isDemoOpen} onOpenChange={setIsDemoOpen} />
    </div>
  );
}

/**
 * Sélecteur d'agence (bascule multi-agences) + bouton "+" pour rejoindre une
 * agence — CDC §2.1.1. Visible uniquement pour les comptes Agence (rendu
 * conditionnel dans `DashboardShell`), affiché discrètement à côté du
 * nom/avatar dans le header. Réutilise les primitives shadcn déjà utilisées
 * ailleurs dans le repo (`DropdownMenu`, `ActionModal`).
 *
 * Branché sur `agencies.service.ts::getMyAgencies` (liste), `auth.service.ts::switchAgency`
 * (bascule — récupère et stocke un nouveau JWT scoped) et
 * `agencies.service.ts::requestToJoinAgency` (bouton "+"). L'agence active est
 * conservée dans `agency.store.ts` (`activeAgencyId`), consommée ensuite par
 * `profile.service.ts::getAgencyProfile`/`getAgencyDashboard`.
 */
function AgencySwitcher() {
  const queryClient = useQueryClient();
  const activeAgencyId = useAgencyStore((state) => state.activeAgencyId);
  const setActiveAgency = useAgencyStore((state) => state.setActiveAgency);
  const setAgencies = useAgencyStore((state) => state.setAgencies);

  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinQuery, setJoinQuery] = useState("");

  const { data: agencies } = useQuery({
    queryKey: ["agencies", "mine"],
    queryFn: getMyAgencies,
  });

  // Alimente le store (persisté) dès que la liste est connue, et choisit la
  // première agence comme agence active par défaut si aucune n'est encore
  // sélectionnée (premier chargement / nouvel appareil).
  useEffect(() => {
    if (!agencies) return;
    setAgencies(agencies);
    if (activeAgencyId === null && agencies.length > 0) {
      setActiveAgency(agencies[0]?.id ?? null);
    }
  }, [agencies, activeAgencyId, setAgencies, setActiveAgency]);

  const switchMutation = useMutation({
    mutationFn: switchAgency,
    onSuccess: (_result, agencyId) => {
      setActiveAgency(agencyId);
      // L'agence active a changé : tout ce qui dépendait de l'ancienne
      // (profil, dashboard, analytics...) doit être rechargé.
      void queryClient.invalidateQueries();
      toast("Agence changée", {
        description: agencies?.find((agency) => agency.id === agencyId)?.name,
      });
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Impossible de changer d'agence.");
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (query: string) => {
      const trimmed = query.trim();
      // Le champ accepte un nom (recherché via `agency.list_agencies`) ou un
      // identifiant d'agence saisi directement.
      const results = await searchAgencies({ query: trimmed, pageSize: 5 });
      const targetId = results.items[0]?.id ?? trimmed;
      return requestToJoinAgency(targetId);
    },
    onSuccess: () => {
      toast("Demande envoyée", {
        description: "Le propriétaire de l'agence doit approuver votre demande.",
      });
      setIsJoinOpen(false);
      setJoinQuery("");
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Envoi de la demande impossible.");
    },
  });

  const activeAgency = agencies?.find((agency) => agency.id === activeAgencyId) ?? agencies?.[0];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-accent"
          >
            <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.7} />
            <span className="hidden max-w-[140px] truncate sm:block">
              {activeAgency?.name ?? "Mes agences"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Vos agences</DropdownMenuLabel>
          {agencies === undefined || agencies.length === 0 ? (
            <p className="px-2 py-1.5 text-[13px] text-muted-foreground">Aucune agence trouvée.</p>
          ) : (
            agencies.map((agency) => (
              <DropdownMenuItem
                key={agency.id}
                onClick={() => {
                  if (agency.id !== activeAgencyId) {
                    switchMutation.mutate(agency.id);
                  }
                }}
                className="justify-between gap-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-semibold">
                    {agency.initials}
                  </span>
                  <span className="min-w-0 truncate">{agency.name}</span>
                </span>
                {agency.id === activeAgencyId ? (
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                ) : null}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsJoinOpen(true)} className="gap-2">
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
            Rejoindre une agence
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionModal
        open={isJoinOpen}
        onOpenChange={setIsJoinOpen}
        title="Rejoindre une agence"
        description="Envoyez une demande de rattachement au propriétaire de l'agence."
        confirmLabel={joinMutation.isPending ? "Envoi..." : "Envoyer la demande"}
        onConfirm={() => {
          if (joinQuery.trim()) {
            joinMutation.mutate(joinQuery);
          }
        }}
      >
        <TextField
          label="Nom ou identifiant de l'agence"
          value={joinQuery}
          onChange={(event) => setJoinQuery(event.target.value)}
        />
      </ActionModal>
    </>
  );
}
