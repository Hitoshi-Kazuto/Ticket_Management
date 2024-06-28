import React from 'react'
import Header from "./header"
import Sidebar from "./sidebar"

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
      </div>
    </div>
  );
}

export default Home;