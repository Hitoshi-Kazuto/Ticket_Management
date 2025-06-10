import React, { useState, useEffect, useMemo } from 'react';
import Home from '../components/Home/home';
import SoftwareForm from '../components/Master_Form/software_form';
import SoftwareInfoPopup from '../components/Master_Info/software_info';
import axios from 'axios';
import LoadingSpinner from '../components/Hooks/spinnerComponent';
import DataTable from 'react-data-table-component';

const SoftwareMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [softwares, setSoftwares] = useState([]);
    const [selectedSoftware, setSelectedSoftware] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const username = localStorage.getItem('username');
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        fetchSoftwareData();
    }, []);

    const fetchSoftwareData = () => {
        axios.get(`${API_URL}api/software`)
            .then(response => {
                setSoftwares(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching softwares', error);
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
                `${API_URL}api/software/software-form`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchSoftwareData();
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
                setError('Error adding software');
            }
            return false;
        }
    };

    const handleInfoClick = (software) => {
        setSelectedSoftware(software);
    };

    const handleCloseInfoPopup = () => {
        setSelectedSoftware(null);
        fetchSoftwareData();
    };

    const handleDelete = async (sw_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/software/inactivate`, 
                { sw_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchSoftwareData();
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating software:', error);
        }
    };

    const handleActivate = async (sw_id) => {
        try {
            const response = await axios.post(
                `${API_URL}api/software/activate`, 
                { sw_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchSoftwareData();
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating software:', error);
        }
    }

    const columns = [
        {
            name: 'Software Name',
            selector: row => row.software_name,
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
                    onClick={() => handleInfoClick(row)}
                    className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
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
                    onClick={() => handleDelete(row.sw_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path fillRule="evenodd" d="M16.5 4.478a.75.75 0 01.424.032l2.047.547a.75.75 0 01.52.92L18.491 19.602a.75.75 0 01-.916.574l-9.155-2.222a.75.75 0 01-.582-.918l1.094-6.425a.75.75 0 01.424-.032l5.068-.707a.75.75 0 00.424-.032z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M14.505 5.733a.75.75 0 01.378-.813l1.83-1.045a.75.75 0 01.89.52l.547 2.047a.75.75 0 01-.032.424l-5.068.707a.75.75 0 01-.424-.032l-1.83-1.045a.75.75 0 01-.378-.813L14.505 5.733z" clipRule="evenodd" />
                    </svg>
                </button> :
                <button
                    title='Activate'
                    onClick={() => handleActivate(row.sw_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <img 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEI0lEQVR4nO2a34tVVRTHP1eduRo6Gej0FPlHKMaob2JEmZolkz7omyCIoqYPGUg/RMfQrBB6CRGpFHuppvK1xh9Izzr+wF8zQ1NZT/0YNT2x4Xtgdz3r7H3OvedeEb+wuJe71v7xPXvvtdZe58JjPLp4ClgO7AMGgWHgD+C2xH2/IJ2zWQbM5CFBHVgDnAT+BZKC4tp8B6xWX23HNGALMFZi8paMApuBqe0i8QJwpYUEGuUy8HyVBNzSH6yQQKMc0cq3FE8DP7WRRCI5B/S2isQcLXfMwL8Dfzb81gcsaPjtH9nG9HlJc2h6JWJInAL6gS5gfoMuhf/bc0A38DpwJpJMb1kSUyO2k/M0K7w2U4AdEUS2yzbFyggPeK6siz4U6PhzoEe2TwI7RSyJIOJkBHjT68N9HguM+VEZF5vX4W6gJttXA0/TIuKv6iuyqQF7AmMviSUxLRAn3pHdZODDiP0dIpLKAWCSbN8LnJeoLbYlp5PjemqOxJcRkytCJO1/ssY4kWO3KUSinrNNbgLTZfdB5MSKEkmA/bKfrnOUZTMSWpU1OQOk+3hVgUmVIZIAr3nezLJxrtvESaPRD55nGWsDkVFghtr9aNh8m3efsFJxtwoOuwpOqCyRBHhL7foN/V3Pdf8Py40G44rYXSXT9rJERhU0XQbwi2GzNIvI+4bxUelfLDGZZogkimcOnxn6gSwig4bxeun3dYDIHrXdYOi/yiJyyTCeK/3pDhAZUtt5ht7VBR6AlVY/I/1IB4hcV9tnDf2vWURuG8bpLe3vDhD5S22fMPQTRYh0B/QhWQgsKtl2QmPXixC5ZRjPkt5ygVXKuMaebeh/yyJysaLD3owMBQ67K/g9gG8M47WBOFOlDGjsdUXcrxUnPpV+YQeI9Gnsw4Z+bxaRZTn7dIruCe08Jz/rotUlN5tl81IWkZk5SePLsnmjjUS2Bh7wHStpdPjeaOQOelpZudEGEte8i5OVxrszbWJ1TudppunKP/crJHFfq4B2gmXn0nsTdaOk4+Sqd9l5u0IiuzRGj1bGunangdrE5kAtqyaxUutm5KjXf16Na2OIRLoqwxHloJqqivdatJ1cyt7SchB6P5EEyNS8M9OMA7junYka8G6A8GIK4uPABL7wzozzZtsUc4rEia3e040pmbr3M4VRV+E4r+OrDffmSXqFMKAK/biy5gl9H1I07vO2UeqdrIOdytmYA26hN+fm6MuQJuOicCy6tKVORfR/URlwU5gTSSZRCnNYSd5cXQG6JbOUxa6TjZV2JBkk3A2xJeiN2GZVyNlWrIT1MrTKqJ548knV796XFNhqZWS4jIsti7pK+2UrK1basbFT/4Coqyo+qFps0cnfVRbb34xrbTV6FFNcDPla9+lb3p9q3Pfzup7u1aUoDaiP8cjhP4pqmhmMpkfXAAAAAElFTkSuQmCC" 
                        alt="activate"
                        width="25" height="25"
                        className="invert brightness-0"
                    />
                </button>
            ),
            width: '100px',
        },
    ];

    const filteredItems = useMemo(() => {
        return softwares.filter(item => {
            const matchesFilter = item.software_name.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'active' && item.status) || 
                                (statusFilter === 'inactive' && !item.status);
            return matchesFilter && matchesStatus;
        });
    }, [softwares, filterText, statusFilter]);

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
                    <p className='text-2xl font-bold text-gray-700'>Software Master</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                <input
                    type="text"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                placeholder="Search Software..."
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
                            Add Software
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

                <SoftwareForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                
                {selectedSoftware && (
                    <SoftwareInfoPopup
                        isOpen={true}
                        software={selectedSoftware}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default SoftwareMaster;
