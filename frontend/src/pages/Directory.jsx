import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { Search, Mail, Building, User as UserIcon, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const Directory = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDirectory();
    }, []);

    const fetchDirectory = async () => {
        try {
            const res = await api.get('auth/directory/');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch directory');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Company Directory</h2>
                <p className="text-secondary small">Connect with your colleagues across the organization</p>
            </div>

            <Card className="border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
                <InputGroup className="border rounded-pill overflow-hidden px-3 bg-light">
                    <InputGroup.Text className="bg-transparent border-0 pe-1">
                        <Search size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control 
                        placeholder="Search by name, email or department..." 
                        className="bg-transparent border-0 shadow-none py-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </Card>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row className="g-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                            <Col key={u.id} lg={4} md={6}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover">
                                    <div className="p-4">
                                        <div className="d-flex align-items-start justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                                    <UserIcon size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 fw-bold">{u.first_name || u.username}</h5>
                                                    <Badge bg="light" className="text-secondary border small fw-normal mt-1">
                                                        {u.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {u.role === 'Admin' && <ShieldCheck size={20} className="text-indigo-500" />}
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <div className="d-flex align-items-center gap-2 text-secondary small">
                                                <Mail size={14} />
                                                <span className="text-truncate">{u.email}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 text-secondary small">
                                                <Building size={14} />
                                                <span>{u.department || 'General'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-light px-4 py-2 border-top d-flex justify-content-between align-items-center">
                                        <span className="extra-small text-muted fw-bold text-uppercase ls-wide">FIN-ID: {u.employee_id || 'N/A'}</span>
                                        <button className="btn btn-link p-0 text-decoration-none extra-small fw-bold">View Profile</button>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5 text-muted">
                            No colleagues found matching your search.
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default Directory;
