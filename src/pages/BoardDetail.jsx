import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import api from '../api/axios';
import List from '../components/List';

function BoardDetail() {
    const { id: boardId } = useParams();
    const [lists, setLists] = useState([]);
    const [cardsByList, setCardsByList] = useState({});
    const [newListTitle, setNewListTitle] = useState('');
    const [newCardTitles, setNewCardTitles] = useState({});
    const [error, setError] = useState('');

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    useEffect(() => {
        fetchLists();
    }, [boardId]);

    const fetchLists = async () => {
        try {
            const response = await api.get(`/boardlists/board/${boardId}`);
            setLists(response.data);
            response.data.forEach((list) => fetchCards(list.id));
        } catch (err) {
            setError('Failed to load lists');
        }
    };

    const fetchCards = async (listId) => {
        try {
            const response = await api.get(`/cards/list/${listId}`);
            setCardsByList((prev) => ({ ...prev, [listId]: response.data }));
        } catch (err) {
            setError('Failed to load cards');
        }
    };

    const findCardLocation = (cardId) => {
        for (const listId of Object.keys(cardsByList)) {
            const cards = cardsByList[listId] || [];
            const index = cards.findIndex((c) => c.id === cardId);
            if (index !== -1) return { listId: Number(listId), index };
        }
        return null;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeCardId = active.id;
        const sourceLocation = findCardLocation(activeCardId);
        if (!sourceLocation) return;

        let targetListId;
        let targetIndex;

        if (over.data.current?.type === 'list') {
            targetListId = over.data.current.listId;
            targetIndex = (cardsByList[targetListId] || []).length;
        } else {
            const overLocation = findCardLocation(over.id);
            if (!overLocation) return;
            targetListId = overLocation.listId;
            targetIndex = overLocation.index;
        }

        const sourceListId = sourceLocation.listId;

        if (sourceListId === targetListId) {
            const cards = cardsByList[sourceListId];
            const clampedIndex = Math.min(targetIndex, cards.length - 1);
            const reordered = arrayMove(cards, sourceLocation.index, clampedIndex);
            setCardsByList((prev) => ({ ...prev, [sourceListId]: reordered }));

            try {
                await Promise.all(
                    reordered.map((card, index) =>
                        api.put(`/cards/${card.id}`, {
                            title: card.title,
                            description: card.description,
                            position: index,
                        })
                    )
                );
            } catch (err) {
                setError('Failed to reorder card');
                fetchCards(sourceListId);
            }
        } else {
            const sourceCards = [...(cardsByList[sourceListId] || [])];
            const [movedCard] = sourceCards.splice(sourceLocation.index, 1);

            const targetCards = [...(cardsByList[targetListId] || [])];
            targetCards.splice(targetIndex, 0, movedCard);

            setCardsByList((prev) => ({
                ...prev,
                [sourceListId]: sourceCards,
                [targetListId]: targetCards,
            }));

            try {
                await Promise.all([
                    ...sourceCards.map((card, index) =>
                        api.put(`/cards/${card.id}`, {
                            title: card.title,
                            description: card.description,
                            position: index,
                        })
                    ),
                    ...targetCards.map((card, index) =>
                        api.put(`/cards/${card.id}`, {
                            title: card.title,
                            description: card.description,
                            position: index,
                            listId: card.id === movedCard.id ? targetListId : undefined,
                        })
                    ),
                ]);
            } catch (err) {
                setError('Failed to move card');
                fetchCards(sourceListId);
                fetchCards(targetListId);
            }
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;

        try {
            await api.post('/boardlists', {
                title: newListTitle,
                position: lists.length,
                boardId: parseInt(boardId),
            });
            setNewListTitle('');
            fetchLists();
        } catch (err) {
            setError('Failed to create list');
        }
    };

    const handleAddCard = async (listId) => {
        const title = newCardTitles[listId];
        if (!title || !title.trim()) return;

        try {
            await api.post('/cards', {
                title,
                description: '',
                position: (cardsByList[listId] || []).length,
                listId,
            });
            setNewCardTitles((prev) => ({ ...prev, [listId]: '' }));
            fetchCards(listId);
        } catch (err) {
            setError('Failed to create card');
        }
    };

    const handleDeleteList = async (listId) => {
        if (!confirm('Delete this list and all its cards?')) return;
        try {
            await api.delete(`/boardlists/${listId}`);
            fetchLists();
        } catch (err) {
            setError('Failed to delete list');
        }
    };

    const handleDeleteCard = async (cardId) => {
        const location = findCardLocation(cardId);
        try {
            await api.delete(`/cards/${cardId}`);
            if (location) fetchCards(location.listId);
        } catch (err) {
            setError('Failed to delete card');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Dashboard
            </Link>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleCreateList} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="New list title"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="border rounded p-2"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add List
                </button>
            </form>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                    {lists.map((list) => (
                        <List
                            key={list.id}
                            list={list}
                            cards={cardsByList[list.id] || []}
                            onDeleteList={handleDeleteList}
                            onDeleteCard={handleDeleteCard}
                            onAddCard={handleAddCard}
                            newCardTitle={newCardTitles[list.id]}
                            onNewCardTitleChange={(listId, value) =>
                                setNewCardTitles((prev) => ({ ...prev, [listId]: value }))
                            }
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}

export default BoardDetail;