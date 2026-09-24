"use client";

import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingCategory, ShoppingListItem } from "@/lib/ai/types";

const CATEGORY_ORDER: ShoppingCategory[] = [
  "fruits_legumes",
  "viande_poisson_oeufs",
  "produits_laitiers",
  "epicerie",
  "condiments",
];

const CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  fruits_legumes: "🥬 Fruits & légumes",
  viande_poisson_oeufs: "🥩 Viandes, poissons & œufs",
  produits_laitiers: "🥛 Produits laitiers",
  epicerie: "🥫 Épicerie",
  condiments: "🧂 Condiments",
};

export function ShoppingListView({ items }: { items: ShoppingListItem[] }) {
  const [list, setList] = useState(items);

  const grouped = useMemo(() => {
    const byCategory = new Map<ShoppingCategory, ShoppingListItem[]>();
    for (const item of list) {
      const bucket = byCategory.get(item.category) ?? [];
      bucket.push(item);
      byCategory.set(item.category, bucket);
    }
    return CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((cat) => ({
      category: cat,
      items: byCategory.get(cat)!,
    }));
  }, [list]);

  const checkedCount = list.filter((item) => item.checked).length;

  async function toggle(itemId: string, checked: boolean) {
    setList((prev) => prev.map((item) => (item.id === itemId ? { ...item, checked } : item)));
    try {
      await fetch("/api/shopping-list/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, checked }),
      });
    } catch {
      setList((prev) => prev.map((item) => (item.id === itemId ? { ...item, checked: !checked } : item)));
    }
  }

  if (list.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Aucun ingrédient pour le moment. Générez d&apos;abord votre plan de la semaine.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {checkedCount} / {list.length} déjà dans le panier
      </p>
      {grouped.map(({ category, items: categoryItems }) => (
        <Card key={category}>
          <CardContent className="p-5">
            <h3 className="mb-3 font-heading text-base font-medium">{CATEGORY_LABELS[category]}</h3>
            <div className="flex flex-col gap-3">
              {categoryItems.map((item) => (
                <label key={item.id} className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => toggle(item.id, e.target.checked)}
                  />
                  <span className={item.checked ? "text-muted-foreground line-through" : ""}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
