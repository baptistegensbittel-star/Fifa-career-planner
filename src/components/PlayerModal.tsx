import { useState } from 'react';
import { DEPTH_CATEGORIES, POSITIONS, TIERS } from '../types/domain';
import type { DepthCategory, Player, PositionCode, Tier } from '../types/domain';
import { useStore } from '../store/store';

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
    if (confirm(`Supprimer ${player.name} ?`)) {
      deletePlayer(player.id);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[#14161d] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-white">
            {isNew ? 'Ajouter un joueur' : 'Modifier le joueur'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Nom
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
              placeholder="Nom du joueur"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Poste
              <select
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value as PositionCode)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
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
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
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
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">—</option>
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
                className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
              />
            </label>
          </div>

          <div className="mt-2 flex items-center justify-between">
            {!isNew ? (
              <button
                type="button"
                onClick={handleDelete}
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
                className="rounded bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-200"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
