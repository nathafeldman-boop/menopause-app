import { GoogleGenAI } from "@google/genai";

import { SAFETY_GUARDRAILS, profileContextBlock } from "./prompts";
import {
  mealAnalysisSchema,
  recipeScanSchema,
  adaptedRecipeSchema,
  ingredientRecipesSchema,
} from "./schemas";
import type {
  AiProvider,
  MealAnalysisResult,
  RecipeScanResult,
  AdaptedRecipe,
  GeneratedRecipe,
  UserProfileContext,
  CoachMessage,
} from "./types";

const MODEL = "gemini-flash-latest";

function client() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function generateJson<T>(params: {
  prompt: string;
  schema: object;
  image?: { data: string; mimeType: string };
}): Promise<T> {
  // L'image en premier, puis le texte : améliore l'ancrage visuel du modèle
  // et réduit le risque qu'il décrive des aliments absents de la photo.
  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [];
  if (params.image) {
    parts.push({ inlineData: { data: params.image.data, mimeType: params.image.mimeType } });
  }
  parts.push({ text: params.prompt });

  const response = await client().models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: SAFETY_GUARDRAILS,
      responseMimeType: "application/json",
      responseJsonSchema: params.schema,
      // Basse température : on veut une lecture fidèle de l'image, pas de créativité.
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Réponse vide du modèle IA");
  return JSON.parse(text) as T;
}

export const geminiProvider: AiProvider = {
  async analyzeMealPhoto(imageBase64, mimeType, profile) {
    const prompt = `Voici une photo de repas. Regarde-la attentivement avant de répondre.

Règle la plus importante : décris UNIQUEMENT les aliments clairement identifiables sur cette photo précise. N'invente ou ne suppose jamais la présence d'un aliment que tu ne vois pas (ex : ne mentionne pas "trop de viande" si aucune viande n'est visible, ne dis pas "manque de légumes" si l'assiette est déjà majoritairement composée de légumes). Si l'assiette est composée à 90% d'un seul type d'aliment (ex : uniquement des légumes), tes retours doivent refléter cette réalité, pas un repas "standard" générique.

${profileContextBlock(profile)}

Évalue, en te basant strictement sur ce qui est visible : équilibre général (score 0-100), présence de protéines, présence de végétaux/fibres, sources potentielles de calcium, niveau de glucides, niveau de matières grasses, présence d'aliments très sucrés si visibles. Si un élément n'est pas déterminable visuellement, indique "unclear" plutôt que de deviner.

Donne 2 à 4 points déjà positifs, 1 à 3 points à améliorer (formulés sans culpabiliser), et 2 à 3 suggestions très concrètes et réalisables — tous cohérents avec ce qui est réellement visible sur la photo.`;

    return generateJson<MealAnalysisResult>({
      prompt,
      schema: mealAnalysisSchema,
      image: { data: imageBase64, mimeType },
    });
  },

  async scanRecipePhoto(imageBase64, mimeType) {
    const prompt = `Cette image montre une recette (photo, capture d'écran ou page de livre). Extrais et comprends la recette : titre, ingrédients, étapes.

Donne aussi un résumé en 1-2 phrases, 2-3 points positifs, 1-3 points à améliorer d'un point de vue nutritionnel général, et un score d'adéquation (0-100) avec une alimentation équilibrée adaptée à une femme en péri/ménopause (sans jugement, reste bienveillant).`;

    return generateJson<RecipeScanResult>({
      prompt,
      schema: recipeScanSchema,
      image: { data: imageBase64, mimeType },
    });
  },

  async adaptRecipe(recipe, profile) {
    const prompt = `Voici une recette existante :
Titre : ${recipe.title}
Ingrédients : ${recipe.ingredients.join(", ")}
Étapes : ${recipe.steps.join(" | ")}

${profileContextBlock(profile)}

Adapte cette recette pour mieux correspondre au profil et aux objectifs de l'utilisatrice (ex : plus de fibres, une source de calcium, moins de sucre ajouté, respect des allergies/aversions listées), sans dénaturer le plat. Donne la version adaptée complète (titre, ingrédients, étapes) et une liste courte de ce qui a changé et pourquoi.`;

    return generateJson<AdaptedRecipe>({ prompt, schema: adaptedRecipeSchema });
  },

  async generateRecipesFromIngredients(input, profile) {
    const ingredientsLine = input.ingredients?.length
      ? `L'utilisatrice a saisi ces ingrédients disponibles : ${input.ingredients.join(", ")}.`
      : "L'utilisatrice a fourni une photo de ses ingrédients disponibles (frigo, placard, plan de travail) : identifie-les visuellement.";

    const prompt = `${ingredientsLine}

${profileContextBlock(profile)}

Propose exactement 3 recettes réalisables principalement avec ces ingrédients (des ingrédients de base courants comme sel, huile, poivre peuvent être supposés disponibles). Pour chaque recette : nom, temps approximatif, liste d'ingrédients, étapes claires et numérotées en texte, et une phrase expliquant pourquoi elle correspond au profil de l'utilisatrice.`;

    const result = await generateJson<{ recipes: GeneratedRecipe[] }>({
      prompt,
      schema: ingredientRecipesSchema,
      image: input.image,
    });
    return result.recipes;
  },

  async coachReply(messages: CoachMessage[], profile: UserProfileContext) {
    const history = messages
      .map((m) => `${m.role === "user" ? "Utilisatrice" : "Coach"} : ${m.content}`)
      .join("\n");

    const prompt = `${profileContextBlock(profile)}

Voici la conversation avec l'utilisatrice jusqu'ici :
${history}

Réponds au dernier message de l'utilisatrice en tant que coach alimentaire bienveillant. Reste concret, actionnable, chaleureux, et concis (quelques phrases, pas un roman). Si la question sort du cadre alimentaire (ex: symptôme médical), reste prudent et renvoie vers un professionnel de santé sans détailler de diagnostic.`;

    const response = await client().models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { systemInstruction: SAFETY_GUARDRAILS },
    });

    return response.text ?? "Désolé, je n'ai pas pu générer de réponse. Pouvez-vous reformuler ?";
  },
};
