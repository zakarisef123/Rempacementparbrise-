# Site web – PARE BRISE EXPRESS

Site vitrine statique (HTML / CSS / JS, sans dépendance) pour **PARE BRISE EXPRESS**,
SAS au capital de 1 000 € – RCS Nîmes 106 576 226 – Calvisson (30420).

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil |
| `remplacement-pare-brise.html` | Remplacement de pare-brise |
| `deroulement.html` | Comment ça se passe ? (16 étapes) |
| `promotions.html` | Promotion « cadeau offert » |
| `assurance.html` | Prise en charge bris de glace |
| `zone-intervention.html` | Communes desservies + carte |
| `a-propos.html` | Présentation de l'entreprise |
| `devis.html` | Formulaire de devis |
| `contact.html` | Coordonnées + formulaire |
| `mentions-legales.html`, `cgv.html`, `confidentialite.html`, `cookies.html` | Pages légales (LCEN, CGV, RGPD, cookies) |
| `404.html`, `sitemap.xml`, `robots.txt` | Technique / SEO |

## ⚠️ À remplacer avant la mise en ligne

Téléphone et WhatsApp : **06 26 15 93 77** (déjà en place).

Faire un « rechercher / remplacer » dans **tous les fichiers** :

| Valeur provisoire | À remplacer par |
|---|---|
| `contact@parebrise-express.fr` | Adresse e-mail réelle (aussi dans `assets/js/main.js`) |
| `https://www.parebrise-express.fr` | Nom de domaine réel |
| `Lun – Sam : 8h00 – 19h00` | Horaires réels |

À vérifier aussi : l'hébergeur indiqué dans `mentions-legales.html` (GitHub Pages par défaut),
le numéro de TVA intracommunautaire si l'entreprise y est assujettie, et le nom du
médiateur de la consommation.

## RGPD, cookies et Google Consent Mode v2

- Bandeau de consentement maison (`assets/js/consent.js`) conforme aux recommandations CNIL :
  « Tout refuser » aussi visible que « Tout accepter », aucune case pré-cochée, choix conservé 6 mois,
  lien « Gérer les cookies » dans le pied de page.
- Google Consent Mode v2 : signaux `ad_storage`, `ad_user_data`, `ad_personalization`,
  `analytics_storage` à « denied » par défaut ; les balises Google ne sont chargées qu'après accord.
- **Pour activer Google Analytics 4 / Google Ads / Google Tag Manager**, renseigner `ga4Id`, `adsId`
  ou `gtmId` en haut de `assets/js/consent.js` : la catégorie apparaît automatiquement dans le bandeau
  et le consentement est redemandé à tous les visiteurs.
- Cartes Google Maps / OpenStreetMap : chargées seulement après accord (« Afficher la carte »).
- Polices hébergées dans `assets/fonts/` (plus aucune requête vers Google Fonts).

### ⚠️ Obligations légales restant à compléter (`build`/pages légales)

| Élément | Où | Pourquoi |
|---|---|---|
| Médiateur de la consommation | `mentions-legales.html`, `cgv.html` | Obligatoire (Code conso. L612-1) : adhérer à un médiateur et indiquer son nom/adresse/site |
| Téléphone de l'hébergeur | `mentions-legales.html` | Obligatoire (LCEN art. 6) |
| N° de TVA FR06106576226 | `mentions-legales.html` | Calculé à partir du SIREN : à vérifier |
| CGV | `cgv.html` | Modèle à faire relire par un professionnel du droit |

## Formulaires

Le site étant statique, les formulaires de devis/contact ouvrent la messagerie du
visiteur (e-mail pré-rempli) ou WhatsApp avec le message pré-rempli. Aucun serveur n'est nécessaire.

## Mise en ligne (GitHub Pages)

Dans le dépôt GitHub : **Settings → Pages → Build and deployment → Deploy from a branch**,
choisir la branche et le dossier `/ (root)`. Le site fonctionne aussi tel quel sur Netlify,
OVH, o2switch, etc. (déposer les fichiers à la racine).
