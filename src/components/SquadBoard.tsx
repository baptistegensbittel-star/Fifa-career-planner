import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DEPTH_CATEGORIES, POSITIONS } from '../types/domain';
import type { DepthCategory, Player, PositionCode } from '../types/domain';
import { useStore } from '../store/store';
import { cellId, parseCellId, sortByDepthOrder } from '../utils/helpers';
import { SquadCell } from './SquadCell';
import { PlayerChip } from './PlayerChip';
import { PlayerModal } from './PlayerModal';
import { ImportClubModal } from './ImportClubModal';
import { TierLegend } from './TierLegend';

type Columns = Record<string, Player[]>;

function buildColumns(players: Player[]): Columns {
  const cols: Columns = {};
  for (const pos of POSITIONS) {
    for (const depth of DEPTH_CATEGORIES) {
      cols[cellId(pos.code, depth.code)] = [];
    }
  }
  for (const p of players) {
    const id = cellId(p.positionCode, p.depthCategory);
    if (cols[id]) cols[id].push(p);
  }
  for (const key of Object.keys(cols)) {
    cols[key] = sortByDepthOrder(cols[key]);
  }
  return cols;
}

function findContainer(columns: Columns, id: string): string | null {
  if (columns[id]) return id;
  for (const key of Object.keys(columns)) {
    if (columns[key].some((p) => p.id === id)) return key;
  }
  return null;
}

export function SquadBoard() {
  const { careerPlayers, updatePlayer, reorderDepth } = useStore();
  const squadPlayers = careerPlayers;

  const [columns, setColumns] = useState<Columns>(() => buildColumns(squadPlayers));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState<
    | { mode: 'edit'; player: Player }
    | { mode: 'add'; positionCode: PositionCode; depthCategory: DepthCategory }
    | null
  >(null);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    if (!dragging) setColumns(buildColumns(squadPlayers));
  }, [squadPlayers, dragging]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const activePlayer = activeId
    ? squadPlayers.find((p) => p.id === activeId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setDragging(true);
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(columns, active.id as string);
    const overContainer = findContainer(columns, over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((p) => p.id === active.id);
      if (activeIndex === -1) return prev;
      const overIndex = overItems.findIndex((p) => p.id === over.id);

      const newIndex = overIndex >= 0 ? overIndex : overItems.length;
      const player = activeItems[activeIndex];
      const newActiveItems = activeItems.filter((p) => p.id !== active.id);
      const newOverItems = [
        ...overItems.slice(0, newIndex),
        player,
        ...overItems.slice(newIndex),
      ];

      return {
        ...prev,
        [activeContainer]: newActiveItems,
        [overContainer]: newOverItems,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setDragging(false);
    if (!over) return;

    const activeContainer = findContainer(columns, active.id as string);
    const overContainer = findContainer(columns, over.id as string);
    if (!activeContainer || !overContainer) return;

    let finalColumns = columns;
    if (activeContainer === overContainer) {
      const items = columns[activeContainer];
      const activeIndex = items.findIndex((p) => p.id === active.id);
      const overIndex = items.findIndex((p) => p.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        finalColumns = { ...columns, [activeContainer]: arrayMove(items, activeIndex, overIndex) };
        setColumns(finalColumns);
      }
    }

    const destParsed = parseCellId(overContainer);
    const srcParsed = parseCellId(activeContainer);
    if (!destParsed) return;

    const movedPlayer = squadPlayers.find((p) => p.id === active.id);
    if (
      movedPlayer &&
      (movedPlayer.positionCode !== destParsed.positionCode ||
        movedPlayer.depthCategory !== destParsed.depthCategory)
    ) {
      updatePlayer(movedPlayer.id, {
        positionCode: destParsed.positionCode,
        depthCategory: destParsed.depthCategory,
      });
    }

    reorderDepth(
      destParsed.positionCode,
      destParsed.depthCategory,
      finalColumns[overContainer].map((p) => p.id),
    );
    if (srcParsed && activeContainer !== overContainer) {
      reorderDepth(
        srcParsed.positionCode,
        srcParsed.depthCategory,
        finalColumns[activeContainer].map((p) => p.id),
      );
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TierLegend />
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="rounded border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
        >
          Importer un club
        </button>
      </div>
      <div className="overflow-x-auto rounded border border-white/10 bg-[#141a29]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="w-24 px-3 py-2 font-medium">Poste</th>
              {DEPTH_CATEGORIES.map((d) => (
                <th key={d.code} className="px-3 py-2 font-medium">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {POSITIONS.map((pos) => (
              <tr key={pos.code} className="border-b border-white/5 align-top last:border-0">
                <td className="px-3 py-2 text-xs font-semibold text-gray-300">
                  <div>{pos.code}</div>
                  <div className="text-[10px] font-normal text-gray-500">{pos.label}</div>
                </td>
                {DEPTH_CATEGORIES.map((d) => (
                  <td key={d.code} className="px-2 py-2">
                    <SquadCell
                      positionCode={pos.code}
                      depthCategory={d.code}
                      players={columns[cellId(pos.code, d.code)] ?? []}
                      onEdit={(player) => setModal({ mode: 'edit', player })}
                      onAdd={(positionCode, depthCategory) =>
                        setModal({ mode: 'add', positionCode, depthCategory })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <DragOverlay>
          {activePlayer ? (
            <div className="w-40">
              <PlayerChip player={activePlayer} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      </div>

      {modal?.mode === 'edit' && (
        <PlayerModal player={modal.player} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'add' && (
        <PlayerModal
          player={null}
          initial={{
            positionCode: modal.positionCode,
            depthCategory: modal.depthCategory,
          }}
          onClose={() => setModal(null)}
        />
      )}
      {importOpen && <ImportClubModal onClose={() => setImportOpen(false)} />}
    </div>
  );
}
