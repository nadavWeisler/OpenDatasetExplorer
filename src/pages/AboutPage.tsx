import openAccessResourcesJson from '../data/open-access-resources.json';
import type { SeeAlsoLink } from '../types/dataset';
import SeeAlsoSection from '../components/SeeAlsoSection';

const openAccessResources = openAccessResourcesJson as SeeAlsoLink[];

export default function AboutPage() {
  return (
    <div className="container about-page">
      <header className="about-header">
        <h1>Source &amp; About</h1>
        <p className="about-lead">
          OpenDataset Explorer is a static, client-side tool for discovering open-access and
          restricted research datasets. It runs entirely in your browser with no login, no user
          data collection, and no tracking.
        </p>
      </header>

      <section className="about-section">
        <h2>What this is</h2>
        <ul>
          <li>A curated reference catalog — not an exhaustive registry of all datasets.</li>
          <li>Dataset metadata is stored locally in JSON and shipped with the app.</li>
          <li>Search and filtering run entirely on your device using Fuse.js.</li>
          <li>Designed for GitHub Pages deployment as a static site.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>What this is not</h2>
        <ul>
          <li>Not a data repository or download portal.</li>
          <li>Not a substitute for reading official access policies at the source.</li>
          <li>Not guaranteed to be complete, current, or error-free.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Data sources</h2>
        <p>
          Each entry links to its official repository or program website. Metadata is manually
          curated and includes a <strong>last verified</strong> date. Always confirm access
          requirements, licenses, and study details at the original source before use.
        </p>
        <p>
          The catalog includes open science platforms such as the{' '}
          <a href="https://osf.io/" target="_blank" rel="noopener noreferrer">
            Open Science Framework (OSF)
          </a>
          , Zenodo, Figshare, and government open data portals. Dataset detail pages include a{' '}
          <strong>See also</strong> section with related open-access resources.
        </p>
        <p>
          See <code>DATA_SOURCES.md</code> in the repository for how to add or update datasets,
          and <code>CONTRIBUTING.md</code> for contribution guidelines.
        </p>
      </section>

      <SeeAlsoSection
        links={openAccessResources}
        title="See also — open access research discovery"
      />

      <section className="about-section">
        <h2>Privacy</h2>
        <p>
          This app does not use analytics, cookies for tracking, or server-side logging. When
          deployed with offline support (service worker), static assets are cached locally for
          faster repeat visits.
        </p>
      </section>

      <section className="about-section">
        <h2>Technology</h2>
        <ul>
          <li>Vite + React + TypeScript</li>
          <li>Fuse.js for fuzzy search</li>
          <li>Plain CSS, mobile-first responsive layout</li>
          <li>vite-plugin-pwa for optional offline caching</li>
        </ul>
      </section>

      <section className="about-section warning-box">
        <h2>Important</h2>
        <p>
          <strong>For research discovery only.</strong> Verify all details — access policies,
          licenses, consent constraints, and data dictionaries — at the original source before
          planning a study or analysis.
        </p>
      </section>
    </div>
  );
}
