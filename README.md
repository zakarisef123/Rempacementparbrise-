# Site web – PARE BRISE EXPRESS

Site vitrine statique (HTML / CSS / JS, sans dépendance) pour **PARE BRISE EXPRESS**,
SAS au capital de 1 000 € – RCS Nîmes 106 576 226 – Calvisson (30420).

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil |
| `remplacement-pare-brise.html` | Remplacement de pare-brise |
| `reparation-impact.html` | Réparation d'impact |
| `nettoyage-automobile.html` | Nettoyage automobile |
| `achat-vente-vehicules.html` | Achat, revente et mise à disposition de véhicules |
| `assurance.html` | Prise en charge bris de glace |
| `zone-intervention.html` | Communes desservies + carte |
| `a-propos.html` | Présentation de l'entreprise |
| `devis.html` | Formulaire de devis |
| `contact.html` | Coordonnées + formulaire |
| `mentions-legales.html` / `confidentialite.html` | Pages légales |
| `404.html`, `sitemap.xml`, `robots.txt` | Technique / SEO |

## ⚠️ À remplacer avant la mise en ligne

Faire un « rechercher / remplacer » dans **tous les fichiers** :

| Valeur provisoire | À remplacer par |
|---|---|
| `06 00 00 00 00` | Numéro de téléphone affiché |
| `+33600000000` | Numéro au format international (liens d'appel) |
| `33600000000` | Numéro WhatsApp (sans +), aussi dans `assets/js/main.js` |
| `contact@parebrise-express.fr` | Adresse e-mail réelle (aussi dans `assets/js/main.js`) |
| `https://www.parebrise-express.fr` | Nom de domaine réel |
| `Lun – Sam : 8h00 – 19h00` | Horaires réels |

À vérifier aussi : l'hébergeur indiqué dans `mentions-legales.html` (GitHub Pages par défaut),
le numéro de TVA intracommunautaire si l'entreprise y est assujettie, et le nom du
médiateur de la consommation.

## Formulaires

Le site étant statique, les formulaires de devis/contact ouvrent la messagerie du
visiteur (e-mail pré-rempli) ou WhatsApp avec le message pré-rempli. Aucun serveur n'est nécessaire.

## Mise en ligne (GitHub Pages)

Dans le dépôt GitHub : **Settings → Pages → Build and deployment → Deploy from a branch**,
choisir la branche et le dossier `/ (root)`. Le site fonctionne aussi tel quel sur Netlify,
OVH, o2switch, etc. (déposer les fichiers à la racine).
