import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import StatusForm from '../components/Master_Form/status_form';
import StatusInfoPopup from '../components/Master_Info/status_info';
import axios from 'axios';

const StatusMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Statuss, setStatuss] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('active');
    const username = localStorage.getItem('username'); // Get username from local storage
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        // Fetch Status data from backend when component mounts
        fetchStatusData();
    }, []);

    const fetchStatusData = () => {
        axios.get(`${API_URL}api/status`) // Replace with your backend endpoint
            .then(response => {
                setStatuss(response.data);
            })
            .catch(error => {
                console.error('Error fetching Statuss', error);
            }); 
    };

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleFormSubmit = async (formData) => {
        formData.created_by = username;
        try {
            const response = await axios.post(
                `${API_URL}api/status/status-form`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchStatusData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
                return true;
            } else {
                console.error('Form submission unsuccessful');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Status with this name already exists');
            } else {
                setError('Error adding software');
            }
            return false;
        }
    };


    const handleInfoClick = (Status) => {
        setSelectedStatus(Status);
    };

    const handleCloseInfoPopup = () => {
        setSelectedStatus(null);
        fetchStatusData();
    };

    const handleDelete = async (status_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/status/inactivate`, 
                { status_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchStatusData(); // Refresh data after successful deletion
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating Status:', error);
        }
    };

    const handleActivate = async (status_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/status/activate`, 
                { status_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchStatusData(); // Refresh data after successful deletion
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating Status:', error);
        }
    }

    const filteredStatuss = Statuss.filter(Statuses =>
        Statuses.status.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'active' && Statuses.status_activity) || (statusFilter === 'inactive' && !Statuses.status_activity))
    );


    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className=' bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Status Master</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search Status Name"
                    required
                />
                <div className="inline-flex mx-2 items-center">
                    <input
                        type="radio"
                        id="all"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={() => setStatusFilter('all')}
                        className="mr-1.5"
                    />
                    <label htmlFor="all" className="mr-3">All</label>
                    <input
                        type="radio"
                        id="active"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={() => setStatusFilter('active')}
                        className="mr-1.5"
                    />
                    <label htmlFor="active" className="mr-3">Active</label>
                    <input
                        type="radio"
                        id="inactive"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={() => setStatusFilter('inactive')}
                        className="mr-1.5"
                    />
                    <label htmlFor="inactive" className="mr-3">Inactive</label>
                </div>
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <StatusForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                <div className="px-3 pb-3">
                    <div className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-100px)]">
                        <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Status Id</th>
                                    <th scope="col" className="px-6 py-3">Status Name</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                                    <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStatuss.map(Status => (
                                    <tr key={Status.status_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                        <td scope="row" className="px-6 py-4 ">
                                            {Status.status_id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {Status.status}
                                        </td>
                                        <td className="px-6 py-4">
                                            {Status.status_activity ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-2 py-4 text-right">
                                            <button
                                                onClick={() => handleInfoClick(Status)}
                                                className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                            >Info
                                            </button>
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            {Status.status_activity ? <button
                                                onClick={() => handleDelete(Status.status_id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            >Delete
                                            </button> :
                                                <button
                                                    onClick={() => handleActivate(Status.status_id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                                >Activate
                                                </button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {selectedStatus && (
                    <StatusInfoPopup
                        isOpen={true}
                        Status={selectedStatus}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default StatusMaster;
