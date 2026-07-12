import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Card({ card, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id, data: { type: 'card', card } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-50 border rounded p-2 flex justify-between items-start cursor-grab active:cursor-grabbing"
        >
            <span className="text-sm">{card.title}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card.id);
                }}
                className="text-red-500 text-xs ml-2"
            >
                ✕
            </button>
        </div>
    );
}

export default Card;