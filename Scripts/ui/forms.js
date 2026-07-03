// ============================================================================
// Module UI - Formulaires et gestion des actions (ajout, suppression, reset)
// ============================================================================

import { addVoiture, clearGarage, removeByIds, garage } from '../core/garage.js';
import { getPaysParMarque } from '../utils/index.js';
import { afficherGarage, filtrerGarage, toggleModeSuppression, isModeSuppressionActive, populateGarageFiltersFromGarage } from './garage-ui.js';
import { afficherMessageTemporaire, afficherConfirmation } from './modals.js';

// Nombre de caractères minimum avant d'afficher les suggestions
const SUGGEST_THRESHOLD = 2;

function setDatalistOptions(datalist, options = []) {
  if (!datalist) return;
  datalist.innerHTML = options.map(value => `<option value="${value}">`).join('');
}

function updateBrandDatalist(value = '', brands = []) {
  const brandDatalist = document.getElementById('marque-list');
  if (!brandDatalist) return;
  if (!value || value.length < SUGGEST_THRESHOLD) {
    brandDatalist.innerHTML = '';
    return;
  }

  const lower = value.toLowerCase();
  const filtered = brands
    .filter(m => String(m).toLowerCase().includes(lower))
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  setDatalistOptions(brandDatalist, filtered);
}

