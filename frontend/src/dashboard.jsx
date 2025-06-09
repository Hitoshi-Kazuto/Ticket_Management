import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './components/Home/home';

const dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <Home>
            <div className='overflow-x-auto shadow-md bg-gray-200 border border-gray-200 p-4 m-0 text-2xl font-bold text-gray-700'>Admin Dashboard</div>
        </Home>
    )
}

export default dashboard