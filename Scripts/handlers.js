// ============================================================================
// HANDLERS - Event delegation et initialisation des handlers globaux
// ============================================================================

import { isModeSuppressionActive, toggleModeSuppression } from './ui/garage-ui.js';

// Délégation d'événements pour la sélection en mode suppression
// On attache un seul listener sur le conteneur pour éviter l'empilement
export function setupSuppressionHandlers() {
  const container = document.querySelector('.garage-container');
  if (!container) return; // pas de conteneur

  container.addEventListener('click', (e) => {
    if (!isModeSuppressionActive()) return; // ne rien faire si pas en mode suppression
    const card = e.target.closest('.voiture');
    if (!card) return;
    card.classList.toggle('suppression-selectionnee'); // bascule la sélection
  });
}

// Configuration des raccourcis clavier et autres handlers globaux
export function setupGlobalHandlers() {
  // Raccourci clavier : Echap quitte le mode suppression
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isModeSuppressionActive()) {
      toggleModeSuppression();
    }
  });
}
