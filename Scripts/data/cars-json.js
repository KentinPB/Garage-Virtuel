// ============================================================================
// Module de chargement JSON pour les voitures et les listes de filtres
// ============================================================================

export async function loadCarsJson() {
  const response = await fetch(new URL('../../Data/cars.json', import.meta.url));
  if (!response.ok) {
    throw new Error(`Impossible de charger Data/cars.json (${response.status})`);
  }
  return await response.json();
}

export async function loadFiltersJson() {
  const response = await fetch(new URL('../../Data/filters.json', import.meta.url));
  if (!response.ok) {
    throw new Error(`Impossible de charger Data/filters.json (${response.status})`);
  }
  return await response.json();
}

function sortUnique(values = []) {
  return Array.from(new Set(values.filter(v => typeof v === 'string' && v.trim() !== ''))).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function parseFilterDefinitions(filters = {}) {
  if (Array.isArray(filters)) {
    const paysParMarque = {};
    const modelesParMarque = {};

    filters.forEach((countryEntry) => {
      if (!countryEntry || typeof countryEntry !== 'object') return;

      Object.entries(countryEntry).forEach(([pays, marques]) => {
        if (!marques || typeof marques !== 'object') return;

        const sortedMarques = Object.keys(marques)
          .filter(m => typeof m === 'string' && m.trim() !== '')
          .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

        paysParMarque[pays] = sortedMarques;

        sortedMarques.forEach((marque) => {
          const modeles = Array.isArray(marques[marque]) ? marques[marque] : [];
          if (modeles.length) {
            modelesParMarque[marque] = sortUnique(modeles);
          }
        });
      });
    });

    return { paysParMarque, modelesParMarque };
  }

  return {
    paysParMarque: filters.paysParMarque || {},
    modelesParMarque: filters.modelesParMarque || {},
  };
}

export function deriveListsFromCars(cars = []) {
  const paysParMarque = {};
  const modelesParMarque = {};
  const allMarques = new Set();
  const allModeles = new Set();

  cars.forEach((voiture) => {
    const marque = (voiture.marque || '').trim();
    const modele = (voiture.modele || '').trim();
    const pays = (voiture.pays || '').trim();

    if (!marque || !pays) return;

    allMarques.add(marque);
    if (modele) allModeles.add(modele);

    if (!paysParMarque[pays]) paysParMarque[pays] = [];
    if (!paysParMarque[pays].includes(marque)) paysParMarque[pays].push(marque);

    if (modele) {
      if (!modelesParMarque[marque]) modelesParMarque[marque] = [];
      if (!modelesParMarque[marque].includes(modele)) modelesParMarque[marque].push(modele);
    }
  });

  for (const pays of Object.keys(paysParMarque)) {
    paysParMarque[pays].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  }

  for (const marque of Object.keys(modelesParMarque)) {
    modelesParMarque[marque].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  }

  return {
    paysParMarque,
    modelesParMarque,
    allMarques: sortUnique(Array.from(allMarques)),
    allModeles: sortUnique(Array.from(allModeles)),
  };
}

export function deriveListsFromFilters(filters = {}) {
  const { paysParMarque, modelesParMarque } = parseFilterDefinitions(filters);
  const allMarques = filters.allMarques || sortUnique(Object.values(paysParMarque).flat());
  const allModeles = filters.allModeles || sortUnique(Object.values(modelesParMarque).flat());

  return {
    paysParMarque,
    modelesParMarque,
    allMarques,
    allModeles,
  };
}
