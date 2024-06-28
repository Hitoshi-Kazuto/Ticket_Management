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
        window.location.href = '/login'; // Redirect to login page
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
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 relative z-50">
            <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                <a href="#" className="flex flex-wrap items-center justify-center mx-auto">
                    <img src="../../resourses/Helpdesk headset icon.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ticket Management</span>
                </a>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="text-right text-gray-900 dark:text-white flex items-center">
                        <img src='../../resourses/User 40.png' className='w-6 mr-2' alt="User Icon" />
                        {username}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button type="button" onClick={toggleChangePassword} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">Change Password</button>
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