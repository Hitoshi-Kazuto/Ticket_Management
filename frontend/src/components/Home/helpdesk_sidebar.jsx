import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-1/6 h-screen bg-gray-200 dark:bg-gray-900">
            <div className="h-full px-3 py-4 overflow-y-auto">
                <NavLink
                    to='/helpdesk-dashboard'
                    className={`flex items-center w-full p-2 mt-14 mb-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800`}

                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                        <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="currentColor" strokeWidth="1.008"></path>
                        <path d="M21 9L3 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M9 21L9 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <span className={`flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold`}>Helpdesk Dashboard</span>
                </NavLink>
                <div className="relative">
                    <button
                        type="button"
                        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                        aria-controls="dropdown-ticket-management"
                        onClick={toggleDropdown}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <path d="M5 12.0002C5 10.694 4.16519 9.58273 3 9.1709V7.6C3 7.03995 3 6.75992 3.10899 6.54601C3.20487 6.35785 3.35785 6.20487 3.54601 6.10899C3.75992 6 4.03995 6 4.6 6H19.4C19.9601 6 20.2401 6 20.454 6.10899C20.6422 6.20487 20.7951 6.35785 20.891 6.54601C21 6.75992 21 7.03995 21 7.6V9.17071C19.8348 9.58254 19 10.694 19 12.0002C19 13.3064 19.8348 14.4175 21 14.8293V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H4.6C4.03995 18 3.75992 18 3.54601 17.891C3.35785 17.7951 3.20487 17.6422 3.10899 17.454C3 17.2401 3 16.9601 3 16.4V14.8295C4.16519 14.4177 5 13.3064 5 12.0002Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Ticket Management</span>
                        <svg className={`w-4 h-4 ml-auto ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isDropdownOpen && (
                        <div id="dropdown-ticket-management" className="space-y-2 pl-8 mt-1">
                            <NavLink
                                to='/assign-staff'
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                            >
                                Assign Staff
                            </NavLink>
                            <NavLink
                                to='/ticket'
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                            >
                                View Tickets
                            </NavLink>
                            <NavLink
                                to='/closed-ticket'
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                            >
                                Closed Tickets
                            </NavLink>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-5 left-5">
                </div>
            </div>
        </aside>
    )
}

export default Sidebar