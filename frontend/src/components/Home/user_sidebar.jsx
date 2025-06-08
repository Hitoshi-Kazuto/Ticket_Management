import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItemClass = "flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-lg";
    const activeMenuItemClass = "bg-blue-50 text-blue-700";
    const iconClass = "w-6 h-6";

    // Check if the current path matches the user dashboard
    const isDashboardActive = location.pathname === '/user-dashboard';

    return (
        <aside className="fixed top-16 left-0 w-1/6 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <nav className="space-y-2">
                    <NavLink
                        to='/user-dashboard'
                        className={({ isActive }) =>
                            `${menuItemClass} ${isActive || isDashboardActive ? activeMenuItemClass : ''}`
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}>
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="currentColor" strokeWidth="1.008"></path>
                                <path d="M21 9L3 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M9 21L9 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                        </svg>
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">User Dashboard</span>
                    </NavLink>

                    <div className="relative">
                        <button
                            className={`${menuItemClass} justify-between w-full`}
                            type="button"
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}>
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M5 12.0002C5 10.694 4.16519 9.58273 3 9.1709V7.6C3 7.03995 3 6.75992 3.10899 6.54601C3.20487 6.35785 3.35785 6.20487 3.54601 6.10899C3.75992 6 4.03995 6 4.6 6H19.4C19.9601 6 20.2401 6 20.454 6.10899C20.6422 6.20487 20.7951 6.35785 20.891 6.54601C21 6.75992 21 7.03995 21 7.6V9.17071C19.8348 9.58254 19 10.694 19 12.0002C19 13.3064 19.8348 14.4175 21 14.8293V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H4.6C4.03995 18 3.75992 18 3.54601 17.891C3.35785 17.7951 3.20487 17.6422 3.10899 17.454C3 17.2401 3 16.9601 3 16.4V14.8295C4.16519 14.4177 5 13.3064 5 12.0002Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </g>
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Ticket Management</span>
                            </div>
                        </button>
                        <div className="pl-4 mt-2 space-y-2">
                            <NavLink
                                to="/ticket"
                                className={({ isActive }) =>
                                    `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
                                }
                            >
                                View Tickets
                            </NavLink>
                            <NavLink
                                to="/closed-ticket"
                                className={({ isActive }) =>
                                    `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
                                }
                            >
                                Closed Tickets
                            </NavLink>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    )
}

export default Sidebar;