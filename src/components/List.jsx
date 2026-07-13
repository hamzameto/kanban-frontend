import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';

function List({ list, cards, onDeleteList, onDeleteCard, onAddCard, newCardTitle, onNewCardTitleChange }) {
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `list-${list.id}`, data: { type: 'list', listId: list.id } });

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: `list-${list.id}`,
        data: { type: 'list', listId: list.id },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setSortableRef}
            style={style}
            className="bg-slate-100 rounded-xl shadow-sm p-3 w-72 flex-shrink-0 border border-slate-200"
        >
            <div
                {...attributes}
                {...listeners}
                className="flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing px-1"
            >
                <h2 className="font-semibold text-slate-700 text-sm tracking-wide">
                    {list.title}
                    <span className="ml-2 text-xs text-slate-400 font-normal">{cards.length}</span>
                </h2>
                <button
                    onClick={() => onDeleteList(list.id)}
                    className="text-slate-400 hover:text-red-500 text-xs transition"
                >
                    ✕
                </button>
            </div>

            <div ref={setDroppableRef} className="space-y-2 mb-3 min-h-[8px]">
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <Card key={card.id} card={card} onDelete={onDeleteCard} />
                    ))}
                </SortableContext>
            </div>

            <div className="flex gap-1">
                <input
                    type="text"
                    placeholder="+ Add a card"
                    value={newCardTitle || ''}
                    onChange={(e) => onNewCardTitleChange(list.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAddCard(list.id)}
                    className="flex-1 border border-slate-200 rounded-md p-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={() => onAddCard(list.id)}
                    className="bg-blue-600 text-white px-3 rounded-md text-sm hover:bg-blue-700 transition"
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default List;