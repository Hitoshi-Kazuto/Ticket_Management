import React, { useState, useEffect } from 'react';
import axios from 'axios';

const setPartnerName = (organization) => {
    let partnerName = '';
    switch (organization) {
        case 'Admin':
            partnerName = 'Admin';
            break;
        case 'Internal':
            partnerName = 'Orbis User';
            break;
        default:
            partnerName = '';
    }
    return partnerName;
};

const AdminTicketForm = ({ isOpen, onClose, onSubmit, error, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [formData, setFormData] = useState({
        Requested_by: username || '',
        Organization: role || '',
        Partner_Name: role ? setPartnerName(role) : '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status: 'Open',
        Assigned_Staff: '',
        created_by: username || ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [filteredPartners, setFilteredPartners] = useState(dropdownValues.partners);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setSelectedFile(files[0]);
        } else {
            let newFormData = {
                ...formData,
                [name]: value
            };

            // If Organization field changes directly
            if (name === 'Organization') {
                newFormData.Partner_Name = setPartnerName(value);

                // Filter partners only when organization is 'Partner'
                if (value === 'Partner') {
                    setFilteredPartners(dropdownValues.partners.filter(partner =>
                        partner.partner_name !== 'Admin' && partner.partner_name !== 'Orbis User' && partner.partner_name !== 'Helpdesk'
                    ));
                } else {
                    setFilteredPartners(dropdownValues.partners);
                }
            }

            setFormData(newFormData);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });
        if (selectedFile) {
            formDataToSubmit.append('file', selectedFile);
        }
        onSubmit(formDataToSubmit);
    };

    const isPartnerEditable = formData.Organization === 'Partner';

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Requested By</label>
                            <select
                                name="Requested_By"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select User ----</option>
                                {dropdownValues.requested_by.map((user) => (
                                    <option key={user.user_id} value={user.username}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Organization ----</option>
                                <option value="Admin">Admin</option>
                                <option value="Internal">Internal</option>
                                <option value="Partner">Partner</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner</label>
                            <select
                                name="Partner_Name"
                                value={formData.Partner_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required={isPartnerEditable}
                                disabled={!isPartnerEditable}
                            >
                                <option value="">---- Select Partner ----</option>
                                {filteredPartners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_name}>{partner.partner_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Software</label>
                            <select
                                name="Software_Name"
                                value={formData.Software_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Software ----</option>
                                {dropdownValues.softwares.map((software) => (
                                    <option key={software.sw_id} value={software.software_name}>{software.software_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Priority</label>
                            <select
                                name="Priority"
                                value={formData.Priority}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Priority ----</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                type="text-field"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />

                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload File</label>
                            <input
                                type="file"
                                name="File_Path"
                                accept='.jpg, .jpeg, .png, .pdf, .doc .numbers'
                                onChange={handleChange}
                                className="text-black px-4 py-2 rounded-md"
                                required
                                multiple
                            />

                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
                            <select
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Category ----</option>
                                {dropdownValues.categories.map((category) => (
                                    <option key={category.cat_id} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Assign To</label>
                            <select
                                name="Assigned_Staff"
                                value={formData.Assigned_Staff}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Staff ----</option>
                                {dropdownValues.usernames.map((username) => (
                                    <option key={username.user_id} value={username.username}>{username.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {error && <div className="text-red-700 mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default AdminTicketForm;


const UserTicketForm = ({ isOpen, onClose, onSubmit, error, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [formData, setFormData] = useState({
        Requested_by: username || '',
        Organization: role || '',
        Partner_Name: role ? setPartnerName(role) : '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status: 'Open',
        Assigned_Staff: '',
        created_by: username || ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [filteredPartners, setFilteredPartners] = useState(dropdownValues.partners);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setSelectedFile(files[0]);
        } else {
            let newFormData = {
                ...formData,
                [name]: value
            };

            // If Organization field changes directly
            if (name === 'Organization') {
                newFormData.Partner_Name = setPartnerName(value);

                // Filter partners only when organization is 'Partner'
                if (value === 'Partner') {
                    setFilteredPartners(dropdownValues.partners.filter(partner =>
                        partner.partner_name !== 'Admin' && partner.partner_name !== 'Orbis User' && partner.partner_name !== 'Helpdesk'
                    ));
                } else {
                    setFilteredPartners(dropdownValues.partners);
                }
            }

            setFormData(newFormData);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });
        if (selectedFile) {
            formDataToSubmit.append('file', selectedFile);
        }
        onSubmit(formDataToSubmit);
    };

    const isPartnerEditable = formData.Organization === 'Partner';

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Requested By</label>
                            <select
                                name="Requested_By"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select User ----</option>
                                {dropdownValues.requested_by.map((user) => (
                                    <option key={user.user_id} value={user.username}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Organization ----</option>
                                <option value="Admin">Admin</option>
                                <option value="Internal">Internal</option>
                                <option value="Partner">Partner</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner</label>
                            <select
                                name="Partner_Name"
                                value={formData.Partner_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required={isPartnerEditable}
                                disabled={!isPartnerEditable}
                            >
                                <option value="">---- Select Partner ----</option>
                                {filteredPartners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_name}>{partner.partner_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Software</label>
                            <select
                                name="Software_Name"
                                value={formData.Software_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Software ----</option>
                                {dropdownValues.softwares.map((software) => (
                                    <option key={software.sw_id} value={software.software_name}>{software.software_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Priority</label>
                            <select
                                name="Priority"
                                value={formData.Priority}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Priority ----</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
                            <select
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Category ----</option>
                                {dropdownValues.categories.map((category) => (
                                    <option key={category.cat_id} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-3 -mx-3 mb-4">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                type="text-field"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />

                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload File</label>
                            <input
                                type="file"
                                name="File_Path"
                                accept='.jpg, .jpeg, .png, .pdf, .doc .numbers'
                                onChange={handleChange}
                                className="text-black px-4 py-2 rounded-md"
                                required
                                multiple
                            />

                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {error && <div className="text-red-700 mt-4">{error}</div>}
            </div>
        </div>
    );
};

export{ UserTicketForm };