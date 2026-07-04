interface EmptyStateProps {
  hasQueryOrFilters: boolean;
  onClear: () => void;
}

export default function EmptyState({ hasQueryOrFilters, onClear }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">
        ∅
      </div>
      <h2>No datasets match your search</h2>
      {hasQueryOrFilters ? (
        <>
          <p>Try broadening your search terms or removing some filters.</p>
          <button type="button" className="primary-button" onClick={onClear}>
            Clear search and filters
          </button>
        </>
      ) : (
        <p>The catalog is empty. Add datasets to <code>src/data/datasets.json</code>.</p>
      )}
    </div>
  );
}
