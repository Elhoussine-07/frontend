/**
 * État vide générique — utilisé partout où le backend ne renvoie encore aucune donnée.
 * Aucun contenu fictif : le libellé est neutre.
 */
export function EmptyState({ message = "Aucune donnée à afficher." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-6 py-14">
      <p className="text-[15px] text-muted-foreground">{message}</p>
    </div>
  );
}
