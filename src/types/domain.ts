export type PositionCode =
  | 'G'
  | 'DD'
  | 'DC'
  | 'DG'
  | 'MDC'
  | 'MC'
  | 'MOC'
  | 'MD'
  | 'MG'
  | 'AD'
  | 'AG'
  | 'BU';

export interface PositionDef {
  code: PositionCode;
  label: string;
  group: 'Gardien' | 'Défense' | 'Milieu' | 'Attaque';
}

export const POSITIONS: PositionDef[] = [
  { code: 'G', label: 'Gardien', group: 'Gardien' },
  { code: 'DD', label: 'Défenseur droit', group: 'Défense' },
  { code: 'DC', label: 'Défenseur central', group: 'Défense' },
  { code: 'DG', label: 'Défenseur gauche', group: 'Défense' },
  { code: 'MDC', label: 'Milieu défensif', group: 'Milieu' },
  { code: 'MC', label: 'Milieu central', group: 'Milieu' },
  { code: 'MOC', label: 'Milieu offensif', group: 'Milieu' },
  { code: 'MD', label: 'Milieu droit', group: 'Milieu' },
  { code: 'MG', label: 'Milieu gauche', group: 'Milieu' },
  { code: 'AD', label: 'Ailier droit', group: 'Attaque' },
  { code: 'AG', label: 'Ailier gauche', group: 'Attaque' },
  { code: 'BU', label: 'Buteur', group: 'Attaque' },
];

export type DepthCategory = 'titulaire' | 'remplacant' | 'espoir';

export const DEPTH_CATEGORIES: { code: DepthCategory; label: string }[] = [
  { code: 'titulaire', label: 'Titulaire' },
  { code: 'remplacant', label: 'Remplaçant' },
  { code: 'espoir', label: 'Espoirs' },
];

export type Tier = 'decisif' | 'important' | 'rotation' | 'sporadique' | 'espoir';

export interface TierDef {
  code: Tier;
  label: string;
  color: string; // tailwind bg class
  textColor: string;
}

export const TIERS: TierDef[] = [
  { code: 'decisif', label: 'Décisif', color: '#22c55e', textColor: '#052e12' },
  { code: 'important', label: 'Important', color: '#3b82f6', textColor: '#0b1a3d' },
  { code: 'rotation', label: 'Rotation', color: '#f59e0b', textColor: '#3d2a04' },
  { code: 'sporadique', label: 'Sporadique', color: '#eab308', textColor: '#3d3204' },
  { code: 'espoir', label: 'Espoir', color: '#a855f7', textColor: '#2e0a4d' },
];

export interface Player {
  id: string;
  careerId: string;
  name: string;
  positionCode: PositionCode;
  depthCategory: DepthCategory;
  depthOrder: number;
  tier: Tier | null;
  rating: number | null;
  createdAt: number;
  updatedAt: number;
}

export type FormationCode = string;

export interface FormationSlot {
  key: string;
  positionCode: PositionCode;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100 (0 = top/attack, 100 = bottom/goal)
}

export interface FormationDef {
  code: FormationCode;
  label: string;
  slots: FormationSlot[];
}

export interface Career {
  id: string;
  name: string;
  club: string;
  season: string;
  formation: FormationCode;
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  careers: Career[];
  players: Player[];
  activeCareerId: string | null;
}
