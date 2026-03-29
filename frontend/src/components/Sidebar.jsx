import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    CreditCard, 
    CheckSquare, 
    Users, 
    Settings, 
    BarChart3, 
    LogOut,
    PlusCircle,
    FileText,
    Crown,
    User
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: `/${user?.role.toLowerCase()}`, roles: ['Admin', 'Manager', 'Employee'] },
        { name: 'Profile', icon: <User size={18} />, path: '/profile', roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Add Expense', icon: <PlusCircle size={18} />, path: '/expenses/new', roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'All Expenses', icon: <FileText size={18} />, path: '/expenses', roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Company Directory', icon: <Users size={18} />, path: '/directory', roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Approval Hub', icon: <CheckSquare size={18} />, path: '/approvals', roles: ['Manager', 'Admin'] },
        { name: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics', roles: ['Admin', 'Manager'] },
        { name: 'User Management', icon: <Settings size={18} />, path: '/admin/users', roles: ['Admin'] },
        { name: 'Approval Rules', icon: <Settings size={18} />, path: '/admin/rules', roles: ['Admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));
    const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || user?.username?.[0] || ''}`.toUpperCase();

    return (
        <div className="sidebar d-flex flex-column">
            {/* Logo */}
            <div className="text-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="bg-white mx-auto py-2 px-3 rounded-3 d-inline-flex align-items-center gap-2 shadow">
                    <img src="/logo-light.png" alt="FinTrack" style={{ maxHeight: '28px' }} />
                </div>
                <div className="mt-2 d-flex align-items-center justify-content-center gap-1">
                    <Crown size={11} style={{ color: '#f59e0b' }} />
                    <span style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>ENTERPRISE</span>
                </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow-1">
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '8px', paddingLeft: '12px' }}>
                    NAVIGATION
                </div>
                {filteredItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path}
                        end={item.path === `/${user?.role.toLowerCase()}`}
                        className={({ isActive }) => 
                            `d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 mb-1 ${
                                isActive 
                                ? 'bg-primary text-white shadow-sm' 
                                : 'text-white-50'
                            }`
                        }
                        style={{ fontSize: '0.88rem', fontWeight: 500 }}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            
            {/* User Card + Logout */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '8px' }}>
                <div className="d-flex align-items-center gap-2 mb-3 px-1">
                    <div style={{ 
                        width: '36px', height: '36px', 
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                        borderRadius: '10px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                        flexShrink: 0
                    }}>
                        {initials || '?'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-white small fw-bold text-truncate">{user?.first_name} {user?.last_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{user?.email || user?.role}</div>
                    </div>
                </div>
                
                <button 
                    onClick={logout} 
                    className="w-100 btn btn-link text-decoration-none d-flex align-items-center gap-3 py-2 px-3 rounded-3"
                    style={{ 
                        background: 'rgba(239, 68, 68, 0.08)', 
                        border: '1px solid rgba(239,68,68,0.15)', 
                        color: '#ef4444',
                        fontSize: '0.88rem',
                        fontWeight: 600
                    }}
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
