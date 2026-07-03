// ============================================================================
// Module UTILS - Utilitaires génériques
// ============================================================================

// Retourne un label plus lisible pour certaines marques particulières
// Ex : MercedesBenz -> Mercedes-Benz, LandRover -> Land Rover
export function prettifyBrand(name) {
  const map = {
    MercedesBenz: "Mercedes-Benz",
    LandRover: "Land Rover",
    AlfaRomeo: "Alfa Romeo",
  };
  if (map[name]) return map[name];
  // Sinon ajoute un espace entre les transitions camelCase -> "Land Rover"
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

// Recherche le pays correspondant à une marque donnée en parcourant
// l'objet paysParMarque (clé = pays, valeur = array de marques)
// Retourne 'Inconnu' si la marque n'existe pas dans la table
export function getPaysParMarque(marque, paysParMarque) {
  for (let [pays, marques] of Object.entries(paysParMarque)) {
    if (marques.includes(marque)) return pays;
  }
  return "Inconnu";
}
