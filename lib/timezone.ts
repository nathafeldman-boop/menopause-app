// L'application ne cible que des utilisatrices en France : toute logique de "jour"/"heure
// actuelle" doit refléter l'heure de Paris, pas l'heure du serveur (Vercel exécute en UTC), sous
// peine d'un décalage de 1-2h autour de minuit (mauvais jour de la semaine, check-in daté sur la
// mauvaise journée, notification du soir qui se déclenche au mauvais moment).
const APP_TIMEZONE = "Europe/Paris";

const WEEKDAY_NAMES_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function parisDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hour = get("hour");
  return { year: get("year"), month: get("month"), day: get("day"), hour: hour === 24 ? 0 : hour };
}

export function todayWeekdayNameParis(date: Date = new Date()): string {
  const { year, month, day } = parisDateParts(date);
  return WEEKDAY_NAMES_FR[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

export function todayDateStringParis(date: Date = new Date()): string {
  const { year, month, day } = parisDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function currentHourParis(date: Date = new Date()): number {
  return parisDateParts(date).hour;
}

/** Instant UTC (ISO) correspondant à minuit à Paris pour la date donnée — utile pour filtrer des
 * colonnes timestamptz ("created_at >= début de journée à Paris"). Calcule le décalage horaire
 * réel (CET +1 / CEST +2) sans dépendance externe : devine minuit UTC puis corrige par l'heure
 * Paris que cet instant donne réellement. */
export function startOfDayParisIso(date: Date = new Date()): string {
  const { year, month, day } = parisDateParts(date);
  const guess = Date.UTC(year, month - 1, day, 0, 0, 0);
  const offsetHours = parisDateParts(new Date(guess)).hour;
  return new Date(guess - offsetHours * 60 * 60 * 1000).toISOString();
}

function mondayOfWeekUtcParts(date: Date) {
  const { year, month, day } = parisDateParts(date);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = dimanche
  const isoWeekday = (weekdayIndex + 6) % 7; // 0 = lundi
  return new Date(Date.UTC(year, month - 1, day - isoWeekday));
}

/** Date (YYYY-MM-DD) du lundi de la semaine ISO courante à Paris — pour comparer à une colonne
 * `date` (ex: progress_date), jamais à une colonne timestamptz (utiliser startOfWeekParisIso). */
export function startOfWeekDateStringParis(date: Date = new Date()): string {
  const monday = mondayOfWeekUtcParts(date);
  return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, "0")}-${String(monday.getUTCDate()).padStart(2, "0")}`;
}

/** Même principe que startOfDayParisIso, mais pour le lundi de la semaine ISO courante à Paris. */
export function startOfWeekParisIso(date: Date = new Date()): string {
  const monday = mondayOfWeekUtcParts(date);
  const mondayGuess = monday.getTime();
  const offsetHours = parisDateParts(new Date(mondayGuess)).hour;
  return new Date(mondayGuess - offsetHours * 60 * 60 * 1000).toISOString();
}
