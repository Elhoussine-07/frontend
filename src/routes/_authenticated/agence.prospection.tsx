import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Compass, Sparkles, ThermometerSun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  SearchInput,
  SectionCard,
  StatCard,
  StatGrid,
  StatusBadge,
  StatusTabs,
} from "@/components/common/Blocks";
import { ListPagination } from "@/components/common/ListControls";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatSkeleton } from "@/components/common/Skeletons";
import { ActionModal } from "@/components/common/ActionModal";
import { TextAreaField, TextField } from "@/components/common/Blocks";
import type { Lead } from "@/services/prospection.service";
import {
  generateProspectionEmail,
  getLeads,
  getProspectionSettings,
  sendProspectionEmail,
} from "@/services/prospection.service";
import { ApiError } from "@/services/http";

/** Prospection IA (Agence) — suggestions intelligentes de clients. */
export const Route = createFileRoute("/_authenticated/agence/prospection")({
  head: () => ({
    meta: [
      { title: "Prospection IA — Sortlist Pro" },
      {
        name: "description",
        content:
          "Découvrez les prospects suggérés par l'IA, leur score d'intérêt et générez vos e-mails de contact.",
      },
      { property: "og:title", content: "Prospection IA — Sortlist Pro" },
      {
        property: "og:description",
        content: "Suggestions intelligentes de clients pour votre agence.",
      },
    ],
  }),
  component: AgencyProspectionPage,
});

