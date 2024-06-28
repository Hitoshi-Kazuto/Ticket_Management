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
    const username = localStorage.getItem('username'); // Get username from local storage

    useEffect(() => {
        // Fetch partner data from backend when component mounts
        fetchPartnerData();
    }, []);

    const fetchPartnerData = () => {
        axios.get('http://localhost:3000/partner') // Replace with your backend endpoint
            .then(response => {
                setPartners(response.data);
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
            const response = await axios.post('http://localhost:3000/partner-form', formData);
            if (response.data.success) {
                fetchPartnerData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
            } else {
                console.error('Form submission unsuccessful');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Partner with this name already exists');
              } else {
                setError('Error adding software');
              }
        }
    };


    const handleInfoClick = (partner) => {
        setSelectedPartner(partner);
    };

    const handleCloseInfoPopup = () => {
        setSelectedPartner(null);
    };

    const handleDelete = async (partner_id) => {
        try {
            const response = await axios.post('http://localhost:3000/partner/inactivate', { partner_id });
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
            const response = await axios.post('http://localhost:3000/partner/activate', { partner_id });
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
    //     axios.get(`http://localhost:3000/partner?search=${searchQuery}&status=${statusFilter}`)
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
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
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
                    className="p-2 mx-1.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Search
                </button> */}
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <PartnerForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error}/>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                            <tr key={partner.partner_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
                                    <a
                                        onClick={() => handleInfoClick(partner)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {partner.status ? <button
                                        onClick={() => handleDelete(partner.partner_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >Delete
                                    </button> :
                                        <button
                                            onClick={() => handleActivate(partner.partner_id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >Activate
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
