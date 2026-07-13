import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Card({ card, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id, data: { type: 'card', card } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white border border-slate-200 rounded-md p-2.5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-grab active:cursor-grabbing group flex justify-between items-start"
        >
            <span className="text-sm text-slate-700">{card.title}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card.id);
                }}
                className="text-slate-300 group-hover:text-red-500 text-xs ml-2 transition"
            >
                ✕
            </button>
        </div>
    );
}

export default Card;