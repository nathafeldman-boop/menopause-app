import { GoogleGenAI } from "@google/genai";

import { SAFETY_GUARDRAILS, profileContextBlock, correctionsContextBlock } from "./prompts";
import {
  mealAnalysisSchema,
  recipeScanSchema,
  adaptedRecipeSchema,
  ingredientRecipesSchema,
  weeklyMealPlanSchema,
  replaceMealSchema,
  sosMealSchema,
} from "./schemas";
import type {
  AiProvider,
  MealAnalysisResult,
  RecipeScanResult,
  AdaptedRecipe,
  GeneratedRecipe,
  GeneratedRecipesResult,
  WeeklyMealPlan,
  PlannedMeal,
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
  async analyzeMealPhoto(imageBase64, mimeType, profile, correctionHints) {
    const prompt = `Voici une photo envoyée par une utilisatrice qui pense y avoir photographié son repas.

Tu vas procéder en PLUSIEURS ÉTAPES DISTINCTES, sans les mélanger. Ne saute jamais directement à une identification sans être passée par l'étape précédente.

ÉTAPE 1 — Qualité de l'image et détection.
Détermine si cette photo montre réellement un repas ou des aliments, avec certitude, et si elle est exploitable.
Mets mealDetected à false si la photo montre : une table ou un plan de travail vide ou quasiment vide, de la vaisselle vide ou déjà terminée, un objet non alimentaire, une personne, un lieu, une image totalement floue/illisible, ou tout ce qui n'est pas clairement de la nourriture. Dans ce cas, remplis imageIssue avec la raison précise (ex: "aucune nourriture visible sur cette photo").
Si de la nourriture est visible mais que la photo reste difficile à exploiter (trop sombre, floue, nourriture trop éloignée ou trop masquée, plusieurs plats mélangés de façon indistincte), garde mealDetected à true mais remplis imageIssue avec la raison — cela te rendra plus prudente dans les étapes suivantes.
Si la photo est claire et exploitable, laisse imageIssue à "".

Si mealDetected est false : mets score à 0, mealName à "", visualInventory et foods à des tableaux vides, tous les flags à "unclear", positives/improvements à des tableaux vides, summary à "", personalizedTip à "Réessayez avec une photo de votre assiette, bien éclairée et cadrée de près.", improvedVersion et nextActionLabel à "". Ne poursuis pas avec une analyse inventée.

Si mealDetected est true, poursuis avec les étapes suivantes :

ÉTAPE 2 — Inventaire visuel brut (visualInventory).
AVANT d'identifier quoi que ce soit, liste ce que tu observes concrètement : formes, couleurs, textures, positions dans l'assiette. Ne nomme pas encore d'aliments précis à ce stade, décris juste ce qui est visuellement là.

ÉTAPE 3 — Identification (foods).
À partir SEULEMENT de cet inventaire visuel, identifie chaque aliment distinct. Règle la plus importante : décris UNIQUEMENT les aliments qui ont une trace concrète dans ton inventaire visuel. N'invente ou ne suppose jamais la présence d'un aliment que tu ne vois pas.
Sois particulièrement prudente sur les paires d'aliments visuellement proches (ex : poulet/dinde, thon/poulet effiloché, saumon/truite, courgette/concombre, feta/chèvre, yaourt/fromage blanc, riz/quinoa, patate douce/pomme de terre, brocoli/chou-fleur, pois chiches/haricots, tomate/poivron rouge, oignon rouge/échalote, crème fraîche/yaourt grec) : si tu hésites entre deux, mets confidence à "low" et liste les deux dans possibleAlternatives plutôt que de trancher arbitrairement.
Pour les sauces ou préparations dont la composition n'est pas visible (ex: une sauce blanche crémeuse), décris ce qui EST visible ("sauce crémeuse blanche") avec confidence adaptée, mais n'invente jamais sa recette exacte (ne dis pas "sauce au yaourt et moutarde" si rien ne le confirme visuellement).
Pour un plat composite dont l'intérieur n'est pas visible (lasagnes, quiche, gratin, curry, tarte...), identifie le plat par son nom si reconnaissable, avec une quantityEstimate qualitative, mais n'énumère pas d'ingrédients internes que tu ne peux pas voir.
${
  correctionHints.length > 0 ? correctionsContextBlock(correctionHints) : ""
}

ÉTAPE 4 — Analyse.
Si l'assiette est composée à 90% d'un seul type d'aliment (ex : uniquement des légumes), tes retours doivent refléter cette réalité, pas un repas "standard" générique.

${profileContextBlock(profile)}

Évalue, en te basant strictement sur ce qui est visible : équilibre général (score 0-100), présence de protéines, présence de végétaux/fibres, sources potentielles de calcium, niveau de glucides, niveau de matières grasses, présence d'aliments très sucrés si visibles. Si un élément n'est pas déterminable visuellement, indique "unclear" plutôt que de deviner.

Écris une vue d'ensemble courte et spécifique à CE repas (summary), 2 à 4 points positifs et 0 à 3 points d'amélioration reliés chacun à un aliment réellement identifié (jamais une affirmation générique du type "repas équilibré" sans expliquer pourquoi), un conseil concret et personnalisé selon le profil ci-dessus (personalizedTip), une courte proposition de version ajustée de ce repas précis si pertinent (improvedVersion), et une question de suivi pertinente (nextActionLabel). Si le repas est déjà cohérent, dis-le plutôt que d'inventer un défaut.`;

    return generateJson<MealAnalysisResult>({
      prompt,
      schema: mealAnalysisSchema,
      image: { data: imageBase64, mimeType },
    });
  },

  async scanRecipePhoto(imageBase64, mimeType, profile, teaser) {
    const prompt = `Cette image est envoyée par une utilisatrice qui pense y avoir photographié une recette (photo, capture d'écran ou page de livre).

ÉTAPE 1 — OBLIGATOIRE, à faire avant tout le reste : détermine si cette image montre réellement une recette lisible (titre et/ou ingrédients et/ou étapes identifiables), avec certitude.
Mets recipeDetected à false si l'image montre : un plan de travail ou une table sans texte de recette, un objet non lié à une recette, une personne, un lieu, une image floue/illisible, ou tout ce qui n'est pas clairement une recette.
Mets recipeDetected à true UNIQUEMENT si tu peux identifier avec certitude le contenu d'une recette.

Si recipeDetected est false : mets tous les champs texte à "", tous les tableaux à des tableaux vides, et fitScore à 0. Ne poursuis pas avec une recette inventée.

Si recipeDetected est true, extrais et comprends la recette : titre, nombre de personnes, temps de préparation, ingrédients, étapes. Si le nombre de personnes ou le temps n'est pas indiqué, laisse une chaîne vide plutôt que de deviner.

${profileContextBlock(profile)}

Donne aussi un résumé en 1-2 phrases, 2-3 points positifs, 1-3 points à améliorer d'un point de vue nutritionnel général en tenant compte du profil ci-dessus (allergies, aversions, objectif), et un score d'adéquation (0-100) avec le profil de l'utilisatrice (sans jugement, reste bienveillant).${
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

  async generateWeeklyMealPlan(profile, todaysMeals, teaser) {
    const todaysMealsLine = todaysMeals
      ? `Ce qu'elle a déjà mangé aujourd'hui : ${todaysMeals}.`
      : "Elle n'a pas encore précisé ce qu'elle a mangé aujourd'hui.";

    const prompt = `Construis un plan de repas hebdomadaire (petit-déjeuner, déjeuner, dîner) adapté à une femme en péri/ménopause.

${profileContextBlock(profile)}
${todaysMealsLine}

Pour chaque repas : un type (Petit-déjeuner/Déjeuner/Dîner), un nom de plat, une description en une phrase (sans calories ni grammes précis inventés), et la liste des ingrédients nécessaires avec une quantité approximative réaliste (ex: "2 œufs", "200 g de saumon", "1 poignée d'épinards"), chacun classé dans une catégorie de courses (fruits_legumes, viande_poisson_oeufs, produits_laitiers, epicerie, condiments). Varie les repas d'un jour à l'autre, reste réaliste et simple à préparer.${
      teaser
        ? `

IMPORTANT — mode aperçu gratuit (utilisatrice non abonnée) : donne UN SEUL jour complet (le premier jour de la semaine, "Lundi"), avec ses 3 repas. Ne donne pas les autres jours.`
        : `

Donne les 7 jours de la semaine (Lundi à Dimanche), chacun avec ses 3 repas.`
    }`;

    return generateJson<WeeklyMealPlan>({ prompt, schema: weeklyMealPlanSchema });
  },

  async replaceMeal(day, mealIndex, profile) {
    const meal = day.meals[mealIndex];
    const otherMeals = day.meals
      .filter((_, i) => i !== mealIndex)
      .map((m) => `${m.type} : ${m.name}`)
      .join(", ");

    const prompt = `Une utilisatrice veut remplacer un repas de son plan de la semaine (${day.day}, ${meal.type} : "${meal.name}") car elle ne l'aime pas ou ne l'a plus envie.

${profileContextBlock(profile)}

Les autres repas déjà prévus ce jour-là : ${otherMeals || "aucun autre repas prévu"}.

Propose un NOUVEAU repas de type "${meal.type}" pour remplacer celui-ci, différent du précédent, adapté au profil, avec un nom, une description en une phrase (sans calories/grammes précis inventés), et la liste des ingrédients nécessaires avec une quantité approximative réaliste, chacun classé dans une catégorie de courses (fruits_legumes, viande_poisson_oeufs, produits_laitiers, epicerie, condiments).`;

    return generateJson<PlannedMeal>({ prompt, schema: replaceMealSchema });
  },

  async suggestSosMeal(input, profile, teaser) {
    const availableLine = input.available
      ? `Ce qu'elle a sous la main : ${input.available}.`
      : "Elle n'a rien précisé de particulier qu'elle a sous la main.";

    const prompt = `Une utilisatrice ne sait pas quoi manger et a besoin d'une idée immédiate.

Temps disponible : ${input.time}.
Envie : ${input.craving}.
${availableLine}

${profileContextBlock(profile)}

Propose UNE SEULE idée de repas réalisable dans le temps indiqué, correspondant à l'envie exprimée, en utilisant si possible ce qu'elle a sous la main (des ingrédients de base courants comme sel, huile, poivre peuvent être supposés disponibles). Donne un nom, un temps approximatif, la liste des ingrédients, des étapes claires et numérotées, et une phrase expliquant pourquoi ça correspond à sa demande et à son profil.${
      teaser
        ? `

IMPORTANT — mode aperçu gratuit (utilisatrice non abonnée) : donne uniquement les 2 premiers ingrédients dans "ingredients" et laisse "steps" à un tableau vide.`
        : ""
    }`;

    return generateJson<GeneratedRecipe>({ prompt, schema: sosMealSchema });
  },
};
