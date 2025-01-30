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
    }, []);

    const fetchSoftwareData = () => {
        axios.get(`${API_URL}api/software`) // Replace with your backend endpoint
            .then(response => {
                setSoftwares(response.data);
                setLoading(false);
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
            const response = await axios.post(
                `${API_URL}api/software/software-form`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                fetchSoftwareData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
                return true;
            } else {
                console.error('Form submission unsuccessful');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Software with this name already exists');
            } else {
                setError('Error adding software');
            }
            return false;
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
            const response = await axios.post(
                `${API_URL}api/software/inactivate`, 
                { sw_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
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
            const response = await axios.post(
                `${API_URL}api/software/activate`, 
                { sw_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
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
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
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
                    className="p-2 mx-1.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-3.5 text-center"
                >Search
                </button> */}
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <SoftwareForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                <div className="px-3 pb-3">
                    <div className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-100px)]">
                        <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
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
                                            <button
                                                onClick={() => handleInfoClick(software)}
                                                className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                            ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"
                                                className="fill-white"
                                            >
                                                <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"></path>
                                            </svg>
                                            </button>
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            {software.status ? <button
                                                title='Delete'
                                                onClick={() => handleDelete(software.sw_id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            ><svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" 
                                                height="24" 
                                                viewBox="0 0 50 50" 
                                                className="fill-white"
                                            >
                                                <path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"/>
                                            </svg>
                                            </button> :
                                                <button
                                                    title='Activate'
                                                    onClick={() => handleActivate(software.sw_id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                                ><svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    width="24" 
                                                    height="24" 
                                                    viewBox="0 0 24 24" 
                                                    className="fill-white"
                                                >
                                                    <path d="M12 3c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9 4.963 0 9-4.037 9-9 0-4.962-4.037-9-9-9zm0 16c-3.859 0-7-3.14-7-7 0-3.859 3.141-7 7-7 3.859 0 7 3.141 7 7 0 3.86-3.141 7-7 7z"/>
                                                    <path d="M13 7h-2v5H6v2h5v5h2v-5h5v-2h-5z"/>
                                                </svg>
                                                </button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>  
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
