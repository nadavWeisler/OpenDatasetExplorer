import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title === 'OpenDataset Explorer' ? title : `${title} | OpenDataset Explorer`;
    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');

    return () => {
      document.title = 'OpenDataset Explorer';
      upsertMeta(
        'name',
        'description',
        'OpenDataset Explorer — discover open-access and restricted research datasets by topic, modality, and access type.',
      );
    };
  }, [title, description]);

  return null;
}
