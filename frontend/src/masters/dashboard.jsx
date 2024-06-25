import React from 'react'
import Home from '../components/Home/home'

const dashboard = () => {
    return (
        <div>
            <Home />
            <div className='overflow-x-auto shadow-md absolute right-0 w-5/6'>This is the Dashboard</div>
        </div>
    )
}

export default dashboard