import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spinner, Button } from 'react-bootstrap';
import { CheckSquare, Clock, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Pie } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({ pendingReviews: 0, teamMonthTotal: 0, approvedTrim: 0, rejectedTrim: 0 });
    const [teamActivity, setTeamActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchManagerData();
    }, []);

    const fetchManagerData = async () => {
        try {
            const res = await api.get('expenses/');
            let allVisible = res.data;
            
            // Auto-seed if system appears empty (Raw Indian Data requirement)
            if (allVisible.length === 0) {
                await api.get('auth/initialize-enterprise-data/');
                const retryRes = await api.get('expenses/');
                allVisible = retryRes.data;
            }

            const approvalsRes = await api.get('approvals/manager-pending/');
            const pendingQueue = approvalsRes.data;
            
            setStats({
                pendingReviews: pendingQueue.length,
                teamMonthTotal: allVisible.reduce((acc, curr) => acc + parseFloat(curr.amount), 0),
                approvedTrim: allVisible.filter(e => e.status === 'Approved').length,
                rejectedTrim: allVisible.filter(e => e.status === 'Rejected').length
            });
            
            setTeamActivity(allVisible.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        const currency = user?.company?.base_currency || 'INR';
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
    };

    const pieData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
            data: [stats.pendingReviews, stats.approvedTrim, stats.rejectedTrim],
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 0,
        }]
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0 fw-bold">Managerial Dashboard</h2>
                    <p className="text-secondary small mb-0">Overview of your team's expense claims and approval status</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold" onClick={async () => {
                        await api.get('auth/initialize-enterprise-data/');
                        fetchManagerData();
                    }}>
                        Refresh Team Data
                    </Button>
                    <Button 
                        className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4"
                        onClick={() => navigate('/approvals')}
                    >
                        <CheckSquare size={18} />
                        <span>Pending Approvals</span>
                    </Button>
                </div>
            </div>
            
            <Row className="g-4 mb-4">
                <Col md={8}>
                    <Row className="g-4 mb-4">
                        <Col md={6}>
                            <Card className="p-4 bg-white border-0 shadow-sm rounded-4 h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                        <Clock size={24} className="text-warning" />
                                    </div>
                                    <div>
                                        <h3 className="mb-0 fw-bold">{stats.pendingReviews}</h3>
                                        <small className="text-secondary fw-bold text-uppercase" style={{fontSize: '0.7em'}}>Pending Your Review</small>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-4 bg-white border-0 shadow-sm rounded-4 h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                        <Users size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-0 fw-bold">{formatCurrency(stats.teamMonthTotal)}</h3>
                                        <small className="text-secondary fw-bold text-uppercase" style={{fontSize: '0.7em'}}>Team Total Volume</small>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Card className="p-4 bg-white border-0 shadow-sm rounded-4 h-auto">
                        <div className="d-flex align-items-center gap-3 mb-3">
                             <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <CheckCircle size={24} className="text-success" />
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold text-success">{stats.approvedTrim}</h3>
                                <small className="text-secondary fw-bold text-uppercase" style={{fontSize: '0.7em'}}>Successfully Approved</small>
                            </div>
                        </div>
                        <p className="text-secondary small mb-0">Total team expenses verified and reimbursed to date.</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-4 border-0 shadow-sm rounded-4 bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                        <h6 className="fw-bold text-dark mb-3">Approval Distribution</h6>
                        <div style={{ maxHeight: '180px', width: '100%' }}>
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <h5 className="fw-bolder mb-3 text-dark">Team's Recent Activity</h5>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table responsive hover className="mb-0 align-middle">
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th className="py-3 px-4 fw-bold text-secondary small">TEAM MEMBER</th>
                            <th className="py-3 fw-bold text-secondary small">DATE</th>
                            <th className="py-3 fw-bold text-secondary small">AMOUNT</th>
                            <th className="py-3 fw-bold text-secondary small">WORKFLOW STATUS</th>
                            <th className="py-3 px-4 fw-bold text-secondary small text-end">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : teamActivity.length > 0 ? (
                            teamActivity.map(act => (
                                <tr key={act.id}>
                                    <td className="py-3 px-4 fw-bold">{act.user_details?.first_name || act.user_details?.username}</td>
                                    <td className="py-3 text-secondary">{new Date(act.date || act.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 fw-bold text-dark">{formatCurrency(act.amount)}</td>
                                    <td className="py-3">
                                        <span className={`badge px-3 py-2 rounded-pill ${
                                            act.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' : 
                                            act.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' : 
                                            'bg-warning bg-opacity-10 text-warning'
                                        }`}>
                                            {act.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-end">
                                        {act.status === 'Pending' ? (
                                            <Button size="sm" variant="outline-primary" onClick={() => navigate('/approvals')} className="rounded-pill px-3">Review Request</Button>
                                        ) : (
                                            <Button size="sm" variant="light" className="text-secondary rounded-pill px-3 fw-bold border" onClick={() => navigate(`/expenses/${act.id}`)}>Details</Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-4 text-secondary">No recent team activity.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default ManagerDashboard;
