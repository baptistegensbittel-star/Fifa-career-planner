import { useMemo, useState } from 'react';
import { FORMATIONS, getFormation } from '../data/formations';
import type { FormationCode, Player } from '../types/domain';
import { useStore } from '../store/store';
import { sortByDepthOrder, tierDef } from '../utils/helpers';
import { PlayerModal } from './PlayerModal';

export function PitchView() {
  const { activeCareer, careerPlayers, updateCareer } = useStore();
  const [editing, setEditing] = useState<Player | null>(null);

  const formation = getFormation(activeCareer?.formation ?? '4-2-3-1');

  const titulairesByPosition = useMemo(() => {
    const map = new Map<string, Player[]>();
    for (const p of careerPlayers) {
      if (p.status !== 'squad' || p.depthCategory !== 'titulaire') continue;
      const list = map.get(p.positionCode) ?? [];
      list.push(p);
      map.set(p.positionCode, sortByDepthOrder(list));
    }
    return map;
  }, [careerPlayers]);

  const usedIndexByPosition = new Map<string, number>();

  function nextPlayerFor(positionCode: string): Player | null {
    const idx = usedIndexByPosition.get(positionCode) ?? 0;
    const list = titulairesByPosition.get(positionCode) ?? [];
    usedIndexByPosition.set(positionCode, idx + 1);
    return list[idx] ?? null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-400">Formation</span>
        <select
          value={formation.code}
          onChange={(e) =>
            activeCareer &&
            updateCareer(activeCareer.id, { formation: e.target.value as FormationCode })
          }
          className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
        >
          {FORMATIONS.map((f) => (
            <option key={f.code} value={f.code}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-inner"
        style={{
          background:
            'repeating-linear-gradient(180deg, #16652f 0, #16652f 10%, #146029 10%, #146029 20%)',
        }}
      >
        <div className="absolute inset-3 rounded-lg border-2 border-white/25" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
        <div className="absolute left-1/2 top-3 h-px w-[calc(100%-1.5rem)] -translate-x-1/2 bg-white/25" />
        <div className="absolute left-1/2 top-3 h-16 w-40 -translate-x-1/2 border-2 border-t-0 border-white/25" />
        <div className="absolute left-1/2 bottom-3 h-16 w-40 -translate-x-1/2 border-2 border-b-0 border-white/25" />

        {formation.slots.map((slot) => {
          const player = nextPlayerFor(slot.positionCode);
          const tier = tierDef(player?.tier ?? null);
          return (
            <button
              key={slot.key}
              type="button"
              onClick={() => player && setEditing(player)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white shadow-md"
                style={{
                  background: tier ? tier.color : player ? '#4b5568' : 'rgba(255,255,255,0.08)',
                  borderColor: player ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                  color: tier ? tier.textColor : '#fff',
                }}
              >
                {player?.rating ?? slot.label}
              </div>
              <span className="max-w-[72px] truncate rounded bg-black/60 px-1 text-[10px] font-medium text-white">
                {player?.name ?? slot.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400">
        {[
          ['Décisif', '#22c55e'],
          ['Important', '#3b82f6'],
          ['Rotation', '#f59e0b'],
          ['Sporadique', '#eab308'],
          ['Espoir', '#a855f7'],
        ].map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {editing && <PlayerModal player={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
