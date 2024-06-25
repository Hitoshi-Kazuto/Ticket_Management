import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login'
import Dashboard from './masters/dashboard'
import Partner from './masters/partner_master'
import Software from './masters/software_master'
import Category from './masters/category_master'
import Status from './masters/status_master'
import User from './masters/user_master'
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

      </Routes>
    </IdleTimeout>
  )
};


export default App
