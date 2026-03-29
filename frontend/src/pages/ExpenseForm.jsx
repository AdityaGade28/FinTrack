import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const ExpenseForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        long_description: '',
        category: 'Travel',
        amount: '',
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        paid_by: 'Employee', // Usually maps to current user
        remarks: ''
    });

    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrSuccess, setOcrSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setOcrSuccess(false);
        if (selectedFile) {
            setOcrLoading(true);
            const formDataOCR = new FormData();
            formDataOCR.append('receipt', selectedFile);
            try {
                // Correct OCR endpoint
                const res = await api.post('expenses/ocr/', formDataOCR, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        amount: res.data.amount || prev.amount,
                        date: res.data.date || prev.date,
                        description: res.data.vendor ? `Purchase from ${res.data.vendor}` : prev.description,
                        category: res.data.category || prev.category,
                    }));
                    setOcrSuccess(true);
                }
            } catch (err) {
                console.error("OCR failed", err);
            } finally {
                setOcrLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError('');
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('receipt', file);
        
        try {
            await api.post('expenses/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitSuccess(true);
            setTimeout(() => navigate('/expenses'), 1800);
        } catch (err) {
            setSubmitError(err.response?.data?.detail || 'Failed to submit expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="mb-1">New Expense Report</h2>
                    <p className="text-secondary small mb-0">Fill in the details below or upload a receipt to auto-fill securely.</p>
                </div>
                <Button variant="light" onClick={() => navigate('/expenses')} className="fw-bold shadow-sm rounded-pill btn-sm px-3 border">
                    Cancel
                </Button>
            </div>
            
            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-0">
                    <Row className="g-0">
                        {/* Left Receipt Panel */}
                        <Col lg={4} className="p-4 p-md-5 bg-light border-end" style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                            <div className="text-center">
                                <div className="mb-4 d-inline-block rounded-circle p-4 bg-white shadow-sm">
                                    <UploadCloud size={40} style={{ color: '#3b82f6' }} />
                                </div>
                                
                                <h5 className="fw-bolder">Smart Receipt Scanner</h5>
                                <p className="text-secondary small mb-4">Our AI will automatically extract the vendor, date, and amount from your receipt.</p>
                                
                                <Button
                                    variant="outline-primary"
                                    className="w-100 py-3 mb-3 fw-bold rounded-pill bg-white"
                                    onClick={() => document.getElementById('receipt-upload').click()}
                                >
                                    Browse Files
                                </Button>
                                <input
                                    type="file"
                                    id="receipt-upload"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                                
                                {file && (
                                    <div className="d-flex align-items-center justify-content-center gap-2 mt-3 text-success bg-success bg-opacity-10 py-2 rounded-3 border border-success border-opacity-25">
                                        <CheckCircle size={16} />
                                        <small className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>{file.name}</small>
                                    </div>
                                )}
                            </div>
                        </Col>
                        
                        {/* Right Form Panel */}
                        <Col lg={8} className="p-4 p-md-5">
                            <div className="d-flex align-items-center mb-5 pb-3 border-bottom">
                                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-bold text-secondary">
                                    <span className="text-primary">Draft</span> <ArrowRight size={14} className="mx-2" /> 
                                    <span>Pending</span> <ArrowRight size={14} className="mx-2" /> 
                                    <span>Approved</span>
                                </Badge>
                                <Badge bg="success" className="bg-opacity-10 text-success ms-auto px-3 py-2 rounded-pill border border-success border-opacity-25">
                                    Secure Connection
                                </Badge>
                            </div>
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-4 mb-4">
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Vendor / Brief Desc</Form.Label>
                                            <Form.Control 
                                                className="shadow-sm py-2"
                                                value={formData.description}
                                                onChange={e => setFormData({...formData, description: e.target.value})}
                                                placeholder="Lunch with Client"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Expense Category</Form.Label>
                                            <Form.Select 
                                                className="shadow-sm py-2"
                                                value={formData.category}
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                            >
                                                <option>Travel</option>
                                                <option>Food</option>
                                                <option>Software</option>
                                                <option>Supplies</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Total Amount & Currency</Form.Label>
                                            <div className="d-flex shadow-sm rounded-3 overflow-hidden">
                                                <Form.Select 
                                                    className="border-0 border-end rounded-0 py-2 bg-light fw-bold text-center"
                                                    value={formData.currency}
                                                    onChange={e => setFormData({...formData, currency: e.target.value})}
                                                    style={{ width: '90px' }}
                                                >
                                                    <option value="INR">INR ₹</option>
                                                    <option value="USD">USD $</option>
                                                    <option value="EUR">EUR €</option>
                                                    <option value="GBP">GBP £</option>
                                                </Form.Select>
                                                <Form.Control 
                                                    className="border-0 rounded-0 py-2 fw-bolder fs-5 text-dark font-monospace"
                                                    value={formData.amount}
                                                    placeholder="0.00"
                                                    onChange={e => setFormData({...formData, amount: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Date of Transaction</Form.Label>
                                            <Form.Control 
                                                type="date"
                                                className="shadow-sm py-2 fw-bold text-dark"
                                                value={formData.date}
                                                onChange={e => setFormData({...formData, date: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xl={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Detailed Description</Form.Label>
                                            <Form.Control 
                                                as="textarea"
                                                rows={2}
                                                className="shadow-sm py-2"
                                                value={formData.long_description}
                                                onChange={e => setFormData({...formData, long_description: e.target.value})}
                                                placeholder="Provide additional details..."
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Paid From</Form.Label>
                                            <Form.Select 
                                                className="shadow-sm py-2 fw-bold"
                                                value={formData.paid_by}
                                                onChange={e => setFormData({...formData, paid_by: e.target.value})}
                                            >
                                                <option value="Employee">Personal Pocket (Reimbursable)</option>
                                                <option value="Company">Company Credit Card</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col xl={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Additional Remarks</Form.Label>
                                            <Form.Control 
                                                className="shadow-sm py-2"
                                                value={formData.remarks}
                                                onChange={e => setFormData({...formData, remarks: e.target.value})}
                                                placeholder="E.g., Pre-approved by manager"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="mt-5 pt-3 border-top d-flex align-items-center justify-content-between">
                                    <div className="text-secondary small" style={{ maxWidth: '300px' }}>
                                        Submitting this expense securely transmits the data to your approving manager.
                                    </div>
                                    <Button
                                        type="submit"
                                        className="px-5 py-3 fw-bold rounded-pill shadow"
                                        style={{ backgroundColor: '#10b981', border: 'none' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Submit Request'}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ExpenseForm;
