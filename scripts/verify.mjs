/**
 * Acceptance checks for search and filter behavior.
 * Run with: npm run verify
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Fuse from 'fuse.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datasetsPath = join(__dirname, '../src/data/datasets.json');
const datasets = JSON.parse(readFileSync(datasetsPath, 'utf-8'));

const SEARCH_KEYS = [
  { name: 'name', weight: 0.3 },
  { name: 'short_description', weight: 0.2 },
  { name: 'topics', weight: 0.15 },
  { name: 'tags', weight: 0.15 },
  { name: 'modalities', weight: 0.1 },
  { name: 'repository', weight: 0.05 },
  { name: 'country_or_region', weight: 0.03 },
  { name: 'citation', weight: 0.02 },
];

const index = new Fuse(datasets, {
  keys: SEARCH_KEYS,
  threshold: 0.4,
  ignoreLocation: true,
});

function searchDatasets(query) {
  const trimmed = query.trim();
  if (!trimmed) return datasets;
  return index.search(trimmed).map((r) => r.item);
}

function applyFilters(items, filters) {
  return items.filter((dataset) => {
    if (filters.topics?.length && !filters.topics.some((t) => dataset.topics.includes(t))) {
      return false;
    }
    if (filters.accessTypes?.length && !filters.accessTypes.includes(dataset.access_type)) {
      return false;
    }
    if (filters.longitudinal !== null && filters.longitudinal !== undefined) {
      if (dataset.longitudinal !== filters.longitudinal) return false;
    }
    return true;
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`PASS: ${message}`);
}

const depressionResults = searchDatasets('depression');
assert(
  depressionResults.some((d) => d.id === 'uk-biobank'),
  'Search "depression" returns UK Biobank',
);
assert(
  depressionResults.some((d) => d.id === 'all-of-us'),
  'Search "depression" returns All of Us',
);

const mriResults = searchDatasets('MRI');
assert(
  mriResults.some((d) => d.id === 'openneuro'),
  'Search "MRI" returns OpenNeuro',
);

const longitudinalResults = applyFilters(datasets, { longitudinal: true });
assert(
  longitudinalResults.every((d) => d.longitudinal),
  'Longitudinal filter returns only longitudinal datasets',
);
assert(longitudinalResults.length > 0, 'Longitudinal filter returns results');

const openResults = applyFilters(datasets, { accessTypes: ['open_access'] });
assert(
  openResults.every((d) => d.access_type === 'open_access'),
  'Open access filter returns only open_access datasets',
);
assert(openResults.length > 0, 'Open access filter returns results');

console.log('\nAll acceptance checks passed.');
