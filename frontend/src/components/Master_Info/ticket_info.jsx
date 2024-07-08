import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketInfoPopup = ({ isOpen, ticket, onClose, dropdownValues }) => {
    const username = localStorage.getItem('username');
    const [formData, setFormData] = useState({
        Ticket_Id: '',
        Requested_by: '',
        Organization: '',
        Partner_Name: '',
        Software_Name: '',
        Title: '',
        Description: '',
        Priority: '',
        Category: '',
        Status_Id: '',
        updated_by: '',
        updated_time: '',
        escalate: false,
        escalate_to: '',
        Update_Description: '',
        created_by: '',
        created_time: '',
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                Ticket_Id: ticket.ticket_id,
                Requested_by: ticket.Requested_by,
                Organization: ticket.Organization,
                Partner_Name: ticket.partner_name,
                Software_Name: ticket.software_name,
                Title: ticket.Title,
                Description: ticket.Description,
                Priority: ticket.Priority,
                Category: ticket.Category,
                Status_Id: ticket.Status,
                updated_by: ticket.updated_by,
                updated_time: ticket.updated_time,
                escalate: '',
                escalate_to: '',
                Update_Description: '',
                created_by: '',
                created_time: '',
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
            const response = await axios.put(`http://localhost:3000/ticket/${ticket.ticket_id}`, formData);
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
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Organization</label>
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
                                <option value="Helpdesk">Helpdesk</option>
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
                                disabled
                            >
                                <option value="">---- Select Partner ----</option>
                                {dropdownValues.partners.map((partner) => (
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
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
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
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                required
                            >
                                <option value="">---- Select Status ----</option>
                                {dropdownValues.statuses.map((status) => (
                                    <option key={status.status_id} value={status.status}>{status.status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                disabled
                            />
                        </div>
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
                    <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                        <div className="inline-flex items-center mx-2 w-full px-3 mb-4">
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
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Escalate To</label>
                                    <input
                                        type="text"
                                        name="escalate_to"
                                        value={formData.escalate_to}
                                        onChange={handleChange}
                                        className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3 mb-4">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
                                    <textarea
                                        name="Update_Description"
                                        value={formData.Update_Description}
                                        onChange={handleChange}
                                        className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                    />
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

export default TicketInfoPopup;