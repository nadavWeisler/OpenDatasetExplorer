import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import datasetsJson from '../data/datasets.json';
import type { Dataset, FilterState } from '../types/dataset';
import { EMPTY_FILTERS } from '../types/dataset';
import {
  applyFilters,
  buildFilterChips,
  computeFacetCounts,
  countActiveFilters,
} from '../lib/filters';
import {
  filtersToSearchParams,
  parseFiltersFromSearchParams,
  parseSortFromSearchParams,
} from '../lib/filterUrl';
import { createSearchIndex, searchDatasets } from '../lib/search';
import { SORT_LABELS, sortDatasets, type SortOption } from '../lib/sort';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterChips from '../components/FilterChips';
import DatasetCard from '../components/DatasetCard';
import EmptyState from '../components/EmptyState';
import PageMeta from '../components/PageMeta';

const datasets = datasetsJson as Dataset[];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const sort = useMemo(() => parseSortFromSearchParams(searchParams), [searchParams]);
  const [filtersOpen, setFiltersOpen] = useState(() => countActiveFilters(filters) > 0);

  const searchIndex = useMemo(() => createSearchIndex(datasets), []);

  const searched = useMemo(() => {
    return searchDatasets(searchIndex, filters.query, datasets);
  }, [searchIndex, filters.query]);

  const results = useMemo(() => {
    const filtered = applyFilters(searched, filters);
    return sortDatasets(filtered, sort);
  }, [searched, filters, sort]);

  const facetCounts = useMemo(
    () => computeFacetCounts(searched, filters),
    [searched, filters],
  );

  const chips = useMemo(
    () =>
      buildFilterChips(filters, (updated) => {
        setSearchParams(filtersToSearchParams(updated, sort), { replace: true });
      }),
    [filters, sort, setSearchParams],
  );

  const hasQueryOrFilters =
    filters.query.trim().length > 0 || chips.length > 0;

  const updateFilters = (partial: Partial<FilterState>) => {
    setSearchParams(filtersToSearchParams({ ...filters, ...partial }, sort), { replace: true });
  };

  const setFilters = (next: FilterState | ((prev: FilterState) => FilterState)) => {
    const updated = typeof next === 'function' ? next(filters) : next;
    setSearchParams(filtersToSearchParams(updated, sort), { replace: true });
  };

  const setSort = (next: SortOption) => {
    setSearchParams(filtersToSearchParams(filters, next), { replace: true });
  };

  const handleClear = () => {
    setSearchParams(filtersToSearchParams(EMPTY_FILTERS, sort), { replace: true });
  };

  useEffect(() => {
    if (countActiveFilters(filters) > 0) {
      setFiltersOpen(true);
    }
  }, [filters]);

  return (
    <div className="container explore-page">
      <PageMeta
        title="OpenDataset Explorer"
        description="Browse a curated sample of open-access and restricted research datasets by topic, modality, and access type."
      />

      <section className="hero">
        <h1>Discover open research datasets</h1>
        <p>
          Browse a curated sample of biomedical, social science, and multidisciplinary data
          resources. Filter by topic, modality, access type, and more.
        </p>
      </section>

      <SearchBar
        value={filters.query}
        onChange={(query) => updateFilters({ query })}
        resultCount={results.length}
      />

      <FilterChips chips={chips} onClearAll={handleClear} />

      <div className="explore-layout">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          facetCounts={facetCounts}
          collapsed={!filtersOpen}
          onToggle={() => setFiltersOpen((open) => !open)}
        />

        <section className="results-section" aria-label="Search results">
          <div className="results-toolbar">
            <label className="sort-control" htmlFor="result-sort">
              Sort by
              <select
                id="result-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <EmptyState hasQueryOrFilters={hasQueryOrFilters} onClear={handleClear} />
          ) : (
            <div className="results-grid">
              {results.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
