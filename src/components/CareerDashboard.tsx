import { useRef, useState } from 'react';
import { useStore } from '../store/store';

export function CareerDashboard() {
  const { state, addCareer, setActiveCareer, deleteCareer, importState } = useStore();
  const [name, setName] = useState('');
  const [club, setClub] = useState('');
  const [season, setSeason] = useState('2026/2027');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!club.trim()) return;
    addCareer({
      name: name.trim() || club.trim(),
      club: club.trim(),
      season: season.trim(),
      formation: '4-2-3-1',
    });
    setName('');
    setClub('');
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importState(String(reader.result));
      if (!ok) alert("Fichier invalide, impossible d'importer.");
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10">
      <h1 className="text-lg font-medium text-white">Career Planner</h1>

      {state.careers.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-wide text-gray-500">Tes carrières</h2>
          <ul className="flex flex-col divide-y divide-white/10 border border-white/10">
            {state.careers.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-3 py-2">
                <button type="button" onClick={() => setActiveCareer(c.id)} className="text-left">
                  <div className="text-sm text-white">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.club} · saison {c.season}
                  </div>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveCareer(c.id)}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    Ouvrir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Supprimer la carrière "${c.name}" et tous ses joueurs ?`)) {
                        deleteCareer(c.id);
                      }
                    }}
                    className="text-xs text-gray-600 hover:text-red-400"
                    title="Supprimer"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex flex-col gap-3 border border-white/10 p-4">
        <h2 className="text-xs uppercase tracking-wide text-gray-500">Nouvelle carrière</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="Club (ex: PSG)"
            className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
            required
          />
          <input
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="Saison (ex: 2026/2027)"
            className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la carrière (optionnel)"
          className="rounded border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-white outline-none focus:border-white/30"
        />
        <button
          type="submit"
          className="self-start rounded bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-gray-200"
        >
          Créer la carrière
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>Tu as une sauvegarde JSON ?</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded border border-white/10 px-3 py-1 text-gray-300 hover:bg-white/5"
        >
          Importer
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
}
