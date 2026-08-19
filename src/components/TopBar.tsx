import { useRef, useState } from 'react';
import { useStore } from '../store/store';
import type { Career } from '../types/domain';

export type Tab = 'squad' | 'pitch' | 'transfers';

interface Props {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TopBar({ tab, onTabChange }: Props) {
  const { state, activeCareer, setActiveCareer, updateCareer, exportState, importState } =
    useStore();
  const [editingSeason, setEditingSeason] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeCareer) return null;

  function handleExport() {
    const blob = new Blob([exportState()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-planner-${activeCareer!.club.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'squad', label: 'Effectif' },
    { id: 'pitch', label: 'Terrain' },
    { id: 'transfers', label: 'Transferts' },
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0f14]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setActiveCareer(null)}
          className="text-sm font-bold text-white hover:text-emerald-400"
          title="Retour aux carrières"
        >
          ⚽ Career Planner
        </button>

        <select
          value={activeCareer.id}
          onChange={(e) => setActiveCareer(e.target.value)}
          className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white outline-none focus:border-emerald-400"
        >
          {state.careers.map((c: Career) => (
            <option key={c.id} value={c.id}>
              {c.club} · {c.season}
            </option>
          ))}
        </select>

        {editingSeason ? (
          <input
            autoFocus
            defaultValue={activeCareer.season}
            onBlur={(e) => {
              updateCareer(activeCareer.id, { season: e.target.value });
              setEditingSeason(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            className="w-24 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white outline-none focus:border-emerald-400"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingSeason(true)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-400 hover:bg-white/5"
            title="Modifier la saison"
          >
            Saison {activeCareer.season}
          </button>
        )}

        <nav className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.id
                  ? 'bg-emerald-500 text-emerald-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5"
            title="Exporter en JSON"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5"
            title="Importer un JSON"
          >
            Import
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
    </div>
  );
}
