# GitHub Copilot instructions for this repository

## Purpose
- Aide les agents IA à faire des modifications sûres et pertinentes sur ce site statique (HTML/CSS/JS).
- Conserver le style minimaliste et éducatif : pages simples sans build toolchain.

## Projet — vue d'ensemble
- Structure principale : fichiers HTML à la racine (`index.html`, `projets.html`, `contact.html`) + JS correspondants (`main.js`, `handlers.js`, `contact.js`, `apprentissage.js`) et dossier `Styles/` pour les CSS.
- Comportement côté client fortement présent : pas de backend. Les données (ex. `garage`) sont persistées dans `localStorage` (voir `core/garage.js`).

## Patterns et conventions observés
- JavaScript Vanilla, pas de framework ni bundler. Modifications doivent rester compatibles avec ce contexte (pas d'ESM import sans adaptation).
- Sélecteurs DOM par id/classes : modifiez/privilégiez l'usage de `document.getElementById` / `querySelector` plutôt que d'introduire de nouvelles dépendances.
- Modal & formulaires : `ui/forms.js` gère l'ouverture/fermeture du modal, la validation et l'ajout dans `localStorage`. Exemple concret :
  - `formAjout` (submit) — validation des champs `marque`, `modele`, `image`, `description`. Voir la fonction `getPaysParMarque` pour dériver `pays` (utilisez `paysParMarque`).
- Filtrage : `filtrerGarage()` utilise `toLowerCase()` pour recherche insensible à la casse sur `modele`.
- Mode suppression : `toggleModeSuppression()` bascule une variable globale `modeSuppression` et met à jour l'affichage (ajoute la classe CSS `suppression-selectionnee`).

## Tests, build et exécution
- Pas de scripts `npm`, pas de tests automatisés. Pour tester localement : ouvrir les fichiers `.html` dans un navigateur (ou utiliser un simple serveur local comme `python -m http.server`).
- Vérifier le comportement de `localStorage` entre rechargements (ex. page `projets.html`).

## Choix de style et bonnes pratiques à respecter
- Pas d’ajout de bibliothèques JS — garder le dépôt léger et pédagogique.
- Préserver la logique côté client actuelle (ex. `window.addEventListener('load', ...)` initialise la donnée par défaut si `localStorage` est vide).
- Messages utilisateur via `alert()` déjà utilisés ; conservez la simplicité si vous remplacez par du HTML, faites-le de manière rétro-compatible.
- Conserver noms de variables en anglais/franglais existants (par ex. `modeSuppression`, `afficherGarage`) pour cohérence historique.

## Ajouts et modifications acceptables
- Refactor local : extraire fonctions purifiées (ex. une petite utilitaire `dom.js`) mais éviter d'introduire un bundler non documenté.
- Ajouter tests manuels : liste de vérification dans PR (ouvrir modal, ajouter, filtrer, mode suppression, vider garage, persistance `localStorage`).

## Emplacements clés à connaître
- `ui/forms.js` — logique principale des formulaires, validation, modal, et ajout en `localStorage`.
- `core/garage.js` — gestion des données du garage, persistance et opérations CRUD.
- `ui/garage-ui.js` — affichage, rendu et filtres.
- `Styles/` — feuilles de style (expliquer classes visuelles comme `.voiture`, `.suppression-selectionnee`).
- `index.html`, `projets.html`, `contact.html` — pages du site; regarder comment les scripts sont inclus en bas des pages.

## Exemples concrets d'amélioration
- Si vous corrigez un bug lié à l'index d'une voiture supprimée (utilisation d'index DOM pour retirer des éléments), préférez calculer l'index via `dataset.index` plutôt que `Array.from(v.parentNode.children).indexOf(v)` pour robustesse.
- Pour l'input `modele` filtré par marque, conservez la logique actuelle qui désactive le `select` quand aucune marque n'est choisie.

## Sécurité et précautions
- Toujours vérifier l'existence des éléments DOM avec `if (element) ...` (le code existant suit déjà cette pratique).
- Ne présumez pas que `localStorage` contient des données valides — ajoutez des `try/catch` lors de la lecture/parsing si vous étendez la fonctionnalité.

---
Si quelque chose n'est pas clair ou si vous voulez que j'ajoute des extraits précis (ex. patchs de refactor), dites-moi quelle section développer. ✅