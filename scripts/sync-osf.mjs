/**
 * Sync OSF platform metadata from the OSF API v2 into datasets.json.
 * Run with: npm run sync:osf
 *
 * Updates the OSF catalog entry's notes with the current public project count
 * and bumps last_verified. Keeps the static-site architecture — no runtime API.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datasetsPath = join(__dirname, '../src/data/datasets.json');
const OSF_SEARCH_URL = 'https://api.osf.io/v2/search/?q=*&page%5Bsize%5D=1';
const TODAY = new Date().toISOString().slice(0, 10);

async function fetchOsfPublicProjectCount() {
  const response = await fetch(OSF_SEARCH_URL);
  if (!response.ok) {
    throw new Error(`OSF API returned ${response.status}`);
  }

  const payload = await response.json();
  const total = payload?.links?.meta?.total;
  if (typeof total !== 'number') {
    throw new Error('OSF API response missing links.meta.total');
  }

  return total;
}

function formatCount(total) {
  return new Intl.NumberFormat('en-US').format(total);
}

function updateOsfEntry(datasets, publicProjectCount) {
  const index = datasets.findIndex((entry) => entry.id === 'osf');
  if (index === -1) {
    throw new Error('OSF entry (id: osf) not found in datasets.json');
  }

  const entry = datasets[index];
  const countNote = `OSF Search indexes roughly ${formatCount(publicProjectCount)} public resources (projects, registrations, preprints, and files).`;
  const baseNote =
    'Hosts projects, files, registrations, and preprints. Some projects may be embargoed or view-only. Use OSF Search to discover public projects.';

  datasets[index] = {
    ...entry,
    last_verified: TODAY,
    notes: `${baseNote} ${countNote}`,
  };

  return datasets;
}

async function main() {
  console.log('Fetching OSF public resource count…');
  const total = await fetchOsfPublicProjectCount();
  console.log(`OSF reports ${formatCount(total)} indexed public resources.`);

  const datasets = JSON.parse(readFileSync(datasetsPath, 'utf-8'));
  const updated = updateOsfEntry(datasets, total);
  writeFileSync(datasetsPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf-8');
  console.log(`Updated ${datasetsPath} (last_verified: ${TODAY}).`);
}

main().catch((error) => {
  console.error('OSF sync failed:', error.message);
  process.exit(1);
});
