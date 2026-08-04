import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  SearchInput,
  StatCard,
  StatGrid,
  StatusBadge,
  StatusTabs,
} from "@/components/common/Blocks";
import { FilterSelect, ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatSkeleton } from "@/components/common/Skeletons";
import type { Invoice } from "@/lib/types";
import { uiAction } from "@/lib/ui-actions";
import { downloadInvoice, getInvoices, getInvoicesSummary } from "@/services/invoices.service";
import { ApiError } from "@/services/http";
import { useInvoicesStore } from "@/store/invoices.store";

/** Facturation (Agence) — factures émises / reçues, filtres, téléchargement. */
export const Route = createFileRoute("/_authenticated/agence/facturation")({
  head: () => ({
    meta: [
      { title: "Facturation — Sortlist Pro" },
      {
        name: "description",
        content:
          "Suivez vos factures émises et reçues, filtrez par statut et téléchargez vos documents.",
      },
      { property: "og:title", content: "Facturation — Sortlist Pro" },
      {
        property: "og:description",
        content: "Factures et paiements de votre agence.",
      },
    ],
  }),
  component: AgencyInvoicingPage,
});

const TABS = [
  { value: "issued", label: "Émises" },
  { value: "received", label: "Reçues" },
  { value: "paid", label: "Payées" },
  { value: "late", label: "En retard" },
];

