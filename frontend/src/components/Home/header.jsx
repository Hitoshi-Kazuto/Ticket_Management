import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../../../resourses/icon.png'

const API_URL = 'https://ticket-management-ten.vercel.app/';

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
            const response = await axios.post(`${API_URL}api/change-password`, {
                username,
                currentPassword,
                newPassword,
            });

            if (response.data.success) {
                alert("Password changed successfully");
                setChangePasswordOpen(false); // Close the form upon successful password change
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                alert("Error changing password: " + response.data.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Error changing password");
        }
    };

    return (
        <nav className="bg-gray-200 h-16 sticky top-0 my-0 z-50 flex items-center">
            <div className="flex justify-between items-center w-full mx-4 my-0 max-w">
                <a href="#" className="flex items-center">
                    <img src={logo} className="mr-3 h-7 sm:h-9" alt="Logo" />
                    <span className="self-right text-2xl font-bold whitespace-nowrap text-gray-700">Helpdesk Management</span>
                </a>
                <div className="relative flex items-center" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="text-right text-gray-900 flex items-center mx-auto hover:text-blue-700 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="text-lg font-semibold">{username}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button type="button" onClick={toggleChangePassword} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Password</button>
                            <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    )}
                    {changePasswordOpen && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
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