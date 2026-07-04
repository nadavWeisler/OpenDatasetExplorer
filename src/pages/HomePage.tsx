import { useMemo, useState } from 'react';
import datasetsJson from '../data/datasets.json';
import type { Dataset, FilterState } from '../types/dataset';
import { EMPTY_FILTERS } from '../types/dataset';
import { applyFilters, buildFilterChips } from '../lib/filters';
import { createSearchIndex, searchDatasets } from '../lib/search';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterChips from '../components/FilterChips';
import DatasetCard from '../components/DatasetCard';
import EmptyState from '../components/EmptyState';

const datasets = datasetsJson as Dataset[];

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchIndex = useMemo(() => createSearchIndex(datasets), []);

  const results = useMemo(() => {
    const searched = searchDatasets(searchIndex, filters.query, datasets);
    return applyFilters(searched, filters);
  }, [searchIndex, filters]);

  const chips = useMemo(() => buildFilterChips(filters, setFilters), [filters]);

  const hasQueryOrFilters =
    filters.query.trim().length > 0 ||
    chips.length > 0;

  const handleClear = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="container explore-page">
      <section className="hero">
        <h1>Discover open research datasets</h1>
        <p>
          Browse a curated sample of biomedical, social science, and multidisciplinary data
          resources. Filter by topic, modality, access type, and more.
        </p>
      </section>

      <SearchBar
        value={filters.query}
        onChange={(query) => setFilters((prev) => ({ ...prev, query }))}
        resultCount={results.length}
      />

      <FilterChips chips={chips} onClearAll={handleClear} />

      <div className="explore-layout">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          collapsed={!filtersOpen}
          onToggle={() => setFiltersOpen((open) => !open)}
        />

        <section className="results-section" aria-label="Search results">
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
