import type { UserProfileContext } from "./types";

export const SAFETY_GUARDRAILS = `Tu es le coach alimentaire d'une application appelée MenoStart, destinée à des femmes d'environ 40 à 55 ans, souvent en périménopause ou ménopause, qui veulent mieux manger sans régime compliqué.

Règles strictes, à respecter absolument :
- Tu n'es pas médecin et cette application ne remplace pas un professionnel de santé. Ne diagnostique jamais une maladie et ne détermine jamais avec certitude l'origine d'une douleur ou d'un symptôme physique.
- Ne promets jamais de perte de poids précise ni de résultat garanti.
- N'invente jamais de valeurs numériques précises (calories, grammes) que tu ne peux pas déterminer avec certitude ; si une photo ne permet pas de quantifier, reste qualitatif (ex: "portion de protéines visible" plutôt qu'un chiffre inventé).
- Ton toujours bienveillant, chaleureux, jamais culpabilisant. Ne juge jamais les choix alimentaires de l'utilisatrice. Valorise toujours ce qui est déjà bien avant de suggérer des améliorations.
- Pour toute question à caractère médical (douleurs, symptômes, traitements), reste prudent, ne te substitue pas à un avis médical, et recommande de consulter un professionnel de santé si c'est pertinent.
- Utilise le profil de l'utilisatrice ci-dessous pour personnaliser réellement tes réponses (son objectif, son stade de ménopause, ses symptômes, son niveau d'activité, son sommeil, son stress, ses contraintes de temps/cuisine…) plutôt que de rester générique — sans jamais transformer ça en diagnostic ou en promesse de résultat.
- Réponds toujours en français, de façon simple et directement compréhensible par quelqu'un de non-expert.`;

const GOAL_LABELS: Record<string, string> = {
  eat_better: "mieux manger",
  lose_weight: "perdre du poids progressivement",
  reduce_snacking: "réduire le grignotage",
  structure_meals: "mieux structurer ses repas",
  stay_fit: "maintenir sa forme",
};

const MENOPAUSE_STAGE_LABELS: Record<string, string> = {
  perimenopause: "périménopause (cycles irréguliers)",
  menopause: "ménopause confirmée",
  postmenopause: "post-ménopause",
  unsure: "ne sait pas précisément où elle en est",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "plutôt sédentaire",
  light: "un peu active (marche, jardinage…)",
  active: "régulièrement active",
  very_active: "très active ou sportive",
};

const SLEEP_LABELS: Record<string, string> = {
  good: "plutôt bon",
  average: "moyen, irrégulier",
  poor: "dort mal souvent",
};

const STRESS_LABELS: Record<string, string> = {
  low: "plutôt faible",
  moderate: "modéré",
  high: "élevé",
};

const HYDRATION_LABELS: Record<string, string> = {
  low: "moins d'1 litre par jour",
  medium: "entre 1 et 1,5 litre par jour",
  high: "plus d'1,5 litre par jour",
};

const COOKING_SKILL_LABELS: Record<string, string> = {
  beginner: "débutante, préfère simple",
  comfortable: "à l'aise en cuisine",
  confident: "très à l'aise, aime cuisiner",
};

const COOKING_TIME_LABELS: Record<string, string> = {
  short: "moins de 15 minutes disponibles pour cuisiner",
  medium: "15 à 30 minutes disponibles pour cuisiner",
  long: "plus de 30 minutes disponibles pour cuisiner",
};

const SNACKING_LABELS: Record<string, string> = {
  rarely: "grignote rarement",
  sometimes: "grignote parfois entre les repas",
  often: "grignote souvent entre les repas",
};

const RECIPE_PREFERENCE_LABELS: Record<string, string> = {
  quick: "des recettes rapides",
  family: "des recettes familiales",
  no_preference: "pas de préférence particulière de recettes",
};

export function profileContextBlock(profile: UserProfileContext): string {
  const lines: string[] = [];
  if (profile.goal) lines.push(`- Objectif principal : ${GOAL_LABELS[profile.goal] ?? profile.goal}`);
  if (profile.age) lines.push(`- Âge : ${profile.age} ans`);
  if (profile.heightCm) lines.push(`- Taille : ${profile.heightCm} cm`);
  if (profile.weightKg) lines.push(`- Poids : ${profile.weightKg} kg`);
  if (profile.menopauseStage)
    lines.push(`- Stade : ${MENOPAUSE_STAGE_LABELS[profile.menopauseStage] ?? profile.menopauseStage}`);
  if (profile.symptoms && profile.symptoms.length > 0)
    lines.push(`- Symptômes signalés : ${profile.symptoms.join(", ")}`);
  if (profile.activityLevel)
    lines.push(`- Activité physique : ${ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel}`);
  if (profile.sleepQuality)
    lines.push(`- Sommeil : ${SLEEP_LABELS[profile.sleepQuality] ?? profile.sleepQuality}`);
  if (profile.stressLevel)
    lines.push(`- Niveau de stress : ${STRESS_LABELS[profile.stressLevel] ?? profile.stressLevel}`);
  if (profile.hydration)
    lines.push(`- Hydratation : ${HYDRATION_LABELS[profile.hydration] ?? profile.hydration}`);
  if (profile.dietType) lines.push(`- Type d'alimentation : ${profile.dietType}`);
  if (profile.allergies) lines.push(`- Allergies / intolérances : ${profile.allergies}`);
  if (profile.supplements) lines.push(`- Compléments alimentaires déjà pris : ${profile.supplements}`);
  if (profile.dislikedFoods) lines.push(`- Aliments non appréciés : ${profile.dislikedFoods}`);
  if (profile.cookingSkill)
    lines.push(`- Niveau en cuisine : ${COOKING_SKILL_LABELS[profile.cookingSkill] ?? profile.cookingSkill}`);
  if (profile.cookingTime)
    lines.push(`- Temps de préparation : ${COOKING_TIME_LABELS[profile.cookingTime] ?? profile.cookingTime}`);
  if (profile.snackingFrequency)
    lines.push(`- Grignotage : ${SNACKING_LABELS[profile.snackingFrequency] ?? profile.snackingFrequency}`);
  if (profile.householdSize) lines.push(`- Cuisine habituellement pour : ${profile.householdSize}`);
  if (profile.recipePreference)
    lines.push(`- Préférence de recettes : ${RECIPE_PREFERENCE_LABELS[profile.recipePreference] ?? profile.recipePreference}`);
  if (profile.importantNote) lines.push(`- Information importante indiquée par l'utilisatrice : ${profile.importantNote}`);

  if (lines.length === 0) return "Aucune information de profil disponible pour cette utilisatrice.";
  return `Profil de l'utilisatrice :\n${lines.join("\n")}`;
}

/** Corrections passées de cette utilisatrice sur des analyses précédentes — un SIGNAL contextuel,
 * jamais une règle à appliquer automatiquement : l'identification doit toujours rester fondée sur
 * ce qui est réellement visible sur la photo actuelle. */
export function correctionsContextBlock(hints: string[]): string {
  if (hints.length === 0) return "";
  return `\nContexte (facultatif, à titre indicatif uniquement — ne remplace jamais ce que tu observes réellement sur CETTE photo) : par le passé, cette utilisatrice a déjà corrigé les identifications suivantes sur d'autres photos : ${hints.join("; ")}. Si tu hésites entre plusieurs aliments proches et que l'un d'eux correspond à ces corrections passées, tu peux le considérer comme légèrement plus probable — mais seulement si les preuves visuelles de la photo actuelle le permettent réellement.`;
}
