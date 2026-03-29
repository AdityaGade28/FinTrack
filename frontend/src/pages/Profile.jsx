import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { User, Mail, Shield, Building, IdCard, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="text-center py-5">Loading profile...</div>;

    const profileItems = [
        { label: 'Full Name', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username, icon: <User size={18} /> },
        { label: 'Email Address', value: user.email, icon: <Mail size={18} /> },
        { label: 'System Role', value: user.role, icon: <Shield size={18} />, badge: true },
        { label: 'Company', value: user.company?.name || 'Acme Solutions', icon: <Building size={18} /> },
        { label: 'Employee ID', value: user.employee_id || 'Not Assigned', icon: <IdCard size={18} /> },
        { label: 'Department', value: user.department || 'General', icon: <Briefcase size={18} /> },
    ];

    return (
        <Container className="py-2">
            <div className="mb-4">
                <h2 className="fw-bold">My Account Profile</h2>
                <p className="text-secondary">Manage your identity and workplace associations</p>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden text-center p-4 h-100">
                        <div className="mb-3 mx-auto shadow-sm d-flex align-items-center justify-content-center" 
                             style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white' }}>
                            <User size={40} />
                        </div>
                        <h4 className="fw-bold mb-1">{user.first_name || user.username}</h4>
                        <p className="text-secondary small mb-3">{user.email}</p>
                        <Badge bg={user.role === 'Admin' ? 'dark' : 'primary'} className="mb-4 px-3 py-2 rounded-pill">
                            {user.role} Member
                        </Badge>
                        
                        <div className="border-top pt-4 text-start">
                            <h6 className="fw-bold small text-uppercase text-secondary mb-3">Workplace Stats</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary small">Member Since</span>
                                <span className="fw-bold small">Mar 2026</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-secondary small">Account Status</span>
                                <span className="text-success fw-bold small">Verified</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="p-4">
                            <h5 className="fw-bold mb-4">Identity Details</h5>
                            <Row className="g-4">
                                {profileItems.map((item, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                            <div className="text-primary">{item.icon}</div>
                                            <div>
                                                <small className="text-secondary fw-bold text-uppercase d-block" style={{ fontSize: '0.65em' }}>{item.label}</small>
                                                <span className="fw-bold text-dark">{item.value}</span>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <h5 className="fw-bold mt-5 mb-4 border-top pt-4">Managerial Hierarchy</h5>
                            <div className="p-4 rounded-4" style={{ background: '#f0f9ff', border: '1px dashed #bae6fd' }}>
                                {user.reporting_manager_details ? (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-white rounded-circle shadow-sm" style={{ padding: '8px' }}>
                                                <User size={24} className="text-info" />
                                            </div>
                                            <div>
                                                <p className="mb-0 fw-bold">{user.reporting_manager_details.first_name} {user.reporting_manager_details.last_name}</p>
                                                <p className="mb-0 small text-secondary">Reporting Manager • {user.reporting_manager_details.role}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-secondary" />
                                    </div>
                                ) : (
                                    <p className="text-secondary mb-0 small">No reporting manager assigned (Top Level Account).</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
