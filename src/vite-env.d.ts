/// <reference types="vite/client" />

/**
 * Variables d'environnement Vite exposées côté client (préfixe VITE_).
 * Voir `.env.example` à la racine du projet.
 */
interface ImportMetaEnv {
  /** Base URL unique du Gateway (Spring Cloud Gateway) — Frappe + microservices. */
  readonly VITE_GATEWAY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
