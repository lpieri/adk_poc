# La Norme Sway

**Version 1.0**

> Ce document décrit la norme de code en vigueur sur le boilerplate Sway et tous les
> projets qui en dérivent. Une norme de programmation définit un ensemble de règles
> régissant l'écriture d'un code. Il est obligatoire de respecter la norme, que le code
> soit écrit par un humain ou par Claude.

---

## Chapitre I - Avant-propos

### I.1 Pourquoi imposer une norme ?

La norme a deux objectifs principaux :
- **Uniformiser** le code afin que tout le monde puisse le lire facilement - humains et agents.
- Écrire des codes **simples, courts et clairs** : la bonne quantité de complexité est le minimum nécessaire.

### I.2 La norme dans vos commits

Tout le code Go, TypeScript/TSX, React Native et Protobuf doit respecter la norme.
Elle est vérifiée par la **norminette** (`scripts/norminette.py`), exécutée :
- en CI sur **chaque commit de chaque branche** (workflow `norminette.yml`) ;
- en local via le hook pre-commit (`scripts/norminette.py --install-hook`).

**La moindre faute de norme rend le commit refusable.** Seul le résultat de la
norminette fait foi pour la partie obligatoire ; la partie conseillée est vérifiée en
revue de code.

### I.3 Conseils

La norme n'est pas une contrainte : c'est un garde-fou pour écrire un code simple.
Codez directement à la norme, quitte à coder plus lentement les premières heures.
Un fichier qui contient une faute de norme est aussi mauvais qu'un fichier qui en
compte dix.

### I.4 Ce qui diffère de la norme de 42

La norme de 42 (C) impose 25 lignes par fonction et 5 fonctions par fichier. Sur
notre stack, ces limites sont adaptées :

| Règle 42 | Adaptation Sway |
|----------|-----------------|
| 25 lignes / fonction | 25 lignes pour les fonctions **utilitaires** ; 100 lignes max pour les RPC et composants React |
| 5 fonctions / fichier | Conservé pour les packages bibliothèque (ex : `swstripe`) ; non applicable aux fichiers RPC (1 RPC = 1 fichier) et aux composants React (1 composant = 1 fichier) |
| Header 42 obligatoire | Pas de header |
| for/switch interdits | Autorisés (idiomatiques en Go) |

---

## Chapitre II - Règles communes

Chaque règle porte un code (`N-XXX-NN`) affiché par la norminette.

### Partie obligatoire

- **N-ALL-01** - Une ligne ne doit jamais se terminer par des espaces ou des tabulations.
- **N-ALL-02** - Deux lignes vides consécutives sont interdites.
- **N-ALL-03** - Tout fichier se termine par un unique retour à la ligne.
- Le code est en **anglais** (identifiants, commentaires techniques) ; la communication d'équipe en français (vérifié en revue).
- **Ne jamais éditer les fichiers générés** (`*.pb.go`, `ts/src/packages/types/proto/`, `*.d.ts` générés) - ils sont exclus de la norminette et de toute modification manuelle.

### Partie conseillée

- Les noms sont explicites ou mnémoniques ; les abréviations sont tolérées si elles réduisent significativement la taille du nom sans en perdre le sens.
- Éviter les retours à la ligne inutiles au milieu d'une implémentation : un bloc = une idée.

---

## Chapitre III - Go

### Partie obligatoire

- **N-GO-01** - Un fichier ne peut pas dépasser **200 lignes** (400 pour un `_test.go`). Les fichiers générés (`*.pb.go`, `*.pb.gw.go`) sont exemptés.
- **N-GO-02** - Une fonction ne peut pas dépasser **100 lignes**. Dans un package ou fichier utilitaire (`*util*`), la limite est de **25 lignes** (les fonctions de test restent à 100).
- **N-GO-03** - L'assignation et le test d'une erreur se font sur **deux lignes**. La forme `if err := f(); err != nil {}` est **interdite** (elle casse la lisibilité) :

  ```go
  // ✗ Interdit
  if err := doSomething(); err != nil {
      return err
  }

  // ✓ Obligatoire
  err := doSomething()
  if err != nil {
      return err
  }
  ```

- **N-GO-04** - **Un fichier par call RPC** : un fichier `api_{method}.go` contient exactement **une** fonction exportée (le handler RPC). Les helpers privés y sont autorisés ; un helper réutilisable ailleurs part dans un package utilitaire.
- **N-GO-05** - Chaque call RPC est **testé** : tout `api_{method}.go` a son `api_{method}_test.go`.
- **N-GO-06** - Dans `go/pkg/`, un fichier de package bibliothèque contient au maximum **5 fonctions**. Exemptés : `api_*.go` (règle N-GO-04), les mocks (`*mock*.go` - ils implémentent une interface complète), `interface.go`, `*_test.go`.

