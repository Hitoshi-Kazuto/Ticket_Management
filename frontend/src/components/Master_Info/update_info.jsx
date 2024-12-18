import React, { useState, useEffect } from 'react';
import axios from 'axios';

const truncateText = (text, length) => {
    if (text.length <= length) {
        return text;
    }
    return text.substring(0, length) + '...';
};

const UpdateInfo = ({ isOpen, updates, onClose }) => {
    if (!isOpen) return null;

    const [open, setOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    const handleOpenModal = (description) => {
        setSelectedDescription(description);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedDescription('');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center max-h-3/4 overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900">
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Update Information</h2>
                <table className="w-full bg-white table-auto overflow-y-auto max-h-64">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Technical Description</th>
                            <th className="px-4 py-2 text-left">Escalate</th>
                            <th className="px-4 py-2 text-left">Escalate To</th>
                            <th className="px-4 py-2 text-left">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updates.map((update) => (
                            <tr key={update.update_id} className="border-b">
                                <td className="px-4 py-2 text-left cursor-pointer" onClick={() => handleOpenModal(update.user_description)}>
                                    {truncateText(update.user_description, 30)}
                                </td>
                                <td className="px-4 py-2 text-left cursor-pointer" onClick={() => handleOpenModal(update.technical_description)}>
                                    {truncateText(update.technical_description, 30)}
                                </td>
                                <td className="px-4 py-2 text-left">{update.escalate ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 text-left">{update.escalate ? update.escalate_to : '-'}</td>
                                <td className="px-4 py-2 text-left">{update.created_time ? update.created_time.split('T')[0] : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {open && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                            <button
                                className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Full Description</h2>
                            <p>{selectedDescription}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateInfo;


const UpdateInfoUserPopup = ({ isOpen, ticket, onClose }) => {
    const [updates, setUpdates] = useState([]);
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        if (ticket) {
            const token = localStorage.getItem('token');
            const endpoint = `${API_URL}api/ticket/admin-access/ticket-updates/${ticket.ticket_id}`;
            
            axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.success) {
                        setUpdates(response.data.updates);
                    }
                })
                .catch(error => {
                    console.error('Error fetching updates:', error);
                });
        }
    }, [ticket]);

    if (!isOpen) return null;

    const [open, setOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    const handleOpenModal = (description) => {
        setSelectedDescription(description);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedDescription('');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center max-h-3/4 overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900">
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-900">UPDATE INFORMATION</h2>
                <hr className='px-3 mb-4 my-4'></hr>
                <table className="w-full bg-white table-auto overflow-y-auto max-h-64">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Escalate</th>
                            <th className="px-4 py-2 text-left">Escalate To</th>
                            <th className="px-4 py-2 text-left">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updates.map((update) => (
                            <tr key={update.update_id} className="border-b">
                                <td className="px-4 py-2 text-left cursor-pointer" onClick={() => handleOpenModal(update.user_description)}>
                                    {truncateText(update.user_description, 30)}
                                </td>
                                <td className="px-4 py-2 text-left">{update.escalate ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 text-left">{update.escalate ? update.escalate_to : '-'}</td>
                                <td className="px-4 py-2 text-left">{update.created_time ? update.created_time.split('T')[0] : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {open && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg relative w-2/4">
                            <button
                                className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Full Description</h2>
                            <p>{selectedDescription}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { UpdateInfoUserPopup };