import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Player } from '../types/domain';
import { tierDef } from '../utils/helpers';

interface Props {
  player: Player;
  onEdit: (player: Player) => void;
  compact?: boolean;
}

export function PlayerChip({ player, onEdit, compact }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: player.id });

  const tier = tierDef(player.tier);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor: tier?.color ?? '#3f4657',
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(player);
      }}
      className={`flex w-full cursor-grab items-center gap-1.5 border-l-[3px] bg-white/[0.04] px-2 py-1 text-xs text-gray-100 active:cursor-grabbing ${
        compact ? '' : ''
      }`}
      title="Cliquer pour modifier · glisser pour déplacer"
    >
      <span className="truncate">{player.name || 'Sans nom'}</span>
      {player.rating != null && (
        <span className="ml-auto shrink-0 text-[10px] tabular-nums text-gray-400">
          {player.rating}
        </span>
      )}
    </div>
  );
}
