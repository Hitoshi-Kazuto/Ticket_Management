import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import AdminTicketForm, { UserTicketForm, HelpdeskTicketForm } from '../components/Master_Form/ticket_form';
import AdminTicketInfo, { UserTicketInfo, HelpdeskTicketInfo } from '../components/Master_Info/ticket_info';
import UpdateInfoPopup, {UpdateInfoUserPopup} from '../components/Master_Info/update_info'
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

        }
        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }) // Include the token in headers) // Replace with your backend endpoint
            .then(response => {
                setTickets(response.data);
                setLoading(false);
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
                fetchDataBasedOnRoles(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
                return true; // Return true on success
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
            return false; // Return false on error
        }
    };


    const handleUpdateClick = (e, Ticket) => {
        if (e.target.closest('button') || e.target.closest('td:last-child')) {
            return;
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

    const handleShowUpdates = (ticket_id) => {
        setSelectedTicketId(ticket_id);
        fetchUpdates(ticket_id);
    };

    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get(`${API_URL}api/dropdown-values`,{headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }});
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            }
        };
        fetchDropdownValues();
    }, []);

    const filteredTickets = Tickets.filter(Ticket =>
        Ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || 
        (statusFilter === 'critical' && Ticket.priority === 'Critical') || 
        (statusFilter === 'high' && Ticket.priority === 'High') || 
        (statusFilter === 'medium' && Ticket.priority === 'Medium') || 
        (statusFilter === 'low' && Ticket.priority === 'Low')) &&
        (statusDropdownFilter === '' || Ticket.status === statusDropdownFilter)
    );

    const role = getUserRole();

    // debug logs
    // console.log("Sample Ticket requested_by:", Tickets[0]?.requested_by);
    // console.log("dropdownValues usernames:", dropdownValues.usernames);

    const handleWithdraw = async (ticketId) => {
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
                // Refresh the ticket list after successful withdrawal
                fetchDataBasedOnRoles();
            } else {
                console.error('Failed to withdraw ticket');
            }
        } catch (error) {
            console.error('Error withdrawing ticket:', error);
        }
    };

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6 dark:bg-gray-200">
                <p className='bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Ticket Management</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
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
                <select
                    value={statusDropdownFilter}
                    onChange={(e) => setStatusDropdownFilter(e.target.value)}
                    className="px-4 py-3.5 mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Statuses</option>
                    {dropdownValues.statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-3.5 text-center"
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
                <div className="px-3 pb-3">
                    <div className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-100px)]">
                        <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400 dark:bg-gray-900">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Creation Date</th>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Requested By</th>
                                    <th scope="col" className="px-6 py-3">Organization</th>
                                    <th scope="col" className="px-6 py-3">Assigned Staff</th>
                                    <th scope="col" className="px-6 py-3">Priority</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-3 py-3"><span className="sr-only">Update</span></th>
                                    <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map(Ticket => (
                                    <tr key={Ticket.ticket_id} 
                                        onClick={(e) => handleUpdateClick(e, Ticket)}
                                        className="cursor-pointer bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {new Date(Ticket.created_time).toLocaleString('en-GB', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false
                                            }).replace(',', ' -')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {Ticket.title}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {dropdownValues.requested_by.find(user => user.username === Ticket.requested_by)?.name || Ticket.requested_by}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {Ticket.organization}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {dropdownValues.usernames.find(user => user.username === Ticket.assigned_staff)?.name || Ticket.assigned_staff}
                                        </td>
                                        <td className="px-6 py-4">
                                            {Ticket.priority}
                                        </td>
                                        <td className="px-6 py-4">
                                            {Ticket.status}
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                        {/* Only show withdraw button if user is the requester and status is Submitted or Assigned */}
                                        {getUsername() === Ticket.requested_by && 
                                            (Ticket.status === 'Submitted' || Ticket.status === 'Assigned') && (
                                                <button
                                                    title='Withdraw Ticket'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to withdraw this ticket?')) {
                                                            handleWithdraw(Ticket.ticket_id);
                                                        }
                                                    }}
                                                    className="text-white px-4 py-2 rounded-md bg-red-500 hover:bg-red-800"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                                                        <line x1="18" y1="9" x2="12" y2="15"/>
                                                        <line x1="12" y1="9" x2="18" y2="15"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            <button
                                                title='View Updates'
                                                onClick={() => handleShowUpdates(Ticket.ticket_id)}
                                                className="text-white px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-800"
                                            ><img width="24" height="24" 
                                                src="https://img.icons8.com/material-outlined/24/edit-property.png" 
                                                alt="edit-property"
                                                className="invert brightness-0"
                                            />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {role === 'Admin' && selectedTicket && (
                    <AdminTicketInfo
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
                    <HelpdeskTicketInfo
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseUpdatePopup}
                        dropdownValues={dropdownValues}
                    />
                )}
                {role === 'Admin' && (
                    <UpdateInfoPopup
                        show={showUpdatesPopup && !updatesLoading}
                        updates={updates}
                        onClose={() => setShowUpdatesPopup(false)}
                    />
                )}
                {role === 'Helpdesk' && (
                    <UpdateInfoPopup
                        show={showUpdatesPopup && !updatesLoading}
                        updates={updates}
                        onClose={() => setShowUpdatesPopup(false)}
                    />
                )}
                {role === 'Orbis' && (
                    <UpdateInfoUserPopup
                        show={showUpdatesPopup && !updatesLoading}
                        updates={updates}
                        onClose={() => setShowUpdatesPopup(false)}
                    />
                )}
                {role === 'Partner' && (
                    <UpdateInfoUserPopup
                        show={showUpdatesPopup && !updatesLoading}
                        updates={updates}
                        onClose={() => setShowUpdatesPopup(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketMaster;
