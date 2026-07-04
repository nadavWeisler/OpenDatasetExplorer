import type { FilterState } from '../types/dataset';
import { collectFilterOptions } from '../lib/filters';
import datasets from '../data/datasets.json';
import type { Dataset } from '../types/dataset';

type FilterOptions = ReturnType<typeof collectFilterOptions>;

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  options?: FilterOptions;
  collapsed?: boolean;
  onToggle?: () => void;
}

const allDatasets = datasets as Dataset[];
const defaultOptions = collectFilterOptions(allDatasets);

function toggleListValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function MultiSelect({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="checkbox-grid">
        {values.map((value) => (
          <label key={value} className="checkbox-label">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FilterPanel({
  filters,
  onChange,
  options = defaultOptions,
  collapsed = false,
  onToggle,
}: FilterPanelProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  return (
    <aside className={`filter-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="filter-panel-header">
        <h2>Filters</h2>
        {onToggle && (
          <button type="button" className="filter-toggle" onClick={onToggle} aria-expanded={!collapsed}>
            {collapsed ? 'Show' : 'Hide'}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="filter-panel-body">
          <fieldset className="filter-group">
            <legend>Access type</legend>
            <div className="checkbox-grid">
              {options.accessTypes.map((value) => (
                <label key={value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.accessTypes.includes(value)}
                    onChange={() =>
                      update({ accessTypes: toggleListValue(filters.accessTypes, value) })
                    }
                  />
                  <span>
                    {value === 'open_access'
                      ? 'Open access'
                      : value === 'restricted'
                        ? 'Restricted'
                        : 'Application required'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend>Longitudinal</legend>
            <div className="radio-row">
              {[
                { label: 'Any', value: null },
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ].map((opt) => (
                <label key={String(opt.value)} className="radio-label">
                  <input
                    type="radio"
                    name="longitudinal"
                    checked={filters.longitudinal === opt.value}
                    onChange={() => update({ longitudinal: opt.value })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend>Human participants</legend>
            <div className="radio-row">
              {[
                { label: 'Any', value: null },
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ].map((opt) => (
                <label key={String(opt.value)} className="radio-label">
                  <input
                    type="radio"
                    name="humanParticipants"
                    checked={filters.humanParticipants === opt.value}
                    onChange={() => update({ humanParticipants: opt.value })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend>Sample size range</legend>
            <div className="range-inputs">
              <label>
                Min
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="e.g. 10000"
                  value={filters.sampleSizeMin ?? ''}
                  onChange={(e) =>
                    update({
                      sampleSizeMin: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </label>
              <label>
                Max
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="e.g. 500000"
                  value={filters.sampleSizeMax ?? ''}
                  onChange={(e) =>
                    update({
                      sampleSizeMax: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </label>
            </div>
          </fieldset>

          <MultiSelect
            label="Topic"
            values={options.topics}
            selected={filters.topics}
            onToggle={(value) => update({ topics: toggleListValue(filters.topics, value) })}
          />

          <MultiSelect
            label="Domain"
            values={options.domains}
            selected={filters.domains}
            onToggle={(value) => update({ domains: toggleListValue(filters.domains, value) })}
          />

          <MultiSelect
            label="Modality"
            values={options.modalities}
            selected={filters.modalities}
            onToggle={(value) => update({ modalities: toggleListValue(filters.modalities, value) })}
          />

          <MultiSelect
            label="Country / region"
            values={options.countries}
            selected={filters.countries}
            onToggle={(value) => update({ countries: toggleListValue(filters.countries, value) })}
          />

          <MultiSelect
            label="License"
            values={options.licenses}
            selected={filters.licenses}
            onToggle={(value) => update({ licenses: toggleListValue(filters.licenses, value) })}
          />

          <MultiSelect
            label="Repository"
            values={options.repositories}
            selected={filters.repositories}
            onToggle={(value) =>
              update({ repositories: toggleListValue(filters.repositories, value) })
            }
          />
        </div>
      )}
    </aside>
  );
}
