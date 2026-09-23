export type ScoreTier = "good" | "medium" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 70) return "good";
  if (score >= 40) return "medium";
  return "low";
}

const TIER_COLOR_VAR: Record<ScoreTier, string> = {
  good: "var(--secondary)",
  medium: "var(--accent)",
  low: "var(--primary)",
};

export function getScoreColorVar(score: number): string {
  return TIER_COLOR_VAR[getScoreTier(score)];
}

const TIER_LABEL: Record<ScoreTier, string> = {
  good: "Bel équilibre",
  medium: "Sur la bonne voie",
  low: "Belle base à enrichir",
};

export function getScoreLabel(score: number): string {
  return TIER_LABEL[getScoreTier(score)];
}

const TIER_FIT_LABEL: Record<ScoreTier, string> = {
  good: "Très adaptée à votre profil",
  medium: "Plutôt adaptée à votre profil",
  low: "Peut être ajustée à votre profil",
};

export function getFitScoreLabel(score: number): string {
  return TIER_FIT_LABEL[getScoreTier(score)];
}

const TIER_SUMMARY: Record<ScoreTier, string> = {
  good: "Un repas complet et bien équilibré.",
  medium: "Un bon repas, avec quelques pistes pour aller plus loin.",
  low: "Une base à enrichir avec quelques ajouts simples.",
};

export function getScoreSummary(score: number): string {
  return TIER_SUMMARY[getScoreTier(score)];
}
