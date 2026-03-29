import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spinner, Modal, Button, Badge } from 'react-bootstrap';
import { Users, CreditCard, Clock, CheckCircle, AlertCircle, TrendingUp, Activity, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingCount: 0, approvedTotal: 0, monthSpend: 0, rejectedCount: 0 });
    const [expenses, setExpenses] = useState([]);
    const [auditLog, setAuditLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ show: false, expense: null });

    const { user } = useAuth();
    
    const formatCurrency = (val) => {
        const currency = user?.company?.base_currency || 'INR';
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [expensesRes, usersRes, auditRes] = await Promise.all([
                api.get('expenses/'),
                api.get('auth/users/'),
                api.get('approvals/audit-log/')
            ]);

            let allExpenses = expensesRes.data;
            const allUsers = usersRes.data;

            // Auto-seed if system appears empty (Raw Indian Data requirement)
            if (allExpenses.length === 0) {
                const seedRes = await api.get('auth/initialize-enterprise-data/');
                if (seedRes.status === 200) {
                    const retryRes = await api.get('expenses/');
                    allExpenses = retryRes.data;
                }
            }

            setStats({
                totalUsers: allUsers.length,
                pendingCount: allExpenses.filter(e => e.status === 'Pending').length,
                approvedTotal: allExpenses.filter(e => e.status === 'Approved').reduce((acc, c) => acc + parseFloat(c.amount), 0),
                monthSpend: allExpenses.reduce((acc, c) => acc + parseFloat(c.amount), 0),
                rejectedCount: allExpenses.filter(e => e.status === 'Rejected').length,
            });

            setExpenses(allExpenses);
            setAuditLog(auditRes.data.slice(0, 8));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Active Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Pending Reviews', value: stats.pendingCount, icon: <Clock size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Total Approved', value: formatCurrency(stats.approvedTotal), icon: <CheckCircle size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
        { label: 'System Volume', value: formatCurrency(stats.monthSpend), icon: <CreditCard size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    ];

    // Chart Data
    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: `Spend (${user?.company?.base_currency || 'INR'})`,
            data: [45000, 52000, 48000, 61000, 55000, stats.monthSpend || 0],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderRadius: 6,
        }]
    };

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="mb-0 fw-bolder">Administration Center</h2>
                    <p className="text-secondary small mb-0">Real-time company-wide expense intelligence & oversight</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold" onClick={async () => {
                        await api.get('auth/initialize-enterprise-data/');
                        fetchAdminData();
                    }}>
                        Sync System Data
                    </Button>
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <Activity size={15} className="text-success" />
                        <span className="text-success small fw-bold">System Live</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <Row className="g-3 mb-4">
                {statCards.map(({ label, value, icon, color, bg }) => (
                    <Col md={3} key={label}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ padding: '10px', borderRadius: '12px', background: bg, color }}>{icon}</div>
                                <div>
                                    <div className="fw-bolder fs-5 text-dark">{value}</div>
                                    <small className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65em' }}>{label}</small>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-bold text-dark mb-4">Financial Trend Analysis</h6>
                        <div style={{ height: '220px' }}>
                            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* All Expenses Table */}
                <Col md={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafcff' }}>
                            <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
                                <TrendingUp size={18} className="text-primary" /> All Company Expenses
                            </h5>
                            <Badge pill style={{ background: '#f1f5f9', color: '#64748b' }}>{expenses.length} total</Badge>
                        </div>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table responsive hover className="mb-0 align-middle">
                                <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th className="py-3 px-4 text-secondary small fw-bold border-0">EMPLOYEE</th>
                                        <th className="py-3 px-4 text-secondary small fw-bold border-0">CATEGORY</th>
                                        <th className="py-3 px-4 text-secondary small fw-bold border-0">AMOUNT</th>
                                        <th className="py-3 px-4 text-secondary small fw-bold border-0">STATUS</th>
                                        <th className="py-3 px-4 text-secondary small fw-bold border-0">DATE</th>
                                        <th className="py-3 px-4 border-0"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" animation="border" /></td></tr>
                                    ) : expenses.map(exp => (
                                        <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td className="py-3 px-4 fw-bold text-dark">{exp.user_details?.first_name || exp.user_details?.username}</td>
                                            <td className="py-3 px-4">
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1 rounded-pill" style={{ fontSize: '0.72em' }}>{exp.category}</span>
                                            </td>
                                            <td className="py-3 px-4 fw-bolder">{formatCurrency(exp.amount, exp.currency)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`badge px-2 py-1 rounded-pill ${
                                                    exp.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' :
                                                    exp.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' :
                                                    'bg-warning bg-opacity-10 text-warning'
                                                }`} style={{ fontSize: '0.72em' }}>
                                                    {exp.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-secondary small">{new Date(exp.date || exp.created_at).toLocaleDateString()}</td>
                                            <td className="py-3 px-4">
                                                <Button variant="link" size="sm" className="text-secondary p-0" onClick={() => setDetailModal({ show: true, expense: exp })}>
                                                    <Eye size={15} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Audit Log */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafcff' }}>
                            <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
                                <AlertCircle size={18} className="text-warning" /> Audit Trail
                            </h5>
                        </div>
                        <div className="p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center py-4"><Spinner size="sm" animation="border" /></div>
                            ) : auditLog.length > 0 ? auditLog.map((log, idx) => (
                                <div key={idx} className="d-flex gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ width: 32, height: 32, background: log.action === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {log.action === 'Approved' ? <CheckCircle size={15} className="text-success" /> : <AlertCircle size={15} className="text-danger" />}
                                    </div>
                                    <div>
                                        <p className="mb-0 small fw-bold text-dark">{log.action} by {log.user_details?.first_name || log.user_details?.username}</p>
                                        <p className="mb-0 small text-secondary">{log.expense_details?.description || 'Expense #' + log.expense}</p>
                                        <p className="mb-0" style={{ fontSize: '0.68em', color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-secondary small text-center mt-4">No audit records yet.</p>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Expense Detail Modal */}
            <Modal show={detailModal.show} onHide={() => setDetailModal({ show: false })} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bolder">Expense Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {detailModal.expense && (
                        <Row className="g-3">
                            {[
                                ['Employee', detailModal.expense.user_details?.first_name || detailModal.expense.user_details?.username],
                                ['Amount', `${detailModal.expense.amount} ${detailModal.expense.currency}`],
                                ['Category', detailModal.expense.category],
                                ['Status', detailModal.expense.status],
                                ['Description', detailModal.expense.description],
                                ['Vendor', detailModal.expense.vendor_name || '—'],
                                ['Date', new Date(detailModal.expense.date || detailModal.expense.created_at).toLocaleDateString()],
                                ['Notes', detailModal.expense.notes || '—'],
                            ].map(([label, value]) => (
                                <Col xs={6} key={label}>
                                    <div className="p-3 rounded-3" style={{ background: '#f8fafc' }}>
                                        <small className="text-secondary fw-bold text-uppercase d-block" style={{ fontSize: '0.65em' }}>{label}</small>
                                        <span className="fw-bold text-dark">{value}</span>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
