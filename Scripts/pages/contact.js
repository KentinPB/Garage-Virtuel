// ============================================================================
// PAGE - Gestion du formulaire de contact
// ============================================================================

import { afficherMessageTemporaire } from '../ui/modals.js';

export function initContact() {
  const form = document.getElementById("contactForm");
  const confirmation = document.getElementById("confirmation");

  // Si le formulaire est présent sur la page, on attache le handler submit
  if (!form) return; // pas de contact form sur cette page

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // empêche l'envoi classique

    const civilite = document.getElementById("civilite").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const formData = { civilite, name, email, message };

    // Logging simple pour débogage local
    console.log("Données du formulaire :", formData);
    console.log("Civilité :", civilite);
    console.log("Nom :", name);
    console.log("Email :", email);
    console.log("Message :", message);

    // Validation : champs obligatoires
    if (!civilite || !name || !email || !message) {
      // Ajoute une bordure rouge sur les champs vides pour donner un retour visuel
      ["name", "email", "message", "civilite"].forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
          input.style.border = "2px solid #e63946"; // rouge
        } else {
          input.style.border = "1px solid #ccc"; // normal
        }
      });

      confirmation.textContent = "❌ Tous les champs doivent être remplis.";
      confirmation.style.color = "red";
      setTimeout(() => { confirmation.textContent = ""; }, 4000);

      return; // stoppe la soumission
    }

    // Validation simple de l'email via regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      confirmation.textContent = "⚠️ L'adresse email semble invalide.";
      confirmation.style.color = "orange";
      return;
    }

    // Succès : message de confirmation
    confirmation.textContent = `✅ Merci ${civilite} ${name}, votre message a bien été enregistré !`;
    confirmation.style.color = "limegreen";

    // Réinitialise le message de confirmation après quelques secondes
    setTimeout(() => { confirmation.textContent = ""; }, 4000);

    // Restaure l'apparence normale des champs
    ["name", "email", "message", "civilite"].forEach(id => {
      const input = document.getElementById(id);
      input.style.border = "1px solid #ccc";
    });

    form.reset(); // remet à zéro les champs
  });

  // Retire la bordure rouge au fur et à mesure que l'utilisateur corrige les champs
  ["name", "email", "message", "civilite"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        input.style.border = "1px solid #ccc";
      }
    });
  });
}

initContact();
