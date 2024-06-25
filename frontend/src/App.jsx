import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login'
import Dashboard from './masters/dashboard'
import Partner from './masters/partner_master'
import Software from './masters/software_master'
import Category from './masters/category_master'
import Status from './masters/status_master'
import User from './masters/user_master'

function App() {

  return (

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/partner' element={<Partner />}/>
        <Route path='/software' element={<Software />}/>
        <Route path='/category' element={<Category />}/>
        <Route path='/status' element={<Status />}/>
        <Route path='/user' element={<User />}/>
      </Routes>

  )
}

export default App
