import React, { useState } from 'react';
import { Card, Form, Button, Container, Alert, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, UserCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeRole, setActiveRole] = useState('employee'); // 'employee', 'manager', 'admin'
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(email, password);
            navigate('/'); // Navigate to dashboard or home as appropriate, or let context redirect
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleTabClick = (role) => {
        setActiveRole(role);
        setError('');
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '450px', backgroundColor: '#ffffff' }}>
                <div className="text-center py-4 mb-3 position-relative" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="d-flex justify-content-center align-items-center mb-2">
                        <img src="/logo-light.png" alt="FinTrack Logo" className="img-fluid" style={{ maxHeight: '55px' }} />
                    </div>
                </div>
                
                <Card.Body className="p-4 pt-1">
                    {/* Role Selection Tabs */}
                    <Nav variant="pills" className="nav-justified mb-4 border-bottom pb-3" style={{ fontSize: '0.9rem' }}>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeRole === 'employee'} 
                                onClick={() => handleRoleTabClick('employee')}
                                className={`d-flex flex-column align-items-center fw-bold py-2 ${activeRole === 'employee' ? 'bg-primary text-white shadow-sm rounded' : 'text-secondary'}`}
                            >
                                <UserCircle size={20} className="mb-1" />
                                Employee
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeRole === 'manager'} 
                                onClick={() => handleRoleTabClick('manager')}
                                className={`d-flex flex-column align-items-center fw-bold py-2 px-1 ${activeRole === 'manager' ? 'bg-primary text-white shadow-sm rounded' : 'text-secondary'}`}
                            >
                                <Users size={20} className="mb-1" />
                                Manager
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeRole === 'admin'} 
                                onClick={() => handleRoleTabClick('admin')}
                                className={`d-flex flex-column align-items-center fw-bold py-2 ${activeRole === 'admin' ? 'bg-dark text-white shadow-sm rounded' : 'text-secondary'}`}
                            >
                                <Shield size={20} className="mb-1" />
                                Admin
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {error && <Alert variant="danger" className="py-2 small fw-bold text-center">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder={`Enter ${activeRole} email`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-2"
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="py-2"
                                required
                            />
                        </Form.Group>
                        
                        <Button 
                            className={`w-100 py-2 mb-4 fw-bold shadow-sm ${activeRole === 'admin' ? 'btn-dark' : 'btn-primary'}`}
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : `Access ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Portal`}
                        </Button>

                        <div className="d-flex justify-content-between small px-1 border-top pt-3">
                            <span className="text-secondary">Are you an Admin? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#3b82f6' }}>Register Company</Link></span>
                            <Link to="/forgot-password" className="text-decoration-none text-secondary">Forgot password?</Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
