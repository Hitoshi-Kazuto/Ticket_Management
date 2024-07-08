import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import TicketForm from '../components/Master_Form/ticket_form';
import TicketInfoPopup from '../components/Master_Info/ticket_info';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TicketMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');  
    const username = localStorage.getItem('username'); // Get username from local storage
    const [dropdownValues, setDropdownValues] = useState({
        partners: [],
        softwares: [],
        categories: [],
        statuses: []
    });

    useEffect(() => {
        // Fetch Ticket data from backend when component mounts
        fetchTicketData();
    }, []);

    const fetchTicketData = () => {
        axios.get('http://localhost:3000/ticket') // Replace with your backend endpoint
            .then(response => {
                setTickets(response.data);
            })
            .catch(error => {
                console.error('Error fetching Tickets', error);
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
            const response = await axios.post('http://localhost:3000/ticket/ticket-form', formData);
            if (response.data.success) {
                fetchTicketData(); // Refetch data after successful submission
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


    const handleInfoClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseInfoPopup = () => {
        setSelectedTicket(null);
        fetchTicketData();
    };

    const handleClose = async (ticket_id) => {
        try {
            const response = await axios.post('http://localhost:3000/ticket/close', { ticket_id });
            if (response.data.success) {
                fetchTicketData(); // Refresh data after successful deletion
            } else {
                console.error('Closing unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error closing Ticket:', error);
        }
    };

    const handleOpen = async (ticket_id) => {
        try {
            const response = await axios.post('http://localhost:3000/ticket/open', { ticket_id });
            if (response.data.success) {
                fetchTicketData(); // Refresh data after successful deletion
            } else {
                console.error('Opening unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error opening Ticket:', error);
        }
    }

    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get('http://localhost:3000/dropdown-values');
                setDropdownValues(response.data);
            } catch (error) {
                console.error('Error fetching dropdown values:', error);
            }
        };
        fetchDropdownValues();
    }, []);

    const filteredTickets = Tickets.filter(Ticket =>
        Ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'critical' && Ticket.priority === 'Critical') || (statusFilter === 'high' && Ticket.priority === 'High')  || (statusFilter === 'medium' && Ticket.priority === 'Medium')  || (statusFilter === 'low' && Ticket.priority === 'Low'))
    );

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
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
                <TicketForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} dropdownValues={dropdownValues}/>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Organization</th>
                            <th scope="col" className="px-6 py-3">Partner Name</th>
                            <th scope="col" className="px-6 py-3">Priority</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                            <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.ticket_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {ticket.title}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {ticket.organization}
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.partner_name}
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.priority}
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.status}
                                </td>
                                <td className="px-2 py-4 text-right">
                                    <a
                                        onClick={() => handleInfoClick(ticket)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {ticket.status ? <button
                                        onClick={() => handleClose(ticket.ticket_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >Close
                                    </button> :
                                        <button
                                            onClick={() => handleOpen(ticket.ticket_id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >Open
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedTicket && (
                    <TicketInfoPopup
                        isOpen={true}
                        Ticket={selectedTicket}
                        onClose={handleCloseInfoPopup}
                        dropdownValues={dropdownValues}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketMaster;
