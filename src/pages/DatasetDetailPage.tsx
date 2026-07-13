import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import datasetsJson from '../data/datasets.json';
import type { Dataset } from '../types/dataset';
import { formatAccessType, formatDate, formatSampleSize } from '../lib/filters';
import { findRelatedDatasets } from '../lib/related';
import { AccessBadge } from '../components/SearchBar';
import FilterTag from '../components/FilterTag';
import PageMeta from '../components/PageMeta';
import RelatedDatasets from '../components/RelatedDatasets';
import SeeAlsoSection from '../components/SeeAlsoSection';

const datasets = datasetsJson as Dataset[];

function MetadataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="metadata-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dataset = datasets.find((d) => d.id === id);
  const [copied, setCopied] = useState(false);
  const related = dataset ? findRelatedDatasets(dataset, datasets) : [];

  if (!dataset) {
    return (
      <div className="container detail-page">
        <PageMeta title="Dataset not found" description="The requested dataset could not be located in this catalog." />
        <div className="empty-state">
          <h2>Dataset not found</h2>
          <p>The requested dataset could not be located in this catalog.</p>
          <Link to="/" className="primary-button">
            Back to explore
          </Link>
        </div>
      </div>
    );
  }

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(dataset.citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container detail-page">
      <PageMeta title={dataset.name} description={dataset.short_description} />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Explore</Link>
        <span aria-hidden="true">/</span>
        <span>{dataset.name}</span>
      </nav>

      <header className="detail-header">
        <div>
          <h1>{dataset.name}</h1>
          <p className="detail-lead">{dataset.short_description}</p>
        </div>
        <AccessBadge accessType={dataset.access_type} />
      </header>

      <div className="detail-actions">
        <a href={dataset.url} className="primary-button" target="_blank" rel="noopener noreferrer">
          Open dataset source
        </a>
        {dataset.id === 'osf' && (
          <a
            href="https://osf.io/search/"
            className="secondary-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Search OSF projects
          </a>
        )}
        <button type="button" className="secondary-button" onClick={copyCitation}>
          {copied ? 'Citation copied' : 'Copy citation'}
        </button>
      </div>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Overview</h2>
          <dl className="metadata-list">
            <MetadataRow label="Topics">
              <div className="tag-row">
                {dataset.topics.map((t) => (
                  <FilterTag key={t} facet="topic" value={t} />
                ))}
              </div>
            </MetadataRow>
            <MetadataRow label="Domains">
              <div className="tag-row">
                {dataset.domains.map((d) => (
                  <FilterTag key={d} facet="domain" value={d} className="muted" />
                ))}
              </div>
            </MetadataRow>
            <MetadataRow label="Modalities">
              <div className="tag-row">
                {dataset.modalities.map((m) => (
                  <FilterTag key={m} facet="modality" value={m} className="muted" />
                ))}
              </div>
            </MetadataRow>
            <MetadataRow label="Tags">
              <div className="tag-row">
                {dataset.tags.map((t) => (
                  <span key={t} className="tag muted">
                    {t}
                  </span>
                ))}
              </div>
            </MetadataRow>
            <MetadataRow label="Notes">{dataset.notes}</MetadataRow>
            <MetadataRow label="Limitations">{dataset.limitations}</MetadataRow>
          </dl>
        </section>

        <section className="detail-section">
          <h2>Access &amp; provenance</h2>
          <dl className="metadata-list">
            <MetadataRow label="Access type">{formatAccessType(dataset.access_type)}</MetadataRow>
            <MetadataRow label="License">{dataset.license}</MetadataRow>
            <MetadataRow label="Repository">{dataset.repository}</MetadataRow>
            <MetadataRow label="Data formats">{dataset.data_format.join(', ')}</MetadataRow>
            <MetadataRow label="URL">
              <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                {dataset.url}
              </a>
            </MetadataRow>
            <MetadataRow label="Last verified">{formatDate(dataset.last_verified)}</MetadataRow>
          </dl>
        </section>

        <section className="detail-section">
          <h2>Study design</h2>
          <dl className="metadata-list">
            <MetadataRow label="Country / region">{dataset.country_or_region}</MetadataRow>
            <MetadataRow label="Population">{dataset.population}</MetadataRow>
            <MetadataRow label="Human participants">
              {dataset.human_participants ? 'Yes' : 'No'}
            </MetadataRow>
            <MetadataRow label="Sample size">{formatSampleSize(dataset.sample_size)}</MetadataRow>
            <MetadataRow label="Longitudinal">{dataset.longitudinal ? 'Yes' : 'No'}</MetadataRow>
          </dl>
        </section>

        <section className="detail-section full-width">
          <h2>Citation</h2>
          <blockquote className="citation-block">{dataset.citation}</blockquote>
        </section>

        <RelatedDatasets datasets={related} />

        {dataset.see_also && dataset.see_also.length > 0 && (
          <SeeAlsoSection links={dataset.see_also} />
        )}
      </div>
    </div>
  );
}
