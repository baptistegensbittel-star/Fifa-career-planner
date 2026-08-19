import { useMemo, useState } from 'react';
import { FORMATIONS, getFormation } from '../data/formations';
import type { FormationCode, Player, PositionCode } from '../types/domain';
import { useStore } from '../store/store';
import { sortByDepthOrder, tierDef } from '../utils/helpers';
import { PlayerModal } from './PlayerModal';
import { TierLegend } from './TierLegend';

export function PitchView() {
  const { activeCareer, careerPlayers, updateCareer } = useStore();
  const [editing, setEditing] = useState<Player | null>(null);
  const [addingPosition, setAddingPosition] = useState<PositionCode | null>(null);

  const formation = getFormation(activeCareer?.formation ?? '4-2-3-1');

  const byPositionAndDepth = useMemo(() => {
    const titulaires = new Map<string, Player[]>();
    const remplacants = new Map<string, Player[]>();
    for (const p of careerPlayers) {
      const map = p.depthCategory === 'titulaire' ? titulaires : p.depthCategory === 'remplacant' ? remplacants : null;
      if (!map) continue;
      const list = map.get(p.positionCode) ?? [];
      list.push(p);
      map.set(p.positionCode, sortByDepthOrder(list));
    }
    return { titulaires, remplacants };
  }, [careerPlayers]);

  const usedIndexByPosition = new Map<string, number>();

  function nextPairFor(positionCode: string): { titulaire: Player | null; remplacant: Player | null } {
    const idx = usedIndexByPosition.get(positionCode) ?? 0;
    usedIndexByPosition.set(positionCode, idx + 1);
    return {
      titulaire: byPositionAndDepth.titulaires.get(positionCode)?.[idx] ?? null,
      remplacant: byPositionAndDepth.remplacants.get(positionCode)?.[idx] ?? null,
    };
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
          className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
        >
          {FORMATIONS.map((f) => (
            <option key={f.code} value={f.code}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden border border-white/10"
        style={{ background: '#1e5631' }}
      >
        <div className="absolute inset-3 border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />
        <div className="absolute left-1/2 top-3 h-px w-[calc(100%-1.5rem)] -translate-x-1/2 bg-white/20" />
        <div className="absolute left-1/2 top-3 h-16 w-40 -translate-x-1/2 border border-t-0 border-white/20" />
        <div className="absolute left-1/2 bottom-3 h-16 w-40 -translate-x-1/2 border border-b-0 border-white/20" />

        {formation.slots.map((slot) => {
          const { titulaire, remplacant } = nextPairFor(slot.positionCode);
          const tier = tierDef(titulaire?.tier ?? null);
          const subTier = tierDef(remplacant?.tier ?? null);
          return (
            <div
              key={slot.key}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <button
                type="button"
                onClick={() => (titulaire ? setEditing(titulaire) : setAddingPosition(slot.positionCode))}
                className="flex flex-col items-center gap-0.5 hover:opacity-80"
                title={titulaire ? 'Modifier le titulaire' : 'Ajouter un titulaire'}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-[11px] text-white"
                  style={{
                    background: tier ? tier.color : titulaire ? '#3f4657' : 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: tier ? tier.textColor : '#fff',
                  }}
                >
                  {titulaire?.rating ?? slot.label}
                </div>
                <span className="max-w-[76px] truncate bg-black/50 px-1 text-[10px] text-white">
                  {titulaire?.name ?? slot.label}
                </span>
              </button>

              <button
                type="button"
                onClick={() => remplacant && setEditing(remplacant)}
                className={`max-w-[76px] truncate px-1 text-[9px] ${
                  remplacant ? 'text-gray-300 hover:text-white' : 'text-gray-400'
                }`}
                title={remplacant ? 'Modifier le remplaçant' : 'Aucun remplaçant à ce poste'}
              >
                {remplacant ? (
                  <span className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: subTier?.color ?? '#5b6478' }}
                    />
                    <span className="truncate">{remplacant.name}</span>
                  </span>
                ) : (
                  '-'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <TierLegend />

      {editing && <PlayerModal player={editing} onClose={() => setEditing(null)} />}
      {addingPosition && (
        <PlayerModal
          player={null}
          initial={{ positionCode: addingPosition, depthCategory: 'titulaire' }}
          onClose={() => setAddingPosition(null)}
        />
      )}
    </div>
  );
}
