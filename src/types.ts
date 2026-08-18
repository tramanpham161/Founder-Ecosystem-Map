export type LocationOption = 'UK' | 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';

export type DemographicOption =
  | 'LSEB'
  | 'women'
  | 'black'
  | 'asian'
  | 'LGBTQIA+'
  | 'first-generation immigrants';

export type StageOption =
  | 'Awareness & ideation'
  | 'Incubator'
  | 'Accelerator'
  | 'Investor readiness'
  | 'Early finance & VC access';

export type CrossCuttingPillar =
  | 'Mentoring & networking'
  | 'Policy, evidence & ecosystem influence'
  | 'Community & social capital';

export type SectorOption =
  | 'Education / HE / FE'
  | 'VCSE / Community / Youth'
  | 'Local authority / Public body'
  | 'Employer / Private / Industry';

export type StatusOption =
  | 'Active / Delivering now'
  | 'Past / Searchable ledger'
  | 'Planned / Co-funding needed'
  | 'At risk / Ending cycle';

export interface Organisation {
  id: string;
  name: string;
  shortName?: string;
  sector: SectorOption;
  nation: 'England' | 'Scotland' | 'Wales' | 'Northern Ireland' | 'UK-Wide';
  city: string;
  locationDisplay: string;
  coordinates: [number, number]; // [lat, lng]
  director: string;
  directorRole: string;
  email: string;
  website: string;
  stages: StageOption[];
  crossCuttingPillars?: CrossCuttingPillar[];
  demographics: DemographicOption[];
  lookingFor: string;
  status: StatusOption;
  activeInitiative: string;
  description: string;
  fundingEnvelope?: string;
  grantOrInvestment?: string;
  cohortCapacity?: string;
  yearEstablished?: number;
  featuredQuote?: string;
  keyPartners?: string[];
}

export interface FilterState {
  locations: LocationOption[]; // multi-select
  demographics: DemographicOption[]; // multi-select
  selectedStage: StageOption | null; // optional single stage filter or highlight
  selectedPillar?: CrossCuttingPillar | null; // optional cross-cutting track filter
  searchQuery: string;
  statusFilter?: StatusOption | 'all';
}
