import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store/store';
import type { PositionCode } from '../types/domain';

interface ClubData {
  club: string;
  league: string;
  players: { n: string; p: string }[];
}

interface Props {
  onClose: () => void;
}

export function ImportClubModal({ onClose }: Props) {
  const { addPlayers } = useStore();
  const [clubs, setClubs] = useState<ClubData[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ClubData | null>(null);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/clubs.json`)
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data: ClubData[]) => setClubs(data))
      .catch(() => setError(true));
  }, []);

  const results = useMemo(() => {
    if (!clubs || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return clubs.filter((c) => c.club.toLowerCase().includes(q)).slice(0, 30);
  }, [clubs, query]);

  function handleImport() {
    if (!selected) return;
    addPlayers(
      selected.players.map((p) => ({
        name: p.n,
        positionCode: p.p as PositionCode,
        depthCategory: 'remplacant',
      })),
    );
    setImported(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-lg border border-white/10 bg-[#14161d] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-white">Importer un club</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            ✕
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">Impossible de charger la base de clubs.</p>
        )}

        {!error && imported && selected && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-300">
              {selected.players.length} joueurs de {selected.club} ajoutés en Remplaçant. Tu peux
              maintenant les répartir et régler les tiers dans le tableau.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="self-start rounded bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        )}

        {!error && !imported && (
          <>
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              placeholder={clubs ? 'Chercher un club...' : 'Chargement...'}
              disabled={!clubs}
              className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
            />

            {selected ? (
              <div className="mt-3 flex flex-col gap-3">
                <div className="rounded border border-white/10 p-3">
                  <div className="text-sm text-white">{selected.club}</div>
                  <div className="text-xs text-gray-500">
                    {selected.league} · {selected.players.length} joueurs
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="rounded px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={handleImport}
                    className="rounded bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-200"
                  >
                    Importer {selected.players.length} joueurs
                  </button>
                </div>
              </div>
            ) : (
              <ul className="mt-2 max-h-64 overflow-y-auto">
                {results.map((c) => (
                  <li key={`${c.club}|${c.league}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex w-full items-center justify-between px-1 py-1.5 text-left text-sm text-gray-200 hover:bg-white/5"
                    >
                      <span>{c.club}</span>
                      <span className="text-xs text-gray-500">{c.league}</span>
                    </button>
                  </li>
                ))}
                {query.trim().length >= 2 && results.length === 0 && (
                  <li className="px-1 py-1.5 text-xs text-gray-600">Aucun club trouvé.</li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