### Architecture (obligatoire, vérifiée en revue)

- **Architecture hexagonale** : le domaine métier ne dépend jamais d'un SDK tiers directement. Chaque package client expose une **interface mockable** (port) avec deux implémentations : la vraie (adapter) et un mock pour les tests. Modèle canonique : `go/pkg/swstripe/` (`interface.go` → `StripeI`, `stripe.go` → `StripeS`, `stripe-mock.go` → `MockStripeS`, constructeurs `NewStripe()` / `NewTestStripe()`).
- **Protobuf est la source de vérité** : les codes d'erreur (`errcode.proto`), les types RPC (`sw-service-*.proto`) et les modèles DB (`sw-db-*.proto`) sont définis en proto, jamais dupliqués à la main.
- **ffcli obligatoire** pour tout binaire dans `go/cmd/` : flags via `flag.NewFlagSet` + `ff.WithEnvVarNoPrefix()`, sous-commandes via `ffcli.Command`, goroutines via `run.Group`.
- **Wrapping systématique des erreurs** : `fmt.Errorf("context: %w", err)` ; codes custom via `errcode.ERR_DOMAINE_ACTION.Wrap(err)`.
- **Dépendre le moins possible de packages externes** : les dépendances du socle (grpc, gorm, discordgo, stripe-go, zap, ff…) sont autorisées ; un **nouveau** package client s'écrit en pure `net/http`, et un nouveau SDK tiers se justifie en revue.

### Partie conseillée

- Imports en 3 groupes séparés par une ligne vide : stdlib, third-party, internes.
- Retour early : pas de `else` après un `return`.
- Logging structuré via zap : `logger.Info("msg", zap.String("key", v))`.
- Commentaires doc uniquement sur les fonctions exportées ; pas de commentaires sur du code évident.

---

## Chapitre IV - Frontend React (TSX)

### Partie obligatoire

- **N-TS-01** - Un fichier ne peut pas dépasser **200 lignes** (400 pour un `*.test.tsx`). Les fichiers générés (`ts/src/packages/types/proto/`, `*.d.ts`) sont exemptés.
- **N-TS-02** - Tout composant (fichier `.tsx` en PascalCase) suit **exactement** ce pattern :

  ```tsx
  const Component: React.FC<ComponentProps> = (props) => {
    return <div>{props.label}</div>;
  };

  export default Component;
  ```

  `React.FC<Props>` et `export default` sont obligatoires. L'interface de props est nommée `{ComponentName}Props` et définie au-dessus du composant.
