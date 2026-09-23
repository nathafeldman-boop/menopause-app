export const TEST_BILLING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_TEST_BILLING === "true";

export const PLANS = {
  monthly: { label: "Mensuel", price: "14,99 €", period: "/ mois", credits: 100 },
  weekly: { label: "Hebdomadaire", price: "7,99 €", period: "/ semaine", credits: 25 },
} as const;

export const CREDIT_PACKS = {
  pack_100: { label: "+100 crédits", price: "3,99 €", credits: 100 },
  pack_500: { label: "+500 crédits", price: "9,99 €", credits: 500 },
} as const;
