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

    const boardColors = [
        'from-blue-400 to-blue-600',
        'from-purple-400 to-purple-600',
        'from-emerald-400 to-emerald-600',
        'from-amber-400 to-amber-600',
        'from-rose-400 to-rose-600',
        'from-cyan-400 to-cyan-600',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Welcome, <span className="text-blue-600">{username}</span>
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition text-sm shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreateBoard} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="New board title"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm"
                    >
                        + Create Board
                    </button>
                </form>

                {loading ? (
                    <p className="text-slate-400">Loading boards...</p>
                ) : boards.length === 0 ? (
                    <p className="text-slate-400">No boards yet. Create one above!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {boards.map((board, i) => (
                            <div
                                key={board.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-slate-100 group"
                            >
                                <Link to={`/boards/${board.id}`}>
                                    <div className={`h-20 bg-gradient-to-br ${boardColors[i % boardColors.length]}`} />
                                    <div className="p-4">
                                        <h2 className="font-semibold text-slate-800 group-hover:text-blue-600 transition">
                                            {board.title}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Created {new Date(board.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                                <div className="px-4 pb-3">
                                    <button
                                        onClick={() => handleDeleteBoard(board.id)}
                                        className="text-red-500 text-xs hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;