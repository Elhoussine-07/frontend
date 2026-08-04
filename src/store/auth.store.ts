import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  /**
   * Définit token + user + role en une seule mise à jour atomique.
   *
   * À utiliser uniquement après une connexion RÉELLEMENT réussie. Ne jamais
   * appeler `setToken` / `setUser` / `setRole` séparément avant d'avoir
   * validé la réponse : un état partiel écrit dans le store est aussitôt
   * persisté en localStorage (cf. `partialize` ci-dessous), et peut ensuite
   * faire croire à l'app qu'un utilisateur est connecté (avec le mauvais
   * rôle) alors que la connexion avait en réalité été refusée côté UI.
   */
  setSession: (session: { token: string; user: User; role: UserRole }) => void;
  reset: () => void;
}

/**
 * Persisté en localStorage (clé "auth-storage") pour que la session survive à un
 * rafraîchissement de page. Seuls `token`/`user`/`role` sont persistés
 * (`partialize`) — `isLoading`/`error` restent éphémères.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSession: ({ token, user, role }) => set({ token, user, role, error: null }),
      reset: () => set({ user: null, token: null, role: null, error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
      }),
    },
  ),
);
