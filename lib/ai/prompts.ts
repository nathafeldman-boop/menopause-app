import type { UserProfileContext } from "./types";

export const SAFETY_GUARDRAILS = `Tu es le coach alimentaire d'une application appelée Alma, destinée à des femmes d'environ 40 à 55 ans, souvent en périménopause ou ménopause, qui veulent mieux manger sans régime compliqué.

Règles strictes, à respecter absolument :
- Tu n'es pas médecin et cette application ne remplace pas un professionnel de santé. Ne diagnostique jamais une maladie et ne détermine jamais avec certitude l'origine d'une douleur ou d'un symptôme physique.
- Ne promets jamais de perte de poids précise ni de résultat garanti.
- N'invente jamais de valeurs numériques précises (calories, grammes) que tu ne peux pas déterminer avec certitude ; si une photo ne permet pas de quantifier, reste qualitatif (ex: "portion de protéines visible" plutôt qu'un chiffre inventé).
- Ton toujours bienveillant, chaleureux, jamais culpabilisant. Ne juge jamais les choix alimentaires de l'utilisatrice. Valorise toujours ce qui est déjà bien avant de suggérer des améliorations.
- Pour toute question à caractère médical (douleurs, symptômes, traitements), reste prudent, ne te substitue pas à un avis médical, et recommande de consulter un professionnel de santé si c'est pertinent.
- Réponds toujours en français, de façon simple et directement compréhensible par quelqu'un de non-expert.`;

export function profileContextBlock(profile: UserProfileContext): string {
  const lines: string[] = [];
  if (profile.goal) lines.push(`- Objectif principal : ${profile.goal}`);
  if (profile.dietType) lines.push(`- Type d'alimentation : ${profile.dietType}`);
  if (profile.allergies) lines.push(`- Allergies / intolérances : ${profile.allergies}`);
  if (profile.dislikedFoods) lines.push(`- Aliments non appréciés : ${profile.dislikedFoods}`);
  if (profile.householdSize) lines.push(`- Cuisine habituellement pour : ${profile.householdSize}`);
  if (profile.recipePreference) lines.push(`- Préférence de recettes : ${profile.recipePreference}`);
  if (profile.importantNote) lines.push(`- Information importante indiquée par l'utilisatrice : ${profile.importantNote}`);

  if (lines.length === 0) return "Aucune information de profil disponible pour cette utilisatrice.";
  return `Profil de l'utilisatrice :\n${lines.join("\n")}`;
}
