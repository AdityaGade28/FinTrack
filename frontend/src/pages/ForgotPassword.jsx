import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [devLink, setDevLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('auth/forgot-password/', { email });
            setSent(true);
            // In development mode the backend returns the link directly
            if (res.data.reset_link) setDevLink(res.data.reset_link);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#f0f4f8' }}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ width: '440px' }}>
                <div className="text-center py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <img src="/logo-light.png" alt="FinTrack" style={{ maxHeight: '48px' }} />
                </div>

                <Card.Body className="p-5">
                    {!sent ? (
                        <>
                            <div className="text-center mb-4">
                                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    <Mail size={28} className="text-primary" />
                                </div>
                                <h4 className="fw-bolder">Forgot Password?</h4>
                                <p className="text-secondary small">Enter your email and we'll send you a reset link.</p>
                            </div>

                            {error && <Alert variant="danger" className="small py-2">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold small text-secondary text-uppercase">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="yourname@company.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="py-2"
                                        style={{ borderRadius: '10px' }}
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', borderRadius: '10px' }}
                                >
                                    {loading ? 'Sending...' : <><Send size={16} /> Send Reset Link</>}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                <CheckCircle size={32} className="text-success" />
                            </div>
                            <h5 className="fw-bolder">Check Your Email</h5>
                            <p className="text-secondary small mb-3">
                                A password reset link has been sent to <strong>{email}</strong>.
                            </p>
                            {devLink && (
                                <div className="p-3 rounded-3 text-start mb-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                                    <p className="small fw-bold text-warning mb-1">⚡ Dev Mode — Reset Link:</p>
                                    <a href={devLink} className="small text-break text-primary" target="_blank" rel="noreferrer">{devLink}</a>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-secondary small text-decoration-none d-inline-flex align-items-center gap-1">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
