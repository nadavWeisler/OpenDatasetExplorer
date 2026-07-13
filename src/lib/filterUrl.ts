import type { AccessType, FilterState } from '../types/dataset';
import { EMPTY_FILTERS } from '../types/dataset';
import type { SortOption } from './sort';

const ACCESS_TYPES: AccessType[] = ['open_access', 'restricted', 'application_required'];
const SORT_OPTIONS: SortOption[] = ['default', 'name', 'verified', 'access'];

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

function parseBool(value: string | null): boolean | null {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return null;
}

function parseAccessTypes(values: string[]): AccessType[] {
  return values.filter((v): v is AccessType => ACCESS_TYPES.includes(v as AccessType));
}

export function parseFiltersFromSearchParams(params: URLSearchParams): FilterState {
  const minRaw = params.get('size_min');
  const maxRaw = params.get('size_max');

  return {
    query: params.get('q') ?? '',
    topics: splitList(params.get('topic')),
    domains: splitList(params.get('domain')),
    modalities: splitList(params.get('modality')),
    accessTypes: parseAccessTypes(splitList(params.get('access'))),
    longitudinal: parseBool(params.get('longitudinal')),
    humanParticipants: parseBool(params.get('human')),
    sampleSizeMin: minRaw ? Number(minRaw) : null,
    sampleSizeMax: maxRaw ? Number(maxRaw) : null,
    countries: splitList(params.get('country')),
    licenses: splitList(params.get('license')),
    repositories: splitList(params.get('repo')),
  };
}

export function parseSortFromSearchParams(params: URLSearchParams): SortOption {
  const sort = params.get('sort');
  if (sort && SORT_OPTIONS.includes(sort as SortOption)) {
    return sort as SortOption;
  }
  return 'default';
}

export function filtersToSearchParams(
  filters: FilterState,
  sort: SortOption,
  current?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(current?.toString() ?? '');

  const setOrDelete = (key: string, value: string | null) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };

  setOrDelete('q', filters.query.trim() || null);
  setOrDelete('topic', filters.topics.length ? filters.topics.join(',') : null);
  setOrDelete('domain', filters.domains.length ? filters.domains.join(',') : null);
  setOrDelete('modality', filters.modalities.length ? filters.modalities.join(',') : null);
  setOrDelete('access', filters.accessTypes.length ? filters.accessTypes.join(',') : null);
  setOrDelete(
    'longitudinal',
    filters.longitudinal === null ? null : filters.longitudinal ? 'yes' : 'no',
  );
  setOrDelete(
    'human',
    filters.humanParticipants === null ? null : filters.humanParticipants ? 'yes' : 'no',
  );
  setOrDelete(
    'size_min',
    filters.sampleSizeMin !== null ? String(filters.sampleSizeMin) : null,
  );
  setOrDelete(
    'size_max',
    filters.sampleSizeMax !== null ? String(filters.sampleSizeMax) : null,
  );
  setOrDelete('country', filters.countries.length ? filters.countries.join(',') : null);
  setOrDelete('license', filters.licenses.length ? filters.licenses.join(',') : null);
  setOrDelete('repo', filters.repositories.length ? filters.repositories.join(',') : null);
  setOrDelete('sort', sort === 'default' ? null : sort);

  return params;
}

/** Build a partial explore URL for tag links (merges with optional base filters). */
export function buildExploreUrl(partial: {
  topic?: string;
  domain?: string;
  modality?: string;
  access?: AccessType;
}): string {
  const filters: FilterState = { ...EMPTY_FILTERS };
  if (partial.topic) filters.topics = [partial.topic];
  if (partial.domain) filters.domains = [partial.domain];
  if (partial.modality) filters.modalities = [partial.modality];
  if (partial.access) filters.accessTypes = [partial.access];
  const params = filtersToSearchParams(filters, 'default');
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}
