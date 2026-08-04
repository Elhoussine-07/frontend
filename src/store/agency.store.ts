import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgencyMembership {
  id: string;
  initials: string;
  name: string;
  tagline: string;
  membership: "owner" | "member";
}

interface AgencyState {
  activeAgencyId: string | null;
  agencies: AgencyMembership[];
  setActiveAgency: (agencyId: string | null) => void;
  setAgencies: (agencies: AgencyMembership[]) => void;
}

/**
 * Store de l'agence active pour les comptes multi-agences (CDC §2.1.1 —
 * sélecteur d'agence / bascule).
 *
 * Persisté en localStorage (clé "agency-storage") comme `auth.store.ts`, pour
 * que l'agence active survive à un rafraîchissement de page. `agencies`
 * (liste des agences accessibles) est aussi persisté pour un premier rendu
 * sans latence, mais reste rafraîchi à chaque `getMyAgencies()`.
 */
export const useAgencyStore = create<AgencyState>()(
  persist(
    (set) => ({
      activeAgencyId: null,
      agencies: [],
      setActiveAgency: (agencyId) => set({ activeAgencyId: agencyId }),
      setAgencies: (agencies) => set({ agencies }),
    }),
    {
      name: "agency-storage",
      partialize: (state) => ({
        activeAgencyId: state.activeAgencyId,
        agencies: state.agencies,
      }),
    },
  ),
);
