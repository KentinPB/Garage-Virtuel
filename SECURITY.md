# 🔒 Politique de Sécurité

## Rapporter une vulnérabilité

Si vous découvrez une **faille de sécurité** dans Garage Virtuel, nous apprécions votre aide responsable !

### ⚠️ À NE PAS FAIRE

❌ **Ne pas** publier la vulnérabilité sur GitHub Issues  
❌ **Ne pas** la partager publiquement  
❌ **Ne pas** exploiter la faille pour nuire  

### ✅ À FAIRE

1. **Contactez-nous discrètement** en ouvrant une **[GitHub Security Advisory](https://github.com/votre-repo/security/advisories)**
   - Ou par email si disponible

2. **Décrivez précisément** :
   - Type de vulnérabilité (XSS, injection, etc.)
   - Emplacement dans le code
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correction (optionnel)

3. **Laissez-nous du temps** pour répondre (48-72h généralement)

### 📧 Contact de sécurité

> Pour les rapports confidentiels de sécurité, veuillez utiliser GitHub Security Advisories.

## Considérations de sécurité du projet

### Vue d'ensemble de l'architecture

Garage Virtuel est une **application web statique** sans backend, sans serveur, et sans authentification :

- ✅ **Pas de communication serveur** : Aucune transmission de données sensibles
- ✅ **Données locales uniquement** : Tout dans `localStorage` du navigateur
- ✅ **Pas de dépendances externes** : Code vanilla JavaScript
- ✅ **Pas d'authentification** : Application publique et partagée

### Risques connus et mitigations

#### 1. **XSS (Cross-Site Scripting)**

**Risque** : Injection de code JavaScript malveillant via les champs de formulaire

**Mitigation** :
- ✅ Utiliser `textContent` au lieu de `innerHTML`
- ✅ Valider/filtrer les entrées utilisateur
- ✅ Utiliser `dataset.*` pour les données dynamiques

**Exemple** :
```javascript
// ✅ Bon - Protégé contre XSS
const title = document.createElement('h3');
title.textContent = voiture.modele;  // Pas d'HTML interprété

// ❌ Mauvais - Vulnérable
const title = document.createElement('h3');
title.innerHTML = voiture.modele;  // Interprète le HTML
```

#### 2. **localStorage non sécurisé**

**Risque** : Les données dans `localStorage` sont accessibles par n'importe quel script sur le même domaine

**Mitigation** :
- ✅ Ne pas stocker de données sensibles (pas de mots de passe)
- ✅ Utiliser HTTPS si déployé sur un serveur
- ✅ Valider les données lors de la lecture

**Exemple** :
```javascript
// ✅ Bon - Valider avant d'utiliser
const gaff = JSON.parse(localStorage.getItem('garage') || '[]');
if (!Array.isArray(garage)) garage = [];

// ❌ Mauvais - Trust aveugle
const garage = JSON.parse(localStorage.getItem('garage'));
```

#### 3. **Injection de données locales**

**Risque** : Un utilisateur modifie manuellement `localStorage` pour ajouter des données malveillantes

**Mitigation** :
- ✅ Valider la structure des données au chargement
- ✅ Vérifier les types (string, number, etc.)
- ✅ Ignorer les données invalides
- ✅ Log les anomalies pour debug

#### 4. **CSRF (Cross-Site Request Forgery)**

**Risque** : Très faible car pas de backend

**Mitigation** :
- ✅ Pas applicable - Pas de communication réseau
- ✅ Aucun token CSRF nécessaire

### Bonnes pratiques de sécurité

Pour les **contributeurs** :

#### ✅ Validation des entrées
```javascript
// Valider avant d'ajouter à garage
function validateVoiture(voiture) {
  if (!voiture.marque || typeof voiture.marque !== 'string') return false;
  if (!voiture.modele || typeof voiture.modele !== 'string') return false;
  if (voiture.marque.length > 100) return false;  // Limiter taille
  return true;
}
```

#### ✅ Sécurité du DOM
```javascript
// Préférer textContent à innerHTML
element.textContent = userInput;  // ✅ Sûr

// Si HTML est nécessaire, utiliser DOMPurify ou encoder
// (mais éviter si possible)
```

#### ✅ Gestion des erreurs
```javascript
// Ne pas exposer les détails techniques
try {
  JSON.parse(localStorage.getItem('garage'));
} catch (e) {
  console.error('Erreur lors du chargement (details loggées pour debug)');
  // Ne pas afficher e.stack à l'utilisateur
}
```

#### ✅ Nettoyage du code
```javascript
// ❌ À éviter
console.log('Token:', localStorage.getItem('secret'));  // Fuite d'info
document.body.innerHTML = userContent;  // XSS

// ✅ Bon
console.log('Données chargées');  // Info générale
element.textContent = userContent;  // Sûr
```

### Déploiement sécurisé

Si vous déployez Garage Virtuel sur un serveur web :

- 🔐 **HTTPS obligatoire** : Chiffrer la transmission
- 🚫 **CSP Header** : Content-Security-Policy pour prévenir XSS
- 🔒 **HSTS Header** : Forcer HTTPS
- 📋 **X-Frame-Options** : Prévenir clickjacking

Exemple (Nginx) :
```nginx
server {
  listen 443 ssl http2;
  
  # HTTPS et certificat SSL
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  
  # Headers de sécurité
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header Content-Security-Policy "default-src 'self'" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  
  root /path/to/garage-virtuel;
  index index.html;
}
```

### Dépendances et mises à jour

- ✅ **Zéro dépendances externes** : Aucun npm package = aucune vulnérabilité de dépendance
- ✅ **Code vanilla** : Ajourter des dépendances demande une discussion
- ✅ **Mises à jour régulières** : Vérifier les vulnérabilités navigateur

## Procédure de divulgation

### Timeline recommandée

1. **J+0** : Rapport initial reçu
2. **J+1-2** : Maintener confirme la vulnérabilité
3. **J+3-14** : Correction développée et testée
4. **J+14+** : Fix publié, CVE optionnel pour vulnérabilités graves
5. **J+14+** : Remerciements publics (si d'accord)

### Critères de gravité

| Sévérité | Impact | Exemple |
|----------|--------|---------|
| **Critique** 🔴 | Perte de données, accès non-autorisé | Corruption localStorage |
| **Haute** 🟠 | Comportement inattendu, frustration | XSS possible |
| **Moyenne** 🟡 | Limitation fonctionnelle mineure | UI cassée |
| **Basse** 🟢 | Typo, comportement cosmétique | Texte mal aligné |

---

## Questions fréquentes

**Q : Garage Virtuel est-il sûr pour les données sensibles ?**  
A : Non. Utilisez-le uniquement pour des données publiques ou de démonstration. Ne stockez pas de mots de passe, numéros de carte, etc.

**Q : Comment sécuriser localStorage ?**  
A : localStorage n'est jamais totalement sûr. Pour des données sensibles, utilisez :
- Un backend authentifié
- Chiffrement côté client (mais complexe)
- Sessionstorage à la place (données temporaires)

**Q : Faut-il faire un audit de sécurité ?**  
A : Garage Virtuel est à usage éducatif. Un audit formel n'est pas nécessaire, mais les contributions sont les bienvenues !

---

**Merci de votre vigilance en matière de sécurité !** 🙏

Pour toute question : ouvrir une Discussion GitHub
