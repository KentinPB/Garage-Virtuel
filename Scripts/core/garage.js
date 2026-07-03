// ============================================================================
// Module CORE - Gestion des données du garage (persistence, opérations purement data)
// ============================================================================
// `garage` contient le tableau courant des voitures en mémoire
export let garage = [];

// Persist la variable `garage` dans localStorage sous forme JSON
function persist() {
  localStorage.setItem("garage", JSON.stringify(garage));
}

// Remplace complètement le tableau `garage` et persiste
export function setGarage(arr) {
  garage = arr;
  persist();
}

// Génère un ID unique basé sur marque/modele + date lisible
// Format : marque-modele-YYYYMMDDHHMMSSmmm (millisecondes). Si collision, ajoute un suffixe numérique incrémental.
export function generateId(marque = '', modele = '') {
  const base = `${String(marque)}-${String(modele)}`.replace(/\s+/g, '_');
  const now = new Date();
  const pad = (n, z = 2) => String(n).padStart(z, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${String(now.getMilliseconds()).padStart(3,'0')}`;
  let id = `${base}-${date}`;
  // si collision improbable, ajoute -1, -2, ... jusqu'à unicité
  let suffix = 1;
  while (garage.some(v => v.id === id)) {
    id = `${base}-${date}-${suffix}`;
    suffix++;
  }
  return id;
}
// Expose une version globale pour les scripts legacy (fallback compat)
window.generateCarId = generateId;

// Ajoute une voiture à `garage`, lui attribue un ID si nécessaire, et persiste
export function addVoiture(voiture) {
  if (!voiture.id) {
    voiture.id = generateId(voiture.marque, voiture.modele);
    // Garantit l'unicité en vérifiant les IDs existants
    while (garage.some(v => v.id === voiture.id)) {
      voiture.id = generateId(voiture.marque, voiture.modele);
    }
  }
  garage.push(voiture);
  persist();
}

// Supprime des éléments par index (array d'index)
// trie en ordre décroissant pour éviter les décalages lors des splice
export function removeByIndexes(indexes) {
  const idxs = Array.from(indexes).slice().sort((a, b) => b - a);
  let removed = 0;
  for (const i of idxs) {
    if (i >= 0 && i < garage.length) {
      garage.splice(i, 1);
      removed++;
    }
  }
  persist(); // met à jour le localStorage après suppression
  return removed; // retourne le nombre d'éléments supprimés
}

// Supprime des éléments en fournissant un tableau d'IDs (strings)
export function removeByIds(ids) {
  const setIds = new Set(ids.map(String));
  const before = garage.length;
  // Mutate in-place to preserve the array reference
  const filtered = garage.filter(v => !setIds.has(String(v.id)));
  garage.length = 0;
  garage.push(...filtered);
  persist();
  return before - garage.length; // nombre d'éléments supprimés
}

// Vide complètement le garage et supprime la clé du localStorage
export function clearGarage() {
  garage = [];
  localStorage.removeItem("garage");
}

/**
 * Charger les données du garage :
 * - si localStorage contient quelque chose de valide, l'utiliser
 * - sinon tenter de charger `Data/cars.json` via fetch
 * - notify(text) est optionnel pour remonter un message à l'UI
 */
export async function chargerGarage(notify) {
  const sauvegarde = localStorage.getItem("garage");

  // Si sauvegarde présente, on essaie de la parser
  if (sauvegarde) {
    try {
      const donnees = JSON.parse(sauvegarde);
      if (Array.isArray(donnees)) {
        garage = donnees; // utilisation du localStorage si valide
        return;
      }
    } catch (e) {
      // JSON invalide — on ignore et on continue vers le seed externe
    }
  }

  // Tentative de chargement externe (seed)
  try {
    const reponse = await fetch("Data/cars.json"); // requête HTTP relative
    if (!reponse.ok) {
      // Si le serveur renvoie une erreur, on notifie et on quitte avec fallback vide
      console.error("Erreur HTTP seed:", reponse.status);
      notify?.(`⚠️ Erreur ${reponse.status} lors du chargement de cars.json`);
      garage = [];
      localStorage.removeItem("garage");
      return;
    }

    const text = await reponse.text(); // lecture brute du texte JSON
    let donnees;
    try {
      donnees = JSON.parse(text); // parse du JSON reçu
    } catch (e) {
      // Si parse échoue, on logge un extrait autour de la position d'erreur
      console.error("Erreur de parsing JSON:", e);
      const m = /position (\d+)/.exec(String(e.message));
      const pos = m ? Number(m[1]) : null;
      const snippet = pos !== null ? text.slice(Math.max(0, pos - 60), pos + 60) : text.slice(0, 240);
      console.error("Extrait autour de l'erreur:\n", snippet);
      notify?.("⚠️ JSON malformé dans cars.json — voir la console (DevTools)");
      garage = [];
      localStorage.removeItem("garage");
      return;
    }

    // Si c'est bien un tableau, on l'utilise et on persiste
    if (Array.isArray(donnees)) {
      // Assure que chaque voiture a un ID unique (pour compat avec l'ancien format)
      const existingIds = new Set();
      for (const v of donnees) {
        if (!v.id) {
          v.id = generateId(v.marque, v.modele);
        }
        // collision improbable : régénère si besoin
        while (existingIds.has(String(v.id))) {
          v.id = generateId(v.marque, v.modele);
        }
        existingIds.add(String(v.id));
      }
      garage = donnees;
      persist();
    } else {
      // Le contenu du fichier n'est pas au format attendu (tableau)
      console.error("Seed JSON invalide : ce n'est pas un tableau");
      garage = [];
      notify?.("⚠️ cars.json n'est pas un tableau JSON valide.");
      localStorage.removeItem("garage");
    }
  } catch (e) {
    // Erreur réseau ou autre lors du fetch
    console.error("Erreur lors du chargement du seed:", e);
    garage = [];
    notify?.("⚠️ Impossible de charger cars.json");
  }
}
