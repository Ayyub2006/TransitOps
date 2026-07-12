import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Registry from './pages/Registry';
import Drivers from './pages/Drivers';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Risk from './pages/Risk';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Auth Guard Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
        <Route path="/registry" element={<ProtectedRoute><Registry /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/risk" element={<ProtectedRoute><Risk /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
