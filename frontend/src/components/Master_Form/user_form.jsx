import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        mobile: '',
        role: '',
        partner_code: '',
        valid_from: '',
        valid_till: ''
    });

    const [partnerCodes, setPartnerCodes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchPartnerCodes();
        }
    }, [isOpen]);

    const fetchPartnerCodes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/partner-codes');
            setPartnerCodes(response.data);
        } catch (error) {
            console.error('Error fetching partner codes:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await axios.post('http://localhost:3000/user-form', formData);
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Name<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Username<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Password<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Confirm Password<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email Address<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Mobile Number<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Role<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Orbis">Orbis</option>
                                <option value="Helpdesk">Helpdesk</option>
                                <option value="Partner">Partner</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner Code<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <select
                                name="partner_code"
                                value={formData.partner_code}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">Select Partner Code</option>
                                {partnerCodes.map((code) => (
                                    <option key={code.partner_code} value={code.partner_code}>
                                        {code.partner_code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Valid From<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="date"
                                name="valid_from"
                                value={formData.valid_from}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Valid Till<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <input
                                type="date"
                                name="valid_till"
                                value={formData.valid_till}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
