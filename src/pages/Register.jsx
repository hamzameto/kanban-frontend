import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-slate-100">
                <h1 className="text-2xl font-bold mb-1 text-center text-slate-800">Create account</h1>
                <p className="text-sm text-slate-400 text-center mb-6">Start organizing your projects</p>

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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Create Account
                </button>

                <p className="text-center mt-5 text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;