import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../api/axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`auth/verify-email/${token}/`);
                setMessage(res.data.message);
                setStatus('success');
            } catch (err) {
                setMessage(err.response?.data?.error || 'Verification failed.');
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#f0f4f8' }}>
            <Card className="border-0 shadow-lg rounded-4 p-5 text-center" style={{ width: '420px' }}>
                <img src="/logo-light.png" alt="FinTrack" style={{ maxHeight: '44px', margin: '0 auto 24px' }} />
                {status === 'loading' && (
                    <>
                        <Loader size={48} className="text-primary mb-3 mx-auto d-block" style={{ animation: 'spin 1s linear infinite' }} />
                        <h5 className="fw-bolder">Verifying your email...</h5>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle size={48} className="text-success mb-3 mx-auto d-block" />
                        <h5 className="fw-bolder text-success">Email Verified!</h5>
                        <p className="text-secondary small">{message}</p>
                        <Link to="/login" className="btn fw-bold py-2 px-4 mt-2 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '10px' }}>
                            Go to Login
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle size={48} className="text-danger mb-3 mx-auto d-block" />
                        <h5 className="fw-bolder text-danger">Verification Failed</h5>
                        <p className="text-secondary small">{message}</p>
                        <Link to="/login" className="btn btn-outline-secondary py-2 px-4 mt-2" style={{ borderRadius: '10px' }}>
                            Back to Login
                        </Link>
                    </>
                )}
            </Card>
        </Container>
    );
};

export default VerifyEmail;
