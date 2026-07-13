import type { AccessType, Dataset, FilterState } from '../types/dataset';

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function collectFilterOptions(datasets: Dataset[]) {
  return {
    topics: uniqueSorted(datasets.flatMap((d) => d.topics)),
    domains: uniqueSorted(datasets.flatMap((d) => d.domains)),
    modalities: uniqueSorted(datasets.flatMap((d) => d.modalities)),
    countries: uniqueSorted(datasets.map((d) => d.country_or_region)),
    licenses: uniqueSorted(datasets.map((d) => d.license)),
    repositories: uniqueSorted(datasets.map((d) => d.repository)),
    accessTypes: ['open_access', 'restricted', 'application_required'] as AccessType[],
  };
}

function matchesSampleSize(
  dataset: Dataset,
  min: number | null,
  max: number | null,
): boolean {
  if (min === null && max === null) return true;
  if (dataset.sample_size === null) return false;
  if (min !== null && dataset.sample_size < min) return false;
  if (max !== null && dataset.sample_size > max) return false;
  return true;
}

type ListFilterKey =
  | 'topics'
  | 'domains'
  | 'modalities'
  | 'accessTypes'
  | 'countries'
  | 'licenses'
  | 'repositories';

export function applyFiltersExcept(
  datasets: Dataset[],
  filters: FilterState,
  exclude: ListFilterKey[],
): Dataset[] {
  const next = { ...filters };
  for (const key of exclude) {
    next[key] = [];
  }
  return applyFilters(datasets, next);
}

export function computeFacetCounts(
  searched: Dataset[],
  filters: FilterState,
): {
  topics: Map<string, number>;
  domains: Map<string, number>;
  modalities: Map<string, number>;
  accessTypes: Map<string, number>;
  countries: Map<string, number>;
  licenses: Map<string, number>;
  repositories: Map<string, number>;
} {
  const countField = (
    pool: Dataset[],
    values: string[],
    getter: (d: Dataset) => string[],
  ): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const value of values) {
      counts.set(value, pool.filter((d) => getter(d).includes(value)).length);
    }
    return counts;
  };

  const options = collectFilterOptions(searched);

  return {
    topics: countField(
      applyFiltersExcept(searched, filters, ['topics']),
      options.topics,
      (d) => d.topics,
    ),
    domains: countField(
      applyFiltersExcept(searched, filters, ['domains']),
      options.domains,
      (d) => d.domains,
    ),
    modalities: countField(
      applyFiltersExcept(searched, filters, ['modalities']),
      options.modalities,
      (d) => d.modalities,
    ),
    accessTypes: (() => {
      const pool = applyFiltersExcept(searched, filters, ['accessTypes']);
      const counts = new Map<string, number>();
      for (const value of options.accessTypes) {
        counts.set(value, pool.filter((d) => d.access_type === value).length);
      }
      return counts;
    })(),
    countries: countField(
      applyFiltersExcept(searched, filters, ['countries']),
      options.countries,
      (d) => [d.country_or_region],
    ),
    licenses: countField(
      applyFiltersExcept(searched, filters, ['licenses']),
      options.licenses,
      (d) => [d.license],
    ),
    repositories: countField(
      applyFiltersExcept(searched, filters, ['repositories']),
      options.repositories,
      (d) => [d.repository],
    ),
  };
}

