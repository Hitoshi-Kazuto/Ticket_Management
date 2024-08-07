import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import SoftwareForm from '../components/Master_Form/software_form'
import SoftwareInfoPopup from '../components/Master_Info/software_info';
import axios from 'axios';

const softwareMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [softwares, setSoftwares] = useState([]);
    const [selectedsoftware, setSelectedSoftware] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username'); // Get username from local storage
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        // Fetch software data from backend when component mounts
        fetchSoftwareData();
        setLoading(false);
    }, []);

    const fetchSoftwareData = () => {
        axios.get(`${API_URL}api/software`) // Replace with your backend endpoint
            .then(response => {
                setSoftwares(response.data);
            })
            .catch(error => {
                console.error('Error fetching softwares', error);
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
            const response = await axios.post(`${API_URL}api/software/software-form`, formData);
            if (response.data.success) {
                fetchSoftwareData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
            } else {
                console.error('Form submission unsuccessful');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Software with this name already exists');
            } else {
                setError('Error adding software');
            }
        }
    };


    const handleInfoClick = (software) => {
        setSelectedSoftware(software);
    };

    const handleCloseInfoPopup = () => {
        setSelectedSoftware(null);
        fetchSoftwareData();
    };

    const handleDelete = async (sw_id) => {
        try {
            const response = await axios.post(`${API_URL}api/software/inactivate`, { sw_id });
            if (response.data.success) {
                fetchSoftwareData(); // Refresh data after successful deletion
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating software:', error);
        }
    };

    const handleActivate = async (sw_id) => {
        try {
            const response = await axios.post(`${API_URL}api/software/activate`, { sw_id });
            if (response.data.success) {
                fetchSoftwareData(); // Refresh data after successful deletion
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating software:', error);
        }
    }

    const filteredsoftwares = softwares.filter(software =>
        software.software_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'active' && software.status) || (statusFilter === 'inactive' && !software.status))
    );

    // const handleSearch = () => {
    //     // Filter softwares based on search query and status filter
    //     axios.get(`${API_URL}api/software?search=${searchQuery}&status=${statusFilter}`)
    //         .then(response => {
    //             setSoftwares(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching softwares', error);
    //         });
    // };

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className=' bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Software Master</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search software Name"
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
                {/* <button
                    onClick={handleSearch}
                    type='button'
                    className="p-2 mx-1.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Search
                </button> */}
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <SoftwareForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">software Id</th>
                            <th scope="col" className="px-6 py-3">software Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                            <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredsoftwares.map(software => (
                            <tr key={software.sw_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 ">
                                    {software.sw_id}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {software.software_name}
                                </td>
                                <td className="px-6 py-4">
                                    {software.status ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-2 py-4 text-right">
                                    <a
                                        onClick={() => handleInfoClick(software)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {software.status ? <button
                                        onClick={() => handleDelete(software.sw_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >Delete
                                    </button> :
                                        <button
                                            onClick={() => handleActivate(software.sw_id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >Activate
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedsoftware && (
                    <SoftwareInfoPopup
                        isOpen={true}
                        software={selectedsoftware}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default softwareMaster;
