import React from 'react'
import Header from "./header"
import Sidebar from "./sidebar_select"

const Home = ({ children }) => {
  return (
    <div className="relative h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <div className="absolute top-16 left-1/6 right-0 bottom-0 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}

export default Home;