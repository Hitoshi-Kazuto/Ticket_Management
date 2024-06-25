import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PartnerInfoPopup = ({ isOpen, partner, onClose }) => {

    const username = localStorage.getItem('username');

    const [formData, setFormData] = useState({
        Partner_Id: '',
        Partner_Code: '',
        Partner_Name: '',
        Remarks: '',
        Status: false,
        Created_By: '',
        Created_Time: '',
        Updated_By: '',
        Updated_Time: ''
    });

    useEffect(() => {
        if (partner) {
            setFormData({
                Partner_Id: partner.partner_id ?? '',
                Partner_Code: partner.partner_code ?? '',
                Partner_Name: partner.partner_name ?? '',
                Remarks: partner.remarks ?? '',
                Status: partner.status ?? false,
                Created_By: partner.created_by ?? '',
                Created_Time: partner.created_time ?? '',
                Updated_By: username ?? '',
                Updated_Time: partner.updated_time ?? ''
            });
        }
    }, [partner]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.Updated_By = username;
        try {
            const response = await axios.put(`http://localhost:3000/partner/${partner.partner_id}`, formData);
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
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Partner Id:</label>
                        <input
                            type="text"
                            name="Partner_Id"
                            value={formData.Partner_Id}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Partner Code:</label>
                        <input
                            type="text"
                            name="Partner_Code"
                            value={formData.Partner_Code}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Partner Name:</label>
                        <input
                            type="text"
                            name="Partner_Name"
                            value={formData.Partner_Name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Remarks:</label>
                        <textarea
                            name="Remarks"
                            value={formData.Remarks}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerInfoPopup;
