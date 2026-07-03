# 🚗 Garage Virtuel

> Une application web statique pédagogique pour gérer une collection de véhicules, sans framework ni dépendances externes.

[![Licence MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](#licence)
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Guide de développement](#-guide-de-développement)
- [Structure du code](#-structure-du-code)
- [Roadmap - Plans futurs](#-roadmap---plans-futurs)
- [Contribution](#-contribution)
- [Licence](#licence)

## 🎯 À propos

**Garage Virtuel** est un projet éducatif conçu pour enseigner les bases du développement web front-end. Il démontre comment construire une application interactive sans framework ni dépendances externes, en utilisant uniquement :

- **HTML 5** pour la structure
- **CSS 3** pour le design
- **JavaScript Vanilla** pour la logique métier
- **localStorage** pour la persistance des données

Le projet est parfait pour :
- 🎓 **Apprentissage** : comprendre les patterns front-end essentiels
- 📚 **Ateliers** : base pour des exercices éducatifs
- 🔧 **Prototypage** : démarrer rapidement sans toolchain complexe

## ✨ Fonctionnalités

### Cœur de l'application
- ✅ **Gestion CRUD complète** : Ajouter, consulter, filtrer et supprimer des véhicules
- ✅ **Persistance locale** : Sauvegarde automatique via `localStorage`
- ✅ **Filtrage avancé** : Recherche par marque, modèle, pays d'origine
- ✅ **Autocomplétion** : Suggestions intelligentes lors de la saisie
- ✅ **Mode suppression** : Sélectionner et supprimer en masse facilement
- ✅ **Statistiques** : Affichage du nombre total et filtré de véhicules

### Interface utilisateur
- 📱 **Design responsive** : Compatible desktop, tablet et mobile
- 🎨 **Thème cohérent** : Styles minimalistes et pédagogiques
- ♿ **Accessibilité** : Sémantique HTML appropriée et navigation au clavier
- 🌍 **Français** : Interface entièrement en français

### Pages du site
- **Accueil** (`index.html`) : Présentation et objectifs du projet
- **Garage** (`projets.html`) : Gestion interactive de la collection
- **Contact** (`contact.html`) : Formulaire de contact (démonstration)

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un éditeur de code (VS Code, Sublime, etc.)
- *(Optionnel)* Un serveur local simple

### Étapes

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/votre-utilisateur/Garage-Virtuel.git
   cd Garage-Virtuel
   ```

2. **Ouvrir dans le navigateur** :
   - Option A : Double-cliquer sur `index.html` dans l'explorateur de fichiers
   - Option B : Utiliser un serveur local
     ```bash
     # Avec Python 3
     python -m http.server 8000
     
     # Avec Node.js
     npx http-server
     ```
   - Puis ouvrir `http://localhost:8000` dans le navigateur

3. **C'est tout !** 🎉 Aucune installation de dépendances requise

## 💻 Utilisation

### Gestion du garage

#### Ajouter une voiture
1. Cliquer sur le bouton **"Ajouter une voiture"**
2. Remplir le formulaire :
   - **Marque** : Sélectionner dans la liste ou taper pour chercher
   - **Modèle** : Saisir le modèle du véhicule
   - **Image** : Coller une URL d'image
   - **Description** : Ajouter une description (optionnel)
3. Cliquer **"Valider"** pour ajouter
4. Les données sont **automatiquement sauvegardées**

#### Filtrer et rechercher
- **Par marque** : Sélectionner dans le dropdown "Marque"
- **Par modèle** : Taper dans le champ "Modèle" pour recherche en temps réel
- Les statistiques se mettent à jour automatiquement

#### Supprimer des véhicules
1. Cliquer sur **"Mode suppression"**
2. Cocher les voitures à supprimer
3. Cliquer **"Confirmer suppression"**
4. Les changements sont persistés automatiquement

#### Vider le garage
- Cliquer sur **"Vider le garage"** pour nettoyer toutes les données
- ⚠️ Action irréversible !

### Persistance des données

Les données sont **sauvegardées automatiquement** dans le `localStorage` du navigateur :
- Les modifications sont persistées après chaque action
- Les données survivent à la fermeture de l'onglet
- Chaque navigateur/appareil a son propre garage
- ⚠️ Nettoyer le cache du navigateur = perte des données

## 🏗️ Architecture

### Structure du projet

```
Garage-Virtuel/
├── HTML                   
│   ├── index.html         # Page d'accueil
│   ├── projets.html       # Page du garage (interface principale)
│   └── contact.html       # Page de contact
├── Data/
│   ├── cars.json          # Données de véhicules pré-remplies
│   └── filters.json       # Configuration des filtres
├── Images/                # Dossier pour les images (vide par défaut)
├── Scripts/
│   ├── main.js            # Point d'entrée et orchestration
│   ├── handlers.js        # Gestion des événements globaux
│   ├── core/
│   │   └── garage.js      # Logique métier (CRUD, persistance)
│   ├── data/
│   │   ├── cars-json.js   # Données initiales des voitures
│   │   └── projets-data.js # Données de marques/pays/modèles
│   ├── pages/
│   │   └── contact.js     # Logique du formulaire contact
│   ├── ui/
│   │   ├── forms.js       # Gestion des formulaires et modaux
│   │   ├── garage-ui.js   # Rendu et affichage du garage
│   │   └── modals.js      # Utilitaires pour modaux/notifications
│   └── utils/
│       └── index.js       # Fonctions utilitaires
└── Styles/
    ├── style.css          # Styles globaux
    ├── garage.css         # Styles spécifiques au garage
    ├── contact.css        # Styles du formulaire contact
    ├── apprentissage.css  # Styles pédagogiques (animations)
    └── expr-s.css         # Thème expression
```

### Flux de données

```
localStorage
    ↑ ↓
garage.js (core)  ← État du garage
    ↑ ↓
forms.js (UI)     ← Interactions utilisateur
    ↑ ↓
garage-ui.js      ← Rendu et affichage
```

### Modules clés

#### 1. **`core/garage.js`** (Logique métier)
- Gestion du tableau `garage` (état global)
- `addVoiture()` : Ajouter une voiture avec ID unique
- `removeByIndexes()` : Supprimer par index
- `removeByIds()` : Supprimer par ID unique
- `clearGarage()` : Vider complètement
- `persist()` : Sauvegarder dans localStorage

#### 2. **`ui/forms.js`** (Formulaires)
- Gestion du modal d'ajout
- Validation des champs
- Autocomplétion (marques/modèles)
- Handlers des boutons

#### 3. **`ui/garage-ui.js`** (Affichage)
- Rendu des voitures en DOM
- Filtrage en temps réel
- Mode suppression
- Mise à jour des statistiques

#### 4. **`handlers.js`** (Événements globaux)
- Listeners des filtres
- Gestion du mode suppression
- Réinitialisation

## 📖 Guide de développement

### Stack technique
- **JavaScript** : ES6 Modules (import/export)
- **Pas de framework** : Code vanilla pour apprentissage
- **Pas de bundler** : Les scripts sont incluís directement dans les pages HTML
- **Pas de tests automatisés** : Tests manuels dans le navigateur

### Conventions de code

#### Nommage
- Variables anglaises (compatibilité historique)
- Variables globales avec `window.*` ou export ES6
- CamelCase pour les fonctions et variables
- UPPERCASE pour les constantes

#### Exemple
```javascript
// ✅ Bon
export function addVoiture(voiture) { ... }
export let garage = [];

// ❌ À éviter
let addVoiture = function() { ... }
var garage = [];
```

### Ajouter une nouvelle fonctionnalité

1. **Identifier le module concerné** (core/, ui/, pages/, etc.)
2. **Modifier ou créer le fichier** (voir architecture ci-dessus)
3. **Exporter la fonction** si utilisée ailleurs
4. **Tester manuellement** dans le navigateur
5. **Vérifier localStorage** (F12 → Application → localStorage)

### Exemple : Ajouter un filtre par pays

```javascript
// Dans ui/garage-ui.js
export function filtrerParPays(pays) {
  return garage.filter(v => v.pays === pays);
}

// Dans ui/forms.js
document.getElementById('filtre-pays').addEventListener('change', (e) => {
  const voitures = filtrerParPays(e.target.value);
  afficherVoitures(voitures);
});
```

### Déboguer

1. **Ouvrir les DevTools** : `F12` ou `Ctrl+Shift+I`
2. **Console** : Voir les logs et erreurs
3. **Application/Storage** : Inspecter `localStorage.garage`
4. **Sources** : Mettre des breakpoints dans les scripts
5. **Network** : Vérifier le chargement des ressources

### Commandes utiles (navigateur)

```javascript
// Afficher le garage actuel
console.log(JSON.parse(localStorage.getItem('garage')));

// Vider le localStorage
localStorage.clear();

// Remplir avec des données de test
localStorage.setItem('garage', JSON.stringify([
  { id: '1', marque: 'Ferrari', modele: '488', pays: 'Italie' }
]));
```

## 🌍 Localisation

- **Langue** : Français (France)
- **Format dates** : JJ/MM/AAAA
- **Séparateurs** : Virgule (,) pour décimales
- **Interface** : Fully francophone

Pour changer de langue, voir les fichiers HTML (balises `lang`, textes dans le DOM, etc.)

## 🧩 Structure du code

Une explication détaillée de l’organisation du projet et de l’interaction entre les scripts est disponible dans [CODE_STRUCTURE.md](CODE_STRUCTURE.md).

Elle couvre :
- le rôle de chaque dossier et fichier
- le fonctionnement du point d’entrée principal
- le flux entre les modules UI, core et data
- un exemple concret d’ajout ou de filtrage d’un véhicule

## 📚 Ressources pédagogiques

### Concepts enseignés
- ✅ Manipuler le DOM avec `document.querySelector()` / `getElementById()`
- ✅ Gestion des événements (`addEventListener`, delegation)
- ✅ ES6 Modules (`import`/`export`)
- ✅ Stockage client (`localStorage` JSON)
- ✅ Opérations CRUD simples
- ✅ Filtrage et recherche en temps réel
- ✅ Validation de formulaires
- ✅ Modals et notifications
- ✅ Responsive design et accessibilité

### Pour aller plus loin
- 🔗 [MDN Web Docs - DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model)
- 🔗 [MDN - localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
- 🔗 [MDN - ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- 🔗 [Web.dev - CSS Responsive](https://web.dev/responsive-web-design-basics/)

## 🗺️ Roadmap - Plans futurs

**Garage Virtuel** évolue vers un **réseau social pour passionnés de véhicules**. Voici la vision globale :

### Phase 2 : Amélioration de l'expérience utilisateur

Objectif : Enrichir l'interface et les données des véhicules.

- 🎴 **Carte détaillée des véhicules** :
  - Cliquer sur une voiture affiche une modal avec tous les détails
  - Affichage complet : photos, historique, caractéristiques techniques
  - Galerie d'images pour chaque véhicule
  - Évaluation et notes des utilisateurs

- 📋 **Formulaire d'ajout amélioré** :
  - Champs étendus : kilométrage, année, couleur, prix, état, historique d'entretien
  - Upload multiple d'images (au lieu d'une seule URL)
  - Tags et catégories (collection, projet, vente, échange)
  - Brouillon automatique lors de la saisie

- 🎨 **Amélioration de l'UI** :
  - Thème sombre / clair
  - Animations CSS avancées
  - Icônes et visuels enrichis
  - Export/Import en CSV ou JSON

### Phase 3 : Système utilisateur

Objectif : Créer des profils et des interactions entre utilisateurs.

- 👤 **Comptes utilisateurs** :
  - Inscription / Connexion
  - Profil public avec statistiques
  - Historique des actions

- 🔐 **Authentification** :
  - Backend API (Node.js/Express ou autre)
  - Sessions ou JWT tokens
  - Sécurité et validation côté serveur

- 📊 **Gestion des données** :
  - Migration de `localStorage` vers une **base de données** (MongoDB, PostgreSQL)
  - Synchronisation multi-appareil
  - Cloud backup automatique

### Phase 4 : Interactions sociales

Objectif : Transformer en réseau social pour passionnés.

- ❤️ **Système de likes/favoris** :
  - "Aimer" une voiture d'un autre utilisateur
  - Liste des favoris personnels
  - Compteur public des likes

- 👁️ **Suivi des garages** :
  - S'abonner aux collections d'autres utilisateurs
  - Notifications quand un suivi ajoute une voiture
  - Fil d'actualité personalisé

- 💬 **Système de commentaires** :
  - Commenter sur les véhicules
  - Discussions et conseils entre passionnés
  - Modération et signalements

- 🏆 **Achievements et badges** :
  - Badges pour collections remarquables
  - Classements (meilleure collection, plus actif, etc.)
  - Événements et défis communautaires

### Phase 5 : Fonctionnalités avancées

Objectif : Créer un écosystème complet.

- 📱 **Application mobile** :
  - React Native ou Progressive Web App (PWA)
  - Notifications push
  - Offline-first synchronization

- 🗺️ **Localisation avancée** :
  - Carte interactive (Google Maps)
  - Emplacement des véhicules / événements
  - Géolocalisation de meetups entre passionnés

- 🔄 **Marché et échanges** :
  - Annonces de vente/échange de véhicules
  - Système de messages privés
  - Évaluation des vendeurs

- 📰 **Blog et contenu** :
  - Articles sur les véhicules
  - Tutoriels d'entretien
  - Galerie de photos de la communauté
  - Événements et sorties

### 📅 Timeline

| Phase | Durée estimée | État |
|-------|------|-------|
| 🎓 **Phase 1 (Actuelle)** | ✅ Complétée | Version de base fonctionnelle |
| 🎨 **Phase 2** | À définir | Amélioration UX |
| 👤 **Phase 3** | À définir | Utilisateurs et données |
| 💬 **Phase 4** | À définir | Interactions sociales |
| 🚀 **Phase 5** | À définir | Écosystème complet |

**Note** : Les timelines sont flexibles selon le temps disponible et les contributions de la communauté. Les priorités peuvent changer selon les retours utilisateurs.

### 🎯 Vision à long terme

Garage Virtuel ambitionne de devenir **la plateforme communautaire de référence pour les passionnés de véhicules**, combinant :
- 📸 Gestion de collections
- 🤝 Interactions sociales
- 💰 Marché et échanges
- 🎓 Partage de connaissances
- 🏆 Gamification et compétitions

Tout en restant **simple, accessible et respectueux de la vie privée**.

### 🤝 Votre avis compte !

Vous avez des idées pour le futur de Garage Virtuel ?
- 💡 Ouvrir une [Discussion](../../discussions)
- 🎯 Voter pour les features [ici](../../issues)
- 🔄 Contribuer à la réalisation des phases

**👉 Pour voir tous les détails techniques et les plans détaillés, consultez le [ROADMAP.md complet](ROADMAP.md) !**

---

## 🤝 Contribution

Les contributions sont bienvenues ! 🎉

### Comment contribuer
1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonction`)
3. Commiter vos changes (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonction`)
5. Ouvrir une Pull Request

### Tests avant de contribuer
- ✅ Ouvrir le modal et ajouter une voiture
- ✅ Filtrer par marque et modèle
- ✅ Activer le mode suppression et supprimer
- ✅ Vider le garage
- ✅ Rafraîchir la page (persistance)
- ✅ Tester sur mobile (responsive)

### Lignes directrices
- Pas de framework (keep it vanilla!)
- Pas de dépendances externes
- Conserver le style pédagogique
- Documenter les nouvelles fonctions
- Préférer la clarté à la complexité

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Créé comme un projet pédagogique pour l'enseignement du développement web front-end.

---

**Besoin d'aide ?**
- 📖 Lire la [Guide de développement](#-guide-de-développement)
- 🐛 Ouvrir une [Issue](../../issues)
- 💬 Proposer une [Pull Request](../../pulls)

**Aimez le projet ?** ⭐ Donnez une étoile !
