import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Header = () => {
    const username = localStorage.getItem('username');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/'; // Redirect to login page
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleChangePassword = () => {
        setChangePasswordOpen(!changePasswordOpen);
        setDropdownOpen(false); // Close the dropdown when opening the change password form
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/change-password', {
                username,
                currentPassword,
                newPassword,
            });

            if (response.data.success) {
                alert("Password changed successfully");
                setChangePasswordOpen(false); // Close the form upon successful password change
            } else {
                alert("Error changing password: " + response.data.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Error changing password");
        }
    };

    return (
        <nav className="bg-gray-200 h-16 dark:bg-gray-900 relative my-0 z-50 flex items-center">
            <div className="flex justify-between items-center mx-4 my-0 max-w">
                <a href="#" className="flex items-center">
                    <img src="https://img.icons8.com/color/48/headset.png" className="mr-3 h-6 sm:h-9" alt="Logo" />
                    <span className="self-right text-xl font-bold whitespace-nowrap text-gray-700 dark:text-white">Helpdesk Management</span>
                </a>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="text-right text-gray-900 dark:text-white flex items-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="0.9600000000000002"></circle>
                            <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="currentColor" strokeWidth="0.9600000000000002" strokeLinecap="round"></path> </g></svg>
                        {username}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button type="button" onClick={toggleChangePassword} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Password</button>
                            <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    )}
                    {changePasswordOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                            <button
                                onClick={toggleChangePassword}
                                className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                            >
                                &times;
                            </button>
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-4">
                                    <label htmlFor="currentPassword" className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmNewPassword" className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                    />
                                </div>
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Change Password</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;