import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTicketUpdatePopup = ({ isOpen, ticket, onClose, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const API_URL = 'http://52.187.70.171:8443/proxy/3001/';
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
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        formData.updated_by = username;
        try {
            const response = await axios.put(
                `${API_URL}api/ticket/admin-access/${ticket.ticket_id}`, 
                formData,
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

    const isAssignedStaffEditable = formData.Assigned_Staff === '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 my-8 max-h-[90vh] overflow-y-auto">
                <span className="self-right text-xl mb-8 font-bold whitespace-nowrap text-gray-900">UPDATE TICKET</span>
                {ticket && ticket.created_time && (
                    <div className="mb-2 text-gray-700 text-base font-semibold">
                        Creation Time: {new Date(ticket.created_time).toLocaleString('en-GB', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                        }).replace(',', ' -')}
                    </div>
                )}
                <hr className='px-3 mb-4 my-4'></hr>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Requested By</label>
                            <select
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select User ----</option>
                                {dropdownValues.requested_by.map((user) => (
                                    <option key={user.user_id} value={user.username}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Organization</label>
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
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Partner</label>
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
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Software</label>
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
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Priority</label>
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
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Title</label>
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
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Description</label>
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
                            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">File Attachment</label>
                            <a href={`${API_URL}api/ticket/${ticket.file_path}`} target="_blank" rel="noopener noreferrer">
                                {formData.File_Path}
                            </a>

                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Category</label>
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
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Assign To</label>
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
                                    <option key={username.user_id} value={username.username}>{username.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap px-3 -mx-3 mb-4">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status</label>
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
                            <label htmlFor='Update_Description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Update Description</label>
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
                            <label htmlFor='Technical_Description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Technical Description</label>
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
                            <label htmlFor='escalate' className="block uppercase tracking-wide text-gray-700 text-sm font-bold my-4">Escalate</label>
                        </div>
                    </div>
                    {formData.escalate && (
                        <>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3 mb-4">
                                    <label htmlFor='escalate_to' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Escalate To</label>
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
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
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
                </form>
                {/* {error && <div className="text-red-700 mt-4">{error}</div>} */}
            </div>
        </div>
    );
};

export default AdminTicketUpdatePopup;


const UserTicketInfo = ({ isOpen, ticket, onClose, dropdownValues}) => {
    const username = localStorage.getItem('username');
    const API_URL = 'http://52.187.70.171:8443/proxy/3001/';
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
        File_Path: [], // Initialize as empty array
        updated_by: '',
        updated_time: '',
        escalate: false,
        escalate_to: '',
        Update_Description: '',
        Technical_Description: ''
    });

    useEffect(() => {
        if (ticket) {
            let filePaths = [];
            if (ticket.file_path) {
                try {
                    // First try to parse as JSON
                    const parsedPath = JSON.parse(ticket.file_path);
                    if (Array.isArray(parsedPath)) {
                        filePaths = parsedPath.map(p => p.replace(/^[\"]|[\"]$/g, '').replace(/^uploads\//, ''));
                    } else if (typeof parsedPath === 'string') {
                        filePaths = [parsedPath.replace(/^[\"]|[\"]$/g, '').replace(/^uploads\//, '')];
                    }
                } catch (e) {
                    // If JSON.parse fails, check if it's already an array
                    if (Array.isArray(ticket.file_path)) {
                        filePaths = ticket.file_path.map(p => p.replace(/^[\"]|[\"]$/g, '').replace(/^uploads\//, ''));
                    } else if (typeof ticket.file_path === 'string') {
                        filePaths = [ticket.file_path.replace(/^[\"]|[\"]$/g, '').replace(/^uploads\//, '')];
                    }
                }
            }
            
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
                File_Path: filePaths,
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
        setIsLoading(true);
        formData.updated_by = username;
        try {
            const response = await axios.put(
                `${API_URL}api/ticket/${ticket.ticket_id}`, 
                formData,
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

    const isAssignedStaffEditable = formData.Assigned_Staff === '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 my-8 max-h-[80vh] overflow-y-auto">
                <span className="self-right text-xl mb-8 font-bold whitespace-nowrap text-gray-900">TICKET INFORMATION</span>
                {/* Creation Time Display */}
                {ticket && ticket.created_time && (
                    <div className="mb-2 text-gray-700 text-base font-semibold">
                        Creation Time: {new Date(ticket.created_time).toLocaleString('en-GB', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                        }).replace(',', ' -')}
                    </div>
                )}
                <hr className='px-3 mb-4 my-4'></hr>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Requested By</label>
                            <select
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select User ----</option>
                                {dropdownValues.requested_by.map((user) => (
                                    <option key={user.user_id} value={user.username}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Organization</label>
                            <select
                                name="Organization"
                                value={formData.Organization}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select Organization ----</option>
                                <option value="Admin">Admin</option>
                                <option value="Orbis">Orbis</option>
                                <option value="Partner">Partner</option>
                                <option value="Helpdesk-Vendor">Helpdesk Vendor</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Partner</label>
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
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Software</label>
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
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Priority</label>
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
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Title</label>
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
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Description</label>
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
                            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">File Attachment</label>
                            {formData.File_Path && Array.isArray(formData.File_Path) && formData.File_Path.length > 0 ? (
                                <div className="space-y-2">
                                    {formData.File_Path.map((filePath, index) => (
                                        <a 
                                            key={index} 
                                            href={`${API_URL}uploads/${filePath}`}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center space-x-2 appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                                        >
                                            <svg className="w-6 h-6 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
                                            </svg>
                                            <span className="truncate">{filePath}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight">No files attached</p>
                            )}
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Category</label>
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
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Assigned Staff</label>
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
                                    <option key={username.user_id} value={username.username}>{username.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">---- Select Status ----</option>
                                {dropdownValues.statuses.map((status) => (
                                    <option key={status.status_id} value={status.status}>{status.status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { UserTicketInfo };

const HelpdeskTicketInfo = ({ isOpen, ticket, onClose, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('role');
    const userPartner = localStorage.getItem('partner_code');
    const API_URL = 'http://52.187.70.171:8443/proxy/3001/';
    const [isLoading, setIsLoading] = useState(false);

    // Check if user has access to this ticket
    const hasAccess = () => {
        if (userRole === 'Helpdesk-Orbis') {
            return true; // Orbis users can see all tickets
        } else if (userRole === 'Helpdesk-Vendor') {
            return ticket.partner_code === userPartner; // Vendor users can only see their partner's tickets
        }
        return false;
    };

    // If user doesn't have access, don't show the popup
    if (!isOpen || !hasAccess()) {
        return null;
    }

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
        setIsLoading(true);
        formData.updated_by = username;
        try {
            const response = await axios.put(
                `${API_URL}api/ticket/admin-access/${ticket.ticket_id}`, 
                formData,
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

    const isAssignedStaffEditable = formData.Assigned_Staff === '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4 my-8 max-h-[90vh] overflow-y-auto">
                {ticket && ticket.created_time && (
                    <div className="mb-2 text-gray-700 text-base font-semibold">
                        Creation Time: {new Date(ticket.created_time).toLocaleString('en-GB', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                        }).replace(',', ' -')}
                    </div>
                )}
                <hr className='px-3 mb-4 my-4'></hr>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4 overflow-y-auto max-h-64">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Requested_By' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Requested By</label>
                            <select
                                name="Requested_by"
                                value={formData.Requested_by}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            >
                                <option value="">---- Select User ----</option>
                                {dropdownValues.requested_by.map((user) => (
                                    <option key={user.user_id} value={user.username}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label htmlFor='Organization' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Organization</label>
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
                            <label htmlFor='Partner_code' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Partner</label>
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
                            <label htmlFor='Software_Name' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Software</label>
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
                            <label htmlFor='Priority' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Priority</label>
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
                            <label htmlFor='Title' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Title</label>
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
                            <label htmlFor='description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Description</label>
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
                            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">File Attachment</label>
                            <a href={`${API_URL}api/ticket/${ticket.file_path}`} target="_blank" rel="noopener noreferrer">
                                {formData.File_Path}
                            </a>

                        </div>
                    </div> */}

                    <hr className='px-3 mb-4 my-4'></hr>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label htmlFor='Category' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Category</label>
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
                            <label htmlFor='Assigned_Staff' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Assign To</label>
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
                                    <option key={username.user_id} value={username.username}>{username.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='px-3 mb-4 my-4'></hr>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap px-3 -mx-3 mb-4">
                            <label htmlFor='Status' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status</label>
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
                            <label htmlFor='Update_Description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Update Description</label>
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
                            <label htmlFor='Technical_Description' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Technical Description</label>
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
                            <label htmlFor='escalate' className="block uppercase tracking-wide text-gray-700 text-sm font-bold my-4">Escalate</label>
                        </div>
                    </div>
                    {formData.escalate && (
                        <>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3 mb-4">
                                    <label htmlFor='escalate_to' className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Escalate To</label>
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
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
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
                </form>
                {/* {error && <div className="text-red-700 mt-4">{error}</div>} */}
            </div>
        </div>
    );
};

export {HelpdeskTicketInfo}