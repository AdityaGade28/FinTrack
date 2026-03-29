import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError("Passwords don't match."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setLoading(true);
        try {
            await api.post('auth/reset-password/', { token, password });
            setDone(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed. Link may have expired.');
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
                    {!done ? (
                        <>
                            <div className="text-center mb-4">
                                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    <Lock size={28} className="text-primary" />
                                </div>
                                <h4 className="fw-bolder">Set New Password</h4>
                                <p className="text-secondary small">Create a strong new password for your account.</p>
                            </div>

                            {error && <Alert variant="danger" className="small py-2">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small text-secondary text-uppercase">New Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            className="py-2 pe-5"
                                            style={{ borderRadius: '10px' }}
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3 text-secondary p-0">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold small text-secondary text-uppercase">Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                        className="py-2"
                                        style={{ borderRadius: '10px' }}
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-100 fw-bold py-2"
                                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', borderRadius: '10px' }}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <div className="text-center py-3">
                            <CheckCircle size={48} className="text-success mb-3" />
                            <h5 className="fw-bolder">Password Reset!</h5>
                            <p className="text-secondary small">Redirecting you to login in 3 seconds...</p>
                        </div>
                    )}
                    <div className="text-center mt-3">
                        <Link to="/login" className="text-secondary small text-decoration-none d-inline-flex align-items-center gap-1">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResetPassword;
