import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); //to navigate to other pages is success is returned

    useEffect(() => {
        const isAuthenticated = !!document.cookie.match(/connect\.sid/); // Adjust according to your authentication logic
        if (isAuthenticated) {
            navigate('/dashboard'); // Redirect authenticated users
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = { username, password };

        try {
            const response = await axios.post('http://localhost:3000/login', credentials);
            if (response.data.success) {
                localStorage.setItem('username', username); // Store the username
                navigate('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during authentication', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto max-h-full">
            <div className="mb-5">
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
            <div className="mb-5">
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
            <button  type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
        </form>
    );
};

export default Login;
