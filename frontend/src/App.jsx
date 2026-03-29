import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseList from './pages/ExpenseList';
import Approvals from './pages/Approvals';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import ApprovalRules from './pages/ApprovalRules';
import Directory from './pages/Directory';
import Home from './pages/Home';
import Profile from './pages/Profile';

const App = () => {
    const { user, isAuthenticated } = useAuth();
    
    const dashboardPath = user?.role ? `/${user.role.toLowerCase()}` : '/employee';

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to={dashboardPath} />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={dashboardPath} />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={dashboardPath} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            
            {/* Authenticated Application Routes */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                {/* Role Dashboards */}
                <Route path="/admin" element={<PrivateRoute roles={['Admin']}><AdminDashboard /></PrivateRoute>} />
                <Route path="/manager" element={<PrivateRoute roles={['Manager']}><ManagerDashboard /></PrivateRoute>} />
                <Route path="/employee" element={<PrivateRoute roles={['Employee']}><EmployeeDashboard /></PrivateRoute>} />
                
                {/* Shared routes — all roles */}
                <Route path="/expenses" element={<ExpenseList />} />
                <Route path="/expenses/new" element={<ExpenseForm />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Manager + Admin */}
                <Route path="/approvals" element={<PrivateRoute roles={['Manager', 'Admin']}><Approvals /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute roles={['Manager', 'Admin']}><Analytics /></PrivateRoute>} />
                
                {/* Admin only */}
                <Route path="/admin/users" element={<PrivateRoute roles={['Admin']}><UserManagement /></PrivateRoute>} />
                <Route path="/admin/rules" element={<PrivateRoute roles={['Admin']}><ApprovalRules /></PrivateRoute>} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? dashboardPath : '/login'} />} />
        </Routes>
    );
};

export default App;
