import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';

function List({ list, cards, onDeleteList, onDeleteCard, onAddCard, newCardTitle, onNewCardTitleChange }) {
    const { setNodeRef } = useDroppable({ id: `list-${list.id}`, data: { type: 'list', listId: list.id } });

    return (
        <div className="bg-white rounded-lg shadow p-4 w-72 flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">{list.title}</h2>
                <button
                    onClick={() => onDeleteList(list.id)}
                    className="text-red-600 text-xs hover:underline"
                >
                    Delete List
                </button>
            </div>

            <div ref={setNodeRef} className="space-y-2 mb-3 min-h-[20px]">
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <Card key={card.id} card={card} onDelete={onDeleteCard} />
                    ))}
                </SortableContext>
            </div>

            <div className="flex gap-1">
                <input
                    type="text"
                    placeholder="New card"
                    value={newCardTitle || ''}
                    onChange={(e) => onNewCardTitleChange(list.id, e.target.value)}
                    className="flex-1 border rounded p-1 text-sm"
                />
                <button
                    onClick={() => onAddCard(list.id)}
                    className="bg-blue-600 text-white px-2 rounded text-sm hover:bg-blue-700"
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default List;