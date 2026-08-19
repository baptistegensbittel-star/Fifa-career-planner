import { POSITIONS, TIERS } from '../types/domain';
import type { DepthCategory, Player, PositionCode, Tier } from '../types/domain';

export function cellId(positionCode: PositionCode, depthCategory: DepthCategory): string {
  return `${positionCode}__${depthCategory}`;
}

export function parseCellId(id: string): { positionCode: PositionCode; depthCategory: DepthCategory } | null {
  const [positionCode, depthCategory] = id.split('__');
  if (!positionCode || !depthCategory) return null;
  return { positionCode: positionCode as PositionCode, depthCategory: depthCategory as DepthCategory };
}

export function positionLabel(code: PositionCode): string {
  return POSITIONS.find((p) => p.code === code)?.label ?? code;
}

export function tierDef(tier: Tier | null) {
  return TIERS.find((t) => t.code === tier) ?? null;
}

export function sortByDepthOrder(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.depthOrder - b.depthOrder || a.name.localeCompare(b.name));
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
