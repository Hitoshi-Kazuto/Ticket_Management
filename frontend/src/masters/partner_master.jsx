import React, { useState, useEffect, useMemo } from 'react';
import Home from '../components/Home/home';
import PartnerForm from '../components/Master_Form/partner_form';
import PartnerInfoPopup from '../components/Master_Info/partner_info';
import axios from 'axios';
import LoadingSpinner from '../components/Hooks/spinnerComponent';
import DataTable from 'react-data-table-component';

const PartnerMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        fetchPartnerData();
    }, []);

    const fetchPartnerData = () => {
        axios.get(`${API_URL}api/partner`)
            .then(response => {
                setPartners(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching partners', error);
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
                return true;
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
            return false;
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
                fetchPartnerData();
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
                fetchPartnerData();
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating partner:', error);
        }
    }

    const columns = [
        {
            name: 'Partner Name',
            selector: row => row.partner_name,
            sortable: true,
        },
        {
            name: 'Partner Code',
            selector: row => row.partner_code,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status ? 'Active' : 'Inactive',
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
                row.status ? 
                <button
                    title='Delete'
                    onClick={() => handleDelete(row.partner_id)}
                    className="text-gray-700 hover:text-red-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                        <path fillRule="evenodd" d="M16.5 4.478a.75.75 0 01.424.032l2.047.547a.75.75 0 01.52.92L18.491 19.602a.75.75 0 01-.916.574l-9.155-2.222a.75.75 0 01-.582-.918l1.094-6.425a.75.75 0 01.424-.032l5.068-.707a.75.75 0 00.424-.032z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M14.505 5.733a.75.75 0 01.378-.813l1.83-1.045a.75.75 0 01.89.52l.547 2.047a.75.75 0 01-.032.424l-5.068.707a.75.75 0 01-.424-.032l-1.83-1.045a.75.75 0 01-.378-.813L14.505 5.733z" clipRule="evenodd" />
                    </svg>
                </button> :
                <button
                    title='Activate'
                    onClick={() => handleActivate(row.partner_id)}
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
        return partners.filter(item => {
            const matchesFilter = item.partner_name.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'active' && item.status) || 
                                (statusFilter === 'inactive' && !item.status);
            return matchesFilter && matchesStatus;
        });
    }, [partners, filterText, statusFilter]);

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 px-6 py-3">
                <div className="flex justify-between items-center mb-4">
                    <p className='text-2xl font-bold text-gray-700'>Partner Master</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                <input
                    type="text"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                placeholder="Search Partner..."
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
                            Add Partner
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

                <PartnerForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                
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
