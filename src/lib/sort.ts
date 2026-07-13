import type { AccessType, Dataset } from '../types/dataset';

export type SortOption = 'default' | 'name' | 'verified' | 'access';

const ACCESS_ORDER: Record<AccessType, number> = {
  open_access: 0,
  application_required: 1,
  restricted: 2,
};

export const SORT_LABELS: Record<SortOption, string> = {
  default: 'Default',
  name: 'Name (A–Z)',
  verified: 'Recently verified',
  access: 'Access type',
};

export function sortDatasets(datasets: Dataset[], sort: SortOption): Dataset[] {
  if (sort === 'default') return datasets;

  const sorted = [...datasets];

  switch (sort) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'verified':
      return sorted.sort(
        (a, b) => new Date(b.last_verified).getTime() - new Date(a.last_verified).getTime(),
      );
    case 'access':
      return sorted.sort(
        (a, b) => ACCESS_ORDER[a.access_type] - ACCESS_ORDER[b.access_type],
      );
    default:
      return datasets;
  }
}
