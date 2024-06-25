import React from 'react'

const header = () => {
    return (
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 static">
            <div className=" flex flex-wrap justify-center items-center mx-auto max-w-screen-xl">
                <a href="#" className="flex items-center">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ticket Management</span>
                </a>
            </div>
        </nav>
    )
}

export default header