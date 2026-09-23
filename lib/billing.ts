export const TEST_BILLING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_TEST_BILLING === "true";

export const PLANS = {
  monthly: { label: "Mensuel", price: "14,99 €", period: "/ mois" },
  weekly: { label: "Hebdomadaire", price: "7,99 €", period: "/ semaine" },
} as const;
