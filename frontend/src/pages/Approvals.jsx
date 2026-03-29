import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spinner, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { Check, X, ShieldAlert, CheckCircle, Clock, MessageSquare, Eye } from 'lucide-react';
import api from '../api/axios';

const Approvals = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionModal, setActionModal] = useState({ show: false, flowId: null, actionType: null, expense: null });
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);
    const [detailModal, setDetailModal] = useState({ show: false, item: null });

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        setLoading(true);
        try {
            const response = await api.get('approvals/manager-pending/');
            setApprovals(response.data);
        } catch (err) {
            console.error('Failed to fetch pending approvals', err);
        } finally {
            setLoading(false);
        }
    };

    const openAction = (flowId, actionType, expense) => {
        setComment('');
        setActionModal({ show: true, flowId, actionType, expense });
    };

    const confirmAction = async () => {
        setProcessing(true);
        try {
            await api.post(`approvals/${actionModal.flowId}/action/`, {
                status: actionModal.actionType,
                comments: comment || (actionModal.actionType === 'Approved' ? 'Approved by manager' : 'Rejected by manager')
            });
            setActionModal({ show: false, flowId: null, actionType: null, expense: null });
            await fetchApprovals();
        } catch (err) {
            alert('Action failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const pendingCount = approvals.filter(a => a.status === 'Pending').length;
    const processedCount = approvals.filter(a => a.status !== 'Pending').length;

    return (
        <div>
            {/* Page Header */}
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="mb-1 fw-bolder">Approval Hub</h2>
                    <p className="text-secondary small mb-0">Review and action pending reimbursement requests from your team</p>
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <ShieldAlert size={16} className="text-warning" />
                    <span className="text-warning small fw-bold">All actions permanently logged</span>
                </div>
            </div>

            {/* KPI Summary Strip */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)' }}>
                                <Clock size={20} className="text-warning" />
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bolder">{pendingCount}</h4>
                                <small className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.68em' }}>Awaiting Your Action</small>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)' }}>
                                <CheckCircle size={20} className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bolder">{processedCount}</h4>
                                <small className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.68em' }}>Processed This Session</small>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)' }}>
                                <MessageSquare size={20} className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bolder">{approvals.length}</h4>
                                <small className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.68em' }}>Total in Queue</small>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Main Table */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="px-4 py-3 d-flex align-items-center justify-content-between" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafcff' }}>
                    <h5 className="fw-bolder text-dark mb-0">Pending Reviews</h5>
                    {pendingCount > 0 && (
                        <Badge style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: '20px' }} className="px-3 py-2">
                            {pendingCount} actionable
                        </Badge>
                    )}
                </div>

                <Table responsive hover className="mb-0 align-middle">
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">REQUEST OWNER</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">DESCRIPTION</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">CATEGORY</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">STEP</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">AMOUNT</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0">STATUS</th>
                            <th className="py-3 px-4 text-secondary small fw-bold border-0 text-center" style={{ minWidth: '220px' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : approvals.length > 0 ? (
                            approvals.map((appr) => (
                                <tr key={appr.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                                                {(appr.expense_details?.user_details?.first_name?.[0] || appr.expense_details?.user_details?.username?.[0] || '?').toUpperCase()}
                                            </div>
                                            <span className="fw-bold text-dark">{appr.expense_details?.user_details?.first_name || appr.expense_details?.user_details?.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-secondary">{appr.expense_details?.description || '—'}</td>
                                    <td className="py-3 px-4">
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 rounded-pill">
                                            {appr.expense_details?.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill" style={{ fontSize: '0.72em' }}>
                                            Step {appr.step_order}
                                            {appr.is_required && ' ⚡'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="fw-bolder text-dark">{appr.expense_details?.amount} {appr.expense_details?.currency}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`badge px-3 py-2 rounded-pill ${
                                            appr.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' :
                                            appr.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' :
                                            'bg-warning bg-opacity-10 text-warning'
                                        }`}>
                                            {appr.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {appr.status === 'Pending' ? (
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => setDetailModal({ show: true, item: appr })} title="View Details">
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="fw-bold rounded-pill px-3 d-flex align-items-center gap-1"
                                                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff' }}
                                                    onClick={() => openAction(appr.id, 'Approved', appr.expense_details)}
                                                >
                                                    <Check size={13} /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    className="fw-bold rounded-pill px-3 d-flex align-items-center gap-1"
                                                    onClick={() => openAction(appr.id, 'Rejected', appr.expense_details)}
                                                >
                                                    <X size={13} /> Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center gap-1 text-secondary small fw-bold">
                                                <CheckCircle size={14} /> Processed
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-5">
                                    <div style={{ color: '#94a3b8' }}>
                                        <CheckCircle size={40} className="mb-3 d-block mx-auto text-success opacity-50" />
                                        <p className="fw-bold mb-0">All clear! No pending approvals.</p>
                                        <small>Your team is up to date.</small>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Action Confirmation Modal */}
            <Modal show={actionModal.show} onHide={() => setActionModal({ show: false })} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Modal.Title className="fw-bolder" style={{ color: actionModal.actionType === 'Approved' ? '#10b981' : '#ef4444' }}>
                        {actionModal.actionType === 'Approved' ? '✅ Approve Request' : '❌ Reject Request'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {actionModal.expense && (
                        <div className="mb-3 p-3 rounded-3" style={{ background: '#f8fafc' }}>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-secondary small">Description</span>
                                <span className="fw-bold small">{actionModal.expense.description}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-secondary small">Amount</span>
                                <span className="fw-bolder text-dark">{actionModal.expense.amount} {actionModal.expense.currency}</span>
                            </div>
                        </div>
                    )}
                    <Form.Group>
                        <Form.Label className="fw-bold small text-secondary text-uppercase">
                            Comment <span className="text-muted fw-normal">(optional)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder={actionModal.actionType === 'Approved' ? 'e.g. Looks good, approved.' : 'e.g. Receipt missing, please resubmit.'}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ borderRadius: '10px', resize: 'none' }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #f1f5f9' }}>
                    <Button variant="light" onClick={() => setActionModal({ show: false })} className="rounded-pill px-4">Cancel</Button>
                    <Button
                        disabled={processing}
                        onClick={confirmAction}
                        className="fw-bold rounded-pill px-4"
                        style={{
                            background: actionModal.actionType === 'Approved' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                            border: 'none', color: '#fff'
                        }}
                    >
                        {processing ? <Spinner size="sm" animation="border" /> : `Confirm ${actionModal.actionType}`}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Detail Modal */}
            <Modal show={detailModal.show} onHide={() => setDetailModal({ show: false })} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bolder">Expense Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {detailModal.item && (
                        <div>
                            <Row className="g-3">
                                {[
                                    ['Submitter', detailModal.item.expense_details?.user_details?.first_name || detailModal.item.expense_details?.user_details?.username],
                                    ['Description', detailModal.item.expense_details?.description],
                                    ['Category', detailModal.item.expense_details?.category],
                                    ['Amount', `${detailModal.item.expense_details?.amount} ${detailModal.item.expense_details?.currency}`],
                                    ['Date Submitted', new Date(detailModal.item.expense_details?.created_at || detailModal.item.expense_details?.date).toLocaleDateString()],
                                    ['Workflow Step', `Step ${detailModal.item.step_order}${detailModal.item.is_required ? ' (Required Override)' : ''}`],
                                ].map(([label, value]) => (
                                    <Col xs={6} key={label}>
                                        <div className="p-3 rounded-3" style={{ background: '#f8fafc' }}>
                                            <small className="text-secondary text-uppercase fw-bold d-block" style={{ fontSize: '0.65em' }}>{label}</small>
                                            <span className="fw-bold text-dark">{value || '—'}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Approvals;
