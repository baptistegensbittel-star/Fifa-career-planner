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
    borderColor: tier?.color ?? '#3f4657',
    background: tier ? `${tier.color}26` : '#1a1f2b',
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
      className={`group flex cursor-grab items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium text-gray-100 active:cursor-grabbing ${
        compact ? 'w-full' : 'w-full'
      }`}
      title="Cliquer pour modifier · glisser pour déplacer"
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: tier?.color ?? '#5b6478' }}
      />
      <span className="truncate">{player.name || 'Sans nom'}</span>
      {player.rating != null && (
        <span className="ml-auto shrink-0 rounded bg-black/30 px-1 py-0.5 text-[10px] tabular-nums text-gray-300">
          {player.rating}
        </span>
      )}
    </div>
  );
}
