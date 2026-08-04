import { createFileRoute } from "@tanstack/react-router";
import { SmartBriefing } from "@/components/briefing/SmartBriefing";

/** Écrans 04a / 04b — SMART BRIEFING IA depuis l'espace Client connecté. */
export const Route = createFileRoute("/_authenticated/client/postuler-un-projet")({
  head: () => ({
    meta: [
      { title: "Postuler un projet — Sortlist Pro" },
      {
        name: "description",
        content:
          "Déposez un nouveau projet : le Smart Briefing IA structure votre cahier des charges en cinq étapes.",
      },
      { property: "og:title", content: "Postuler un projet — Sortlist Pro" },
      {
        property: "og:description",
        content: "Déposez un nouveau projet et trouvez les meilleures agences.",
      },
    ],
  }),
  component: ClientApplyPage,
});

function ClientApplyPage() {
  return <SmartBriefing />;
}
