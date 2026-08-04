import { toast } from "sonner";

/**
 * Point de branchement unique pour toutes les actions d'interface
 * qui ne sont pas encore reliées au backend.
 *
 * Chaque bouton de l'application appelle `uiAction("<libellé>")`.
 * Il suffit de remplacer l'appel par le service correspondant
 * (voir `src/services/*.service.ts`) le jour du branchement API.
 *
 * // API CALL: remplacer par le service métier associé au libellé.
 */
export function uiAction(label: string) {
  // API CALL: brancher ici l'appel réel (service + store Zustand).
  toast(label, {
    description: "Action prête — en attente du branchement API.",
  });
}
