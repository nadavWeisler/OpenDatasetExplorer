import type { Dataset } from '../types/dataset';

function overlapScore(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((v) => setB.has(v)).length;
}

function relatedScore(source: Dataset, candidate: Dataset): number {
  return (
    overlapScore(source.topics, candidate.topics) * 3 +
    overlapScore(source.domains, candidate.domains) * 2 +
    overlapScore(source.modalities, candidate.modalities) +
    (source.repository === candidate.repository ? 1 : 0)
  );
}

export function findRelatedDatasets(
  dataset: Dataset,
  all: Dataset[],
  limit = 3,
): Dataset[] {
  return all
    .filter((d) => d.id !== dataset.id)
    .map((d) => ({ dataset: d, score: relatedScore(dataset, d) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.dataset.name.localeCompare(b.dataset.name))
    .slice(0, limit)
    .map(({ dataset: d }) => d);
}