function buildColumns(
  onGenerateEmail: (lead: Lead) => void,
  generatingId: string | null,
): Column<Lead>[] {
  return [
    {
      key: "lead",
      header: "Prospect",
      width: "minmax(0,2.2fr)",
      render: (lead) => (
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-[13px] font-semibold">
            {lead.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold">{lead.companyName}</p>
            <p className="truncate text-[13px] text-muted-foreground">{lead.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Signaux détectés",
      width: "minmax(0,1.6fr)",
      render: (lead) => (
        <p className="truncate text-[13px] text-muted-foreground">{lead.actions.join(" · ")}</p>
      ),
    },
    {
      key: "temperature",
      header: "Température",
      render: (lead) => <StatusBadge label={lead.temperatureLabel} />,
    },
    {
      key: "score",
      header: "Score",
      render: (lead) => <p className="truncate text-[13px] font-semibold">{lead.score}/100</p>,
    },
    {
      key: "action",
      header: "Action",
      render: (lead) => (
        <button
          type="button"
          onClick={() => onGenerateEmail(lead)}
          disabled={generatingId === lead.id}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Sparkles className="h-3 w-3" strokeWidth={1.8} />
          {generatingId === lead.id ? "Génération..." : "Générer l'e-mail"}
        </button>
      ),
    },
  ];
}

function AgencyProspectionPage() {
  const [query, setQuery] = useState("");
  const [temperature, setTemperature] = useState("all");
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailTarget, setEmailTarget] = useState<Lead | null>(null);
  const [page] = useState(1);

  const leadsQuery = useQuery({
    queryKey: ["agency", "prospection", "leads", temperature],
    queryFn: () =>
      getLeads(
        temperature === "all"
          ? { page, pageSize: 50 }
          : { page, pageSize: 50, temperature: temperature as "hot" | "warm" | "cold" },
      ),
  });
  const allLeads = leadsQuery.data?.items ?? [];
  const isLoading = leadsQuery.isLoading;
  const counters = leadsQuery.data?.counters ?? { hot: null, warm: null, cold: null };
  const isCountersLoading = leadsQuery.isLoading;
  const totalPages = null;

  const settingsQuery = useQuery({
    queryKey: ["agency", "prospection", "settings"],
    queryFn: getProspectionSettings,
  });

  const leads = query.trim()
    ? allLeads.filter((lead) => lead.companyName.toLowerCase().includes(query.trim().toLowerCase()))
    : allLeads;

  const counts: Record<string, number> = {
    all: allLeads.length,
    hot: counters.hot ?? 0,
    warm: counters.warm ?? 0,
    cold: counters.cold ?? 0,
  };

  const generateEmailMutation = useMutation({
    mutationFn: generateProspectionEmail,
    onSuccess: (result) => {
      setEmailSubject(result.subject);
      setEmailBody(result.body);
      setIsEmailOpen(true);
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Génération de l'e-mail impossible.");
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: () => {
      if (!emailTarget) throw new Error("Aucun prospect sélectionné.");
      return sendProspectionEmail(emailTarget.id, { subject: emailSubject, body: emailBody });
    },
    onSuccess: () => {
      toast("E-mail envoyé", { description: emailTarget?.companyName });
      setIsEmailOpen(false);
      setEmailTarget(null);
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Envoi de l'e-mail impossible.");
    },
  });

  return (
    <DashboardShell role="agency">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-start gap-3">
          <Compass className="mt-1 h-[22px] w-[22px] shrink-0" strokeWidth={1.6} />
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight">Prospection IA</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Prospects suggérés par l'IA à partir des signaux d'intérêt.
            </p>
          </div>
        </div>

        <section className="mt-7">
          {isCountersLoading ? (
            <StatSkeleton count={3} />
          ) : (
            <StatGrid>
              <StatCard
                icon={ThermometerSun}
                label="Prospects chauds"
                value={counters.hot === null ? "—" : String(counters.hot)}
              />
              <StatCard
                icon={ThermometerSun}
                label="Prospects tièdes"
                value={counters.warm === null ? "—" : String(counters.warm)}
              />
              <StatCard
                icon={ThermometerSun}
                label="Prospects froids"
                value={counters.cold === null ? "—" : String(counters.cold)}
              />
            </StatGrid>
          )}
        </section>

        <div className="mt-7">
          <SearchInput value={query} onChange={setQuery} placeholder="Rechercher un prospect..." />
        </div>

        <div className="mt-6">
          <StatusTabs
            tabs={[
              { value: "all", label: "Tous" },
              { value: "hot", label: "Chauds" },
              { value: "warm", label: "Tièdes" },
              { value: "cold", label: "Froids" },
            ]}
            value={temperature}
            onChange={setTemperature}
            counts={counts}
          />
        </div>

        <div className="mt-6">
          <DataTable
            columns={buildColumns(
              (lead) => {
                setEmailTarget(lead);
                generateEmailMutation.mutate(lead.id);
              },
              generateEmailMutation.isPending ? (generateEmailMutation.variables ?? null) : null,
            )}
            rows={leads}
            isLoading={isLoading}
          />
        </div>

        <ListPagination page={page} totalPages={totalPages} />

        <section className="mt-9">
          <SectionCard
            title="Paramètres de scoring"
            description="Seuils utilisés par l'IA pour qualifier les prospects."
          >
            {/*
              TODO backend: `prospection.service.ts::getProspectionSettings` n'a
              qu'une lecture confirmée (`prospection.get_scoring_rules`) — pas
              d'endpoint PUT identifié côté `prospection-service`. Champs affichés
              en lecture seule en attendant.
            */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                label="Seuil « chaud » (score minimum)"
                value={settingsQuery.data ? String(settingsQuery.data.scoring.hotMin) : ""}
                readOnly
                onChange={() => {}}
              />
              <TextField
                label="Seuil « tiède » (score minimum)"
                value={settingsQuery.data ? String(settingsQuery.data.scoring.warmMin) : ""}
                readOnly
                onChange={() => {}}
              />
            </div>
          </SectionCard>
        </section>
      </div>

      <ActionModal
        open={isEmailOpen}
        onOpenChange={(open) => {
          setIsEmailOpen(open);
          if (!open) setEmailTarget(null);
        }}
        title="E-mail de prospection"
        description="Généré par l'IA à partir des signaux du prospect."
        confirmLabel={sendEmailMutation.isPending ? "Envoi..." : "Envoyer"}
        onConfirm={() => sendEmailMutation.mutate()}
      >
        <div className="space-y-4">
          <TextField
            label="Objet"
            value={emailSubject}
            onChange={(event) => setEmailSubject(event.target.value)}
          />
          <TextAreaField
            label="Message"
            rows={6}
            value={emailBody}
            onChange={(event) => setEmailBody(event.target.value)}
          />
        </div>
      </ActionModal>
    </DashboardShell>
  );
}
