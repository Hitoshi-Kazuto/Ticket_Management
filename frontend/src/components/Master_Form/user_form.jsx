import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';


const setPartnerName = (role) => {
    let partnerName = '';
    switch (role) {
        case 'Admin':
            partnerName = 'ADMIN';
            break;
        case 'Orbis':
            partnerName = 'ORBIS';
            break;
        case 'Helpdesk':
            partnerName = 'HELPDESK';
            break;
        default:
            partnerName = '';
    }
    return partnerName;
};

const UserForm = ({ isOpen, onClose, onSubmit, error, dropdownValues }) => {
    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        mobile: '',
        role: '',
        partner_code: '',
        valid_from: today,
        valid_till: ''
    });

    const [filteredPartners, setFilteredPartners] = useState(dropdownValues.partners);
    const [emailError, setEmailError] = useState('');
    const [emailValid, setEmailValid] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [phoneValid, setPhoneValid] = useState('');
    const [dateError, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = {
            ...formData,
            [name]: value
        };


        if (name === 'email') {
            if (validator.isEmail(value)) {
                setEmailValid('')
                setEmailError('')
            } else {
                setEmailValid('')
                setEmailError('Enter valid Email!')
            }
        }

        if (name === 'mobile') {
            if (validator.isMobilePhone(value)) {
                setPhoneValid("");
                setPhoneError("");
            } else {
                setPhoneError('Enter valid Phone Number!');
                setPhoneValid("");
            }
        }
        if (name === 'valid_from' && formData.valid_to && value > formData.valid_to) {
            setError('Valid From date cannot be later than Valid To date.');
        } else if (name === 'valid_to' && formData.valid_from && value < formData.valid_from) {
            setError('Valid To date cannot be earlier than Valid From date.');
        } else {
            setError('');
        }


        if (name === 'role') {
            newFormData.partner_code = setPartnerName(value);

            // Filter partners for both Partner and Helpdesk-Vendor roles
            if (value === 'Partner' || value === 'Helpdesk-Vendor') {
                setFilteredPartners(dropdownValues.partners.filter(partner =>
                    partner.partner_code !== 'ADMIN' && partner.partner_code !== 'ORBIS' && partner.partner_code !== 'HELPDESK'
                ));
            } else {
                setFilteredPartners(dropdownValues.partners);
            }
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Wait for the response from parent component
        const success = await onSubmit(formData);
        
        // Only clear the form if submission was successful
        if (success) {
            setFormData({
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                mobile: '',
                role: '',
                partner_code: '',
                valid_from: today,
                valid_till: ''
            });
            // Reset any validation states if needed
            setEmailError('');
            setEmailValid('');
            setPhoneError('');
            setPhoneValid('');
            setError('');
        }
        setIsLoading(false);
    };

    const isUserEditable = formData.role === 'Partner' || formData.role === 'Helpdesk-Vendor';


    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <span className="self-right text-xl mb-8 font-bold whitespace-nowrap text-gray-900">CREATE USER</span>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Name<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Username<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Password<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Confirm Password<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                    <div className="flex flex-wrap -mx-3 mb-3">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Email Address<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Mobile Number<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                    {
                    <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3">
                            {emailError && <div className="text-red-700 ">{emailError}</div>}
                            {emailValid && <div className="text-blue-700 ">{emailValid}</div>}
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            {phoneError && <div className="text-red-700 ">{phoneError}</div>}
                            {phoneValid && <div className="text-blue-700 ">{phoneValid}</div>}
                        </div>
                    </div>
                    }

                    <div className="flex flex-wrap -mx-3 mt-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Role<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Orbis">Orbis User</option>
                                <option value="Helpdesk">Helpdesk Internal</option>
                                <option value="Partner">Partner User</option>
                                <option value="Helpdesk-Vendor">Helpdesk Vendor</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Partner Name<span className='text-red-700 font-bold text-sm'>*</span></label>
                            <select
                                name="partner_code"
                                value={formData.partner_code}
                                onChange={handleChange}
                                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required={isUserEditable}
                                disabled={!isUserEditable}
                            >
                                <option value="">Select Partner Name</option>
                                {filteredPartners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_code}>{partner.partner_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Valid From<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                            <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Valid Till<span className='text-red-700 font-bold text-sm'>*</span></label>
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
                    {
                    <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3">
                            {dateError && <div className="text-red-700 ">{dateError}</div>}
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            {dateError && <div className="text-red-700 ">{dateError}</div>}
                        </div>
                    </div>
                    }
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                {error && <div className="text-red-700 font-bold mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default UserForm;
