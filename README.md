# Career Planner

Outil pour organiser un mode carrière FIFA / EA FC : plus besoin de tout retaper à la main dans un tableur.

- **Effectif par poste** — tableau Titulaire / Remplaçant / Espoirs, avec code couleur (Décisif, Important, Rotation, Sporadique, Espoir), glisser-déposer entre postes et catégories.
- **Vue terrain** — schéma tactique selon la formation choisie (plus de 20 formations disponibles), avec les titulaires positionnés automatiquement.
- **Import de club** — recherche un club (674 clubs, 47 championnats) et importe d'un coup tous ses joueurs (nom + poste) en Remplaçant, prêt à être organisé.
- **Multi-carrières** — gère plusieurs clubs/saisons en parallèle, chacun avec son propre effectif.
- **100% local** — toutes les données restent dans le navigateur (`localStorage`), avec export/import JSON pour sauvegarder ou changer d'appareil.

### Données des clubs

`public/data/clubs.json` (noms de joueurs + poste uniquement, aucune note ni statistique) est dérivé d'un jeu de données EA Sports FC public. Les ligues féminines ont été exclues. Ces données sont une photo figée au moment de la génération : elles ne suivent pas les transferts en cours de saison.

## Développement

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173`.

## Build

```bash
npm run build
```

## Déploiement

Le site se déploie automatiquement sur GitHub Pages via GitHub Actions à chaque push sur `main` (voir `.github/workflows/deploy.yml`).

Pour l'activer la première fois : **Settings → Pages → Source : "GitHub Actions"** dans les paramètres du dépôt.
