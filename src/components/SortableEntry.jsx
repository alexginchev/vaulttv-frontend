import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableEntry({ entry, position, isAdmin, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="ranking-entry">
      <span className="ranking-position">{position}</span>
      <div className="ranking-entry-info">
        <p className="ranking-entry-name">{entry.name}</p>
        {entry.note && <p className="ranking-entry-note">{entry.note}</p>}
      </div>
      {entry.score != null && <span className="ranking-entry-score">{entry.score}</span>}

      {isAdmin && (
        <>
          <button className="drag-handle" {...attributes} {...listeners}>⠿</button>
          <button className="entry-delete" onClick={onDelete}>✕</button>
        </>
      )}
    </div>
  );
}

export default SortableEntry;