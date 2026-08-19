# Career Planner ⚽

Outil pour organiser un mode carrière FIFA / EA FC : plus besoin de tout retaper à la main dans un tableur.

- **Effectif par poste** — tableau Titulaire / Remplaçant / Espoirs, avec code couleur (Décisif, Important, Rotation, Sporadique, Espoir), glisser-déposer entre postes et catégories.
- **Vue terrain** — schéma tactique selon la formation choisie (4-2-3-1, 4-3-3, 4-4-2, 4-1-2-1-2, 3-5-2, 3-4-3), avec les titulaires positionnés automatiquement.
- **Transferts** — listes séparées pour les joueurs à surveiller/recruter (avec lien Sofifa), prêtés, vendus, libérés.
- **Multi-carrières** — gère plusieurs clubs/saisons en parallèle, chacun avec son propre effectif.
- **100% local** — toutes les données restent dans le navigateur (`localStorage`), avec export/import JSON pour sauvegarder ou changer d'appareil.

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
