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
                    title='Info'
                    onClick={() => handleInfoClick(row)}
                    className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
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
                    className="text-gray-700 hover:text-red-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button> :
                <button
                    title='Activate'
                    onClick={() => handleActivate(row.user_id)}
                    className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                <input
                    type="text"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                            placeholder="Search Users..."
                            className="px-5 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-72 text-base"
                        />
                        {filterText && (
                            <button
                                onClick={handleClear}
                                className="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-base"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={() => setStatusFilter('all')}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                            <span className="text-gray-700 text-base">All</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={() => setStatusFilter('active')}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                            <span className="text-gray-700 text-base">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={() => setStatusFilter('inactive')}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                            <span className="text-gray-700 text-base">Inactive</span>
                        </label>
                    </div>
                </div>
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="px-6 py-2 mx-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base"
                >
                    Add User
                </button>
            </div>
        );
    }, [filterText, resetPaginationToggle, statusFilter]);

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 px-6 py-3">
                <div className="flex justify-between items-center mb-4">
                    <p className='text-2xl font-bold text-gray-700'>User Management</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                placeholder="Search Users..."
                                className="px-5 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-72 text-base"
                            />
                            {filterText && (
                                            <button
                                    onClick={handleClear}
                                    className="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-base"
                                >
                                    Clear
                                            </button>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="all"
                                    checked={statusFilter === 'all'}
                                    onChange={() => setStatusFilter('all')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">All</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={statusFilter === 'active'}
                                    onChange={() => setStatusFilter('active')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    checked={statusFilter === 'inactive'}
                                    onChange={() => setStatusFilter('inactive')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">Inactive</span>
                            </label>
                        </div>
                                                <button
                            onClick={handleAddClick}
                            type="button"
                            className="px-6 py-2 mx-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base"
                        >
                            Add User
                        </button>
                    </div>
                </div>
                
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader={false}
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
