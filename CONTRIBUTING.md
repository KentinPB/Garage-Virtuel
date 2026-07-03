# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **Garage Virtuel** ! Ce document explique comment contribuer au projet.

## 📋 Table des matières

- [Avant de commencer](#avant-de-commencer)
- [Comment soumettre une contribution](#comment-soumettre-une-contribution)
- [Processus Pull Request](#processus-pull-request)
- [Guide de style](#guide-de-style)
- [Tests et validation](#tests-et-validation)
- [Questions ou problèmes](#questions-ou-problèmes)

## Avant de commencer

### Types de contributions bienvenues

✅ **Code** : Nouvelles fonctionnalités, corrections de bugs, refactoring  
✅ **Documentation** : Clarifications, exemples, traductions  
✅ **Tests** : Cas de test, amélioration de la couverture  
✅ **Designs** : Améliorations UI/UX, accessibilité  
✅ **Issues** : Rapports de bugs, suggestions de fonctionnalités  

### Principes du projet

🎓 **Pédagogique** : Le code doit rester simple et explicite  
🚫 **Pas de dépendances** : Zéro framework, zéro npm package  
♿ **Accessible** : HTML sémantique, navigation au clavier  
📱 **Responsive** : Compatible tous les écrans  
🌍 **Français** : Interface et documentation en français  

## Comment soumettre une contribution

### 1. Signaler un bug 🐛

Ouvrir une **Issue** avec le titre et la description précis :

```
Titre : [BUG] Le modal d'ajout ne se ferme pas après validation

Description :
- Environnement : Chrome 120 sur Windows 11
- Étapes :
  1. Cliquer sur "Ajouter une voiture"
  2. Remplir le formulaire
  3. Cliquer "Valider"
  
- Résultat attendu : Le modal se ferme
- Résultat actuel : Le modal reste ouvert
```

### 2. Suggérer une fonctionnalité ✨

Ouvrir une **Issue** avec le label `enhancement` :

```
Titre : [FEATURE] Ajouter export en CSV

Description :
Permettre aux utilisateurs d'exporter leur garage en fichier CSV
pour utilisation dans un tableur.

Cas d'usage :
- Créer un backup de sa collection
- Analyser les données dans Excel/Sheets
```

### 3. Soumettre du code 💻

#### Étape 1 : Forker le projet

```bash
# Sur GitHub.com
# Cliquer "Fork" en haut à droite du projet
```

#### Étape 2 : Cloner votre fork

```bash
git clone https://github.com/votre-utilisateur/Garage-Virtuel.git
cd Garage-Virtuel
```

#### Étape 3 : Créer une branche

```bash
# Branche pour une fonctionnalité
git checkout -b feature/export-csv

# Branche pour un bug
git checkout -b fix/modal-fermeture

# Branche pour la documentation
git checkout -b docs/guide-utilisation
```

**Convention de nommage** :
- `feature/nom-fonctionnalité` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs
- `docs/nom-doc` : Mises à jour documentation
- `refactor/nom-refactor` : Refactoring de code
- `test/nom-test` : Ajout de tests

#### Étape 4 : Faire vos modifications

```bash
# Éditer les fichiers
# Tester dans le navigateur (voir section Tests)
# Commiter les changements
git add .
git commit -m "Ajouter export CSV

- Ajouter bouton 'Exporter en CSV'
- Implémenter logique d'export dans garage-ui.js
- Ajouter style du bouton dans garage.css
- Tester avec 10+ véhicules"
```

**Format du commit** :
```
Sujet court (50 caractères max)

Description détaillée (si besoin) :
- Point 1
- Point 2

Fixes #123 (si correction de bug associé)
```

#### Étape 5 : Push et Pull Request

```bash
git push origin feature/export-csv
```

Puis sur GitHub.com, cliquer **"Compare & pull request"**

## Processus Pull Request

### Avant de soumettre

**Checklist** :

- [ ] Le code suit le [Guide de style](#guide-de-style)
- [ ] Les modifications ont été testées dans le navigateur
- [ ] `localStorage` fonctionne correctement (F12 → Application)
- [ ] Le design est responsive (testable avec F12)
- [ ] La documentation a été mise à jour si besoin
- [ ] Aucune console.log() de debug en production
- [ ] Pas de dépendance externe ajoutée

### Description de la PR

```markdown
## Description
Ajoute la fonctionnalité d'export en CSV permettant aux utilisateurs
de télécharger leur collection de véhicules.

## Modifications
- ✅ Nouveau bouton "Exporter CSV" dans la barre d'outils
- ✅ Logique d'export dans `Scripts/ui/garage-ui.js`
- ✅ Styles correspondants dans `Styles/garage.css`

## Tests
- ✅ Ajout de 10 véhicules
- ✅ Export en CSV généré correctement
- ✅ Fichier ouvert dans Excel → OK
- ✅ Responsive sur mobile

## Fixes
Fixes #42 (signaler un numéro d'issue si applicable)

## Screenshots
[Ajouter des captures d'écran si modification UI]
```

### Révision et feedback

- Les mainteneurs réviseront votre PR
- Des suggestions peuvent être proposées
- Vous pouvez ajouter des commits supplémentaires pour répondre aux demandes
- Une fois approuvé, votre PR sera fusionnée ! 🎉

## Guide de style

### Code JavaScript

#### Nommage

```javascript
// ✅ Bon
const isModeSuppression = true;
export function afficherGarage() { }
const MAX_VOITURES = 1000;

// ❌ À éviter
const IsModeSuppression = true;  // PascalCase pour variable
const show_garage = () => { };   // snake_case
let tmp = 100;                   // Nom peu explicite
```

#### Commentaires

```javascript
// ✅ Bon
// ============================================================================
// Module CORE - Gestion des données du garage
// ============================================================================

// Génère un ID unique pour chaque voiture
export function generateId(marque = '', modele = '') {
  // Implémentation...
}

// ❌ À éviter
// ceci fait xyz
function foo() { }

// Pas de commentaire pour code évident
const x = 5; // x = 5
```

#### Formatage

```javascript
// ✅ Bon - Lisible et structuré
export function addVoiture(voiture) {
  if (!voiture.id) {
    voiture.id = generateId(voiture.marque, voiture.modele);
  }
  garage.push(voiture);
  persist();
}

// ❌ À éviter - Difficile à lire
export function addVoiture(v){if(!v.id){v.id=generateId(v.marque,v.modele);}garage.push(v);persist();}
```

#### Import/Export

```javascript
// ✅ Bon
import { garage, addVoiture } from '../core/garage.js';
export function myFunction() { }

// ❌ À éviter
const { garage } = require('../core/garage.js');  // CommonJS
import * as everything from './module.js';       // Import tout
```

### HTML

```html
<!-- ✅ Bon - Sémantique, id unique, classes descriptives -->
<section id="garage-container" class="garage-wrapper">
  <button id="add-car-btn" class="btn btn-primary">Ajouter</button>
  <article class="car-card">
    <img src="..." alt="Marque et modèle" />
    <h3>Titre</h3>
  </article>
</section>

<!-- ❌ À éviter -->
<div id="main">  <!-- section serait mieux -->
  <button onclick="add()">+</button>  <!-- addEventListener serait mieux -->
  <img src="..." />  <!-- Alt text manquant -->
</div>
```

### CSS

```css
/* ✅ Bon - Clair, organisé, commentaires explicatifs */
/* Section du garage - Conteneur principal */
.garage-container {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.car-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

/* Mode suppression - Modifier les voitures sélectionnables */
.car-card.suppression-selectionnee {
  border-color: #d32f2f;
  background-color: rgba(211, 47, 47, 0.05);
}

/* ❌ À éviter */
.gc { display: grid; }  /* Nom peu explicite */
.card { border: 1px solid red; }  /* Couleur codée dur */
```

## Tests et validation

### ✅ Tester votre contribution

#### 1. Fonctionnalité de base

Avant de committer :

```javascript
// Test dans la console du navigateur (F12)
// 1. Vérifier que localStorage fonctionne
console.log(localStorage.getItem('garage'));

// 2. Tester chaque fonction modifiée
// Pour une nouvelle fonction addExportCSV()
console.log(addExportCSV(['Voiture 1', 'Voiture 2']));
```

#### 2. Checklist manuelle

- [ ] Le modal s'ouvre/ferme correctement
- [ ] L'ajout persiste après rafraîchir (F5)
- [ ] Les filtres fonctionnent en temps réel
- [ ] Le mode suppression fonctionne
- [ ] Pas d'erreur dans la console (F12 → Console)
- [ ] Responsive : testez sur mobile (F12 → Ctrl+Shift+M)
- [ ] Tous les textes sont en français

#### 3. Tests browser

- [ ] **Chrome/Edge** (Chromium) : Windows/Mac
- [ ] **Firefox** : Windows/Mac
- [ ] **Safari** : Mac/iOS (si possible)
- [ ] **Responsive** : Mobile (375px), Tablette (768px), Desktop (1920px)

## Questions ou problèmes

- 🐛 **Bug trouvé ?** Ouvrir une Issue
- ❓ **Question sur le processus ?** Commenter dans une Issue existante
- 💬 **Discussion générale ?** Ouvrir une Discussion GitHub

---

**Merci d'avoir contribué à Garage Virtuel !** 🎉

Chaque contribution, même petite, aide le projet à s'améliorer. 🙏
