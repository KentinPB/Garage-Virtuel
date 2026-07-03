// ============================================================================
// Module DATA - Paramètres de filtres dérivés depuis Data/filters.json ou Data/cars.json
// ============================================================================

import { loadCarsJson, loadFiltersJson, deriveListsFromCars, deriveListsFromFilters } from './cars-json.js';

let paysParMarque = {};
let modelesParMarque = {};
let allMarques = [];
let allModeles = [];

try {
  const filters = await loadFiltersJson();
  if (filters && typeof filters === 'object' && (Array.isArray(filters) || (filters.paysParMarque && filters.modelesParMarque))) {
    ({ paysParMarque, modelesParMarque, allMarques, allModeles } = deriveListsFromFilters(filters));
  } else {
    throw new Error('Format de filters.json invalide');
  }
} catch (e) {
  console.warn('Impossible de charger Data/filters.json, fallback vers Data/cars.json', e);
  try {
    const cars = await loadCarsJson();
    ({ paysParMarque, modelesParMarque, allMarques, allModeles } = deriveListsFromCars(cars));
  } catch (innerError) {
    console.error('Erreur de chargement de projets-data depuis cars.json :', innerError);
  }
}

export { paysParMarque, modelesParMarque, allMarques, allModeles };
