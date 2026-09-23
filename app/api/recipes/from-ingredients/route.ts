import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { ai } from "@/lib/ai";
import { spendCredits, refundCredits, InsufficientCreditsError } from "@/lib/credits";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const ingredientsRaw = formData.get("ingredients");
  const photo = formData.get("photo");

  let ingredients: string[] = [];
  if (typeof ingredientsRaw === "string" && ingredientsRaw.trim()) {
    try {
      ingredients = JSON.parse(ingredientsRaw);
    } catch {
      ingredients = [];
    }
  }

  const hasPhoto = photo instanceof File;
  if (ingredients.length === 0 && !hasPhoto) {
    return NextResponse.json({ error: "Ajoutez au moins un ingrédient ou une photo." }, { status: 400 });
  }

  let newBalance: number;
  try {
    newBalance = await spendCredits(supabase, "ingredients_recipe");
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    throw err;
  }

  try {
    let image: { data: string; mimeType: string } | undefined;
    if (hasPhoto) {
      const buffer = Buffer.from(await (photo as File).arrayBuffer());
      image = { data: buffer.toString("base64"), mimeType: (photo as File).type || "image/jpeg" };
    }

    const profile = await getProfile(supabase, user.id);
    const recipes = await ai.generateRecipesFromIngredients({ ingredients, image }, toAiContext(profile));

    const { data: row, error: insertError } = await supabase
      .from("ingredient_recipes")
      .insert({
        user_id: user.id,
        ingredients_input: ingredients.length > 0 ? ingredients : ["Photo des ingrédients"],
        recipes,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ id: row.id, creditsBalance: newBalance });
  } catch (err) {
    console.error("[api/recipes/from-ingredients]", err);
    await refundCredits(supabase, "ingredients_recipe").catch(() => {});
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
