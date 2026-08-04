import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput, StatusTabs, StatusBadge } from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { useNotificationsStore } from "@/store/notifications.store";
import type { Notification } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import { getNotifications, markAllAsRead, markAsRead } from "@/services/notifications.service";
import { ApiError } from "@/services/http";

/**
 * Centre de notifications (Agence) — historique, filtres, statuts.
 * Copie structurelle exacte de `client.notifications.tsx` (CDC §7.3 : le
 * bouton "Historique des notifications" doit exister aussi bien côté
 * dashboard Entreprise que côté dashboard Agence) — seuls le rôle passé à
 * `DashboardShell` et les libellés changent.
 * // API CALL : notifications.service.ts::getNotifications — pas de
 * // paramètre `agencyContext` exposé aujourd'hui par ce service (propriété
 * // d'un autre agent, hors périmètre de cette page) : identique au
 * // comportement de `client.notifications.tsx`, alimenté par le même store
 * // partagé (`notifications.store.ts`), déjà cohérent avec la cloche du
 * // header quel que soit le rôle actif.
 */
export const Route = createFileRoute("/_authenticated/agence/notifications")({
  head: () => ({
    meta: [
      { title: "Historique des notifications — Sortlist Pro" },
      {
        name: "description",
        content:
          "Consultez l'historique complet des notifications de votre agence, filtrez par type et par statut.",
      },
      {
        property: "og:title",
        content: "Historique des notifications — Sortlist Pro",
      },
      {
        property: "og:description",
        content: "Centre de notifications de votre espace agence.",
      },
    ],
  }),
  component: AgencyNotificationsPage,
});

const TABS = [
  { value: "all", label: "Toutes" },
  { value: "unread", label: "Non lues" },
  { value: "read", label: "Lues" },
];

const PAGE_SIZE = 20;

function AgencyNotificationsPage() {
  const queryClient = useQueryClient();
  const setStoreNotifications = useNotificationsStore((state) => state.setNotifications);
  const setStoreUnreadCount = useNotificationsStore((state) => state.setUnreadCount);
  const setStoreLoading = useNotificationsStore((state) => state.setLoading);
  const notifications = useNotificationsStore((state) => state.notifications);

  // Le backend (`notification.list_active`) ne filtre/trie/pagine pas — on
  // récupère la liste complète une fois et on synchronise le store partagé
  // (utilisé aussi par `DashboardShell` pour le badge de notifications).
  const notificationsQuery = useQuery({
    queryKey: ["agency", "notifications"],
    queryFn: () => getNotifications(),
  });
  const isLoading = notificationsQuery.isPending;

  useEffect(() => {
    setStoreLoading(isLoading);
  }, [isLoading, setStoreLoading]);

  useEffect(() => {
    if (notificationsQuery.data) {
      const items = notificationsQuery.data.items;
      setStoreNotifications(items);
      setStoreUnreadCount(items.filter((item) => !item.read).length);
    }
  }, [notificationsQuery.data, setStoreNotifications, setStoreUnreadCount]);

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "notifications"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Impossible de marquer cette notification comme lue.",
      );
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "notifications"] });
      toast.success("Toutes les notifications ont été marquées comme lues");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Impossible de marquer les notifications comme lues.",
      );
    },
  });

  const COLUMNS: Column<Notification>[] = useMemo(
    () => [
      {
        key: "notification",
        header: "Notification",
        width: "minmax(0,2.4fr)",
        render: (notification) => (
          <div className="flex min-w-0 items-start gap-3">
            <Bell className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold">{notification.title}</p>
              <p className="truncate text-[13px] text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "status",
        header: "Statut",
        width: "minmax(0,1fr)",
        render: (notification) => <StatusBadge label={notification.read ? "Lue" : "Non lue"} />,
      },
      {
        key: "date",
        header: "Date",
        width: "minmax(0,1fr)",
        render: (notification) => (
          <p className="truncate text-[13px] text-muted-foreground">{notification.createdAt}</p>
        ),
      },
      {
        key: "action",
        header: "Action",
        width: "minmax(0,1fr)",
        render: (notification) =>
          notification.read ? (
            <span className="text-[13px] text-muted-foreground">—</span>
          ) : (
            <button
              onClick={() => markReadMutation.mutate(notification.id)}
              type="button"
              disabled={markReadMutation.isPending}
              className="rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Marquer comme lue
            </button>
          ),
      },
    ],
    [markReadMutation],
  );

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const unread = notifications.filter((item) => !item.read).length;
    return {
      all: notifications.length,
      unread,
      read: notifications.length - unread,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return notifications.filter((notification) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unread" && !notification.read) ||
        (activeTab === "read" && notification.read);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        notification.title.toLowerCase().includes(normalizedQuery) ||
        notification.description.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [notifications, activeTab, query]);

  const total = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Historique des notifications</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Retrouvez toutes les notifications reçues sur le compte de votre agence.
            </p>
          </div>
          <button
            onClick={() => markAllReadMutation.mutate()}
            type="button"
            disabled={markAllReadMutation.isPending || counts["unread"] === 0}
            className="flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:justify-self-end"
          >
            <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
            Tout marquer comme lu
          </button>
        </div>

        <div className="mt-7">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Rechercher une notification..."
          />
        </div>

        <div className="mt-6">
          <StatusTabs
            tabs={TABS}
            value={activeTab}
            onChange={(value) => {
              setActiveTab(value);
              setPage(1);
            }}
            counts={counts}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* API CALL : GET /api/notifications/types */}
          <FilterSelect label="Type" placeholder="Tous les types" />
          {/* Filtre période appliqué côté API : { period: "7d" | "30d" | "90d" | "all" } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
          {/* Filtre statut appliqué côté API : { unreadOnly: boolean } */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{total} notifications</p>
          <button
            onClick={() => uiAction("Trier par : Plus récentes")}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* TODO backend/frontend : `notification.list_active` ne trie pas
                côté serveur et `Notification.createdAt` n'est pas garanti
                trié — approximation risquée à corriger si le backend expose
                un vrai paramètre `sort`. Laissé en `uiAction`. */}
            Trier par : Plus récentes
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4">
          <DataTable columns={COLUMNS} rows={pagedNotifications} isLoading={isLoading} />
        </div>

        {/* TODO frontend : `ListPagination` (composant partagé `ListControls.tsx`,
            hors périmètre de cette page) n'expose pas de prop `onPageChange` —
            ses boutons restent des `uiAction` internes. */}
        <ListPagination page={currentPage} totalPages={totalPages} />
      </div>
    </DashboardShell>
  );
}
