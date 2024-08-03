import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import AdminTicketForm, { UserTicketForm, HelpdeskTicketForm } from '../components/Master_Form/ticket_form';
import TicketUpdatePopup, { UserTicketInfo, HelpdeskTicketUpdatePopup } from '../components/Master_Info/ticket_info';
import UpdateInfoPopup from '../components/Master_Info/update_info'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TicketMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showUpdatesPopup, setShowUpdatesPopup] = useState(false);
    const [updates, setUpdates] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [dropdownValues, setDropdownValues] = useState({
        partners: [],
        softwares: [],
        categories: [],
        statuses: [],
        usernames: [],
        requested_by: [],
    });

    useEffect(() => {
        // Fetch Ticket data from backend when component mounts
        fetchDataBasedOnRoles();
    }, []);

    const getUserRole = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
            const decoded = jwtDecode(token); // Decode the token
            return decoded.role; // Extract the role from the decoded token
        }
        return null;
    };

    const getUsername = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
            const decoded = jwtDecode(token); // Decode the token
            return decoded.username; // Extract the role from the decoded token
        }
        return null;
    };

    const fetchDataBasedOnRoles = async () => {
        const role = getUserRole();
        const username = getUsername();
        let apiUrl;
        switch (role) {
            case 'Admin':
                apiUrl = 'http://localhost:3000/api/ticket/admin-access';
                break;
            case 'Partner':
                apiUrl = `http://localhost:3000/api/ticket/user-access/${username}`;
                break;
            case 'Orbis':
                apiUrl = `http://localhost:3000/api/ticket/user-access/${username}`;
                break;
            case 'Helpdesk':
                apiUrl = 'http://localhost:3000/api/ticket/helpdesk-access/all'

        }
        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }) // Include the token in headers) // Replace with your backend endpoint
            .then(response => {
                setTickets(response.data);
            })
            .catch(error => {
                console.error('Error fetching Tickets', error);
            });
    }

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
                apiUrl = 'http://localhost:3000/api/ticket/admin-access/ticket-form';
                break;
            case 'Partner':
            case 'Orbis':
                apiUrl = 'http://localhost:3000/api/ticket/user-access/ticket-form';
                break;
            case 'Helpdesk':
                apiUrl = 'http://localhost:3000/api/ticket/helpdesk-access/ticket-form';
                break;
            default:
                console.error('Role not recognized');
                return;
        }

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                fetchDataBasedOnRoles(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
            } else {
                console.error('Form submission unsuccessful');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data.message);
            } else {
                setError('Error adding Ticket');
            }
        }
    };


    const handleUpdateClick = (Ticket) => {
        setSelectedTicket(Ticket);
    };

    const handleCloseUpdatePopup = () => {
        setSelectedTicket(null);
        fetchDataBasedOnRoles();
    };

    const fetchUpdates = async (ticket_id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/ticket/admin-access/ticket-updates/${ticket_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success) {
                setUpdates(data.updates);
            } else {
                console.error('Failed to fetch updates');
                return [];
            }
        } catch (error) {
            console.error('Error fetching updates:', error);
            return [];
        }
    };

    const handleShowUpdates = (ticket_id) => {
        setSelectedTicketId(ticket_id);
        fetchUpdates(ticket_id);
        setShowUpdatesPopup(true);
    };

    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dropdown-values');
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            }
        };
        fetchDropdownValues();
    }, []);

    const filteredTickets = Tickets.filter(Ticket =>
        Ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'critical' && Ticket.priority === 'Critical') || (statusFilter === 'high' && Ticket.priority === 'High') || (statusFilter === 'medium' && Ticket.priority === 'Medium') || (statusFilter === 'low' && Ticket.priority === 'Low'))
    );

    const role = getUserRole();

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 dark:bg-gray-200">
                <p className='bg-gray-200 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Ticket Management</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search Ticket Name"
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
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                {role === 'Admin' && (
                    <AdminTicketForm
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        error={error}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Partner' && (
                    <UserTicketForm
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        error={error}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Orbis' && (
                    <UserTicketForm
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        error={error}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Helpdesk' && (
                    <HelpdeskTicketForm 
                        isOpen={isPopupOpen} 
                        onClose={handleClosePopup} 
                        onSubmit={handleFormSubmit} 
                        error={error} 
                        dropdownValues={dropdownValues} 
                    />
                )}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 dark:bg-gray-900">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Requested By</th>
                            <th scope="col" className="px-6 py-3">Organization</th>
                            <th scope="col" className="px-6 py-3">Priority</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Update</span></th>
                            <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(Ticket => (
                            <tr key={Ticket.ticket_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {Ticket.title}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {Ticket.requested_by}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {Ticket.organization}
                                </td>
                                <td className="px-6 py-4">
                                    {Ticket.priority}
                                </td>
                                <td className="px-6 py-4">
                                    {Ticket.status}
                                </td>
                                <td className="px-2 py-4 text-right">
                                    <a
                                        onClick={() => handleUpdateClick(Ticket)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Ticket Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    <a
                                        onClick={() => handleShowUpdates(Ticket.ticket_id)}
                                        className="text-white px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-800"
                                    >Update Info
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {role === 'Admin' && selectedTicket && (
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
                {role === 'Helpdesk' && selectedTicket && (
                    <HelpdeskTicketUpdatePopup
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                <UpdateInfoPopup
                    show={showUpdatesPopup}
                    updates={updates}
                    onClose={() => setShowUpdatesPopup(false)}
                />
            </div>
        </div>
    );
};

export default TicketMaster;
