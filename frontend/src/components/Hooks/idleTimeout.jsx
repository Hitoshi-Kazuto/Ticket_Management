import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IdleTimeout = ({ children }) => {
    const navigate = useNavigate();
    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        const timeout = setTimeout(() => {
            const inactiveDuration = Date.now() - lastActivity;
            const maxInactiveTime = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (inactiveDuration >= maxInactiveTime) {
                // Log out user or perform any necessary action
                localStorage.removeItem('token'); // Clear token or authentication status
                navigate('/login'); // Redirect to login page
            }
        }, 1000); // Check every second for inactivity

        // Reset last activity time on user interaction
        const resetActivity = () => setLastActivity(Date.now());
        window.addEventListener('mousemove', resetActivity);
        window.addEventListener('keydown', resetActivity);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetActivity);
            window.removeEventListener('keydown', resetActivity);
        };
    }, [lastActivity, navigate]);

    return <>{children}</>;
};

export default IdleTimeout;