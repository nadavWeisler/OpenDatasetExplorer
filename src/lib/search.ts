import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Dataset } from '../types/dataset';

const SEARCH_KEYS: IFuseOptions<Dataset>['keys'] = [
  { name: 'name', weight: 0.25 },
  { name: 'short_description', weight: 0.18 },
  { name: 'topics', weight: 0.12 },
  { name: 'tags', weight: 0.12 },
  { name: 'domains', weight: 0.1 },
  { name: 'modalities', weight: 0.08 },
  { name: 'data_format', weight: 0.05 },
  { name: 'notes', weight: 0.05 },
  { name: 'repository', weight: 0.03 },
  { name: 'country_or_region', weight: 0.02 },
  { name: 'citation', weight: 0.02 },
];

export function createSearchIndex(datasets: Dataset[]): Fuse<Dataset> {
  return new Fuse(datasets, {
    keys: SEARCH_KEYS,
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });
}

export function searchDatasets(
  index: Fuse<Dataset>,
  query: string,
  datasets: Dataset[],
): Dataset[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return datasets;
  }
  return index.search(trimmed).map((result) => result.item);
}
