import { useState } from 'react';
import {
  DEPTH_CATEGORIES,
  POSITIONS,
  TIERS,
} from '../types/domain';
import type {
  DepthCategory,
  Player,
  PlayerStatus,
  PositionCode,
  Tier,
} from '../types/domain';
import { useStore } from '../store/store';

interface Props {
  player: Player | null;
  initial?: {
    positionCode?: PositionCode;
    depthCategory?: DepthCategory | null;
    status?: PlayerStatus;
  };
  onClose: () => void;
}

const STATUS_LABELS: Record<PlayerStatus, string> = {
  squad: 'Effectif',
  loan: 'Prêté',
  watchlist: 'À surveiller / cible',
  sold: 'Vendu',
  released: 'Libéré',
};

export function PlayerModal({ player, initial, onClose }: Props) {
  const { addPlayer, updatePlayer, deletePlayer } = useStore();
  const isNew = player === null;

  const [name, setName] = useState(player?.name ?? '');
  const [positionCode, setPositionCode] = useState<PositionCode>(
    player?.positionCode ?? initial?.positionCode ?? 'MC',
  );
  const [status, setStatus] = useState<PlayerStatus>(
    player?.status ?? initial?.status ?? 'squad',
  );
  const [depthCategory, setDepthCategory] = useState<DepthCategory | ''>(
    player?.depthCategory ?? initial?.depthCategory ?? 'titulaire',
  );
  const [tier, setTier] = useState<Tier | ''>(player?.tier ?? '');
  const [rating, setRating] = useState(player?.rating?.toString() ?? '');
  const [age, setAge] = useState(player?.age?.toString() ?? '');
  const [potential, setPotential] = useState(player?.potential?.toString() ?? '');
  const [value, setValue] = useState(player?.value ?? '');
  const [contractEnd, setContractEnd] = useState(player?.contractEnd ?? '');
  const [sofifaUrl, setSofifaUrl] = useState(player?.sofifaUrl ?? '');
  const [destinationClub, setDestinationClub] = useState(player?.destinationClub ?? '');
  const [notes, setNotes] = useState(player?.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const patch = {
      name: name.trim(),
      positionCode,
      status,
      depthCategory: status === 'squad' ? (depthCategory || 'titulaire') : null,
      tier: tier || null,
      rating: rating ? Number(rating) : null,
      age: age ? Number(age) : null,
      potential: potential ? Number(potential) : null,
      value,
      contractEnd,
      sofifaUrl,
      destinationClub,
      notes,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#161923] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isNew ? 'Ajouter un joueur' : 'Modifier le joueur'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <label className="col-span-2 flex flex-col gap-1 text-xs text-gray-400">
            Nom
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
              placeholder="Nom du joueur"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Poste
            <select
              value={positionCode}
              onChange={(e) => setPositionCode(e.target.value as PositionCode)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              {POSITIONS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Statut
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlayerStatus)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              {Object.entries(STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {status === 'squad' && (
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Profondeur
              <select
                value={depthCategory}
                onChange={(e) => setDepthCategory(e.target.value as DepthCategory)}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
              >
                {DEPTH_CATEGORIES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Tier (couleur)
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
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
            Note (OVR)
            <input
              type="number"
              min={0}
              max={99}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Âge
            <input
              type="number"
              min={14}
              max={45}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Potentiel
            <input
              type="number"
              min={0}
              max={99}
              value={potential}
              onChange={(e) => setPotential(e.target.value)}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Valeur marchande
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ex: 12M€"
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Fin de contrat
            <input
              value={contractEnd}
              onChange={(e) => setContractEnd(e.target.value)}
              placeholder="ex: 2028"
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          {(status === 'loan' || status === 'watchlist') && (
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              {status === 'loan' ? 'Club de prêt' : 'Club actuel'}
              <input
                value={destinationClub}
                onChange={(e) => setDestinationClub(e.target.value)}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
              />
            </label>
          )}

          <label className="col-span-2 flex flex-col gap-1 text-xs text-gray-400">
            Lien Sofifa
            <input
              value={sofifaUrl}
              onChange={(e) => setSofifaUrl(e.target.value)}
              placeholder="https://sofifa.com/player/..."
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="col-span-2 flex flex-col gap-1 text-xs text-gray-400">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400"
            />
          </label>

          <div className="col-span-2 mt-2 flex items-center justify-between">
            {!isNew ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
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
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
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
