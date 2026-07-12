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
import Join from './pages/Join';
import Fleets from './pages/Fleets';
import DriverDashboard from './pages/DriverDashboard';

// Auth Guard Components
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Role-based redirection if accessing the wrong portal
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'Driver') {
        return <Navigate to="/driver/dashboard" replace />;
      } else {
        return <Navigate to="/manager/dashboard" replace />;
      }
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public Routes */}
        <Route path="/join/:code" element={<Join />} />
        
        {/* Redirect root based on role if logged in, else login */}
        <Route path="/" element={<ProtectedRoute><Navigate to="/manager/dashboard" replace /></ProtectedRoute>} />
        
        {/* Fleet Manager Routes */}
        <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}><Dashboard /></ProtectedRoute>} />
        <Route path="/manager/trips" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Trips /></ProtectedRoute>} />
        <Route path="/manager/registry" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Registry /></ProtectedRoute>} />
        <Route path="/manager/drivers" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Drivers /></ProtectedRoute>} />
        <Route path="/manager/maintenance" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Maintenance /></ProtectedRoute>} />
        <Route path="/manager/expenses" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}><Expenses /></ProtectedRoute>} />
        <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}><Reports /></ProtectedRoute>} />
        <Route path="/manager/risk" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}><Risk /></ProtectedRoute>} />
        <Route path="/manager/profile" element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}><Profile /></ProtectedRoute>} />
        <Route path="/manager/settings" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Settings /></ProtectedRoute>} />
        <Route path="/manager/fleets" element={<ProtectedRoute allowedRoles={['Fleet Manager']}><Fleets /></ProtectedRoute>} />

        {/* Driver Routes (New shell to be built) */}
        <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['Driver']}><DriverDashboard /></ProtectedRoute>} />
        {/* Temporary placeholders for Driver routes */}
        
        {/* Fallbacks */}
        <Route path="/dashboard" element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
