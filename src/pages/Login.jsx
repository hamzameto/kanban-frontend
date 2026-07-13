import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data.token, response.data.username);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-slate-100">
                <h1 className="text-2xl font-bold mb-1 text-center text-slate-800">Welcome back</h1>
                <p className="text-sm text-slate-400 text-center mb-6">Log in to your boards</p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-2.5 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
                >
                    Log In
                </button>

                <p className="text-center mt-5 text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;