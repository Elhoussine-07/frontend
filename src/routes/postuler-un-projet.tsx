import { createFileRoute } from "@tanstack/react-router";
import { SmartBriefing } from "@/components/briefing/SmartBriefing";

/** Écrans 04a / 04b — SMART BRIEFING IA (parcours public : "Postuler un projet"). */
export const Route = createFileRoute("/postuler-un-projet")({
  head: () => ({
    meta: [
      { title: "Postuler un projet — Sortlist Pro" },
      {
        name: "description",
        content:
          "Décrivez votre besoin avec le Smart Briefing IA et générez votre cahier des charges en cinq étapes.",
      },
      { property: "og:title", content: "Postuler un projet — Sortlist Pro" },
      {
        property: "og:description",
        content: "Décrivez votre besoin avec le Smart Briefing IA.",
      },
    ],
  }),
  component: ApplyProjectPage,
});

function ApplyProjectPage() {
  return <SmartBriefing />;
}
