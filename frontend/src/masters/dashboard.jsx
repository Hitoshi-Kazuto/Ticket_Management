import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home/home';

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
            <div className='overflow-x-auto shadow-md absolute right-0 w-5/6'>Welcome to the Dashboard</div>
        </div>
    )
}

export default dashboard