export function applyFilters(datasets: Dataset[], filters: FilterState): Dataset[] {
  return datasets.filter((dataset) => {
    if (filters.topics.length && !filters.topics.some((t) => dataset.topics.includes(t))) {
      return false;
    }
    if (filters.domains.length && !filters.domains.some((d) => dataset.domains.includes(d))) {
      return false;
    }
    if (
      filters.modalities.length &&
      !filters.modalities.some((m) => dataset.modalities.includes(m))
    ) {
      return false;
    }
    if (filters.accessTypes.length && !filters.accessTypes.includes(dataset.access_type)) {
      return false;
    }
    if (filters.longitudinal !== null && dataset.longitudinal !== filters.longitudinal) {
      return false;
    }
    if (
      filters.humanParticipants !== null &&
      dataset.human_participants !== filters.humanParticipants
    ) {
      return false;
    }
    if (
      !matchesSampleSize(dataset, filters.sampleSizeMin, filters.sampleSizeMax)
    ) {
      return false;
    }
    if (filters.countries.length && !filters.countries.includes(dataset.country_or_region)) {
      return false;
    }
    if (filters.licenses.length && !filters.licenses.includes(dataset.license)) {
      return false;
    }
    if (filters.repositories.length && !filters.repositories.includes(dataset.repository)) {
      return false;
    }
    return true;
  });
}

export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  count += filters.topics.length;
  count += filters.domains.length;
  count += filters.modalities.length;
  count += filters.accessTypes.length;
  count += filters.countries.length;
  count += filters.licenses.length;
  count += filters.repositories.length;
  if (filters.longitudinal !== null) count += 1;
  if (filters.humanParticipants !== null) count += 1;
  if (filters.sampleSizeMin !== null || filters.sampleSizeMax !== null) count += 1;
  return count;
}

export function formatAccessType(accessType: AccessType): string {
  const labels: Record<AccessType, string> = {
    open_access: 'Open access',
    restricted: 'Restricted',
    application_required: 'Application required',
  };
  return labels[accessType];
}

export function formatSampleSize(size: number | null): string {
  if (size === null) return 'Varies';
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(1)}M`;
  if (size >= 1_000) return `${(size / 1_000).toFixed(0)}K`;
  return size.toLocaleString();
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );
}

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function buildFilterChips(
  filters: FilterState,
  onChange: (next: FilterState) => void,
): FilterChip[] {
  const chips: FilterChip[] = [];

  const addListChips = <K extends keyof FilterState>(
    key: K,
    values: string[],
    prefix: string,
  ) => {
    values.forEach((value) => {
      chips.push({
        key: `${String(key)}-${value}`,
        label: `${prefix}: ${value}`,
        onRemove: () => {
          const current = filters[key];
          if (!Array.isArray(current)) return;
          onChange({
            ...filters,
            [key]: current.filter((v) => v !== value),
          });
        },
      });
    });
  };

  addListChips('topics', filters.topics, 'Topic');
  addListChips('domains', filters.domains, 'Domain');
  addListChips('modalities', filters.modalities, 'Modality');
  filters.accessTypes.forEach((value) => {
    chips.push({
      key: `accessTypes-${value}`,
      label: `Access: ${formatAccessType(value)}`,
      onRemove: () =>
        onChange({
          ...filters,
          accessTypes: filters.accessTypes.filter((v) => v !== value),
        }),
    });
  });
  addListChips('countries', filters.countries, 'Region');
  addListChips('licenses', filters.licenses, 'License');
  addListChips('repositories', filters.repositories, 'Repository');

  if (filters.longitudinal !== null) {
    chips.push({
      key: 'longitudinal',
      label: `Longitudinal: ${filters.longitudinal ? 'Yes' : 'No'}`,
      onRemove: () => onChange({ ...filters, longitudinal: null }),
    });
  }

  if (filters.humanParticipants !== null) {
    chips.push({
      key: 'humanParticipants',
      label: `Human participants: ${filters.humanParticipants ? 'Yes' : 'No'}`,
      onRemove: () => onChange({ ...filters, humanParticipants: null }),
    });
  }

  if (filters.sampleSizeMin !== null || filters.sampleSizeMax !== null) {
    const min = filters.sampleSizeMin?.toLocaleString() ?? 'any';
    const max = filters.sampleSizeMax?.toLocaleString() ?? 'any';
    chips.push({
      key: 'sampleSize',
      label: `Sample size: ${min} – ${max}`,
      onRemove: () =>
        onChange({ ...filters, sampleSizeMin: null, sampleSizeMax: null }),
    });
  }

  return chips;
}
