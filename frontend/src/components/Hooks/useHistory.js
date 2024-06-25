import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useHistoryBlock = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('token');
        if (location.pathname === '/login' && isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [location, navigate]);
};

export default useHistoryBlock;