import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import UserForm from '../components/Master_Form/user_form';
import UserInfoPopup from '../components/Master_Info/user_info';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');  
    const username = localStorage.getItem('username'); // Get username from local storage

    useEffect(() => {
        // Fetch User data from backend when component mounts
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios.get('http://13.51.193.200:3000/user') // Replace with your backend endpoint
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching Users', error);
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
            const response = await axios.post('http://13.51.193.200:3000/user/user-form', formData);
            if (response.data.success) {
                fetchUserData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
            } else {
                console.error('Form submission unsuccessful');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data.message);
              } else {
                setError('Error adding User');
              }
        }
    };


    const handleInfoClick = (User) => {
        setSelectedUser(User);
    };

    const handleCloseInfoPopup = () => {
        setSelectedUser(null);
        fetchUserData();
    };

    const handleDelete = async (user_id) => {
        try {
            const response = await axios.post('http://13.51.193.200:3000/user/inactivate', { user_id });
            if (response.data.success) {
                fetchUserData(); // Refresh data after successful deletion
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating User:', error);
        }
    };

    const handleActivate = async (user_id) => {
        try {
            const response = await axios.post('http://13.51.193.200:3000/user/activate', { user_id });
            if (response.data.success) {
                fetchUserData(); // Refresh data after successful deletion
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating User:', error);
        }
    }

    // const fetchPartnerCodes = async () => {
    //     try {
    //         const response = await axios.get('http://13.51.193.200:3000/partner-codes');
    //         setFilteredPartners(response.data);
    //     } catch (error) {
    //         console.error('Error fetching partner codes:', error);
    //     }
    // };
    const [dropdownValues, setDropdownValues] = useState({
        partners: []
    });

    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get('http://13.51.193.200:3000/partner-codes');
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            }
        };
        fetchDropdownValues();
    }, []);

    const filteredUsers = Users.filter(User =>
        User.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'active' && User.active_status) || (statusFilter === 'inactive' && !User.active_status))
    );

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className=' bg-gray-200 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>User Management</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search User Name"
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
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <UserForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} dropdownValues={dropdownValues}/>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Display Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Partner Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                            <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(User => (
                            <tr key={User.user_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {User.username}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {User.name}
                                </td>
                                <td className="px-6 py-4">
                                    {User.role}
                                </td>
                                <td className="px-6 py-4">
                                    {User.partner_name}
                                </td>
                                <td className="px-6 py-4">
                                    {User.active_status ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-2 py-4 text-right">
                                    <a
                                        onClick={() => handleInfoClick(User)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {User.active_status ? <button
                                        onClick={() => handleDelete(User.user_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >Delete
                                    </button> :
                                        <button
                                            onClick={() => handleActivate(User.user_id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >Activate
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedUser && (
                    <UserInfoPopup
                        isOpen={true}
                        user={selectedUser}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default UserMaster;
