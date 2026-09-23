import { geminiProvider } from "./gemini";
import { mockProvider } from "./mock";
import type { AiProvider } from "./types";

const hasKey = !!process.env.GEMINI_API_KEY;

/** Enveloppe chaque méthode : si l'appel Gemini échoue (clé manquante, quota, erreur réseau),
 * on retombe sur une réponse simulée plutôt que de casser l'expérience utilisateur. */
function withFallback<T extends (...args: never[]) => Promise<unknown>>(primary: T, fallback: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await primary(...args);
    } catch (err) {
      console.error("[ai] appel au fournisseur IA échoué, repli sur le mode simulé :", err);
      return fallback(...args);
    }
  }) as T;
}

export const ai: AiProvider = hasKey
  ? {
      analyzeMealPhoto: withFallback(geminiProvider.analyzeMealPhoto, mockProvider.analyzeMealPhoto),
      scanRecipePhoto: withFallback(geminiProvider.scanRecipePhoto, mockProvider.scanRecipePhoto),
      adaptRecipe: withFallback(geminiProvider.adaptRecipe, mockProvider.adaptRecipe),
      generateRecipesFromIngredients: withFallback(
        geminiProvider.generateRecipesFromIngredients,
        mockProvider.generateRecipesFromIngredients
      ),
      coachReply: withFallback(geminiProvider.coachReply, mockProvider.coachReply),
    }
  : mockProvider;

export const AI_MODE = hasKey ? "gemini" : "mock";

export * from "./types";