function buildColumns(
  onDownload: (invoice: Invoice) => void,
  downloadingId: string | null,
): Column<Invoice>[] {
  return [
    {
      key: "invoice",
      header: "Facture",
      width: "minmax(0,2.2fr)",
      render: (invoice) => (
        <div className="flex min-w-0 items-start gap-3">
          <FileText className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold">{invoice.projectTitle}</p>
            <p className="truncate text-[13px] text-muted-foreground">{invoice.companyName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Montant",
      render: (invoice) => <p className="truncate text-[13px] font-semibold">{invoice.amount}</p>,
    },
    {
      key: "issuedAt",
      header: "Émise le",
      render: (invoice) => (
        <p className="truncate text-[13px] text-muted-foreground">{invoice.issuedAt}</p>
      ),
    },
    {
      key: "dueAt",
      header: "Échéance",
      render: (invoice) => (
        <p className="truncate text-[13px] text-muted-foreground">{invoice.dueAt}</p>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (invoice) => <StatusBadge label={invoice.statusLabel} />,
    },
    {
      key: "action",
      header: "Action",
      render: (invoice) => (
        <button
          type="button"
          onClick={() => onDownload(invoice)}
          disabled={downloadingId === invoice.id}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-accent disabled:opacity-60"
        >
          <Download className="h-3 w-3" strokeWidth={1.8} />
          {downloadingId === invoice.id ? "Téléchargement..." : "Télécharger"}
        </button>
      ),
    },
  ];
}

/**
 * Le backend (`payment.list_invoices`) ne distingue pas "émises" vs "reçues"
 * (pas de champ de direction confirmé sur `Invoice`) — seul le statut
 * (paid/to_pay/late) est fiable. Les onglets "Émises"/"Reçues" affichent donc
 * la même liste complète, faute de mieux ; "Payées"/"En retard" filtrent
 * réellement par statut.
 */
function filterByTab(invoices: Invoice[], tab: string): Invoice[] {
  if (tab === "paid") return invoices.filter((invoice) => invoice.status === "paid");
  if (tab === "late") return invoices.filter((invoice) => invoice.status === "late");
  return invoices;
}

function AgencyInvoicingPage() {
  const [page] = useState(1);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("issued");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const storeInvoices = useInvoicesStore((state) => state.invoices);
  const setStoreInvoices = useInvoicesStore((state) => state.setInvoices);
  const setStoreSummary = useInvoicesStore((state) => state.setSummary);
  const setStoreLoading = useInvoicesStore((state) => state.setLoading);
  const totalPaidStore = useInvoicesStore((state) => state.totalPaid);

  const invoicesQuery = useQuery({
    queryKey: ["agency", "invoices", "all"],
    queryFn: () => getInvoices({ status: "all", page, pageSize: 100 }),
  });
  const summaryQuery = useQuery({
    queryKey: ["agency", "invoices", "summary"],
    queryFn: getInvoicesSummary,
  });

  // Le store `useInvoicesStore` (déjà présent dans le repo mais jusqu'ici
  // inutilisé au profit d'un `useState` local) est la source de vérité — on
  // l'alimente à chaque succès de requête plutôt que de garder les données
  // uniquement dans le cache React Query.
  useEffect(() => {
    setStoreLoading(invoicesQuery.isLoading);
    if (invoicesQuery.data) setStoreInvoices(invoicesQuery.data.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesQuery.data, invoicesQuery.isLoading]);

  useEffect(() => {
    if (summaryQuery.data) setStoreSummary(summaryQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryQuery.data]);

  const isLoading = invoicesQuery.isLoading;
  const isSummaryLoading = summaryQuery.isLoading;

  const tabFiltered = filterByTab(storeInvoices, activeTab);
  const invoices = query.trim()
    ? tabFiltered.filter((invoice) =>
        `${invoice.projectTitle} ${invoice.companyName}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : tabFiltered;

  const counts: Record<string, number> = {
    issued: storeInvoices.length,
    received: storeInvoices.length,
    paid: storeInvoices.filter((invoice) => invoice.status === "paid").length,
    late: storeInvoices.filter((invoice) => invoice.status === "late").length,
  };

  const totalLate = storeInvoices
    .filter((invoice) => invoice.status === "late")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalIssued = storeInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const summary = {
    totalIssued,
    totalReceived: totalIssued,
    totalPaid: totalPaidStore,
    totalLate,
  };

  async function handleDownload(invoice: Invoice) {
    setDownloadingId(invoice.id);
    try {
      const blob = await downloadInvoice(invoice.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = invoice.invoiceNumber ?? invoice.id;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Téléchargement impossible.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="text-[24px] font-bold tracking-tight">Facturation</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Suivez vos paiements et téléchargez vos factures.
        </p>

        <section className="mt-7">
          {isSummaryLoading ? (
            <StatSkeleton count={4} />
          ) : (
            <StatGrid>
              <StatCard
                icon={FileText}
                label="Total émis"
                value={summary.totalIssued === null ? "—" : String(summary.totalIssued)}
              />
              <StatCard
                icon={FileText}
                label="Total reçu"
                value={summary.totalReceived === null ? "—" : String(summary.totalReceived)}
              />
              <StatCard
                icon={FileText}
                label="Total payé"
                value={summary.totalPaid === null ? "—" : String(summary.totalPaid)}
              />
              <StatCard
                icon={FileText}
                label="En retard"
                value={summary.totalLate === null ? "—" : String(summary.totalLate)}
              />
            </StatGrid>
          )}
        </section>

        <div className="mt-7">
          <SearchInput value={query} onChange={setQuery} placeholder="Rechercher une facture..." />
        </div>

        <div className="mt-6">
          <StatusTabs tabs={TABS} value={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Filtre statut côté API : { status: "paid" | "to_pay" | "late" } */}
          <FilterSelect label="Statut" placeholder="Tous les statuts" />
          {/* Filtre période côté API : { period } */}
          <FilterSelect label="Période" placeholder="Toutes les périodes" />
          {/* API CALL : GET /api/invoices/clients */}
          <FilterSelect label="Client" placeholder="Tous les clients" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="truncate text-[14px] font-semibold">{counts[activeTab] ?? 0} factures</p>
          <button
            onClick={() => uiAction("Trier par : Plus récentes")}
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* API CALL : GET /api/invoices?sort=recent|amount|due */}
            Trier par : Plus récentes
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4">
          <DataTable
            columns={buildColumns(handleDownload, downloadingId)}
            rows={invoices}
            isLoading={isLoading}
          />
        </div>

        <ListPagination page={page} totalPages={1} />
      </div>
    </DashboardShell>
  );
}
