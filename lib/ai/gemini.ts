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
  GeneratedRecipesResult,
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
    const prompt = `Voici une photo envoyée par une utilisatrice qui pense y avoir photographié son repas.

ÉTAPE 1 — OBLIGATOIRE, à faire avant tout le reste : détermine si cette photo montre réellement un repas ou des aliments, avec certitude.
Mets mealDetected à false si la photo montre : une table ou un plan de travail vide ou quasiment vide, de la vaisselle vide ou déjà terminée, un objet non alimentaire, une personne, un lieu, une image floue/illisible, ou tout ce qui n'est pas clairement de la nourriture.
Mets mealDetected à true UNIQUEMENT si tu peux identifier avec certitude au moins un aliment ou plat sur la photo.

Si mealDetected est false : mets score à 0, mealName à "", tous les flags à "unclear", goodPoints et suggestions à des tableaux vides, et improvePoints à un seul message clair du type : "Nous n'avons pas identifié de repas sur cette photo. Réessayez avec une photo de votre assiette." Ne poursuis pas avec une analyse nutritionnelle inventée.

Si mealDetected est true, poursuis normalement :

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

  async scanRecipePhoto(imageBase64, mimeType, teaser) {
    const prompt = `Cette image est envoyée par une utilisatrice qui pense y avoir photographié une recette (photo, capture d'écran ou page de livre).

ÉTAPE 1 — OBLIGATOIRE, à faire avant tout le reste : détermine si cette image montre réellement une recette lisible (titre et/ou ingrédients et/ou étapes identifiables), avec certitude.
Mets recipeDetected à false si l'image montre : un plan de travail ou une table sans texte de recette, un objet non lié à une recette, une personne, un lieu, une image floue/illisible, ou tout ce qui n'est pas clairement une recette.
Mets recipeDetected à true UNIQUEMENT si tu peux identifier avec certitude le contenu d'une recette.

Si recipeDetected est false : mets tous les champs texte à "", tous les tableaux à des tableaux vides, et fitScore à 0. Ne poursuis pas avec une recette inventée.

Si recipeDetected est true, extrais et comprends la recette : titre, nombre de personnes, temps de préparation, ingrédients, étapes. Si le nombre de personnes ou le temps n'est pas indiqué, laisse une chaîne vide plutôt que de deviner.

Donne aussi un résumé en 1-2 phrases, 2-3 points positifs, 1-3 points à améliorer d'un point de vue nutritionnel général, et un score d'adéquation (0-100) avec une alimentation équilibrée adaptée à une femme en péri/ménopause (sans jugement, reste bienveillant).${
      teaser
        ? `

IMPORTANT — mode aperçu gratuit (utilisatrice non abonnée) : ne donne QUE title, summary, servings, time, fitScore, et UNIQUEMENT les 2 premiers ingrédients dans "ingredients" (pas plus). Laisse "steps" à un tableau vide et "improvePoints" à un tableau vide. Donne un seul élément dans "goodPoints".`
        : ""
    }`;

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

Adapte cette recette pour mieux correspondre au profil et aux objectifs de l'utilisatrice (ex : plus de fibres, une source de calcium, moins de sucre ajouté, respect des allergies/aversions listées), sans dénaturer le plat.

Donne la version adaptée complète : titre, un nouveau score d'adéquation (0-100) reflétant l'amélioration apportée par ces changements (normalement supérieur au score original de ${recipe.fitScore}, sans exagérer), étapes, et surtout la liste COMPLÈTE des ingrédients de la version adaptée (y compris ceux qui n'ont pas changé), où pour chaque ingrédient modifié tu précises dans "note" ce qui a changé par rapport à l'original (ex: "au lieu de 3"), et où chaque ingrédient totalement nouveau a isNew à true. Les ingrédients inchangés ont note à "" et isNew à false. Ajoute aussi une liste courte ("whatChanged") résumant les changements et pourquoi.`;

    return generateJson<AdaptedRecipe>({ prompt, schema: adaptedRecipeSchema });
  },

  async generateRecipesFromIngredients(input, profile, teaser) {
    const ingredientsLine = input.ingredients?.length
      ? `L'utilisatrice a saisi ces ingrédients disponibles : ${input.ingredients.join(", ")}. C'est une saisie texte : mets toujours ingredientsDetected à true.`
      : `L'utilisatrice a fourni une photo de ses ingrédients disponibles (frigo, placard, plan de travail).

ÉTAPE 1 — OBLIGATOIRE, à faire avant tout le reste : détermine si cette photo montre réellement des aliments ou ingrédients, avec certitude. Mets ingredientsDetected à false si la photo ne montre clairement aucun aliment (table vide, objet non alimentaire, personne, image floue/illisible). Si ingredientsDetected est false, mets recipes à un tableau vide et ne poursuis pas. Sinon, identifie les ingrédients visuellement.`;

    const prompt = `${ingredientsLine}

${profileContextBlock(profile)}

${
  teaser
    ? `IMPORTANT — mode aperçu gratuit (utilisatrice non abonnée) : propose UNE SEULE recette complète (pas plus), réalisable principalement avec ces ingrédients (des ingrédients de base courants comme sel, huile, poivre peuvent être supposés disponibles). Nom, temps approximatif, liste d'ingrédients, étapes claires et numérotées, et une phrase expliquant pourquoi elle correspond au profil de l'utilisatrice.`
    : `Propose exactement 3 recettes réalisables principalement avec ces ingrédients (des ingrédients de base courants comme sel, huile, poivre peuvent être supposés disponibles). Pour chaque recette : nom, temps approximatif, liste d'ingrédients, étapes claires et numérotées en texte, et une phrase expliquant pourquoi elle correspond au profil de l'utilisatrice.`
}`;

    return generateJson<GeneratedRecipesResult>({
      prompt,
      schema: ingredientRecipesSchema,
      image: input.image,
    });
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
