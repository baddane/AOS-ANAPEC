# AOS ANAPEC — Chantiers avant déploiement production à grande échelle

> Notes consignées pour reprise ultérieure. L'application est fonctionnelle
> et adaptée à une démo / un usage de dizaines de connexions. Les points
> ci-dessous concernent la montée en charge (centaines d'utilisateurs
> simultanés) et le durcissement sécurité.

---

## ✅ Déjà fait

- **Chargement des données par rôle** (commit `354a45d`)
  - Un adhérent ne charge que : conventions + actualités + ses propres demandes.
  - L'admin garde la vue globale (tous les users + toutes les demandes).
  - Gain : performance (charge divisée) + sécurité (un adhérent ne voit plus
    la liste de tous les agents ni les demandes des autres).
  - Tri des demandes côté serveur par `submissionDate`.

---

## ⚠️ À faire — par ordre de priorité

### 1. Passer Supabase au plan Pro (~$25/mois) — BLOQUANT pour la prod
- **Pourquoi** : sur le plan gratuit, le projet se met en **pause après
  1 semaine d'inactivité**, et le pool de connexions DB simultanées est limité.
- **Action** : dashboard Supabase → projet `zkdqywiumoklgthcasnu` (eu-west-3)
  → Settings → Billing → upgrade Pro.
- **Action code** : aucune. C'est une action de facturation.

### 2. Aligner les IDs utilisateurs sur `auth.uid()` puis durcir le RLS — HAUTE
- **Problème actuel** : les profils utilisent des IDs maison (`user_1`,
  `user_admin`) qui ne correspondent PAS à l'UUID d'authentification Supabase
  (`auth.uid()`). Une politique RLS basée sur `auth.uid()` casserait l'app.
- **Étapes** :
  1. Migrer `aos_users.id` pour qu'il corresponde à l'UUID auth de chaque user
     (ou ajouter une colonne `auth_id` et migrer `aos_requests.userId` en
     conséquence).
  2. Réécrire les politiques RLS actuelles (qui autorisent tout le monde à
     tout lire/écrire) :
     - `aos_requests` : un user ne lit/écrit QUE ses propres demandes
       (`auth.uid() = userId`) ; l'admin lit tout.
     - `aos_users` : un user lit/modifie QUE son profil ; l'admin gère tout.
     - `aos_conventions` / `aos_news` : lecture publique authentifiée ;
       écriture réservée à l'admin.
  3. Tester chaque rôle avant de pousser (ne pas faire la veille d'une démo).

### 3. Pagination des listes — MOYENNE
- `fetchAllUsers()` et `fetchAllRequests()` (vue admin) ramènent toutes les
  lignes. Avec 500+ agents et des centaines de demandes, ajouter une
  pagination (`.range()` / curseur) côté admin.

### 4. Optimisations annexes — BASSE
- Code-splitting du bundle JS (actuellement ~1,1 Mo, warning Vite > 500 Ko)
  via `import()` dynamique ou `manualChunks`.
- Index DB sur `aos_requests.userId` et `aos_requests.submissionDate` pour
  accélérer les requêtes filtrées/triées.

---

_Dernière mise à jour : 2026-06-02_
