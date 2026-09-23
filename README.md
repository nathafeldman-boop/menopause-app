# MenoStart — coach alimentaire pour la ménopause

MVP SaaS B2C : web app Next.js (App Router) + Supabase (auth, base de données, stockage) +
Google Gemini (analyse photo et coach IA).

## Démarrer en local

```bash
npm install
npm run dev
```

Copiez `.env.example` vers `.env.local` et renseignez les variables (voir ci-dessous).

## Variables d'environnement

Voir `.env.example` pour la liste complète. Points importants :

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` : déjà provisionnées pour ce
  projet (Supabase project `menopause-app`, région `eu-west-3`).
- `GEMINI_API_KEY` : **à ajouter avant d'envoyer du trafic réel.** Sans cette clé, l'application
  fonctionne quand même (mode IA simulé automatique dans `lib/ai/mock.ts`) mais les analyses ne
  sont pas réelles. Clé gratuite en 2 minutes sur https://aistudio.google.com/apikey.
- `NEXT_PUBLIC_ENABLE_TEST_BILLING` : active un bouton d'activation d'abonnement en mode test
  (aucun paiement réel) sur `/abonnement`, en l'absence d'intégration Stripe pour l'instant.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Supabase : Postgres (RLS activé sur toutes les tables), Auth (email/mot de passe), Storage
  (photos privées)
- IA : Google Gemini (`lib/ai/gemini.ts`), avec repli automatique vers un mode simulé
  (`lib/ai/mock.ts`) si la clé est absente ou si un appel échoue
- Accès aux fonctionnalités IA conditionné à un abonnement actif (`lib/subscription.ts`) —
  pas de système de crédits

## Ce qui reste à faire avant un vrai lancement payant

1. Ajouter `GEMINI_API_KEY` en production.
2. Brancher Stripe (checkout + webhooks) à la place du mode test de `/abonnement` —
   voir `lib/actions/billing.ts` et `lib/billing.ts`.
3. Vérifier les réglages d'authentification Supabase (confirmation email activée par défaut).
