import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();

  const menuItemClass = "flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-lg";
  const activeMenuItemClass = "bg-blue-50 text-blue-700";
  const iconClass = "w-6 h-6";

  // Check if the current path matches the dashboard
  const isDashboardActive = location.pathname === '/dashboard';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <aside className="fixed top-16 left-0 w-1/6 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              `${menuItemClass} ${isActive || isDashboardActive ? activeMenuItemClass : ''}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
              <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="currentColor" strokeWidth="1.008"></path>
              <path d="M21 9L3 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M9 21L9 9" stroke="currentColor" strokeWidth="1.008" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Dashboard</span>
          </NavLink>
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to='/user'
                className={({ isActive }) =>
                  `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                  <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="0.9600000000000002"></circle>
                  <path d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path> </g></svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">User Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/partner' 
                className={({ isActive }) =>
                  `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="0.9600000000000002"></circle>
                  <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path>
                  <path d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 14.4183 13 10 13C5.58172 13 2 15.0147 2 17.5C2 19.9853 2 22 10 22C12.231 22 13.8398 21.8433 15 21.5634" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path> </g></svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Partner Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/software' className={({ isActive }) =>
                `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
              }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                  <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.07989 21 8.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M10 9L7 12L10 15M14 9L17 12L14 15" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Software Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/category' className={({ isActive }) =>
                `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
              }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                  <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Category Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/status' className={({ isActive }) =>
                `${menuItemClass} ${isActive ? activeMenuItemClass : ''}`
              }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                  <path d="M6.87988 18.1501V16.0801" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path>
                  <path d="M12 18.15V14.01" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path>
                  <path d="M17.1201 18.1499V11.9299" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path>
                  <path d="M17.1199 5.8501L16.6599 6.3901C14.1099 9.3701 10.6899 11.4801 6.87988 12.4301" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path>
                  <path d="M14.1899 5.8501H17.1199V8.7701" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-bold">Status Master</span>
              </NavLink>
            </li>
            <li>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`${menuItemClass} justify-between w-full`}
                  type="button"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                      <path d="M5 12.0002C5 10.694 4.16519 9.58273 3 9.1709V7.6C3 7.03995 3 6.75992 3.10899 6.54601C3.20487 6.35785 3.35785 6.20487 3.54601 6.10899C3.75992 6 4.03995 6 4.6 6H19.4C19.9601 6 20.2401 6 20.454 6.10899C20.6422 6.20487 20.7951 6.35785 20.891 6.54601C21 6.75992 21 7.03995 21 7.6V9.17071C19.8348 9.58254 19 10.694 19 12.0002C19 13.3064 19.8348 14.4175 21 14.8293V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H4.6C4.03995 18 3.75992 18 3.54601 17.891C3.35785 17.7951 3.20487 17.6422 3.10899 17.454C3 17.2401 3 16.9601 3 15.8V14.8295C4.16519 14.4177 5 13.3064 5 12.0002Z" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar