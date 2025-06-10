import React, { useState, useEffect, useMemo } from 'react';
import Home from '../components/Home/home';
import TicketUpdatePopup, { UserTicketInfo } from '../components/Master_Info/ticket_info';
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
        const partnerCode = localStorage.getItem('partner_code');
        let apiUrl;
        switch (role) {
            case 'Admin':
                apiUrl = `${API_URL}api/ticket/closed-ticket/admin-access`;
                break;
            case 'Partner':
                apiUrl = `${API_URL}api/ticket/closed-ticket/user-access/${username}`;
                break;
            case 'Orbis':
                apiUrl = `${API_URL}api/ticket/closed-ticket/user-access/${username}`;
                break;
            case 'Helpdesk':
                apiUrl = `${API_URL}api/ticket/closed-ticket/helpdesk-access`;
                break;
            case 'Helpdesk-Vendor':
                apiUrl = `${API_URL}api/ticket/closed-ticket/helpdesk-access/partner/${partnerCode}`;
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
            console.log('Making request for ticket:', ticket_id);
            const response = await axios.get(
                `${API_URL}api/ticket/admin-access/ticket-updates/${ticket_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            console.log('Raw response:', response);
            console.log('Response data:', response.data);
            
            // Check if response.data exists and has the expected structure
            if (!response.data) {
                console.error('No data in response');
                setUpdates([]);
                setShowUpdatesPopup(true);
                return;
            }

            // Check if updates exist in the response
            if (!response.data.updates) {
                console.error('No updates in response data');
                setUpdates([]);
                setShowUpdatesPopup(true);
                return;
            }

            // If we have updates, set them
            console.log('Setting updates:', response.data.updates);
            setUpdates(response.data.updates);
            setShowUpdatesPopup(true);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setUpdates([]);
            setShowUpdatesPopup(true);
        } finally {
            setUpdatesLoading(false);
        }
    };

    const handleShowUpdates = (e, ticket_id) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Show updates clicked for ticket:', ticket_id);
        setSelectedTicketId(ticket_id);
        fetchUpdates(ticket_id);
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
            name: 'Creation Date',
            selector: row => new Date(row.created_time).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', ' -'),
            sortable: true,
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Requested By',
            selector: row => dropdownValues.requested_by.find(user => user.username === row.requested_by)?.name || row.requested_by,
            sortable: true,
        },
        {
            name: 'Organization',
            selector: row => row.organization,
            sortable: true,
        },
        {
            name: 'Assigned To',
            selector: row => row.assigned_staff || 'Not Assigned',
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
                    title='Updates'
                    onClick={(e) => handleShowUpdates(e, row.ticket_id)}
                    className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </button>
            ),
            width: '100px',
        }
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
                    <p className='text-2xl font-bold text-gray-700'>Closed Tickets</p>
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

                {role === 'Admin' && selectedTicket && (
                    <TicketUpdatePopup
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Helpdesk' && selectedTicket && (
                    <TicketUpdatePopup
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Helpdesk-Vendor' && selectedTicket && (
                    <TicketUpdatePopup
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Partner' && selectedTicket && (
                    <UserTicketInfo
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Orbis' && selectedTicket && (
                    <UserTicketInfo
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}

                {role === 'Admin' && showUpdatesPopup && (
                    <UpdateInfoPopup 
                        show={true}
                        updates={updates || []}
                        onClose={() => {
                            setShowUpdatesPopup(false);
                            setSelectedTicketId(null);
                            setUpdates([]);
                        }}
                    />
                )}
                {role === 'Helpdesk' && showUpdatesPopup && (
                    <UpdateInfoPopup 
                        show={true}
                        updates={updates || []}
                        onClose={() => {
                            setShowUpdatesPopup(false);
                            setSelectedTicketId(null);
                            setUpdates([]);
                        }}
                    />
                )}
                {role === 'Helpdesk-Vendor' && showUpdatesPopup && (
                    <UpdateInfoPopup 
                        show={true}
                        updates={updates || []}
                        onClose={() => {
                            setShowUpdatesPopup(false);
                            setSelectedTicketId(null);
                            setUpdates([]);
                        }}
                    />
                )}
                {role === 'Orbis' && showUpdatesPopup && (
                    <UpdateInfoUserPopup
                        show={true}
                        updates={updates || []}
                        onClose={() => {
                            setShowUpdatesPopup(false);
                            setSelectedTicketId(null);
                            setUpdates([]);
                        }}
                    />
                )}
                {role === 'Partner' && showUpdatesPopup && (
                    <UpdateInfoUserPopup
                        show={true}
                        updates={updates || []}
                        onClose={() => {
                            setShowUpdatesPopup(false);
                            setSelectedTicketId(null);
                            setUpdates([]);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketMaster;
