import React, { useEffect, useState } from 'react';
import AdminSidebar from './admin_sidebar';
import PartnerSidebar from './user_sidebar';
import InternalSidebar from './user_sidebar';
import HelpdeskSidebar from './helpdesk_sidebar';

const Sidebar = () => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const renderSidebar = () => {
        switch (role) {
            case 'Admin':
                return <AdminSidebar />;
            case 'Partner':
                return <PartnerSidebar />;
            case 'Orbis':
                return <InternalSidebar />;
            case 'Helpdesk':
                return <HelpdeskSidebar />;
            default:
                return null;
        }
    };

    return (
        <div className="sidebar">
            {renderSidebar()}
        </div>
    );
};

export default Sidebar;