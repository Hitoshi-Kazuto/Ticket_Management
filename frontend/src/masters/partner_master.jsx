import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import PartnerForm from '../components/Master_Form/partner_form';
import PartnerInfoPopup from '../components/Master_Info/partner_info';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username'); // Get username from local storage
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        // Fetch partner data from backend when component mounts
        fetchPartnerData();
    }, []);

    const fetchPartnerData = () => {
        axios.get(`${API_URL}api/partner`) // Replace with your backend endpoint
            .then(response => {
                setPartners(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching partners', error);
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
                `${API_URL}api/partner/partner-form`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchPartnerData();
                handleClosePopup();
                setError('');
                return true; // Return true on success
            } else {
                console.error('Form submission unsuccessful');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.message);
            } else {
                setError('Error adding partner');
            }
            return false; // Return false on error
        }
    };


    const handleInfoClick = (partner) => {
        setSelectedPartner(partner);
    };

    const handleCloseInfoPopup = () => {
        setSelectedPartner(null);
        fetchPartnerData();
    };

    const handleDelete = async (partner_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/partner/inactivate`, 
                { partner_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchPartnerData(); // Refresh data after successful deletion
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating partner:', error);
        }
    };

    const handleActivate = async (partner_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/partner/activate`, 
                { partner_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchPartnerData(); // Refresh data after successful deletion
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating partner:', error);
        }
    }

    const filteredPartners = partners.filter(partner =>
        partner.partner_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'active' && partner.status) || (statusFilter === 'inactive' && !partner.status))
    );

    // const handleSearch = () => {
    //     // Filter partners based on search query and status filter
    //     axios.get(`${API_URL}api/partner?search=${searchQuery}&status=${statusFilter}`)
    //         .then(response => {
    //             setPartners(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching partners', error);
    //         });
    // };

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className='bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Partner Master</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search Partner Name"
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
                <PartnerForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                <div className="px-3 pb-3">
                    <div className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-165px)]">
                        <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Partner Name</th>
                                    <th scope="col" className="px-6 py-3">Partner Code</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                                    <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPartners.map(partner => (
                                    <tr key={partner.partner_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {partner.partner_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {partner.partner_code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {partner.status ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-2 py-4 text-right">
                                            <button
                                                onClick={() => handleInfoClick(partner)}
                                                className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                            ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"
                                                className="fill-white"
                                            >
                                                <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"></path>
                                            </svg>
                                            </button>
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            {partner.status ? <button
                                                title='Delete'
                                                onClick={() => handleDelete(partner.partner_id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24" className="fill-white">
                                                <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                                            </svg>
                                            </button> :
                                                <button
                                                    title='Activate'
                                                    onClick={() => handleActivate(partner.partner_id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                                ><img 
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEI0lEQVR4nO2a34tVVRTHP1eduRo6Gej0FPlHKMaob2JEmZolkz7omyCIoqYPGUg/RMfQrBB6CRGpFHuppvK1xh9Izzr+wF8zQ1NZT/0YNT2x4Xtgdz3r7H3OvedeEb+wuJe71v7xPXvvtdZe58JjPLp4ClgO7AMGgWHgD+C2xH2/IJ2zWQbM5CFBHVgDnAT+BZKC4tp8B6xWX23HNGALMFZi8paMApuBqe0i8QJwpYUEGuUy8HyVBNzSH6yQQKMc0cq3FE8DP7WRRCI5B/S2isQcLXfMwL8Dfzb81gcsaPjtH9nG9HlJc2h6JWJInAL6gS5gfoMuhf/bc0A38DpwJpJMb1kSUyO2k/M0K7w2U4AdEUS2yzbFyggPeK6siz4U6PhzoEe2TwI7RSyJIOJkBHjT68N9HguM+VEZF5vX4W6gJttXA0/TIuKv6iuyqQF7AmMviSUxLRAn3pHdZODDiP0dIpLKAWCSbN8LnJeoLbYlp5PjemqOxJcRkytCJO1/ssY4kWO3KUSinrNNbgLTZfdB5MSKEkmA/bKfrnOUZTMSWpU1OQOk+3hVgUmVIZIAr3nezLJxrtvESaPRD55nGWsDkVFghtr9aNh8m3efsFJxtwoOuwpOqCyRBHhL7foN/V3Pdf8Py40G44rYXSXT9rJERhU0XQbwi2GzNIvI+4bxUelfLDGZZogkimcOnxn6gSwig4bxeun3dYDIHrXdYOi/yiJyyTCeK/3pDhAZUtt5ht7VBR6AlVY/I/1IB4hcV9tnDf2vWURuG8bpLe3vDhD5S22fMPQTRYh0B/QhWQgsKtl2QmPXixC5ZRjPkt5ygVXKuMaebeh/yyJysaLD3owMBQ67K/g9gG8M47WBOFOlDGjsdUXcrxUnPpV+YQeI9Gnsw4Z+bxaRZTn7dIruCe08Jz/rotUlN5tl81IWkZk5SePLsnmjjUS2Bh7wHStpdPjeaOQOelpZudEGEte8i5OVxrszbWJ1TudppunKP/crJHFfq4B2gmXn0nsTdaOk4+Sqd9l5u0IiuzRGj1bGunangdrE5kAtqyaxUutm5KjXf16Na2OIRLoqwxHloJqqivdatJ1cyt7SchB6P5EEyNS8M9OMA7junYka8G6A8GIK4uPABL7wzozzZtsUc4rEia3e040pmbr3M4VRV+E4r+OrDffmSXqFMKAK/biy5gl9H1I07vO2UeqdrIOdytmYA26hN+fm6MuQJuOicCy6tKVORfR/URlwU5gTSSZRCnNYSd5cXQG6JbOUxa6TjZV2JBkk3A2xJeiN2GZVyNlWrIT1MrTKqJ548knV796XFNhqZWS4jIsti7pK+2UrK1basbFT/4Coqyo+qFps0cnfVRbb34xrbTV6FFNcDPla9+lb3p9q3Pfzup7u1aUoDaiP8cjhP4pqmhmMpkfXAAAAAElFTkSuQmCC" 
                                                    alt="activate"
                                                    className="invert brightness-0"
                                                    />
                                                </button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>        
                {selectedPartner && (
                    <PartnerInfoPopup
                        isOpen={true}
                        partner={selectedPartner}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default PartnerMaster;
