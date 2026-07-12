import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { username, logout } = useAuth();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
            <p>Your boards will appear here.</p>
        </div>
    );
}

export default Dashboard;