import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import AssignPopup from '../components/Master_Info/assign_staff_form';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DataTable from 'react-data-table-component';
import { FaSearch, FaPlus } from 'react-icons/fa';

const TicketMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [Assign, setAssign] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownValues, setDropdownValues] = useState({
        partners: [],
        softwares: [],
        categories: [],
        statuses: [],
        usernames: [],
        requested_by: [],
    });
    const API_URL = 'http://52.187.70.171:8443/proxy/3001/';

    useEffect(() => {
        fetchData();
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

    const fetchData = async () => {
        let apiUrl = `${API_URL}api/ticket/assign-staff`;
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

    const handleAssignClick = (Ticket) => {
        setSelectedTicket(Ticket);
    };

    const handleCloseAssignPopup = () => {
        setSelectedTicket(null);
        setIsPopupOpen(false);
        fetchData();
    };

    useEffect(() => {
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
        fetchDropdownValues();
    }, []);

    const filteredTickets = useMemo(() => {
        return Tickets.filter(Ticket => {
            const searchText = filterText.toLowerCase();
            
            // List all fields you want to search
            const fieldsToSearch = [
                Ticket.title,
                Ticket.requested_by,
                Ticket.organization,
                Ticket.priority,
                Ticket.status
            ];
            
            // Check if any field contains the search text
            const matchesFilter = fieldsToSearch.some(field =>
                field && field.toString().toLowerCase().includes(searchText)
            );
            
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'critical' && Ticket.priority === 'Critical') || 
                                (statusFilter === 'high' && Ticket.priority === 'High') || 
                                (statusFilter === 'medium' && Ticket.priority === 'Medium') || 
                                (statusFilter === 'low' && Ticket.priority === 'Low');
            return matchesFilter && matchesStatus;
        });
    }, [Tickets, filterText, statusFilter]);

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
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderBottom: '2px solid #e5e7eb',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                color: '#374151',
            },
        },
        rows: {
            style: {
                minHeight: '72px',
                cursor: 'pointer',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
    };

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axios.put(
                `${API_URL}api/ticket/helpdesk-access/assign-staff/${selectedTicket.ticket_id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchData();
                return true;
            } else {
                console.error('Form submission unsuccessful:', response.data.error);
                return false;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            return false;
        }
    };

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 px-6 py-3">
                <div className="flex justify-between items-center mb-4">
                    <p className='text-2xl font-bold text-gray-700'>Assign Staff</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                placeholder="Search Tickets..."
                                className="px-5 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-72 text-base"
                            />
                            {filterText && (
                                <button
                                    onClick={() => {
                                        setResetPaginationToggle(!resetPaginationToggle);
                                        setFilterText('');
                                    }}
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
                            onClick={handleFormSubmit}
                            type="button"
                            className="px-6 py-2 mx-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base"
                        >
                            Add Ticket
                        </button>
                    </div>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                    <DataTable
                        columns={columns}
                        data={filteredTickets}
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
                        onRowClicked={(row) => handleAssignClick(row)}
                    />
                </div>
            </div>

            {selectedTicket && (
                <AssignPopup
                    isOpen={true}
                    ticket={selectedTicket}
                    onClose={handleCloseAssignPopup}
                    onSubmit={handleFormSubmit}
                    dropdownValues={dropdownValues}
                />
            )}
        </div>
    );
};

export default TicketMaster;
