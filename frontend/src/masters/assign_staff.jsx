import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import AssignPopup from '../components/Master_Info/assign_staff_form'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
        // Fetch Ticket data from backend when component mounts
        fetchData();
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

    const fetchData = async () => {

        let apiUrl = `${API_URL}api/ticket/assign-staff`
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
                const response = await axios.get(`${API_URL}api/dropdown-values`,{headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }});
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            } finally {
                setLoading(false);
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
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className=' bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Assign Ticket</p>
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
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Requested By</th>
                            <th scope="col" className="px-6 py-3">Organization</th>
                            <th scope="col" className="px-6 py-3">Priority</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Assign</span></th>
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
                                <td className="px-4 py-4 text-center">
                                    <button
                                        onClick={() => handleAssignClick(Ticket)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedTicket && (
                    <AssignPopup
                        isOpen={true}
                        ticket={selectedTicket}
                        onClose={handleCloseAssignPopup}
                        dropdownValues={dropdownValues}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketMaster;
