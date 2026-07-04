# OpenDataset Explorer

A fast, mobile-friendly, static dataset discovery tool for researchers. Browse a curated sample of open-access and restricted research datasets by topic, domain, modality, sample size, access type, license, country, and study design.

**This catalog is a curated sample — not an exhaustive registry.** Always verify details at the original source.

## Features

- Static frontend (Vite + React + TypeScript) — no backend, no login, no tracking
- Client-side fuzzy search with [Fuse.js](https://fusejs.io/)
- Rich filters with removable chips
- Dataset detail pages with copy-citation and open-source buttons
- Mobile-first responsive layout
- Optional offline caching via service worker (PWA)
- GitHub Pages ready

## Quick start

```bash
cd open-dataset-explorer
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run verify` | Run acceptance checks (search & filters) |
| `npm run lint` | Run oxlint |

## Project structure

```
open-dataset-explorer/
├── public/                 # Static assets (favicon, manifest)
├── src/
│   ├── components/         # UI components
│   ├── data/
│   │   └── datasets.json   # Local dataset catalog
│   ├── lib/
│   │   ├── filters.ts      # Filter logic and helpers
│   │   └── search.ts       # Fuse.js search index
│   ├── pages/              # Route views
│   └── types/              # TypeScript types
├── DATA_SOURCES.md         # How to add/update datasets
├── CONTRIBUTING.md         # Contribution rules
└── vite.config.ts
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy to GitHub Pages

This repo deploys automatically via [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) on every push to `main`.

**Live site:** https://nadavWeisler.github.io/OpenDatasetExplorer/

### One-time setup

1. Open **Settings → Pages** on GitHub
2. Set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually from the **Actions** tab)

The workflow sets `VITE_BASE_PATH` to `/<repo-name>/` for project Pages URLs.

### Local preview of a Pages build

```bash
VITE_BASE_PATH=/OpenDatasetExplorer/ npm run build
cp dist/index.html dist/404.html
npm run preview
```

## Adding datasets

See [DATA_SOURCES.md](./DATA_SOURCES.md) for the dataset schema and update process.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution rules and quality standards.

## Disclaimer

For research discovery only. Verify access policies, licenses, and study details at the original source before use.
