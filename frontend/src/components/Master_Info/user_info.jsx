import React, { useState, useEffect } from 'react';
import axios from 'axios';

const userInfoPopup = ({ isOpen, user, onClose }) => {

    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        username: '',
        password: '',
        confirm_password: '',
        email_address: '',
        mobile_number: '',
        role: '',
        partner_code: '',
        valid_from: '',
        valid_till: '',
        updated_by: '',
        updated_time: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                user_id: user.user_id,
                name: user.name,
                username: user.username,
                password: user.password,
                confirm_password: user.password,
                email_address: user.email_address,
                mobile_number: user.mobile_number,
                role: user.role,
                partner_name: user.partner_name,
                valid_from: user.valid_from ? user.valid_from.split('T')[0] : '',
                valid_till: user.valid_till ? user.valid_till.split('T')[0] : '',
                updated_by: user.updated_by,
                updated_time: user.updated_time
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        formData.updated_by = username;
        try {
            const response = await axios.put(
                `${API_URL}api/user/${user.user_id}`, 
                formData,  // data payload
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                onClose();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <span className="self-right text-xl mb-8 font-bold whitespace-nowrap text-gray-900">UPDATE USER</span>
                <hr className='px-3 mb-4 my-4'></hr>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="text"
                                name="email_address"
                                value={formData.email_address}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Orbis">Orbis</option>
                                <option value="Helpdesk">Helpdesk</option>
                                <option value="Partner">Partner</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Partner Name</label>
                            <input
                                type="text"
                                name="partner_name"
                                value={formData.partner_name}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Valid From</label>
                            <input
                                type="date"
                                name="valid_from"
                                value={formData.valid_from}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Valid Till</label>
                            <input
                                type="date"
                                name="valid_till"
                                value={formData.valid_till}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default userInfoPopup;
