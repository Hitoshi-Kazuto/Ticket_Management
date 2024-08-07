import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login'
import Dashboard from './dashboard'
import UserDashboard from './user_dashboard'
import HelpdeskDashboard from './helpdesk_dashboard'

import Partner from './masters/partner_master'
import Software from './masters/software_master'
import Category from './masters/category_master'
import Status from './masters/status_master'
import User from './masters/user_master'
import TicketMaster from './masters/ticket_master'
import AssignStaff from './masters/assign_staff'
import ClosedTicketMaster from './masters/closed_ticket_master'

import ProtectedRoute from './components/Hooks/protectedRoute'
import useHistoryBlock from './components/Hooks/useHistory'
import PrivateRoute from './components/Hooks/privateRoute'
import IdleTimeout from './components/Hooks/idleTimeout'

function App() {
  useHistoryBlock();

  return (
    <IdleTimeout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/partner" element={<ProtectedRoute><Partner /></ProtectedRoute>} />
        <Route path="/software" element={<ProtectedRoute><Software /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
        <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
        <Route path="/ticket" element={<ProtectedRoute><TicketMaster /></ProtectedRoute>} />
        <Route path="/closed-ticket" element={<ProtectedRoute><ClosedTicketMaster /></ProtectedRoute>} />
        <Route path="/assign-staff" element={<ProtectedRoute><AssignStaff /></ProtectedRoute>} />


        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/helpdesk-dashboard" element={<ProtectedRoute><HelpdeskDashboard /></ProtectedRoute>} />
      </Routes>
    </IdleTimeout>
  )
};


export default App
