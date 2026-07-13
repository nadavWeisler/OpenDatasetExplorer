import { Link } from 'react-router-dom';
import { buildExploreUrl } from '../lib/filterUrl';

type FilterFacet = 'topic' | 'domain' | 'modality';

interface FilterTagProps {
  facet: FilterFacet;
  value: string;
  className?: string;
}

export default function FilterTag({ facet, value, className = '' }: FilterTagProps) {
  const to = buildExploreUrl({ [facet]: value });

  return (
    <Link
      to={to}
      className={`tag tag-link ${className}`.trim()}
      title={`Filter by ${value}`}
    >
      {value}
    </Link>
  );
}
