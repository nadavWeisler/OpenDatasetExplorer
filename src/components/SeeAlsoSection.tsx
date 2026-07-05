import { Link } from 'react-router-dom';
import type { SeeAlsoLink } from '../types/dataset';

interface SeeAlsoSectionProps {
  links: SeeAlsoLink[];
  title?: string;
}

export default function SeeAlsoSection({ links, title = 'See also' }: SeeAlsoSectionProps) {
  if (links.length === 0) return null;

  return (
    <section className="detail-section see-also-section">
      <h2>{title}</h2>
      <ul className="see-also-list">
        {links.map((link) => {
          const key = link.id ?? link.url ?? link.name;
          const content = (
            <>
              <span className="see-also-name">{link.name}</span>
              {link.description && <span className="see-also-desc">{link.description}</span>}
            </>
          );

          if (link.id) {
            return (
              <li key={key}>
                <Link to={`/dataset/${link.id}`} className="see-also-link">
                  {content}
                </Link>
              </li>
            );
          }

          if (link.url) {
            return (
              <li key={key}>
                <a
                  href={link.url}
                  className="see-also-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              </li>
            );
          }

          return (
            <li key={key} className="see-also-plain">
              {content}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
