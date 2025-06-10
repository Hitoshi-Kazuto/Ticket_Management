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
    const API_URL = 'https://ticket-management-ten.vercel.app/';

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

    const filteredTickets = Tickets.filter(Ticket =>
        Ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'critical' && Ticket.priority === 'Critical') || 
        (statusFilter === 'high' && Ticket.priority === 'High') || 
        (statusFilter === 'medium' && Ticket.priority === 'Medium') || 
        (statusFilter === 'low' && Ticket.priority === 'Low'))
    );

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
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    row.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {row.priority}
                </span>
            ),
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    title='Assign'
                    onClick={() => handleAssignClick(row)}
                    className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        className="fill-white"
                    >
                        <path d="M12 3c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9 4.963 0 9-4.037 9-9 0-4.962-4.037-9-9-9zm0 16c-3.859 0-7-3.14-7-7 0-3.859 3.141-7 7-7 3.859 0 7 3.141 7 7 0 3.86-3.141 7-7 7z"/>
                        <path d="M13 7h-2v5H6v2h5v5h2v-5h5v-2h-5z"/>
                    </svg>
                </button>
            ),
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
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
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Assign Ticket</h1>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg pl-10"
                                    placeholder="Search Ticket Name"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <div className="inline-flex items-center gap-2">
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
                                    id="critical"
                                    name="status"
                                    value="critical"
                                    checked={statusFilter === 'critical'}
                                    onChange={() => setStatusFilter('critical')}
                                    className="mr-1.5"
                                />
                                <label htmlFor="critical" className="mr-3">Critical</label>
                                <input
                                    type="radio"
                                    id="high"
                                    name="status"
                                    value="high"
                                    checked={statusFilter === 'high'}
                                    onChange={() => setStatusFilter('high')}
                                    className="mr-1.5"
                                />
                                <label htmlFor="high" className="mr-3">High</label>
                                <input
                                    type="radio"
                                    id="medium"
                                    name="status"
                                    value="medium"
                                    checked={statusFilter === 'medium'}
                                    onChange={() => setStatusFilter('medium')}
                                    className="mr-1.5"
                                />
                                <label htmlFor="medium" className="mr-3">Medium</label>
                                <input
                                    type="radio"
                                    id="low"
                                    name="status"
                                    value="low"
                                    checked={statusFilter === 'low'}
                                    onChange={() => setStatusFilter('low')}
                                    className="mr-1.5"
                                />
                                <label htmlFor="low" className="mr-3">Low</label>
                            </div>
                            <button 
                                onClick={handleAddClick} 
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                            >
                                <FaPlus className="inline-block mr-2" />
                                Add Ticket
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredTickets}
                                pagination
                                highlightOnHover
                                pointerOnHover
                                customStyles={customStyles}
                                noDataComponent="No tickets to display."
                            />
                        )}
                    </div>
                </div>
            </div>

            {selectedTicket && (
                <AssignPopup
                    isOpen={true}
                    onClose={handleCloseAssignPopup}
                    onSubmit={handleFormSubmit}
                    ticketData={selectedTicket}
                    dropdownValues={dropdownValues}
                />
            )}
        </div>
    );
};

export default TicketMaster;
