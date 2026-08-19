import type { FormationDef, FormationSlot, PositionCode } from '../types/domain';

// x-coordinates (in %) for evenly spread lines of n players
const SPREAD: Record<number, number[]> = {
  1: [50],
  2: [30, 70],
  3: [20, 50, 80],
  4: [18, 38, 62, 82],
  5: [10, 30, 50, 70, 90],
};

interface LineItem {
  code: PositionCode;
  label?: string;
}

function line(y: number, items: LineItem[]): FormationSlot[] {
  const xs = SPREAD[items.length] ?? SPREAD[3];
  return items.map((item, i) => ({
    key: `${item.code.toLowerCase()}-${y}-${i}`,
    positionCode: item.code,
    label: item.label ?? item.code,
    x: xs[i],
    y,
  }));
}

function keeper(): FormationSlot {
  return { key: 'g', positionCode: 'G', label: 'G', x: 50, y: 92 };
}

function back4(): LineItem[] {
  return [{ code: 'DD' }, { code: 'DC' }, { code: 'DC' }, { code: 'DG' }];
}
function back3(): LineItem[] {
  return [{ code: 'DC' }, { code: 'DC' }, { code: 'DC' }];
}
function back5(): LineItem[] {
  return [{ code: 'DD' }, { code: 'DC' }, { code: 'DC' }, { code: 'DC' }, { code: 'DG' }];
}

function build(code: string, label: string, lines: FormationSlot[][]): FormationDef {
  return { code, label, slots: [keeper(), ...lines.flat()] };
}

export const FORMATIONS: FormationDef[] = [
  build('4-4-2', '4-4-2', [
    line(78, back4()),
    line(48, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(14, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('4-4-1-1', '4-4-1-1', [
    line(78, back4()),
    line(50, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(30, [{ code: 'MOC' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('4-3-3', '4-3-3', [
    line(78, back4()),
    line(52, [{ code: 'MC' }, { code: 'MC' }, { code: 'MC' }]),
    line(18, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('4-3-3-offensif', '4-3-3 Offensif', [
    line(78, back4()),
    line(60, [{ code: 'MDC' }]),
    line(42, [{ code: 'MC' }, { code: 'MC' }]),
    line(16, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('4-3-3-defensif', '4-3-3 Défensif', [
    line(78, back4()),
    line(60, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(40, [{ code: 'MC' }]),
    line(20, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('4-3-3-conservateur', '4-3-3 Conservateur', [
    line(78, back4()),
    line(56, [{ code: 'MDC' }, { code: 'MC' }, { code: 'MDC' }]),
    line(22, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('4-2-3-1', '4-2-3-1', [
    line(78, back4()),
    line(60, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(34, [{ code: 'AG' }, { code: 'MOC' }, { code: 'AD' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('4-2-3-1-wide', '4-2-3-1 (large)', [
    line(78, back4()),
    line(60, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(34, [{ code: 'MG' }, { code: 'MOC' }, { code: 'MD' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('4-1-2-1-2', '4-1-2-1-2 (losange)', [
    line(78, back4()),
    line(62, [{ code: 'MDC' }]),
    line(46, [{ code: 'MC' }, { code: 'MC' }]),
    line(30, [{ code: 'MOC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('4-1-2-1-2-wide', '4-1-2-1-2 (large)', [
    line(78, back4()),
    line(62, [{ code: 'MDC' }]),
    line(46, [{ code: 'MG' }, { code: 'MD' }]),
    line(30, [{ code: 'MOC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('4-1-3-2', '4-1-3-2', [
    line(78, back4()),
    line(62, [{ code: 'MDC' }]),
    line(42, [{ code: 'MG' }, { code: 'MC' }, { code: 'MD' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('4-1-4-1', '4-1-4-1', [
    line(78, back4()),
    line(62, [{ code: 'MDC' }]),
    line(42, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('4-2-2-2', '4-2-2-2', [
    line(78, back4()),
    line(60, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(34, [{ code: 'MOC' }, { code: 'MOC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('4-5-1', '4-5-1', [
    line(78, back4()),
    line(48, [
      { code: 'MD' },
      { code: 'MC' },
      { code: 'MC' },
      { code: 'MC' },
      { code: 'MG' },
    ]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('4-5-1-attaque', '4-5-1 (attaque)', [
    line(78, back4()),
    line(46, [{ code: 'MC' }, { code: 'MC' }, { code: 'MC' }]),
    line(26, [{ code: 'AG' }, { code: 'AD' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('5-2-1-2', '5-2-1-2', [
    line(80, back5()),
    line(58, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(32, [{ code: 'MOC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('5-2-3', '5-2-3', [
    line(80, back5()),
    line(56, [{ code: 'MDC' }, { code: 'MDC' }]),
    line(18, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('5-3-2', '5-3-2', [
    line(80, back5()),
    line(52, [{ code: 'MC' }, { code: 'MC' }, { code: 'MC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('5-4-1', '5-4-1', [
    line(80, back5()),
    line(50, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('3-4-3', '3-4-3', [
    line(78, back3()),
    line(50, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(18, [{ code: 'AG' }, { code: 'BU' }, { code: 'AD' }]),
  ]),
  build('3-4-1-2', '3-4-1-2', [
    line(78, back3()),
    line(52, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(30, [{ code: 'MOC' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('3-4-2-1', '3-4-2-1', [
    line(78, back3()),
    line(52, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(30, [{ code: 'MOC' }, { code: 'MOC' }]),
    line(12, [{ code: 'BU' }]),
  ]),
  build('3-5-2', '3-5-2', [
    line(78, back3()),
    line(52, [
      { code: 'MD' },
      { code: 'MDC' },
      { code: 'MC' },
      { code: 'MDC' },
      { code: 'MG' },
    ]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
  build('3-1-4-2', '3-1-4-2', [
    line(78, back3()),
    line(62, [{ code: 'MDC' }]),
    line(44, [{ code: 'MD' }, { code: 'MC' }, { code: 'MC' }, { code: 'MG' }]),
    line(12, [{ code: 'BU' }, { code: 'BU' }]),
  ]),
];

export function getFormation(code: string): FormationDef {
  return FORMATIONS.find((f) => f.code === code) ?? FORMATIONS[0];
}
