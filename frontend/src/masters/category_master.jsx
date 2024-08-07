import React, { useState, useEffect } from 'react';
import Home from '../components/Home/home';
import CategoryForm from '../components/Master_Form/category_form';
import CategoryInfoPopup from '../components/Master_Info/category_info';
import axios from 'axios';

const categoryMaster = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [categorys, setCategorys] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const username = localStorage.getItem('username'); // Get username from local storage
    const API_URL = 'https://ticket-management-ten.vercel.app/';

    useEffect(() => {
        // Fetch category data from backend when component mounts
        fetchCategoryData();
    }, []);

    const fetchCategoryData = () => {
        axios.get(`${API_URL}api/category`) // Replace with your backend endpoint
            .then(response => {
                setCategorys(response.data);
            })
            .catch(error => {
                console.error('Error fetching categorys', error);
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
            const response = await axios.post(`${API_URL}/category/category-form`, formData);
            if (response.data.success) {
                fetchCategoryData(); // Refetch data after successful submission
                handleClosePopup(); // Close the popup
                setError('');
            } else {
                console.error('Form submission unsuccessful');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Category with this name already exists');
            } else {
                setError('Error adding software');
            }
        }
    };


    const handleInfoClick = (category) => {
        setSelectedCategory(category);
    };

    const handleCloseInfoPopup = () => {
        setSelectedCategory(null);
        fetchCategoryData();
    };

    const handleDelete = async (cat_id) => {
        try {
            const response = await axios.post(`${API_URL}api/category/inactivate`, { cat_id });
            if (response.data.success) {
                fetchCategoryData(); // Refresh data after successful deletion
            } else {
                console.error('Inactivation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error inactivating category:', error);
        }
    };

    const handleActivate = async (cat_id) => {
        try {
            const response = await axios.post(`${API_URL}api/category/activate`, { cat_id });
            if (response.data.success) {
                fetchCategoryData(); // Refresh data after successful deletion
            } else {
                console.error('Activation unsuccessful:', response.data.error);
            }
        } catch (error) {
            console.error('Error activating category:', error);
        }
    }

    const filteredCategories = categorys.filter(category =>
        category.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'all' || (statusFilter === 'active' && category.status) || (statusFilter === 'inactive' && !category.status))
    );

    return (
        <div>
            <Home />
            <div className="overflow-x-auto shadow-md absolute right-0 w-5/6">
                <p className=' bg-gray-100 border-gray-200 p-3 m-0 dark:bg-gray-800 relative self-right text-xl font-semibold whitespace-nowrap dark:text-gray-400'>Category Master</p>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-3.5 m-3 mr-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-5/12"
                    placeholder="Search category Name"
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
                        id="active"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={() => setStatusFilter('active')}
                        className="mr-1.5"
                    />
                    <label htmlFor="active" className="mr-3">Active</label>
                    <input
                        type="radio"
                        id="inactive"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={() => setStatusFilter('inactive')}
                        className="mr-1.5"
                    />
                    <label htmlFor="inactive" className="mr-3">Inactive</label>
                </div>
                <button
                    onClick={handleAddClick}
                    type="button"
                    className="p-2 mx-1.5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3.5 text-center"
                >Add
                </button>
                <CategoryForm isOpen={isPopupOpen} onClose={handleClosePopup} onSubmit={handleFormSubmit} error={error} />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Category Id</th>
                            <th scope="col" className="px-6 py-3">Category Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Info</span></th>
                            <th scope="col" className="pl-3 pr-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(category => (
                            <tr key={category.cat_id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 ">
                                    {category.cat_id}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {category.category}
                                </td>
                                <td className="px-6 py-4">
                                    {category.status ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-2 py-4 text-right">
                                    <a
                                        onClick={() => handleInfoClick(category)}
                                        className="text-white px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
                                    >Info
                                    </a>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {category.status ? <button
                                        onClick={() => handleDelete(category.cat_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >Delete
                                    </button> :
                                        <button
                                            onClick={() => handleActivate(category.cat_id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >Activate
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedCategory && (
                    <CategoryInfoPopup
                        isOpen={true}
                        category={selectedCategory}
                        onClose={handleCloseInfoPopup}
                    />
                )}
            </div>
        </div>
    );
};

export default categoryMaster;
