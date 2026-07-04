export type AccessType = 'open_access' | 'restricted' | 'application_required';

export interface Dataset {
  id: string;
  name: string;
  short_description: string;
  topics: string[];
  domains: string[];
  modalities: string[];
  country_or_region: string;
  population: string;
  human_participants: boolean;
  sample_size: number | null;
  longitudinal: boolean;
  access_type: AccessType;
  license: string;
  data_format: string[];
  repository: string;
  url: string;
  citation: string;
  last_verified: string;
  tags: string[];
  notes: string;
  limitations: string;
}

export interface FilterState {
  query: string;
  topics: string[];
  domains: string[];
  modalities: string[];
  accessTypes: AccessType[];
  longitudinal: boolean | null;
  humanParticipants: boolean | null;
  sampleSizeMin: number | null;
  sampleSizeMax: number | null;
  countries: string[];
  licenses: string[];
  repositories: string[];
}

export const EMPTY_FILTERS: FilterState = {
  query: '',
  topics: [],
  domains: [],
  modalities: [],
  accessTypes: [],
  longitudinal: null,
  humanParticipants: null,
  sampleSizeMin: null,
  sampleSizeMax: null,
  countries: [],
  licenses: [],
  repositories: [],
};
