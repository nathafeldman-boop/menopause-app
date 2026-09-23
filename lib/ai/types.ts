export type Flag = "present" | "absent" | "unclear";
export type Level = "low" | "moderate" | "high" | "unclear";

export type MealAnalysisResult = {
  score: number; // 0-100, équilibre général
  mealName: string;
  proteinFlag: Flag;
  vegFiberFlag: Flag;
  calciumFlag: Flag;
  carbsLevel: Level;
  fatLevel: Level;
  sugarFlag: Flag;
  goodPoints: string[];
  improvePoints: string[];
  suggestions: string[];
};

export type RecipeScanResult = {
  title: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  goodPoints: string[];
  improvePoints: string[];
  fitScore: number; // 0-100, adéquation avec le profil
};

export type AdaptedRecipe = {
  title: string;
  ingredients: string[];
  steps: string[];
  whatChanged: string[];
};

export type GeneratedRecipe = {
  name: string;
  time: string;
  ingredients: string[];
  steps: string[];
  whyFits: string;
};

export type UserProfileContext = {
  goal: string | null;
  dietType: string | null;
  allergies: string | null;
  dislikedFoods: string | null;
  householdSize: string | null;
  recipePreference: string | null;
  importantNote: string | null;
};

export type CoachMessage = { role: "user" | "assistant"; content: string };

export interface AiProvider {
  analyzeMealPhoto(
    imageBase64: string,
    mimeType: string,
    profile: UserProfileContext
  ): Promise<MealAnalysisResult>;

  scanRecipePhoto(imageBase64: string, mimeType: string): Promise<RecipeScanResult>;

  adaptRecipe(recipe: RecipeScanResult, profile: UserProfileContext): Promise<AdaptedRecipe>;

  generateRecipesFromIngredients(
    input: { ingredients?: string[]; image?: { data: string; mimeType: string } },
    profile: UserProfileContext
  ): Promise<GeneratedRecipe[]>;

  coachReply(messages: CoachMessage[], profile: UserProfileContext): Promise<string>;
}
