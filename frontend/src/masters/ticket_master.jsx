import React, { useState, useEffect, useMemo } from 'react';
import Home from '../components/Home/home';
import AdminTicketForm, { UserTicketForm, HelpdeskTicketForm } from '../components/Master_Form/ticket_form';
import AdminTicketInfo, { UserTicketInfo, HelpdeskTicketInfo } from '../components/Master_Info/ticket_info';
import UpdateInfoPopup, {UpdateInfoUserPopup} from '../components/Master_Info/update_info'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../components/Hooks/spinnerComponent';
import DataTable from 'react-data-table-component';

const TicketMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showUpdatesPopup, setShowUpdatesPopup] = useState(false);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [dropdownValues, setDropdownValues] = useState({
        partners: [],
        softwares: [],
        categories: [],
        statuses: [],
        usernames: [],
        requested_by: [],
    });
    const API_URL = 'https://ticket-management-ten.vercel.app/';
    const [updatesLoading, setUpdatesLoading] = useState(false);
    const [statusDropdownFilter, setStatusDropdownFilter] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    useEffect(() => {
        fetchDataBasedOnRoles();
        fetchDropdownValues();
    }, []);

    const getUserRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.role;
        }
        return null;
    };

    const getUsername = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.username;
        }
        return null;
    };

    const fetchDataBasedOnRoles = async () => {
        const role = getUserRole();
        const username = getUsername();
        let apiUrl;
        switch (role) {
            case 'Admin':
                apiUrl = `${API_URL}api/ticket/admin-access`;
                break;
            case 'Partner':
                apiUrl = `${API_URL}api/ticket/user-access/${username}`;
                break;
            case 'Orbis':
                apiUrl = `${API_URL}api/ticket/user-access/${username}`;
                break;
            case 'Helpdesk':
                apiUrl = `${API_URL}api/ticket/helpdesk-access/all`
                break;
        }
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Tickets', error);
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleFormSubmit = async (formData) => {
        const role = getUserRole();
        let apiUrl;

        switch (role) {
            case 'Admin':
                apiUrl = `${API_URL}api/ticket/admin-access/ticket-form`;
                break;
            case 'Partner':
            case 'Orbis':
                apiUrl = `${API_URL}api/ticket/user-access/ticket-form`;
                break;
            case 'Helpdesk':
                apiUrl = `${API_URL}api/ticket/helpdesk-access/ticket-form`;
                break;
            default:
                console.error('Role not recognized');
                return false;
        }

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                fetchDataBasedOnRoles();
                handleClosePopup();
                setError('');
                return true;
            } else {
                console.error('Form submission unsuccessful');
                setError(response.data.message || 'Form submission unsuccessful');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data.message);
            } else {
                setError('Error adding Ticket');
            }
            return false;
        }
    };

    const handleUpdateClick = (e, Ticket) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSelectedTicket(Ticket);
    };

    const handleCloseUpdatePopup = () => {
        setSelectedTicket(null);
        fetchDataBasedOnRoles();
    };

    const fetchUpdates = async (ticket_id) => {
        setUpdatesLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}api/ticket/admin-access/ticket-updates/${ticket_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                setUpdates(response.data.updates);
                setShowUpdatesPopup(true);
            } else {
                console.error('Failed to fetch updates');
            }
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setUpdatesLoading(false);
        }
    };

    const handleShowUpdates = (e, ticket_id) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTicketId(ticket_id);
        fetchUpdates(ticket_id);
    };

    const handleWithdraw = async (e, ticketId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await axios.put(
                `${API_URL}api/ticket/withdraw/${ticketId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                fetchDataBasedOnRoles();
                alert('Ticket withdrawn successfully');
            } else {
                alert(response.data.message || 'Failed to withdraw ticket');
            }
        } catch (error) {
            console.error('Error withdrawing ticket:', error);
            alert(error.response?.data?.message || 'Error withdrawing ticket');
        }
    };

    const fetchDropdownValues = async () => {
        try {
            const response = await axios.get(`${API_URL}api/dropdown-values`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDropdownValues(response.data);
        } catch (error) {
            console.error('Error fetching dropdown values:', error);
        }
    };

    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Requested By',
            selector: row => row.requested_by,
            sortable: true,
        },
        {
            name: 'Organization',
            selector: row => row.organization,
            sortable: true,
        },
        {
            name: 'Priority',
            selector: row => row.priority,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Updates',
            cell: row => (
                <button
                    onClick={(e) => handleShowUpdates(e, row.ticket_id)}
                    className="text-white px-4 py-2 rounded-md bg-green-700 hover:bg-green-800"
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
            cell: row => {
                const currentUser = getUsername();
                const isTicketCreator = row.requested_by === currentUser;
                const isWithdrawn = row.status === 'Withdraw';
                
                if (!isTicketCreator || isWithdrawn) return null;
                
                return (
                    <button
                        onClick={(e) => handleWithdraw(e, row.ticket_id)}
                        className="text-white px-4 py-2 rounded-md bg-red-700 hover:bg-red-800"
                    >
                        Withdraw
                    </button>
                );
            },
            width: '100px',
        },
    ];

    const filteredItems = useMemo(() => {
        return Tickets.filter(item => {
            const matchesFilter = item.title.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'critical' && item.priority === 'Critical') || 
                                (statusFilter === 'high' && item.priority === 'High') || 
                                (statusFilter === 'medium' && item.priority === 'Medium') || 
                                (statusFilter === 'low' && item.priority === 'Low');
            const matchesDropdown = statusDropdownFilter === '' || item.status === statusDropdownFilter;
            return matchesFilter && matchesStatus && matchesDropdown;
        });
    }, [Tickets, filterText, statusFilter, statusDropdownFilter]);

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    const role = getUserRole();

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 px-6 py-3">
                <div className="flex justify-between items-center mb-4">
                    <p className='text-2xl font-bold text-gray-700'>Ticket Management</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                placeholder="Search Ticket..."
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
                                    value="critical"
                                    checked={statusFilter === 'critical'}
                                    onChange={() => setStatusFilter('critical')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">Critical</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="high"
                                    checked={statusFilter === 'high'}
                                    onChange={() => setStatusFilter('high')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">High</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="medium"
                                    checked={statusFilter === 'medium'}
                                    onChange={() => setStatusFilter('medium')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">Medium</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="low"
                                    checked={statusFilter === 'low'}
                                    onChange={() => setStatusFilter('low')}
                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-base">Low</span>
                            </label>
                        </div>
                        <button
                            onClick={handleAddClick}
                            type="button"
                            className="px-6 py-2 mx-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base"
                        >
                            Add Ticket
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
                                cursor: 'pointer',
                            },
                        },
                    }}
                    onRowClicked={(row) => handleUpdateClick(null, row)}
                />

                {role === 'Admin' ? (
                    <AdminTicketForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} dropdownValues={dropdownValues} />
                ) : role === 'Helpdesk' ? (
                    <HelpdeskTicketForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} dropdownValues={dropdownValues} />
                ) : (
                    <UserTicketForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} dropdownValues={dropdownValues} />
                )}

                {selectedTicket && (
                    role === 'Admin' ? (
                        <AdminTicketInfo 
                            isOpen={true} 
                            ticket={selectedTicket} 
                            onClose={handleCloseUpdatePopup}
                            dropdownValues={dropdownValues}
                        />
                    ) : role === 'Helpdesk' ? (
                        <HelpdeskTicketInfo 
                            isOpen={true} 
                            ticket={selectedTicket} 
                            onClose={handleCloseUpdatePopup}
                            dropdownValues={dropdownValues}
                        />
                    ) : (
                        <UserTicketInfo 
                            isOpen={true} 
                            ticket={selectedTicket} 
                            onClose={handleCloseUpdatePopup}
                            dropdownValues={dropdownValues}
                        />
                    )
                )}

                {showUpdatesPopup && (
                    role === 'Admin' ? (
                        <UpdateInfoPopup 
                            show={true} 
                            updates={updates} 
                            onClose={() => setShowUpdatesPopup(false)} 
                        />
                    ) : (
                        <UpdateInfoUserPopup 
                            show={true} 
                            updates={updates} 
                            onClose={() => setShowUpdatesPopup(false)} 
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default TicketMaster;
