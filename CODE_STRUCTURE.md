# Structure du code et interaction des scripts

Ce document explique comment le code du projet est organisé et comment les différents scripts interagissent entre eux.

## 1. Vue d’ensemble

Le projet est une application web statique en JavaScript vanilla. Les pages HTML chargent des scripts modules ES6 via l’attribut `type="module"`.

L’architecture est séparée en plusieurs parties :

- Frontend HTML/CSS
- Logique métier dans le dossier Scripts/core
- Interface et rendu dans Scripts/ui
- Gestion des événements dans Scripts/handlers.js
- Données de base dans Scripts/data
- Pages spécifiques comme contact dans Scripts/pages

---

## 2. Structure principale du projet

```text
Garage-Virtuel/
├── index.html
├── projets.html
├── contact.html
├── Scripts/
│   ├── main.js
│   ├── handlers.js
│   ├── core/
│   │   └── garage.js
│   ├── data/
│   │   ├── cars-json.js
│   │   └── projets-data.js
│   ├── pages/
│   │   └── contact.js
│   ├── ui/
│   │   ├── forms.js
│   │   ├── garage-ui.js
│   │   └── modals.js
│   └── utils/
│       └── index.js
├── Styles/
└── Data/
```

---

## 3. Point d’entrée du projet

### Page principale : index.html
Cette page sert surtout à la présentation du projet. Elle affiche les informations générales et les objectifs du site.

### Page du garage : projets.html
C’est la page la plus importante du projet. Elle initialise l’application du garage.

### Page de contact : contact.html
Elle charge la logique spécifique de contact à partir de Scripts/pages/contact.js.

---

## 4. Interaction des scripts

### A. Chargement initial
Lorsqu’une page est ouverte, le script principal charge les modules nécessaires.

Le point d’entrée est généralement :

- Scripts/main.js

Ce fichier agit comme l’orchestrateur central de l’application.

### B. Rôle de main.js
Le fichier main.js est le centre de coordination.

Il fait principalement :

1. Initialiser le garage
2. Charger les données depuis localStorage ou depuis les données de départ
3. Rendre les véhicules dans l’interface
4. Configurer les formulaires et les interactions utilisateur
5. Déclencher les handlers globaux pour les filtres et actions

Il importe et relie plusieurs modules :

- core/garage.js : gestion des voitures et du stockage
- ui/garage-ui.js : affichage du garage et filtres
- ui/forms.js : interactions du formulaire
- handlers.js : gestion des événements généraux
- data/projets-data.js : données de référence pour marques, modèles et pays
- ui/modals.js : messages temporaires et confirmations
- pages/contact.js : logique du formulaire de contact

---

## 5. Rôle de chaque module

### Scripts/core/garage.js
C’est le cœur de la logique métier.

Il gère :

- l’état du garage en mémoire
- l’ajout de véhicules
- la suppression de véhicules
- la génération d’identifiants uniques
- la sauvegarde dans localStorage

En pratique, c’est le module qui sert de “source de vérité” pour les voitures.

### Scripts/ui/garage-ui.js
Ce module s’occupe de l’affichage du garage.

Il gère :

- le rendu des cartes de véhicules
- l’affichage des filtres
- la mise à jour des statistiques
- le mode suppression

### Scripts/ui/forms.js
Ce module gère les formulaires et l’interaction utilisateur.

Il s’occupe de :

- l’ouverture et la fermeture du formulaire d’ajout
- la validation des données saisies
- l’autocomplétion des marques et modèles
- la soumission des nouveaux véhicules

### Scripts/handlers.js
Ce fichier centralise les événements globaux du site.

Il écoute par exemple :

- les modifications des filtres
- les clics sur les boutons de suppression
- les actions globales du garage

### Scripts/data/*.js
Ces fichiers contiennent les données de base utilisées par l’interface.

Exemples :

- cars-json.js : liste initiale de voitures
- projets-data.js : marques, modèles, pays et autres données de référence

### Scripts/pages/contact.js
Ce module est spécifique à la page de contact.

Il initialise le formulaire de contact et applique la logique associée.

### Scripts/utils/index.js
Ce module contient des fonctions utilitaires réutilisées par les autres modules.

---

## 6. Flux de fonctionnement du garage

Voici le schéma simple de l’interaction :

```text
Utilisateur
   ↓
Formulaire / filtres / boutons
   ↓
Scripts/ui/forms.js ou handlers.js
   ↓
Scripts/core/garage.js
   ↓
Mise à jour de l’état du garage
   ↓
Scripts/ui/garage-ui.js
   ↓
Rendu dans la page HTML
```

### Exemple concret : ajouter une voiture

1. L’utilisateur remplit le formulaire dans la page du garage.
2. Scripts/ui/forms.js récupère les données saisies.
3. Les données sont envoyées à Scripts/core/garage.js.
4. Le garage met à jour son état et sauvegarde dans localStorage.
5. Scripts/ui/garage-ui.js rafraîchit l’affichage avec la nouvelle voiture.

### Exemple concret : filtrer les véhicules

1. L’utilisateur modifie un filtre.
2. Scripts/handlers.js détecte l’événement.
3. La logique du filtre est appliquée.
4. Scripts/ui/garage-ui.js affiche uniquement les éléments correspondants.

---

## 7. Rôle du stockage local

Le projet utilise localStorage pour conserver les données du garage dans le navigateur.

Le flux est le suivant :

```text
Action utilisateur → modification du garage → sauvegarde dans localStorage
```

Ainsi, si la page est rechargée, les données restent disponibles.

---

## 8. Résumé simple

En résumé :

- main.js initialise l’application
- core/garage.js centralise les données
- ui/forms.js gère les formulaires
- ui/garage-ui.js affiche les voitures et les filtres
- handlers.js gère les événements
- data/ fournit les données de base
- pages/contact.js gère la page contact

Cela permet d’avoir un code plus clair, modulaire et plus facile à maintenir.
