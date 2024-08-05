import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); // Navigate back to the login page
    };

    return (
        <button onClick={handleLogout} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" >Logout</button>
    )
}

export default logout