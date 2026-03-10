export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') {
    return "??"; // Valeur par défaut si pas de nom
  }

  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limite à 2 lettres max
}