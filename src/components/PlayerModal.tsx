import { useEffect, useState } from 'react';
import { DEPTH_CATEGORIES, POSITIONS, TIERS } from '../types/domain';
import type { DepthCategory, Player, PositionCode, Tier } from '../types/domain';
import { useStore } from '../store/store';
import { loadPlayerIndex } from '../data/clubsData';
import type { FlatPlayer } from '../data/clubsData';
import { CloseIcon } from './icons';

interface Props {
  player: Player | null;
  initial?: {
    positionCode?: PositionCode;
    depthCategory?: DepthCategory;
  };
  onClose: () => void;
}

export function PlayerModal({ player, initial, onClose }: Props) {
  const { addPlayer, updatePlayer, deletePlayer } = useStore();
  const isNew = player === null;

  const [name, setName] = useState(player?.name ?? '');
  const [positionCode, setPositionCode] = useState<PositionCode>(
    player?.positionCode ?? initial?.positionCode ?? 'MC',
  );
  const [depthCategory, setDepthCategory] = useState<DepthCategory>(
    player?.depthCategory ?? initial?.depthCategory ?? 'titulaire',
  );
  const [tier, setTier] = useState<Tier | ''>(player?.tier ?? '');
  const [rating, setRating] = useState(player?.rating?.toString() ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [playerIndex, setPlayerIndex] = useState<FlatPlayer[] | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    loadPlayerIndex().then(setPlayerIndex).catch(() => {});
  }, []);

  const suggestions =
    playerIndex && suggestionsOpen && name.trim().length >= 2
      ? playerIndex
          .filter((p) => p.name.toLowerCase().includes(name.trim().toLowerCase()))
          .slice(0, 6)
      : [];

  function pickSuggestion(p: FlatPlayer) {
    setName(p.name);
    setPositionCode(p.position as PositionCode);
    setSuggestionsOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const patch = {
      name: name.trim(),
      positionCode,
      depthCategory,
      tier: tier || null,
      rating: rating ? Number(rating) : null,
    };
    if (isNew) {
      addPlayer(patch);
    } else {
      updatePlayer(player.id, patch);
    }
    onClose();
  }

  function handleDelete() {
    if (!player) return;
    deletePlayer(player.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[#141a29] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-white">
            {isNew ? 'Ajouter un joueur' : 'Modifier le joueur'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="relative flex flex-col gap-1 text-xs text-gray-400">
            Nom
            <input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
              autoComplete="off"
              className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              placeholder="Nom du joueur"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded border border-white/10 bg-[#1b2338] shadow-lg">
                {suggestions.map((p) => (
                  <li key={`${p.name}|${p.club}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickSuggestion(p)}
                      className="flex w-full items-center justify-between px-2 py-1.5 text-left text-sm text-gray-200 hover:bg-white/5"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-gray-400">{p.club}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Poste
              <select
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value as PositionCode)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              >
                {POSITIONS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Profondeur
              <select
                value={depthCategory}
                onChange={(e) => setDepthCategory(e.target.value as DepthCategory)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              >
                {DEPTH_CATEGORIES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Tier
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              >
                <option value="">-</option>
                {TIERS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Note
              <input
                type="number"
                min={0}
                max={99}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-[#5b8cff]/60"
              />
            </label>
          </div>

          {confirmingDelete && player ? (
            <div className="mt-2 flex items-center justify-between rounded border border-red-500/20 bg-red-500/5 px-3 py-2">
              <span className="text-sm text-gray-300">Supprimer {player.name} ?</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="text-sm text-gray-400 hover:underline"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-sm font-medium text-red-400 hover:underline"
                >
                  Confirmer
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between">
              {!isNew ? (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Supprimer
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#5b8cff] px-3 py-1.5 text-sm font-medium text-[#08101f] hover:bg-[#74a0ff]"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