- **N-TS-03** - **Un fichier par composant** : un seul `React.FC` par fichier. Dès qu'un morceau de JSX est réutilisable ou fait grossir le fichier, on le découpe en composant.
- **N-TS-04** - **Double quotes** partout. Les single quotes sont interdites pour les chaînes ; les template literals servent uniquement à l'interpolation.
- **N-TS-05** - Chaque composant a un **test unitaire** dans le dossier **`__tests__/`** du dossier du composant (`__tests__/Component.test.tsx` - jamais colocalisé, pour ne pas polluer l'arborescence). La couverture des composants doit être de **100 %** (seuil vérifié en CI).
- **N-TS-06** - **Aucun commentaire** dans le frontend (`.ts` comme `.tsx`) : ni `//`, ni `/* */`, ni `{/* */}`. Un commentaire signale du code qui ne se lit pas tout seul - la réponse est de renommer, d'extraire une fonction au nom explicite ou de découper le composant, pas de gloser :

  ```tsx
  // ✗ Interdit
  // on garde 3 lignes max pour ne pas casser la carte
  const rows = items.slice(0, 3);

  // ✓ Obligatoire
  const CARD_MAX_ROWS = 3;
  const rows = items.slice(0, CARD_MAX_ROWS);
  ```

  Le scanner ignore les chaînes, les template literals et les littéraux regex : une URL `https://…` ou un `/\s/g` ne déclenche rien. Les directives outillage (`eslint-disable`, `@ts-expect-error`) n'échappent pas à la règle : elles se déclarent dans `eslint.config.mjs`, qui n'est pas soumis à la Norme.
- Toute instruction se termine par un **`;`** (vérifié par ESLint/Prettier en CI).
- Nommage : composants en **PascalCase**, handlers en **`handle{Action}`**, constantes en **UPPER_SNAKE_CASE**, utilitaires en **camelCase**.
- Imports ordonnés : React/Next, packages tiers, `import type`, composants internes, utils/data.

### Stack (obligatoire, vérifiée en revue)

- **Tailwind CSS** pour tout le styling - pas de CSS-in-JS, pas de fichiers CSS par composant. Styles dynamiques via `style={{ }}` inline uniquement.
- **i18next** pour tout texte visible par l'utilisateur - aucune chaîne en dur dans le JSX : `const { t } = useTranslation();` puis `{t("section.key")}`.
- `"use client"` en tête des composants interactifs.
- Chaque dossier de composants a un `index.ts` barrel export.

### Partie conseillée

- Privilégier du code **prédictible** : `useState` avec type explicite (`useState<string | null>(null)`), updates immutables ; `useMemo`/`useCallback` autorisés quand ils servent la lisibilité ou la performance.
- State management : React state en priorité ; **Zustand** et **React Query** sont autorisés quand le besoin le justifie.

---

## Chapitre V - React Native

Les règles du Chapitre IV s'appliquent intégralement (N-TS-01 à N-TS-05), avec ces adaptations :

### Partie obligatoire

- Composants typés `React.FC<Props>` + `export default`, un fichier par composant, 200 lignes max.
- **NativeWind** (Tailwind pour React Native) pour le styling - mêmes classes que le web, pas de `StyleSheet.create` sauf impossibilité technique documentée.
- **i18next** (`react-i18next`) pour tous les textes.
- Tests unitaires avec `@testing-library/react-native`, couverture 100 % des composants.
- **Partager** les types, l'API client gRPC-web et l'i18n avec le web via `packages/`.
- **Isoler le code spécifique plateforme** dans des fichiers `.native.tsx` / `.web.tsx`.

---

## Chapitre VI - Protobuf

### Partie obligatoire

- **N-PB-01** - Les messages sont en **PascalCase**. Les types d'entrée/sortie RPC suivent le pattern `{Operation}_Input` / `{Operation}_Output`.
- **N-PB-02** - Les champs sont en **snake_case**.
- **N-PB-03** - Un fichier proto ne peut pas dépasser **400 lignes** : au-delà, découper par domaine (`sw-types-{domaine}.proto`).
- **N-PB-04** - **Aucun commentaire** dans un `.proto` (ni `//`, ni `/* */`). Le proto est la source de vérité des types : un champ qui a besoin d'être expliqué a besoin d'être renommé. Les commentaires proto se propagent en plus dans tout le code généré, Go et TS.
- Un package proto par domaine : `sway.fr.{domaine}`.
- `option go_package` pointe vers le package du service concerné.
- Après toute modification : `cd go && make pb.generate`. Ne jamais éditer les fichiers générés.

---

## Chapitre VII - La norminette

### Usage

```bash
python3 scripts/norminette.py              # vérifie tout le repo
python3 scripts/norminette.py go/pkg/swai  # vérifie un chemin précis
python3 scripts/norminette.py --fix        # corrige N-ALL-01/02/03 et supprime les commentaires (N-TS-06, N-PB-04)
python3 scripts/norminette.py --install-hook  # installe le hook pre-commit
```

Sortie : `fichier:ligne: [N-XXX-NN] message`. Code retour `0` si conforme, `1` sinon.

### En CI

Le workflow `.github/workflows/norminette.yml` exécute la norminette sur **chaque
push de chaque branche** et sur chaque pull request. Un échec bloque le merge.
La couverture de tests (100 % composants, tests RPC) est vérifiée par les workflows
`frontend.yml` et `backend.yml`.

### Récapitulatif des codes

| Code | Règle |
|------|-------|
| N-ALL-01 | Espace ou tabulation en fin de ligne |
| N-ALL-02 | Lignes vides consécutives |
| N-ALL-03 | Retour à la ligne final manquant ou multiple |
| N-GO-01 | Fichier Go > 200 lignes (test > 400) |
| N-GO-02 | Fonction Go > 100 lignes (> 25 dans un package utilitaire) |
| N-GO-03 | `if err := f(); err != nil` - assignation et test sur la même ligne |
| N-GO-04 | Fichier `api_*.go` avec plus d'une fonction exportée |
| N-GO-05 | Fichier `api_*.go` sans test associé |
| N-GO-06 | Plus de 5 fonctions dans un fichier de package bibliothèque |
| N-TS-01 | Fichier TS/TSX > 200 lignes (test > 400) |
| N-TS-02 | Composant sans `React.FC<Props>` ou sans `export default` |
| N-TS-03 | Plusieurs composants dans un même fichier |
| N-TS-04 | Single quotes |
| N-TS-05 | Composant sans test unitaire |
| N-TS-06 | Commentaire dans un `.ts` / `.tsx` (`//`, `/* */`, `{/* */}`) |
| N-PB-01 | Message proto non PascalCase |
| N-PB-02 | Champ proto non snake_case |
| N-PB-03 | Fichier proto > 400 lignes |
| N-PB-04 | Commentaire dans un `.proto` |
