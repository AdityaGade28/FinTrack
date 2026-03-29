import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import api from '../api/axios';

const Layout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const roleColors = {
        Admin: { bg: 'rgba(99,102,241,0.1)', text: '#6366f1' },
        Manager: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
        Employee: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
    };
    const rc = roleColors[user?.role] || roleColors.Employee;

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('auth/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('auth/notifications/read-all/');
            fetchNotifications();
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    const getIcon = (type) => {
        if (type === 'APPROVAL') return <AlertCircle size={16} className="text-warning" />;
        if (type === 'EXPENSE') return <CheckCircle size={16} className="text-success" />;
        return <Info size={16} className="text-info" />;
    };

    return (
        <div className="dashboard-container d-flex" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Sidebar />
            <main className="main-content flex-grow-1" style={{ overflowY: 'auto', minWidth: 0 }}>
                {/* Top Bar */}
                <div className="px-5 py-3 d-flex align-items-center justify-content-between bg-white shadow-sm" style={{ borderBottom: '1px solid #e8ecf0', position: 'sticky', top: 0, zIndex: 1000 }}>
                    <div>
                        <span className="text-secondary small">Welcome back, </span>
                        <span className="fw-bolder text-dark">{user?.first_name || user?.username}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ background: rc.bg, color: rc.text, padding: '4px 14px', borderRadius: '20px', fontSize: '0.75em', fontWeight: 700 }}>
                            {user?.role?.toUpperCase()}
                        </div>
                        {user?.company?.name && (
                            <div className="text-secondary d-none d-md-block" style={{ fontSize: '0.85em' }}>
                                <span className="text-muted pe-2">|</span>
                                <span className="fw-bold">🏢 {user.company.name}</span>
                            </div>
                        )}
                        
                        {/* Notifications Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle as="div" bsPrefix="p-0" className="cursor-pointer">
                                <Button variant="light" size="sm" className="rounded-circle p-2 position-relative border">
                                    <Bell size={18} className="text-secondary" />
                                    {unreadCount > 0 && (
                                        <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle border border-white" style={{ fontSize: '0.6em', padding: '0.4em 0.6em' }}>
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow border-0 mt-2 p-0 rounded-4 overflow-hidden" style={{ minWidth: '320px', maxHeight: '450px' }}>
                                <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 fw-bold">Notifications</h6>
                                    {unreadCount > 0 && (
                                        <Button variant="link" className="text-decoration-none p-0 x-small fw-bold" onClick={markAllRead}>Mark all read</Button>
                                    )}
                                </div>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <Dropdown.Item key={n.id} className={`p-3 border-bottom ${!n.is_read ? 'bg-primary bg-opacity-10' : ''}`} style={{ whiteSpace: 'normal' }}>
                                                <div className="d-flex gap-3">
                                                    <div className="mt-1">{getIcon(n.type)}</div>
                                                    <div>
                                                        <div className={`small fw-bold ${!n.is_read ? 'text-primary' : 'text-dark'}`}>{n.title}</div>
                                                        <div className="text-secondary extra-small mb-1">{n.message}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7em' }}>{new Date(n.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</div>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <div className="text-center py-5 text-muted small">No new notifications.</div>
                                    )}
                                </div>
                                <Dropdown.Item className="text-center py-2 bg-light small fw-bold text-primary" onClick={() => navigate('/notifications')}>
                                    View All Notifications
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 p-md-5">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
