import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spinner, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FileUp, PlusCircle, MoreVertical, CreditCard } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ExpenseList = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: '', variant: 'success' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get('expenses/');
            setExpenses(response.data);
        } catch (err) {
            console.error('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, variant = 'success') => {
        setToast({ show: true, msg, variant });
        setTimeout(() => setToast({ show: false, msg: '', variant: 'success' }), 3000);
    };

    const deleteExpense = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`expenses/${id}/`);
            setExpenses(prev => prev.filter(e => e.id !== id));
            showToast('Expense deleted.');
        } catch {
            showToast('Failed to delete expense.', 'danger');
        }
    };

    const draftTotal = expenses.filter(e => e.status.toLowerCase() === 'draft').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const waitingTotal = expenses.filter(e => e.status.toLowerCase() === 'pending' || e.status.toLowerCase() === 'submitted').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const approvedTotal = expenses.filter(e => e.status.toLowerCase() === 'approved').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const formatCurrency = (val) => {
        const currency = user?.company?.base_currency || 'INR';
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">
                        {user?.role === 'Admin' ? 'Company Expenses Overview' : user?.role === 'Manager' ? 'Team & My Expenses' : 'My Expenses'}
                    </h2>
                    <p className="text-secondary small mb-0">
                        {user?.role === 'Admin' ? 'View and track all global company reimbursement records' : 'Track and manage your reimbursement requests'}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4">
                        <FileUp size={18} /> OCR Upload
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/expenses/new')} className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4" style={{ backgroundColor: '#10b981', border: 'none' }}>
                        <PlusCircle size={18} /> New Expense
                    </Button>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #64748b !important' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-secondary fw-bold text-uppercase small">Drafts (To Submit)</span>
                            <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
                                <CreditCard size={20} style={{ color: '#64748b' }} />
                            </div>
                        </div>
                        <h3 className="fw-bolder mb-0" style={{ color: '#0f172a' }}>{formatCurrency(draftTotal)}</h3>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6 !important' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-primary fw-bold text-uppercase small">Waiting Approval</span>
                            <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <CreditCard size={20} style={{ color: '#3b82f6' }} />
                            </div>
                        </div>
                        <h3 className="fw-bolder text-primary mb-0">{formatCurrency(waitingTotal)}</h3>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4" style={{ backgroundColor: '#f0fdfa', borderLeft: '4px solid #10b981 !important' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-success fw-bold text-uppercase small">Approved</span>
                            <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <CreditCard size={20} style={{ color: '#10b981' }} />
                            </div>
                        </div>
                        <h3 className="fw-bolder text-success mb-0">{formatCurrency(approvedTotal)}</h3>
                    </Card>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <Table responsive hover className="mb-0 align-middle">
                    <thead style={{ backgroundColor: '#f1f5f9' }}>
                        <tr>
                            <th className="py-3 px-4 text-secondary small fw-bold">DATE</th>
                            <th className="py-3 px-4 text-secondary small fw-bold">DESCRIPTION</th>
                            <th className="py-3 px-4 text-secondary small fw-bold">CATEGORY</th>
                            <th className="py-3 px-4 text-secondary small fw-bold">AMOUNT</th>
                            <th className="py-3 px-4 text-secondary small fw-bold">STATUS</th>
                            <th className="py-3 px-4 text-end text-secondary small fw-bold">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : expenses.length > 0 ? (
                            expenses.map((exp) => (
                                <tr key={exp.id} className="border-bottom">
                                    <td className="py-3 px-4 text-secondary">{new Date(exp.created_at || exp.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 fw-bold" style={{ color: '#334155' }}>{exp.description}</td>
                                    <td className="py-3 px-4">
                                        <span className="badge bg-light text-secondary border">{exp.category}</span>
                                    </td>
                                    <td className="py-3 px-4 fw-bolder" style={{ color: '#0f172a' }}>{exp.amount} {exp.currency}</td>
                                    <td className="py-3 px-4">
                                        <span className={`badge px-3 py-2 rounded-pill ${
                                            exp.status.toLowerCase() === 'draft' ? 'bg-secondary bg-opacity-10 text-secondary' : 
                                            exp.status.toLowerCase() === 'approved' ? 'bg-success bg-opacity-10 text-success' : 
                                            'bg-warning bg-opacity-10 text-warning'
                                        }`}>
                                            {exp.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-end">
                                        <Dropdown align="end">
                                            <Dropdown.Toggle variant="light" size="sm" className="btn-icon rounded-circle shadow-none border-0 text-secondary">
                                                <MoreVertical size={16} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="shadow-sm border-0">
                                                <Dropdown.Item onClick={() => navigate(`/expenses/${exp.id}`)}>View Details</Dropdown.Item>
                                                <Dropdown.Item className="text-danger" onClick={() => deleteExpense(exp.id)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <div className="text-secondary mb-3">No reimbursement requests found.</div>
                                    <Button variant="outline-primary" onClick={() => navigate('/expenses/new')} className="rounded-pill">Create your first expense</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default ExpenseList;
