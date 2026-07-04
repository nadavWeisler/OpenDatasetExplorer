import type { AccessType } from '../types/dataset';
import { formatAccessType } from '../lib/filters';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="dataset-search" className="visually-hidden">
        Search datasets
      </label>
      <input
        id="dataset-search"
        type="search"
        placeholder="Search by name, topic, modality, repository, citation…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      <p className="search-meta" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'dataset' : 'datasets'} found
      </p>
    </div>
  );
}

export function AccessBadge({ accessType }: { accessType: AccessType }) {
  return <span className={`badge access-${accessType}`}>{formatAccessType(accessType)}</span>;
}
