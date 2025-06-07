import React, { useState, useEffect, useMemo } from 'react';
import Home from '../components/Home/home';
import UserForm from '../components/Master_Form/user_form';
import UserInfoPopup from '../components/Master_Info/user_info';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Hooks/spinnerComponent';
import DataTable from 'react-data-table-component';

const UserMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios.get(`${API_URL}api/user`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Users', error);
                setLoading(false);
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
                `${API_URL}api/user/user-form`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                fetchUserData();
                handleClosePopup();
                setError('');
                return true;
            } else {
                setError(response.data.message || 'Form submission unsuccessful');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data.message);
            } else {
                setError('Error adding User');
            }
            return false;
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
            const response = await axios.post(
                `${API_URL}api/user/inactivate`,
                { user_id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                fetchUserData();
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating User:', error);
        }
    };

    const handleActivate = async (user_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/user/activate`,
                { user_id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                fetchUserData();
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating User:', error);
        }
    };

    const [dropdownValues, setDropdownValues] = useState({
        partners: []
    });

    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get(`${API_URL}api/partner-codes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            }
        };
        fetchDropdownValues();
    }, []);

    const columns = [
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'Display Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
        },
        {
            name: 'Partner Name',
            selector: row => row.partner_name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.active_status ? 'Active' : 'Inactive',
            sortable: true,
        },
        {
            name: 'Info',
            cell: row => (
                <button
                    onClick={() => handleInfoClick(row)}
                    className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"
                        className="fill-white"
                    >
                        <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"></path>
                    </svg>
                </button>
            ),
            width: '100px',
        },
        {
            name: 'Actions',
            cell: row => (
                row.active_status ? 
                <button
                    title='Delete'
                    onClick={() => handleDelete(row.user_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24" className="fill-white">
                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                    </svg>
                </button> :
                <button
                    title='Activate'
                    onClick={() => handleActivate(row.user_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <img 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEI0lEQVR4nO2a34tVVRTHP1eduRo6Gej0FPlHKMaob2JEmZolkz7omyCIoqYPGUg/RMfQrBB6CRGpFHuppvK1xh9Izzr+wF8zQ1NZT/0YNT2x4Xtgdz3r7H3OvedeEb+wuJe71v7xPXvvtdZe58JjPLp4ClgO7AMGgWHgD+C2xH2/IJ2zWQbM5CFBHVgDnAT+BZKC4tp8B6xWX23HNGALMFZi8paMApuBqe0i8QJwpYUEGuUy8HyVBNzSH6yQQKMc0cq3FE8DP7WRRCI5B/S2isQcLXfMwL8Dfzb81gcsaPjtH9nG9HlJc2h6JWJInAL6gS5gfoMuhf/bc0A38DpwJpJMb1kSUyO2k/M0K7w2U4AdEUS2yzbFyggPeK6siz4U6PhzoEe2TwI7RSyJIOJkBHjT68N9HguM+VEZF5vX4W6gJttXA0/TIuKv6iuyqQF7AmMviSUxLRAn3pHdZODDiP0dIpLKAWCSbN8LnJeoLbYlp5PjemqOxJcRkytCJO1/ssY4kWO3KUSinrNNbgLTZfdB5MSKEkmA/bKfrnOUZTMSWpU1OQOk+3hVgUmVIZIAr3nezLJxrtvESaPRD55nGWsDkVFghtr9aNh8m3efsFJxtwoOuwpOqCyRBHhL7foN/V3Pdf8Py40G44rYXSXT9rJERhU0XQbwi2GzNIvI+4bxUelfLDGZZogkimcOnxn6gSwig4bxeun3dYDIHrXdYOi/yiJyyTCeK/3pDhAZUtt5ht7VBR6AlVY/I/1IB4hcV9tnDf2vWURuG8bpLe3vDhD5S22fMPQTRYh0B/QhWQgsKtl2QmPXixC5ZRjPkt5ygVXKuMaebeh/yyJysaLD3owMBQ67K/g9gG8M47WBOFOlDGjsdUXcrxUnPpV+YQeI9Gnsw4Z+bxaRZTn7dIruCe08Jz/rotUlN5tl81IWkZk5SePLsnmjjUS2Bh7wHStpdPjeaOQOelpZudEGEte8i5OVxrszbWJ1TudppunKP/crJHFfq4B2gmXn0nsTdaOk4+Sqd9l5u0IiuzRGj1bGunangdrE5kAtqyaxUutm5KjXf16Na2OIRLoqwxHloJqqivdatJ1cyt7SchB6P5EEyNS8M9OMA7junYka8G6A8GIK4uPABL7wzozzZtsUc4rEia3e040pmbr3M4VRV+E4r+OrDffmSXqFMKAK/biy5gl9H1I07vO2UeqdrIOdytmYA26hN+fm6MuQJuOicCy6tKVORfR/URlwU5gTSSZRCnNYSd5cXQG6JbOUxa6TjZV2JBkk3A2xJeiN2GZVyNlWrIT1MrTKqJ548knV796XFNhqZWS4jIsti7pK+2UrK1basbFT/4Coqyo+qFps0cnfVRbb34xrbTV6FFNcDPla9+lb3p9q3Pfzup7u1aUoDaiP8cjhP4pqmhmMpkfXAAAAAElFTkSuQmCC" 
                        alt="activate"
                        width="25" height="25"
                        className="invert brightness-0"
                    />
                </button>
            ),
            width: '100px',
        },
    ];

    const filteredItems = useMemo(() => {
        return Users.filter(item => {
            const matchesFilter = item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                                item.username.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'active' && item.active_status) || 
                                (statusFilter === 'inactive' && !item.active_status);
            return matchesFilter && matchesStatus;
        });
    }, [Users, filterText, statusFilter]);

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        placeholder="Search Users..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {filterText && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        id="all"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={() => setStatusFilter('all')}
                        className="mr-1"
                    />
                    <label htmlFor="all" className="mr-3">All</label>
                    <input
                        type="radio"
                        id="active"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={() => setStatusFilter('active')}
                        className="mr-1"
                    />
                    <label htmlFor="active" className="mr-3">Active</label>
                    <input
                        type="radio"
                        id="inactive"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={() => setStatusFilter('inactive')}
                        className="mr-1"
                    />
                    <label htmlFor="inactive" className="mr-3">Inactive</label>
                </div>
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="px-4 py-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm"
                >
                    Add User
                </button>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 p-4">
                <p className='bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>User Management</p>
                
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    persistTableHead
                    highlightOnHover
                    pointerOnHover
                    responsive
                    striped
                    progressPending={loading}
                    progressComponent={
                        <div className="flex justify-center items-center h-64">
                            <LoadingSpinner />
                        </div>
                    }
                    noDataComponent={
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No records to display
                        </div>
                    }
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                            },
                        },
                        rows: {
                            style: {
                                minHeight: '72px',
                            },
                        },
                    }}
                />

                <UserForm 
                    isOpen={isPopupOpen} 
                    onClose={handleClosePopup} 
                    onSubmit={handleFormSubmit} 
                    error={error} 
                    dropdownValues={dropdownValues} 
                />
                
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
