import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { ai } from "@/lib/ai";
import { hasActiveSubscription } from "@/lib/subscription";

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
  const isLeftovers = formData.get("isLeftovers") === "true";

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

  try {
    const subscribed = await hasActiveSubscription(supabase, user.id);

    let image: { data: string; mimeType: string } | undefined;
    if (hasPhoto) {
      const buffer = Buffer.from(await (photo as File).arrayBuffer());
      image = { data: buffer.toString("base64"), mimeType: (photo as File).type || "image/jpeg" };
    }

    const profile = await getProfile(supabase, user.id);
    const result = await ai.generateRecipesFromIngredients(
      { ingredients, image, isLeftovers },
      toAiContext(profile),
      !subscribed
    );

    if (image && !result.ingredientsDetected) {
      return NextResponse.json({ error: "no_ingredients_detected" }, { status: 422 });
    }

    const { data: row, error: insertError } = await supabase
      .from("ingredient_recipes")
      .insert({
        user_id: user.id,
        ingredients_input: ingredients.length > 0 ? ingredients : ["Photo des ingrédients"],
        recipes: result.recipes,
        is_teaser: !subscribed,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ id: row.id });
  } catch (err) {
    console.error("[api/recipes/from-ingredients]", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