function getModeleSuggestions(marque = '') {
  const suggestions = garage
    .filter(v => v && v.modele)
    .filter(v => !marque || v.marque === marque)
    .map(v => String(v.modele).trim())
    .filter(Boolean);
  return Array.from(new Set(suggestions)).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function refreshSearchSuggestions() {
  const input = document.getElementById('filtre-modele');
  const current = input?.value?.trim() || '';
  updateModelDatalistForInput(current);
}

function updateModelDatalistForInput(value = '') {
  const modeleListEl = document.getElementById('filtre-modele-list');
  if (!modeleListEl) return;

  const marque = document.getElementById('filtre-marque')?.value || '';
  // Si l'utilisateur n'a pas tapé assez de caractères, on vide les suggestions
  if (!value || value.length < SUGGEST_THRESHOLD) {
    modeleListEl.innerHTML = '';
    return;
  }

  const candidates = getModeleSuggestions(marque);
  const lower = value.toLowerCase();
  // Filtrage par "contient" pour montrer les modèles qui incluent la saisie
  const filtered = candidates.filter(m => String(m).toLowerCase().includes(lower));
  setDatalistOptions(modeleListEl, filtered);
}
export function setupUIHandlers(paysParMarque, allMarques = [], allModeles = []) {
  // ===== Filtres =====
  document.getElementById('filtre-modele')?.addEventListener('input', (e) => {
    const val = e.target?.value || '';
    updateModelDatalistForInput(val.trim());
    filtrerGarage();
  });
  
  // Filtre marque : sélectionne automatiquement le pays
  document.getElementById('filtre-marque')?.addEventListener('change', (e) => {
    const marque = e.target.value;
    if (marque) {
      const pays = getPaysParMarque(marque, paysParMarque);
      const filtrePays = document.getElementById('filtre-pays');
      if (filtrePays && pays) {
        filtrePays.value = pays;
      }
    }
    refreshSearchSuggestions();
    filtrerGarage();
  });
  
  document.getElementById('filtre-pays')?.addEventListener('change', () => {
    populateGarageFiltersFromGarage(document.getElementById('filtre-pays')?.value || '');
    refreshSearchSuggestions();
    filtrerGarage();
  });

  // ===== Suppression de sélection =====
  const btnSupprimerSelection = document.getElementById('supprimer-selection');
  btnSupprimerSelection?.addEventListener('click', () => {
    const selectionnees = document.querySelectorAll('.voiture.suppression-selectionnee');
    const ids = Array.from(selectionnees).map(v => v.dataset.id).filter(Boolean);
    if (ids.length === 0) {
      afficherMessageTemporaire("Veuillez sélectionner au moins une voiture à supprimer !", 2000);
      return;
    }
    const nb = removeByIds(ids);
    afficherGarage();
    populateGarageFiltersFromGarage();
    refreshSearchSuggestions();
    afficherMessageTemporaire(`${nb} voiture(s) supprimée(s).`);
    toggleModeSuppression(); // Quitter le mode suppression après suppression
  });

  // ===== Vider le garage =====
  const btnViderGarage = document.getElementById('vider-garage');
  btnViderGarage?.addEventListener('click', () => {
    afficherConfirmation('⚠️ Êtes-vous sûr de vouloir tout supprimer ?', () => {
      clearGarage();
      afficherGarage();
      populateGarageFiltersFromGarage();
      refreshSearchSuggestions();
      afficherMessageTemporaire('Garage complètement vidé !');
      toggleModeSuppression(); // Quitter le mode suppression après avoir vidé le garage
    }, () => {
      // annulé
    });
  });

  // ===== Mode suppression =====
  const btnMode = document.getElementById('mode-suppression');
  btnMode?.addEventListener('click', () => {
    toggleModeSuppression();
  });

  // ===== Reset filtre =====
  document.getElementById('reset-filtre')?.addEventListener('click', () => {
    const filtreModele = document.getElementById('filtre-modele');
    const filtreMarque = document.getElementById('filtre-marque');
    const filtrePays = document.getElementById('filtre-pays');

    if (filtreModele) filtreModele.value = '';
    if (filtreMarque) filtreMarque.value = '';
    if (filtrePays) { filtrePays.value = ''; filtrePays.dispatchEvent(new Event('change')); }

    populateGarageFiltersFromGarage();
    refreshSearchSuggestions();
    afficherMessageTemporaire('🔄 Filtres réinitialisés');
    afficherGarage();
  });

  // ===== Datalists =====
  setDatalistOptions(document.getElementById('marque-list'), []);
  refreshSearchSuggestions();

  // ===== Formulaire d'ajout =====
  setupFormAjout(paysParMarque, allMarques, allModeles);

  // ===== Modal d'ajout (ouverture / fermeture) =====
  setupModalAjout();
}

function setupFormAjout(paysParMarque, allMarques = [], allModeles = []) {
  const formAjout = document.getElementById('form-ajout');
  const marqueInput = document.getElementById('marque');
  const modeleInput = document.getElementById('modele');

  function updateModeleSuggestions(marque) {
    if (!modeleInput) return;
    modeleInput.innerHTML = '';

    // Priorité aux modèles venant du fichier filters.json (window.modelesParMarque)
    let options = [];
    if (marque && window.modelesParMarque && Array.isArray(window.modelesParMarque[marque]) && window.modelesParMarque[marque].length > 0) {
      options = window.modelesParMarque[marque];
    } else if (marque) {
      // Fallback : dériver les modèles depuis le garage (si la marque existe uniquement dans cars.json)
      options = garage.filter(v => v && v.marque === marque).map(v => v.modele).filter(Boolean);
      options = Array.from(new Set(options)).sort((a, b) => String(a).localeCompare(b, 'fr', { sensitivity: 'base' }));
    }

    if (!marque || options.length === 0) {
      modeleInput.disabled = true;
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '-- Choisissez d’abord une marque --';
      modeleInput.appendChild(placeholder);
      return;
    }

    modeleInput.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '-- Sélectionnez un modèle --';
    modeleInput.appendChild(placeholder);

    options.forEach((modele) => {
      const option = document.createElement('option');
      option.value = modele;
      option.textContent = modele;
      modeleInput.appendChild(option);
    });
  }

  // Mise à jour des modèles disponibles quand on change la marque
  marqueInput?.addEventListener('input', () => {
    const valeur = marqueInput.value;
    updateModeleSuggestions(valeur);
    updateBrandDatalist(valeur, allMarques);
  });

  // Soumission du formulaire
  formAjout?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!marqueInput || !modeleInput) return;
    const marque = marqueInput.value.trim();
    const modele = modeleInput.value.trim();
    const image = document.getElementById('image')?.value.trim();
    const description = document.getElementById('description')?.value.trim();
    const ficheV = document.getElementById('fiche')?.value.trim();

    if (!marque || !modele || !image || !description) {
      afficherMessageTemporaire('⚠️ Tous les champs obligatoires doivent être remplis.', 2000);
      return;
    }

    const pays = getPaysParMarque(marque, paysParMarque);
    addVoiture({ marque, modele, image, description, fiche: ficheV, pays });
    afficherGarage();
    populateGarageFiltersFromGarage();
    refreshSearchSuggestions();

    const modal = document.getElementById('modal-ajout');
    if (modal) modal.classList.remove('active');
    formAjout.reset();
    if (modeleInput) modeleInput.disabled = true;
    afficherMessageTemporaire(`✅ ${marque} ${modele} ajoutée au garage !`);
  });
}

function setupModalAjout() {
  const modal = document.getElementById('modal-ajout');
  const btnAjouter = document.getElementById('ajouter');
  const btnClose = modal ? modal.querySelector('.modal-close') : null;
  const btnCancel = document.getElementById('close-modal');

  // Ouverture de la modal
  if (btnAjouter && modal) {
    btnAjouter.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  // Fermeture par le bouton close (croix)
  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Fermeture par le bouton Annuler
  if (btnCancel && modal) {
    btnCancel.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Fermeture en cliquant en dehors
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Fermeture par Echap
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}
