import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Dashboard() {
    const { username, logout } = useAuth();
    const [boards, setBoards] = useState([]);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await api.get('/boards');
            setBoards(response.data);
        } catch (err) {
            setError('Failed to load boards');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        try {
            await api.post('/boards', { title: newBoardTitle });
            setNewBoardTitle('');
            fetchBoards();
        } catch (err) {
            setError('Failed to create board');
        }
    };

    const handleDeleteBoard = async (id) => {
        if (!confirm('Delete this board?')) return;

        try {
            await api.delete(`/boards/${id}`);
            fetchBoards();
        } catch (err) {
            setError('Failed to delete board');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreateBoard} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="New board title"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        className="flex-1 border rounded p-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Create Board
                    </button>
                </form>

                {loading ? (
                    <p>Loading boards...</p>
                ) : boards.length === 0 ? (
                    <p className="text-gray-500">No boards yet. Create one above!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <div
                                key={board.id}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                            >
                                <Link to={`/boards/${board.id}`}>
                                    <h2 className="text-lg font-semibold mb-2">{board.title}</h2>
                                </Link>
                                <p className="text-xs text-gray-400 mb-3">
                                    Created {new Date(board.createdAt).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => handleDeleteBoard(board.id)}
                                    className="text-red-600 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;