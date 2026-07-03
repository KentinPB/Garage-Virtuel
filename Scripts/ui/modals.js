// ============================================================================
// Module UI - Modals (toasts, confirmations)
// ============================================================================

// Affiche un message temporaire (toast) dans le header (ou body)
// - texte : contenu textuel
// - duree : durée d'affichage en ms
export function afficherMessageTemporaire(texte, duree = 1500) {
  const messageExistant = document.querySelector('.toast'); // retire toast existant pour éviter chevauchement
  if (messageExistant) messageExistant.remove();

  const nouvelle = document.createElement('div');
  nouvelle.classList.add('toast');
  nouvelle.innerHTML = `<p>${texte}</p>`; // contenu du toast

  const header = document.querySelector('header') || document.body; // placement par défaut
  header.appendChild(nouvelle);

  setTimeout(() => { // supprime le toast après la durée spécifiée
    nouvelle.remove();
  }, duree);
}

// Expose la fonction de toast globalement pour les scripts non-modules (compat)
window.afficherMessageTemporaire = afficherMessageTemporaire;

// Affiche une modal de confirmation non bloquante
// - onConfirm : callback appelé si l'utilisateur confirme
// - onCancel  : callback si annulation
export function afficherConfirmation(texte, onConfirm, onCancel) {
  const existing = document.querySelector('.confirm-modal');
  if (existing) existing.remove(); // évite d'empiler plusieurs modales

  const modal = document.createElement('div');
  modal.classList.add('confirm-modal');
  modal.innerHTML = `
    <div class="confirm-content">
      <p>${texte}</p>
      <div class="confirm-actions">
        <button class="confirm-yes">Confirmer</button>
        <button class="confirm-no">Annuler</button>
      </div>
    </div>
  `; // template simple

  document.body.appendChild(modal); // ajoute au DOM

  const btnYes = modal.querySelector('.confirm-yes');
  const btnNo = modal.querySelector('.confirm-no');

  const cleanup = () => {
    modal.remove();
    document.removeEventListener('keydown', escHandler); // enlève écouteur Esc
  };

  function escHandler(e) {
    if (e.key === 'Escape') { cleanup(); onCancel && onCancel(); }
  }

  // actions des boutons
  btnYes.addEventListener('click', () => { cleanup(); onConfirm && onConfirm(); });
  btnNo.addEventListener('click', () => { cleanup(); onCancel && onCancel(); });

  // clic en dehors pour annuler
  modal.addEventListener('click', (e) => {
    if (e.target === modal) { cleanup(); onCancel && onCancel(); }
  });

  document.addEventListener('keydown', escHandler); // permet fermeture via Echap
}
