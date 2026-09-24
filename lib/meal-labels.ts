export const FLAG_LABELS: Record<string, string> = {
  present: "Présent",
  absent: "Absent",
  unclear: "Difficile à évaluer",
};

export const LEVEL_LABELS: Record<string, string> = {
  low: "Faible",
  moderate: "Modéré",
  high: "Élevé",
  unclear: "Difficile à évaluer",
};

import { currentHourParis } from "./timezone";

export function getMealTimeLabel(isoDate: string): string {
  const hour = currentHourParis(new Date(isoDate));
  if (hour < 11) return "Petit-déjeuner";
  if (hour < 15) return "Déjeuner";
  if (hour < 19) return "Goûter";
  return "Dîner";
}

export function formatMealTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}
