import { geminiProvider } from "./gemini";
import { mockProvider } from "./mock";
import type { AiProvider } from "./types";

const hasKey = !!process.env.GEMINI_API_KEY;

/** Sans clé API (dev local uniquement), on utilise des réponses simulées.
 * Avec une clé, on appelle toujours le vrai fournisseur : si l'appel échoue (quota, panne,
 * clé invalide), l'erreur remonte telle quelle jusqu'aux routes API, qui savent déjà répondre
 * par un message d'erreur clair. Masquer l'échec derrière une réponse simulée présenterait du
 * contenu inventé, non lié à la photo/aux données envoyées, comme un vrai résultat — pire qu'une
 * erreur honnête pour une utilisatrice abonnée. */
export const ai: AiProvider = hasKey ? geminiProvider : mockProvider;

export const AI_MODE = hasKey ? "gemini" : "mock";

export * from "./types";
