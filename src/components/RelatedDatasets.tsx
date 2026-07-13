import { Link } from 'react-router-dom';
import type { Dataset } from '../types/dataset';
import { AccessBadge } from './SearchBar';

interface RelatedDatasetsProps {
  datasets: Dataset[];
}

export default function RelatedDatasets({ datasets }: RelatedDatasetsProps) {
  if (datasets.length === 0) return null;

  return (
    <section className="detail-section full-width related-datasets">
      <h2>Related datasets</h2>
      <ul className="related-list">
        {datasets.map((d) => (
          <li key={d.id} className="related-item">
            <div className="related-item-header">
              <Link to={`/dataset/${d.id}`}>{d.name}</Link>
              <AccessBadge accessType={d.access_type} />
            </div>
            <p>{d.short_description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
