// PopupForm.js
import React, { useState } from 'react';

const PopupForm = ({ isOpen, onClose, onSubmit, error }) => {
    const [formData, setFormData] = useState({
        Status_Name: '',
        Remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            Status_Name: '',
            Remarks: ''
        });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <span className="self-right text-xl mb-4 font-bold whitespace-nowrap text-gray-700">ADD STATUS</span>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 uppercase tracking-wide text-gray-700 text-sm font-bold mb-2 hover:text-gray-900"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className=" uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Status Name<span className='text-red-700 font-bold text-sm'>*</span></label>
                        <input
                            type="text"
                            name="Status_Name"
                            value={formData.Status_Name}
                            onChange={handleChange}
                            className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">Remarks</label>
                        <input
                            type="text"
                            name="Remarks"
                            value={formData.Remarks}
                            onChange={handleChange}
                            className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
                {error && <div className="text-red-700 font-bold mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default PopupForm;
