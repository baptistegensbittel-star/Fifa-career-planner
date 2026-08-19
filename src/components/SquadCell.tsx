import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DepthCategory, Player, PositionCode } from '../types/domain';
import { cellId } from '../utils/helpers';
import { PlayerChip } from './PlayerChip';

interface Props {
  positionCode: PositionCode;
  depthCategory: DepthCategory;
  players: Player[];
  onEdit: (player: Player) => void;
  onAdd: (positionCode: PositionCode, depthCategory: DepthCategory) => void;
}

export function SquadCell({ positionCode, depthCategory, players, onEdit, onAdd }: Props) {
  const id = cellId(positionCode, depthCategory);
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[48px] flex-col gap-1 border border-dashed p-1 transition-colors ${
        isOver ? 'border-[#5b8cff]/60 bg-[#5b8cff]/10' : 'border-white/10'
      }`}
    >
      <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        {players.map((p) => (
          <PlayerChip key={p.id} player={p} onEdit={onEdit} />
        ))}
      </SortableContext>
      <button
        type="button"
        onClick={() => onAdd(positionCode, depthCategory)}
        className="px-2 py-1 text-left text-[11px] text-gray-400 hover:text-gray-300"
      >
        + Ajouter
      </button>
    </div>
  );
}
