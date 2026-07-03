// ============================================================================
// MAIN - Point d'entrée principal (orchestration)
// ============================================================================

import { chargerGarage } from './core/garage.js';
import { populateBrandAndCountrySelects, populateGarageFiltersFromGarage, afficherGarage } from './ui/garage-ui.js';
import { setupUIHandlers } from './ui/forms.js';
import { setupSuppressionHandlers, setupGlobalHandlers } from './handlers.js';
import { paysParMarque, modelesParMarque, allMarques, allModeles } from './data/projets-data.js';
import { afficherMessageTemporaire } from './ui/modals.js';
import { initContact } from './pages/contact.js';

// Expose globals used by some UI helpers (pour éviter de modifier les petits scripts)
// Cette compatibilité permet que window.paysParMarque / window.modelesParMarque soient disponibles.
window.paysParMarque = paysParMarque;
window.modelesParMarque = modelesParMarque;

// Initialisation principale de l'application (garage)
async function initGarage() {
  console.log('📦 Initialisation du garage...');
  
  // Peuple les selects marques/pays dans le DOM pour le formulaire d'ajout
  populateBrandAndCountrySelects(paysParMarque);
  console.log('✅ Selects peuplés');

  // Charge les données depuis localStorage ou seed
  await chargerGarage((msg) => {
    console.log('📢 Notification:', msg);
    afficherMessageTemporaire(msg);
  });
  console.log('✅ Garage chargé');

  // Met à jour les filtres du garage selon les véhicules réellement présents
  populateGarageFiltersFromGarage();
  console.log('✅ Filtres garage synchronisés');

  // Rendu initial du garage
  afficherGarage();
  console.log('✅ Garage affiché');

  // Configuration des handlers (filtres, formulaire, boutons)
  setupUIHandlers(paysParMarque, allMarques, allModeles);
  console.log('✅ UI handlers configurés');

  // Handlers de suppression et globaux
  setupSuppressionHandlers();
  setupGlobalHandlers();
  console.log('✅ Garage complètement initialisé');
}

// Initialisation générale
async function init() {
  console.log('🚀 Démarrage de l\'application');
  
  // Init du garage si on est sur projets.html
  const container = document.querySelector('.garage-container');
  if (container) {
    await initGarage().catch(e => {
      console.error('❌ Erreur init garage:', e);
      afficherMessageTemporaire('❌ Erreur lors du chargement du garage');
    });
  }

  // Init du formulaire contact si présent
  initContact();
}

// Auto-init when module is loaded
init().catch(e => console.error('Init failed:', e));