import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image from '../../resourses/login_image.png'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}api/login`, { username, password });

            if (response.data.success) {
                // Save the token and user data to localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('role', response.data.user.role);
                localStorage.setItem('partner_code', response.data.user.partner_code);

                // Redirect based on user role
                if (response.data.user.role === 'Admin') {
                    navigate('/dashboard');
                } else if (response.data.user.role === 'Partner' || response.data.user.role === 'Orbis') {
                    navigate('/user-dashboard');
                } else if (response.data.user.role === 'Helpdesk' || response.data.user.role === 'Helpdesk-Vendor') {
                    navigate('/helpdesk-dashboard');
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-screen-xl">
                {/* Image Section */}
                <div className="w-8/12 flex items-center justify-center p-6">
                    <img src={image} alt="illustration" className="max-w-full h-auto" />
                </div>
                {/* Login Form Section */}
                <div className="w-4/12 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Ticket Management</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                id="username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Login;