import { useState } from 'react';
import type { Player, PlayerStatus } from '../types/domain';
import { useStore } from '../store/store';
import { positionLabel } from '../utils/helpers';
import { PlayerModal } from './PlayerModal';

const SECTIONS: { status: PlayerStatus; title: string; hint: string; accent: string }[] = [
  { status: 'watchlist', title: 'À surveiller / cibles', hint: 'Joueurs repérés à recruter', accent: '#ef4444' },
  { status: 'loan', title: 'Prêtés', hint: 'Joueurs du club actuellement en prêt', accent: '#eab308' },
  { status: 'sold', title: 'Vendus', hint: 'Historique des ventes', accent: '#64748b' },
  { status: 'released', title: 'Libérés', hint: 'Fins de contrat / libérations', accent: '#64748b' },
];

export function TransfersView() {
  const { careerPlayers } = useStore();
  const [editing, setEditing] = useState<Player | null>(null);
  const [adding, setAdding] = useState<PlayerStatus | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {SECTIONS.map((section) => {
        const players = careerPlayers.filter((p) => p.status === section.status);
        return (
          <div key={section.status} className="rounded-xl border border-white/10 bg-[#12141c]">
            <div
              className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"
              style={{ borderLeft: `3px solid ${section.accent}` }}
            >
              <div>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.hint}</p>
              </div>
              <button
                type="button"
                onClick={() => setAdding(section.status)}
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-300 hover:bg-white/5"
              >
                + Ajouter
              </button>
            </div>
            {players.length === 0 ? (
              <p className="px-4 py-3 text-xs text-gray-600">Aucun joueur.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm hover:bg-white/[0.03]"
                  >
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="font-medium text-white hover:underline"
                    >
                      {p.name}
                    </button>
                    <span className="text-xs text-gray-500">{positionLabel(p.positionCode)}</span>
                    {p.rating != null && (
                      <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums text-gray-300">
                        {p.rating} OVR
                      </span>
                    )}
                    {p.destinationClub && (
                      <span className="text-xs text-gray-500">→ {p.destinationClub}</span>
                    )}
                    {p.value && <span className="text-xs text-emerald-400">{p.value}</span>}
                    {p.sofifaUrl && (
                      <a
                        href={p.sofifaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-xs text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Sofifa ↗
                      </a>
                    )}
                    {p.notes && <span className="w-full text-xs text-gray-500">{p.notes}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {editing && <PlayerModal player={editing} onClose={() => setEditing(null)} />}
      {adding && (
        <PlayerModal
          player={null}
          initial={{ status: adding, depthCategory: null }}
          onClose={() => setAdding(null)}
        />
      )}
    </div>
  );
}
