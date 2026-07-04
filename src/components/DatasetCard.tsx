import { Link } from 'react-router-dom';
import type { Dataset } from '../types/dataset';
import { formatDate, formatSampleSize } from '../lib/filters';
import { AccessBadge } from './SearchBar';

interface DatasetCardProps {
  dataset: Dataset;
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <article className="dataset-card">
      <div className="dataset-card-header">
        <h2>
          <Link to={`/dataset/${dataset.id}`}>{dataset.name}</Link>
        </h2>
        <AccessBadge accessType={dataset.access_type} />
      </div>

      <p className="dataset-description">{dataset.short_description}</p>

      <div className="tag-row">
        {dataset.topics.slice(0, 4).map((topic) => (
          <span key={topic} className="tag">
            {topic}
          </span>
        ))}
        {dataset.topics.length > 4 && (
          <span className="tag muted">+{dataset.topics.length - 4} more</span>
        )}
      </div>

      <dl className="dataset-meta">
        <div>
          <dt>Sample size</dt>
          <dd>{formatSampleSize(dataset.sample_size)}</dd>
        </div>
        <div>
          <dt>Repository</dt>
          <dd>{dataset.repository}</dd>
        </div>
        <div>
          <dt>Last verified</dt>
          <dd>{formatDate(dataset.last_verified)}</dd>
        </div>
      </dl>
    </article>
  );
}
