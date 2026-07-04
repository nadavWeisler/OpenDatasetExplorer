import type { FilterChip } from '../lib/filters';

interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export default function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="filter-chips" aria-label="Active filters">
      <span className="filter-chips-label">Active filters:</span>
      <div className="chip-list">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className="chip"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
          >
            {chip.label}
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button type="button" className="text-button" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}
