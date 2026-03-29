import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { MapPin, Globe, Building, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        company_name: '',
        country: 'India',
        role: 'Admin'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or email might be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
            <Card style={{ maxWidth: '650px', width: '100%' }} className="border-0 shadow-lg">
                <Card.Header style={{ backgroundColor: '#1a2332', padding: '30px' }} className="text-center text-white border-0">
                    <UserPlus size={40} className="mb-3 text-primary-light" />
                    <h2 style={{ fontWeight: 800 }}>Create Corporate Account</h2>
                    <p className="text-white-50 mb-0">Join the FinTrack Network</p>
                </Card.Header>
                
                <Card.Body className="p-5 bg-white">
                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="first_name" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" name="company_name" onChange={handleChange} required placeholder="Join or Create a Company" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" onChange={handleChange} value={formData.role} required>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control type="password" name="confirm_password" onChange={(e) => {
                                if (e.target.value !== formData.password) {
                                    e.target.setCustomValidity("Passwords don't match");
                                } else {
                                    e.target.setCustomValidity("");
                                }
                            }} required />
                        </Form.Group>

                        <div className="mb-4 text-secondary small">
                            <Form.Group>
                                <Form.Label>Country selection</Form.Label>
                                <Form.Select name="country" onChange={handleChange} required>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Singapore">Singapore</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="mt-2 text-muted fw-bold">
                                * The selected country's currency is set in environment as company's base currency.
                            </div>
                        </div>
                        
                        <Button 
                            className="w-100 py-3 fw-bold btn-primary" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Signup'}
                        </Button>
                    </Form>
                    
                    <div className="text-center mt-4">
                        <span className="text-secondary small">Already registered? </span>
                        <Link to="/login" className="small fw-bold text-decoration-none">Login Here</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
