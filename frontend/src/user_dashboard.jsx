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
        <div>
            <Home />
            <div className='overflow-x-auto shadow-md absolute right-0 w-5/6 bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>User Dashboard</div>

        </div>
    )
}

export default dashboard

