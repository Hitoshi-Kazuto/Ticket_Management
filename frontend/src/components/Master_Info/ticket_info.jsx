import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTicketUpdatePopup = ({ isOpen, ticket, onClose, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const [formData, setFormData] = useState({
        Ticket_Id: '',
        Requested_by: '',
        Organization: '',
        Partner_code: '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status: '',
        Assigned_Staff: '',
        File_Path: '',
        updated_by: '',
        updated_time: '',
        escalate: false,
        escalate_to: '',
        Update_Description: '',
        Technical_Description: ''
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                Ticket_Id: ticket.ticket_id,
                Requested_by: ticket.requested_by,
                Organization: ticket.organization,
                Partner_code: ticket.partner_code,
                Software_Name: ticket.software_name,
                Title: ticket.title,
                Description: ticket.description,
                Priority: ticket.priority,
                Category: ticket.category,
                Status: ticket.status,
                Assigned_Staff: ticket.assigned_staff || '',
                File_Path: ticket.file_path,
                updated_by: ticket.updated_by,
                updated_time: ticket.updated_time
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'radio' ? true : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.updated_by = username;
        try {
            const response = await axios.put(`${API_URL}api/ticket/admin-access/${ticket.ticket_id}`, formData);
            if (response.data.success) {
                // Handle successful update (e.g., close the popup and refresh the data)
                onClose();
            } else {
                console.error('Form submission unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    const isAssignedStaffEditable = formData.Assigned_Staff === '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 max-h-3/4 overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Requested By</label>
                            <input
                                type="text"
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
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
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner</label>
                            <select
                                name="Partner_code"
                                value={formData.Partner_code}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Partner ----</option>
                                {dropdownValues.partners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_code}>{partner.partner_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Software</label>
                            <select
                                name="Software_Name"
                                value={formData.Software_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
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
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Priority</label>
                            <select
                                name="Priority"
                                value={formData.Priority}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Priority ----</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                type="text-field"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />

                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">File Attachment</label>
                            <a href={`${API_URL}api/ticket/${ticket.file_path}`} target="_blank" rel="noopener noreferrer">
                                {formData.File_Path}
                            </a>

                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
                            <select
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Category ----</option>
                                {dropdownValues.categories.map((category) => (
                                    <option key={category.cat_id} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Assign To</label>
                            <select
                                name="Assigned_Staff"
                                value={formData.Assigned_Staff}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required = {isAssignedStaffEditable}
                                disabled = {!isAssignedStaffEditable}
                            >
                                <option value="">---- Select Staff ----</option>
                                {dropdownValues.usernames.map((username) => (
                                    <option key={username.user_id} value={username.username}>{username.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap px-3 -mx-3 mb-4">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">---- Select Software ----</option>
                                {dropdownValues.statuses.map((status) => (
                                    <option key={status.status_id} value={status.status}>{status.status}</option>
                                ))}
                            </select>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3">
                            <label htmlFor='Update_Description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Update Description</label>
                            <textarea
                                name="Update_Description"
                                value={formData.Update_Description}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3">
                            <label htmlFor='Technical_Description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Technical Description</label>
                            <textarea
                                name="Technical_Description"
                                value={formData.Technical_Description}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                        <div className="inline-flex items-center  w-full  mb-4">
                            <input
                                id='escalate'
                                type="radio"
                                name="escalate"
                                checked={formData.escalate}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor='escalate' className="block uppercase tracking-wide text-gray-700 text-xs font-bold my-4">Escalate</label>
                        </div>
                    </div>
                    {formData.escalate && (
                        <>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3 mb-4">
                                    <label htmlFor='escalate_to' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Escalate To</label>
                                    <select
                                        name="escalate_to"
                                        value={formData.escalate_to}
                                        onChange={handleChange}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="">---- Escalate To ----</option>
                                        {dropdownValues.usernames.map((username) => (
                                            <option key={username.user_id} value={username.username}>{username.username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {/* {error && <div className="text-red-700 mt-4">{error}</div>} */}
            </div>
        </div>
    );
};

export default AdminTicketUpdatePopup;


const UserTicketInfo = ({ isOpen, ticket, onClose, dropdownValues}) => {
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const [formData, setFormData] = useState({
        Ticket_Id: '',
        Requested_by: '',
        Organization: '',
        Partner_code: '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status: '',
        Assigned_Staff: '',
        File_Path: '',
        updated_by: '',
        updated_time: '',
        escalate: false,
        escalate_to: '',
        Update_Description: '',
        Technical_Description: ''
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                Ticket_Id: ticket.ticket_id,
                Requested_by: ticket.requested_by,
                Organization: ticket.organization,
                Partner_code: ticket.partner_code,
                Software_Name: ticket.software_name,
                Title: ticket.title,
                Description: ticket.description,
                Priority: ticket.priority,
                Category: ticket.category,
                Status: ticket.status,
                Assigned_Staff: ticket.assigned_staff,
                File_Path: ticket.file_path,
                updated_by: ticket.updated_by,
                updated_time: ticket.updated_time
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'radio' ? true : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.updated_by = username;
        try {
            const response = await axios.put(`${API_URL}api/ticket/admin-access/${ticket.ticket_id}`, formData);
            if (response.data.success) {
                // Handle successful update (e.g., close the popup and refresh the data)
                onClose();
            } else {
                console.error('Form submission unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 max-h-3/4 overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Requested By</label>
                            <input
                                type="text"
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-100 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                <option value="Admin">Admin</option>
                                <option value="Internal">Internal</option>
                                <option value="Partner">Partner</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner</label>
                            <select
                                name="Partner_code"
                                value={formData.Partner_code}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                {dropdownValues.partners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_code}>{partner.partner_code}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Software</label>
                            <select
                                name="Software_Name"
                                value={formData.Software_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                {dropdownValues.softwares.map((software) => (
                                    <option key={software.sw_id} value={software.software_name}>{software.software_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Priority</label>
                            <select
                                name="Priority"
                                value={formData.Priority}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-100 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                type="text-field"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-100 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />

                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">File Attachment</label>
                            <a href={`${API_URL}api/ticket/${ticket.file_path}`} target="_blank" rel="noopener noreferrer">
                                {formData.File_Path}
                            </a>

                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
                            <select
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                {dropdownValues.categories.map((category) => (
                                    <option key={category.cat_id} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Assign To</label>
                            <select
                                name="Assigned_Staff"
                                value={formData.Assigned_Staff}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">No Assigned</option>
                                {dropdownValues.usernames.map((username) => (
                                    <option key={username.user_id} value={username.username}>{username.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap px-3 -mx-3 mb-4">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">Not Selected</option>
                                {dropdownValues.statuses.map((status) => (
                                    <option key={status.status_id} value={status.status}>{status.status}</option>
                                ))}
                            </select>
                    </div>
                </form>
                {/* {error && <div className="text-red-700 mt-4">{error}</div>} */}
            </div>
        </div>
    );
};

export { UserTicketInfo };

const HelpdeskTicketUpdatePopup = ({ isOpen, ticket, onClose, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const [formData, setFormData] = useState({
        Ticket_Id: '',
        Requested_by: '',
        Organization: '',
        Partner_code: '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status: '',
        Assigned_Staff: '',
        File_Path: '',
        updated_by: '',
        updated_time: '',
        escalate: false,
        escalate_to: '',
        Update_Description: '',
        Technical_Description: ''
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                Ticket_Id: ticket.ticket_id,
                Requested_by: ticket.requested_by,
                Organization: ticket.organization,
                Partner_code: ticket.partner_code,
                Software_Name: ticket.software_name,
                Title: ticket.title,
                Description: ticket.description,
                Priority: ticket.priority,
                Category: ticket.category,
                Status: ticket.status,
                Assigned_Staff: ticket.assigned_staff || '',
                File_Path: ticket.file_path,
                updated_by: ticket.updated_by,
                updated_time: ticket.updated_time
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'radio' ? true : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.updated_by = username;
        try {
            const response = await axios.put(`${API_URL}api/ticket/admin-access/${ticket.ticket_id}`, formData);
            if (response.data.success) {
                // Handle successful update (e.g., close the popup and refresh the data)
                onClose();
            } else {
                console.error('Form submission unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    const isAssignedStaffEditable = formData.Assigned_Staff === '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 max-h-3/4 overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Requested By</label>
                            <input
                                type="text"
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
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
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Partner</label>
                            <select
                                name="Partner_code"
                                value={formData.Partner_code}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Partner ----</option>
                                {dropdownValues.partners.map((partner) => (
                                    <option key={partner.partner_id} value={partner.partner_code}>{partner.partner_code}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Software</label>
                            <select
                                name="Software_Name"
                                value={formData.Software_Name}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
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
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Priority</label>
                            <select
                                name="Priority"
                                value={formData.Priority}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Priority ----</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                type="text-field"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />

                        </div>
                    </div>
                    {/* <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">File Attachment</label>
                            <a href={`${API_URL}api/ticket/${ticket.file_path}`} target="_blank" rel="noopener noreferrer">
                                {formData.File_Path}
                            </a>

                        </div>
                    </div> */}

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
                            <select
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Category ----</option>
                                {dropdownValues.categories.map((category) => (
                                    <option key={category.cat_id} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Assign To</label>
                            <select
                                name="Assigned_Staff"
                                value={formData.Assigned_Staff}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required = {isAssignedStaffEditable}
                                disabled = {!isAssignedStaffEditable}
                            >
                                <option value="">---- Select Staff ----</option>
                                {dropdownValues.usernames.map((username) => (
                                    <option key={username.user_id} value={username.username}>{username.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap px-3 -mx-3 mb-4">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">---- Select Software ----</option>
                                {dropdownValues.statuses.map((status) => (
                                    <option key={status.status_id} value={status.status}>{status.status}</option>
                                ))}
                            </select>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3">
                            <label htmlFor='Update_Description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Update Description</label>
                            <textarea
                                name="Update_Description"
                                value={formData.Update_Description}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3">
                            <label htmlFor='Technical_Description' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Technical Description</label>
                            <textarea
                                name="Technical_Description"
                                value={formData.Technical_Description}
                                onChange={handleChange}
                                className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                        <div className="inline-flex items-center  w-full  mb-4">
                            <input
                                id='escalate'
                                type="radio"
                                name="escalate"
                                checked={formData.escalate}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor='escalate' className="block uppercase tracking-wide text-gray-700 text-xs font-bold my-4">Escalate</label>
                        </div>
                    </div>
                    {formData.escalate && (
                        <>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3 mb-4">
                                    <label htmlFor='escalate_to' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Escalate To</label>
                                    <select
                                        name="escalate_to"
                                        value={formData.escalate_to}
                                        onChange={handleChange}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="">---- Escalate To ----</option>
                                        {dropdownValues.usernames.map((username) => (
                                            <option key={username.user_id} value={username.username}>{username.username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {/* {error && <div className="text-red-700 mt-4">{error}</div>} */}
            </div>
        </div>
    );
};

export {HelpdeskTicketUpdatePopup}