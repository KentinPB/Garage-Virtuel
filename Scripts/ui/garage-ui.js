// ============================================================================
// Module UI - Affichage et gestion du garage (liste, filtres, compteurs)
// ============================================================================

import { garage } from '../core/garage.js';
import { prettifyBrand } from '../utils/index.js';
import { afficherMessageTemporaire, afficherConfirmation } from './modals.js';

function sortStrings(values = []) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function getAvailablePaysFromGarage() {
  return sortStrings(garage.map(v => v.pays || 'Inconnu'));
}

function buildOptionElement(value, label = null) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label || value;
  return option;
}

// Rend la liste des voitures dans le DOM
export function afficherGarage(liste = garage, totalCategory = null) {
  // Met à jour les compteurs en priorité (utile si la fonction retourne tôt)
  const affichees = Array.isArray(liste) ? liste.length : 0;
  const total = (typeof totalCategory === 'number') ? totalCategory : garage.length;
  const cachees = total - affichees;
  
  // Mettre à jour les compteurs classiques
  const compteurAff = document.getElementById('compteur-affichees');
  if (compteurAff) compteurAff.textContent = String(affichees);
  const compteurTot = document.getElementById('compteur-total');
  if (compteurTot) compteurTot.textContent = String(total);

  // Mettre à jour les stats bar (nouveaux éléments)
  const statTotal = document.getElementById('stat-total');
  const statAffichees = document.getElementById('stat-affichees');
  if (statTotal) statTotal.textContent = String(total);
  if (statAffichees) statAffichees.textContent = String(affichees);

  // Compatibilité : compteur-voitures existant historique
  const compteur = document.getElementById('compteur-voitures');
  if (compteur) compteur.textContent = String(affichees);

  const container = document.querySelector('.garage-container');
  if (!container) return; // si pas de conteneur, on quitte

  container.innerHTML = ''; // vide le conteneur avant rendu

  // Si aucun résultat, affiche une carte d'état avec actions rapides
  if (affichees === 0) {
    const vide = document.createElement('div');
    vide.classList.add('etat-vide');
    vide.innerHTML = `
      <h3>Aucun résultat</h3>
      <p>Aucune voiture ne correspond aux filtres.</p>
      <div class="etat-actions">
        <button id="etat-reset" class="btn">Réinitialiser les filtres</button>
        <button id="etat-ajouter" class="btn">Ajouter une voiture</button>
      </div>
    `;
    container.appendChild(vide);

    // Actions : redirigent vers les boutons existants
    const etatReset = document.getElementById('etat-reset');
    const etatAjouter = document.getElementById('etat-ajouter');
    const btnReset = document.getElementById('reset-filtre');
    const btnAjouter = document.getElementById('ajouter');
    etatReset?.addEventListener('click', () => btnReset?.click());
    etatAjouter?.addEventListener('click', () => btnAjouter?.click());

    return;
  }

  // Rend les cartes normales
  for (let voiture of liste) {
    const nouvelle = document.createElement('div');
    nouvelle.classList.add('voiture');

    nouvelle.dataset.index = garage.indexOf(voiture);
    nouvelle.dataset.id = voiture.id || '';
    nouvelle.dataset.marque = voiture.marque;
    nouvelle.dataset.modele = voiture.modele;
    nouvelle.dataset.pays = voiture.pays;

    nouvelle.innerHTML = `
      <div class="voiture-image">
        <img src="${voiture.image}" alt="Voiture ${voiture.modele}">
      </div>
      <div class="voiture-content">
        <div class="voiture-header">
          <div class="voiture-marque">${prettifyBrand(voiture.marque)}</div>
          <div class="voiture-modele">${voiture.modele}</div>
          <div class="voiture-pays">${voiture.pays || 'Inconnu'}</div>
        </div>
        <div class="voiture-description">${voiture.description}</div>
        ${voiture.fiche ? `<div class="voiture-fiche"><small>${voiture.fiche}</small></div>` : ''}
      </div>
    `;

    container.appendChild(nouvelle);
  }

  // Affiche/masque les boutons selon l'état du mode suppression
  const btnSupprimer = document.getElementById('supprimer-selection');
  const btnVider = document.getElementById('vider-garage');
  const inSuppression = isModeSuppressionActive();
  if (btnSupprimer) btnSupprimer.style.display = inSuppression ? 'block' : 'none';
  if (btnVider) btnVider.style.display = inSuppression ? 'block' : 'none';
}

