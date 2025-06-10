import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatusInfoPopup = ({ isOpen, Status, onClose }) => {

    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const username = localStorage.getItem('username');
    const [formData, setFormData] = useState({
        Status_Id: '',
        Status_Name: '',
        Remarks: '',
        Status_Activity: false,
        Created_By: '',
        Created_Time: '',
        Updated_By: '',
        Updated_Time: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Status) {
            setFormData({
                Status_Id: Status.status_id ?? '',
                Status_Name: Status.status ?? '',
                Remarks: Status.remarks ?? '',
                Status_Activity: Status.status_activity ?? false,
                Created_By: Status.created_by ?? '',
                Created_Time: Status.created_time ?? '',
                Updated_By: username ?? '',
                Updated_Time: Status.updated_time ?? ''
            });
        }
    }, [Status]);

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
        formData.Updated_By = username;
        try {
            const response = await axios.put(
                `${API_URL}api/status/${Status.status_id}`, 
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
                <span className="self-right text-xl mb-8 font-bold whitespace-nowrap text-gray-900">UPDATE STATUS</span>
                <hr className='px-3 mb-4 my-4'></hr>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status Id:</label>
                        <input
                            type="text"
                            name="Status_Id"
                            value={formData.Status_Id}
                            readOnly
                            className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status Name:</label>
                        <input
                            type="text"
                            name="Status_Name"
                            value={formData.Status_Name}
                            onChange={handleChange}
                            readOnly
                            className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Remarks:</label>
                        <textarea
                            name="Remarks"
                            value={formData.Remarks}
                            onChange={handleChange}
                            className="appearance-none w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 flex items-center"
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
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StatusInfoPopup;
