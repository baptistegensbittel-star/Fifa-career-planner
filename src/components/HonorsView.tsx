import { useState } from 'react';
import { useStore } from '../store/store';
import { incrementSeasonLabel } from '../store/store';

export function HonorsView() {
  const { activeCareer, updateCareer, archiveSeason } = useStore();
  const [newTrophy, setNewTrophy] = useState('');
  const [confirmingNewSeason, setConfirmingNewSeason] = useState(false);

  if (!activeCareer) return null;

  function addTrophy() {
    if (!activeCareer || !newTrophy.trim()) return;
    updateCareer(activeCareer.id, { trophies: [...activeCareer.trophies, newTrophy.trim()] });
    setNewTrophy('');
  }

  function removeTrophy(index: number) {
    if (!activeCareer) return;
    updateCareer(activeCareer.id, {
      trophies: activeCareer.trophies.filter((_, i) => i !== index),
    });
  }

  function handleNewSeason() {
    if (!activeCareer) return;
    archiveSeason(activeCareer.id, incrementSeasonLabel(activeCareer.season));
    setConfirmingNewSeason(false);
  }

  function deleteHistoryEntry(id: string) {
    if (!activeCareer) return;
    if (!confirm('Supprimer cette saison du palmarès ?')) return;
    updateCareer(activeCareer.id, {
      seasonHistory: activeCareer.seasonHistory.filter((s) => s.id !== id),
    });
  }

  const nextSeasonLabel = incrementSeasonLabel(activeCareer.season);

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-white/10 p-4">
        <h2 className="text-xs uppercase tracking-wide text-gray-500">
          Saison en cours — {activeCareer.season}
        </h2>

        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Classement en championnat
            <input
              value={activeCareer.position}
              onChange={(e) => updateCareer(activeCareer.id, { position: e.target.value })}
              placeholder="ex: 1er, 3ème, Relégué..."
              className="w-full max-w-xs rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
            />
          </label>

          <div className="flex flex-col gap-1 text-xs text-gray-400">
            Trophées remportés
            {activeCareer.trophies.length > 0 && (
              <ul className="mb-1 flex flex-col divide-y divide-white/5 border border-white/10">
                {activeCareer.trophies.map((t, i) => (
                  <li key={`${t}-${i}`} className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-200">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTrophy(i)}
                      className="text-gray-600 hover:text-red-400"
                      title="Retirer"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                value={newTrophy}
                onChange={(e) => setNewTrophy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTrophy();
                  }
                }}
                placeholder="ex: Coupe de France"
                className="w-full max-w-xs rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              />
              <button
                type="button"
                onClick={addTrophy}
                className="rounded border border-white/10 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          {confirmingNewSeason ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/20 bg-white/5 px-3 py-2">
              <span className="text-sm text-gray-300">
                Archiver la saison {activeCareer.season} et passer à {nextSeasonLabel} ?
                L'effectif reste identique.
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingNewSeason(false)}
                  className="text-sm text-gray-400 hover:underline"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleNewSeason}
                  className="text-sm font-medium text-white hover:underline"
                >
                  Confirmer
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingNewSeason(true)}
              className="rounded bg-[#5b8cff] px-3 py-1.5 text-sm font-medium text-[#08101f] hover:bg-[#74a0ff]"
            >
              Nouvelle saison
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xs uppercase tracking-wide text-gray-500">Historique</h2>
        {activeCareer.seasonHistory.length === 0 ? (
          <p className="text-sm text-gray-600">Aucune saison archivée pour l'instant.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...activeCareer.seasonHistory].reverse().map((s) => (
              <li key={s.id} className="border border-white/10 p-3">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium text-white">{s.season}</div>
                  <button
                    type="button"
                    onClick={() => deleteHistoryEntry(s.id)}
                    className="text-xs text-gray-600 hover:text-red-400"
                  >
                    Supprimer
                  </button>
                </div>
                {s.position && <div className="mt-0.5 text-xs text-gray-400">{s.position}</div>}
                {s.trophies.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.trophies.map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-600">Aucun trophée noté.</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