// Indique si le mode suppression est actif (vérifie libellé du bouton)
export function isModeSuppressionActive() {
  const btnMode = document.getElementById('mode-suppression');
  if (!btnMode) return false;
  return btnMode.textContent.includes('Quitter');
}

// Bascule le mode suppression et nettoie les sélections si on quitte
export function toggleModeSuppression() {
  const btnMode = document.getElementById('mode-suppression');
  if (!btnMode) return;
  const now = isModeSuppressionActive();
  btnMode.textContent = now ? '🗑️ Mode suppression' : '❌ Quitter le mode suppression';
  // retirer toutes les sélections si on quitte le mode
  if (now) {
    document.querySelectorAll('.voiture.suppression-selectionnee').forEach(v => v.classList.remove('suppression-selectionnee'));
  }
  // réaffiche pour mettre à jour l'UI
  afficherGarage();
}

// Applique les filtres et affiche le résultat
export function filtrerGarage() {
  const marqueF = document.getElementById('filtre-marque')?.value || '';
  const modeleF = document.getElementById('filtre-modele')?.value || '';
  const paysF = document.getElementById('filtre-pays')?.value || '';

  // Base = filtrage par catégorie (marque + pays)
  const base = garage.filter(voiture => {
    const correspondMarque = !marqueF || voiture.marque === marqueF;
    const correspondPays = !paysF || voiture.pays === paysF;
    return correspondMarque && correspondPays;
  });

  // Le compteur "Résultats" doit montrer la taille de la catégorie (base.length)
  const baseLength = base.length;

  // Recherche modèle s'applique ensuite à l'intérieur de la base
  const resultat = !modeleF ? base : base.filter(voiture => {
    return voiture.modele && voiture.modele.toLowerCase().includes(modeleF.toLowerCase());
  });

  afficherGarage(resultat, baseLength);
}

// Remplit dynamiquement les selects des marques et pays
export function populateBrandAndCountrySelects(paysParMarque) {
  const marqueEl = document.getElementById('marque');

  if (marqueEl) {
    marqueEl.innerHTML = '<option value="" disabled selected>-- Sélectionnez une marque --</option>';
    for (const [pays, marques] of Object.entries(paysParMarque)) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = pays;
      marques.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = prettifyBrand(m);
        optgroup.appendChild(option);
      });
      marqueEl.appendChild(optgroup);
    }
  }
}

function getGarageMarquesByPays(paysFilter = '') {
  const map = new Map();
  garage.forEach(voiture => {
    if (!voiture || !voiture.marque) return;
    const pays = voiture.pays || 'Inconnu';
    if (paysFilter && pays !== paysFilter) return;
    if (!map.has(pays)) map.set(pays, new Set());
    map.get(pays).add(voiture.marque);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
    .map(([pays, marques]) => [pays, Array.from(marques).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))]);
}

export function populateGarageFiltersFromGarage(selectedPays = '') {
  const filtrePaysEl = document.getElementById('filtre-pays');
  const filtreMarqueEl = document.getElementById('filtre-marque');

  const availablePays = getAvailablePaysFromGarage();
  const paysKept = availablePays.includes(selectedPays) ? selectedPays : '';

  if (filtrePaysEl) {
    filtrePaysEl.innerHTML = '';
    filtrePaysEl.appendChild(buildOptionElement('', '🌍 Tous les pays'));
    for (const pays of availablePays) {
      filtrePaysEl.appendChild(buildOptionElement(pays));
    }
    filtrePaysEl.value = paysKept;
  }

  if (filtreMarqueEl) {
    const selectedMarque = filtreMarqueEl.value || '';
    const groups = getGarageMarquesByPays(paysKept);
    filtreMarqueEl.innerHTML = '';
    filtreMarqueEl.appendChild(buildOptionElement('', '🚗 Toutes les marques'));
    groups.forEach(([pays, marques]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = pays;
      marques.forEach(marque => {
        const option = document.createElement('option');
        option.value = marque;
        option.textContent = prettifyBrand(marque);
        optgroup.appendChild(option);
      });
      filtreMarqueEl.appendChild(optgroup);
    });
    const possible = Array.from(filtreMarqueEl.querySelectorAll('option')).map(o => o.value);
    filtreMarqueEl.value = possible.includes(selectedMarque) ? selectedMarque : '';
  }
}

